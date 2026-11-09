"""planche_montage.py — contrôle du monteur : pour chaque plan d'un montage, la 1re image, le milieu et la dernière image,
cadrés comme dans CapCut (9:16, zoom calé en bas, décalage horizontal), avec le texte du haut. Une ligne par plan.
Usage : python planche_montage.py <montage.json> <sortie.jpg>
"""
import json, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

mt = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
base = Path(mt["dossier"])
tmp = Path(tempfile.mkdtemp(prefix="pm-"))
W, H = 162, 288
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 15)
rows = []
for i, p in enumerate(mt["plans"], 1):
    f = base / p["extrait"]
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                             capture_output=True, text=True).stdout)
    row = Image.new("RGB", (60 + 3 * W + 330, H), (35, 35, 35))
    dr = ImageDraw.Draw(row)
    dr.text((6, 6), str(i), fill=(255, 200, 80), font=font)
    for j, t in enumerate((0.05, d / 2, max(0, d - 0.1))):
        o = tmp / f"{i}_{j}.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", str(f), "-frames:v", "1", str(o)])
        im = Image.open(o); w, h = im.size
        zx = p.get("zoom_extra", 1.0)
        if w > h:                                   # 16:9 → recadrage 9:16 comme capcut_projet.py
            ch = h / zx; cw = ch * 9 / 16
            x0 = (p["cadrage"] if p.get("cadrage") is not None else 0.5) * (w - cw)
            im = im.crop((int(x0), int(h - ch), int(x0 + cw), h))
        row.paste(im.resize((W, H)), (60 + j * W, 0))
    infos = [Path(p["extrait"]).stem, f"{d:.1f} s" + (f" ×{p['vitesse']}" if p.get("vitesse") else "")]
    if p.get("haut"): infos.append("haut : " + p["haut"].replace("\n", " / "))
    if p.get("texte"): infos.append("texte : " + p["texte"][:60])
    for k, s in enumerate(infos):
        dr.text((60 + 3 * W + 8, 8 + 20 * k), s, fill=(230, 230, 230), font=font)
    rows.append(row)
sheet = Image.new("RGB", (rows[0].width, H * len(rows)))
for i, r in enumerate(rows):
    sheet.paste(r, (0, H * i))
sheet.save(sys.argv[2], quality=80)
print(sys.argv[2], len(rows), "plans")
