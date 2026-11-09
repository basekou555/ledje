"""extraire_son.py — 27/10 : découpe des morceaux de SON seul dans les rushes (voix posée sur une autre image,
vrais bruits d'un geste). Même principe qu'extraire.py, sans l'image.

Usage : python extraire_son.py <dossier> <liste.txt>
liste.txt : `nom ; rush ; in ; out [; brut]` — « brut » : bruit court (un pack posé) — pas de loudnorm,
           le pic est remonté à -3 dB (sinon un pack posé à 2 m sort 20 dB sous la voix, inaudible).
Sortie : <dossier>/_sons/reels/<nom>.wav (déjà présent → ignoré)
"""
import subprocess, sys
from pathlib import Path

racine = Path(sys.argv[1]); sortie = racine / "_sons" / "reels"; sortie.mkdir(parents=True, exist_ok=True)
for ligne in Path(sys.argv[2]).read_text(encoding="utf-8").splitlines():
    if not ligne.strip() or ligne.startswith("#"):
        continue
    c = [x.strip() for x in ligne.split(";")]
    nom, rush, a, b = c[:4]; brut = len(c) > 4 and c[4] == "brut"
    dst = sortie / f"{nom}.wav"
    if dst.exists():
        continue
    af = ["-af", "loudnorm=I=-16:TP=-1.5:LRA=11"] if not brut else []
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", a, "-i", str(racine / rush), "-t", f"{float(b) - float(a):.3f}", "-vn",
                    *af, "-ar", "48000", "-ac", "2", str(dst)], check=True)
    if brut:
        o = subprocess.run(["ffmpeg", "-i", str(dst), "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
        pic = float(o.split("max_volume:")[1].split("dB")[0])
        tmp = dst.with_suffix(".tmp.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(dst), "-af", f"volume={-3 - pic:.1f}dB", str(tmp)], check=True)
        tmp.replace(dst)
    print(f"{nom} : {rush} {a} → {b}", flush=True)
