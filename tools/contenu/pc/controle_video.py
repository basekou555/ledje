"""controle_video.py — prépare le contrôle d'une vidéo EXPORTÉE de CapCut (le vrai résultat, pas une copie).
Produit dans _controle/<nom>/ :
  - planches_NN.jpg : une image toutes les 0,5 s, avec le timecode (pour voir textes, sous-titres, zooms, cadrage) ;
  - son.json : niveau sonore toutes les 0,1 s (dBFS crête et RMS) + les pics nets (effets sonores entendus ou non) ;
  - resume.json : durée, résolution, niveau moyen.
L'agent de contrôle lit ces fichiers et remplit _montages/controle-video.md.
Usage : python controle_video.py <video.mp4> [<montage.json>]  (le montage permet de vérifier chaque effet sonore)
"""
import json, subprocess, sys, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

src = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / "_controle" / src.stem
out.mkdir(parents=True, exist_ok=True)
pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=width,height,codec_type",
                                "-of", "json", str(src)], capture_output=True, text=True).stdout)
duree = float(pr["format"]["duration"])

# 1. Images toutes les 0,5 s, 20 par planche (5 × 4), timecode incrusté.
tmp = out / "_img"; tmp.mkdir(exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", "fps=2,scale=216:384", str(tmp / "i%04d.jpg")], check=True)
imgs = sorted(tmp.glob("i*.jpg"))
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 16)
for k in range(0, len(imgs), 20):
    page = Image.new("RGB", (5 * 216, 4 * (384 + 22)), (30, 30, 30)); d = ImageDraw.Draw(page)
    for j, f in enumerate(imgs[k:k + 20]):
        x, y = (j % 5) * 216, (j // 5) * (384 + 22)
        page.paste(Image.open(f), (x, y)); t = (k + j) * 0.5
        d.text((x + 4, y + 386), f"{int(t // 60)}:{t % 60:04.1f}", fill=(255, 210, 80), font=font)
    page.save(out / f"planches_{k // 20 + 1:02d}.jpg", quality=80)
for f in imgs: f.unlink()
tmp.rmdir()

# 2. Le son : niveau toutes les 0,1 s, et les pics qui dépassent le fond de plus de 6 dB (les effets doivent en faire partie).
o = subprocess.run(["ffmpeg", "-v", "info", "-i", str(src), "-af",
                    "aresample=48000,asetnsamples=4800,astats=metadata=1:reset=1:measure_perchannel=none,ametadata=print",
                    "-f", "null", "-"], capture_output=True, text=True).stderr
pk = [float(v) if v not in ("-inf", "inf") else -120.0 for v in re.findall(r"Overall\.Peak_level=(\S+)", o)]
rm = [float(v) if v not in ("-inf", "inf") else -120.0 for v in re.findall(r"Overall\.RMS_level=(\S+)", o)]
def fond(i):                                       # niveau médian autour (±1,5 s) : la voix, le décor
    z = sorted(rm[max(0, i - 15):i + 16]); return z[len(z) // 2] if z else -60.0


# Effets attendus (si le montage est donné) : à chacun de ces moments, le niveau doit monter nettement au-dessus du fond.
effets = []
if len(sys.argv) > 2:
    mt = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8")); base = Path(mt["dossier"]); t, prev = 0.0, None
    for p in mt["plans"]:
        dd = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                   str(base / p["extrait"])], capture_output=True, text=True).stdout) / p.get("vitesse", 1.0)
        if p.get("haut") and p["haut"] != prev: effets.append((t, "whoosh (nouveau texte)"))
        elif p.get("haut"): effets.append((t, "pop (coupe)"))
        prev = p.get("haut") or prev
        effets += [(t + x[0], x[1]) for x in p.get("sfx", [])]
        t += dd
controle = []
for te, nom in effets:
    i = int(te / 0.1)
    if i >= len(rm): continue
    m = max(rm[i:i + 5]); f = fond(i)
    controle.append({"t": round(te, 1), "effet": nom, "niveau": round(m, 1), "fond": round(f, 1),
                     "ecart_db": round(m - f, 1), "audible": m - f >= 4})
(out / "son.json").write_text(json.dumps({"pas": 0.1, "crete": pk, "rms": rm, "effets": controle}, ensure_ascii=False), encoding="utf-8")
pics = controle
v = [s for s in pr["streams"] if s.get("codec_type") == "video"][0]
res = {"video": str(src), "duree": round(duree, 2), "taille": f"{v['width']}x{v['height']}", "planches": len(list(out.glob('planches_*.jpg'))),
       "rms_moyen": round(sum(rm) / len(rm), 1) if rm else None,
       "effets_controles": len(controle), "effets_inaudibles": [c for c in controle if not c["audible"]]}
(out / "resume.json").write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(res, ensure_ascii=False))
