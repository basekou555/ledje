"""analyse_son.py — ce qu'il y a dans le son d'une vidéo, à part la voix : musique de fond, bruitages, et à quel volume.
Demande de Basekou (26/10) : regarder aussi le son des vidéos de référence (notamment « l'After Food »), puisque nos
bruitages sont « trop légers, trop subtils, sans impact ».

1. Sépare la voix du reste avec Demucs (modèle htdemucs, gratuit, sur l'ordinateur) : voix / batterie / basse / autres.
2. Mesure, toutes les 50 ms, le niveau de la voix et celui du reste.
3. Musique de fond : présente si le reste est là en continu ; on donne son niveau par rapport à la voix.
4. Bruitages : un saut court du reste (≥ 9 dB au-dessus de son niveau autour, moins de 1,5 s), avec son niveau par rapport
   à la voix, sa durée, son registre (grave = impact/boum, médium, aigu = pop/clic/whoosh) et s'il tombe sur une coupe.

Usage : python analyse_son.py <video> [<coupes.txt>]   → <video>.son.json à côté de l'analyse, et un résumé à l'écran.
Bibliothèques : _outils/_libs (demucs sans torchaudio, chargé à la main).
"""
import json, subprocess, sys, tempfile, types
from pathlib import Path
import numpy as np, soundfile as sf

sys.path.insert(0, str(Path(__file__).parent / "_libs"))
sys.modules.setdefault("torchaudio", types.ModuleType("torchaudio"))   # demucs l'importe, on n'en a pas besoin ici
import torch
from demucs.pretrained import get_model
from demucs.apply import apply_model

PAS = 0.05


def db(x):
    return 20 * np.log10(np.maximum(x, 1e-6))


def separer(video):
    m = get_model("htdemucs")
    with tempfile.TemporaryDirectory() as d:
        w = Path(d) / "a.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-ac", "2", "-ar", str(m.samplerate), str(w)], check=True)
        a, sr = sf.read(w, dtype="float32")
    x = torch.from_numpy(a.T.copy())
    ref = x.mean(0)
    x = (x - ref.mean()) / (ref.std() + 1e-8)
    with torch.no_grad():
        s = apply_model(m, x[None], split=True, overlap=0.25, progress=False)[0]
    s = s * (ref.std() + 1e-8) + ref.mean()
    pistes = {n: s[i].mean(0).numpy() for i, n in enumerate(m.sources)}
    return pistes, sr


def niveaux(sig, sr):
    n = int(PAS * sr); k = len(sig) // n
    return db(np.sqrt((sig[:k * n].reshape(k, n) ** 2).mean(1)))


def registre(sig, sr, t, d):
    seg = sig[int(t * sr):int((t + max(d, 0.1)) * sr)]
    if len(seg) < 256:
        return "?"
    sp = np.abs(np.fft.rfft(seg * np.hanning(len(seg))))
    f = np.fft.rfftfreq(len(seg), 1 / sr)
    c = (sp * f).sum() / (sp.sum() + 1e-9)
    return "grave (impact, boum)" if c < 400 else "médium" if c < 2500 else "aigu (pop, clic, whoosh, cloche)"


if __name__ == "__main__":
    video = Path(sys.argv[1])
    coupes = [float(x) for x in open(sys.argv[2])] if len(sys.argv) > 2 else []
    p, sr = separer(video)
    reste = p["drums"] + p["bass"] + p["other"]
    lv, lr = niveaux(p["vocals"], sr), niveaux(reste, sr)
    parle = lv > np.percentile(lv, 90) - 20                  # trames où la voix est là
    voix = float(np.median(lv[parle])) if parle.any() else -60
    fond = float(np.median(lr))
    musique = float((lr > voix - 30).mean())                   # part du temps où le reste est audible sous la voix
    # bruitages : saut court au-dessus du niveau local du reste
    ev, i = [], 0
    loc = np.array([np.median(lr[max(0, j - 30):j + 30]) for j in range(len(lr))])
    while i < len(lr):
        if lr[i] - loc[i] >= 9 and lr[i] > voix - 25:
            j = i
            while j < len(lr) and lr[j] - loc[i] >= 4:
                j += 1
            d = (j - i) * PAS
            if d <= 1.5:
                t = i * PAS
                ev.append(dict(t=round(t, 2), duree=round(d, 2), vs_voix_db=round(float(lr[i:j].max() - voix), 1),
                               registre=registre(reste, sr, t, d), sur_coupe=any(abs(t - c) < 0.2 for c in coupes)))
            i = j
        i += 1
    res = dict(video=video.name, duree=round(len(lv) * PAS, 1), voix_dbfs=round(voix, 1),
               fond_vs_voix_db=round(fond - voix, 1), musique_part_du_temps=round(musique, 2),
               bruitages=ev, bruitages_par_minute=round(len(ev) / (len(lv) * PAS / 60), 1),
               bruitages_sur_coupe=sum(e["sur_coupe"] for e in ev))
    out = video.parent / "_analyse" / (video.stem[:40] + ".son.json")
    out.parent.mkdir(exist_ok=True); out.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{video.name[:40]} : {res['duree']} s ; fond {res['fond_vs_voix_db']} dB sous la voix, audible {musique:.0%} du temps ; "
          f"{len(ev)} bruitages ({res['bruitages_par_minute']}/min, {res['bruitages_sur_coupe']} sur une coupe)")
    for e in ev:
        print(f"   {e['t']:6.2f} s  {e['duree']:.2f} s  {e['vs_voix_db']:+5.1f} dB / voix  {e['registre']}{'  [coupe]' if e['sur_coupe'] else ''}")
