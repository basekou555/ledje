"""planches_verif.py — planches de vérification de la banque de plans : 4 images par plan (10/37/63/90 %),
cadrées comme au montage, numéro + rush + timecodes incrustés, 8 plans par page.
Usage : python planches_verif.py <candidats.json> <dossier_sortie>"""
import json, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

TM = ("zscale=t=linear:npl=160,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,"
      "zscale=t=bt709:m=bt709:r=tv,format=yuv420p,eq=gamma=1.08:contrast=1.2:saturation=1.35")
L = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
tmp = Path(tempfile.mkdtemp(prefix="pv-"))
W, H = 180, 320
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 16)


def hdr(src):
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=color_transfer",
                        "-of", "csv=p=0", src], capture_output=True, text=True).stdout
    return "smpte2084" in o or "arib-std-b67" in o


cache = {}
for k in range(0, len(L), 8):
    page = Image.new("RGB", (60 + 4 * W, 8 * (H + 24)), (40, 40, 40))
    d = ImageDraw.Draw(page)
    for r, p in enumerate(L[k:k + 8]):
        i = k + r
        if p["rush"] not in cache: cache[p["rush"]] = hdr(p["rush"])
        crop = f"crop=ih*9/16:ih:(iw-ih*9/16)*{p['cadrage']}:0," if p.get("cadrage") is not None else ""
        y = r * (H + 24)
        d.text((4, y + 4), f"{i + 1}", fill=(255, 200, 80), font=font)
        d.text((60, y + H + 4), f"{Path(p['rush']).name}  {p['a']:.1f}→{p['b']:.1f}s  ({', '.join(p['sb'])})", fill=(230, 230, 230), font=font)
        for j, f in enumerate((0.1, 0.37, 0.63, 0.9)):
            t = p["a"] + (p["b"] - p["a"]) * f
            dst = tmp / f"{i}_{j}.jpg"
            vf = (TM + "," if cache[p["rush"]] else "") + f"{crop}scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", p["rush"], "-frames:v", "1", "-vf", vf, "-q:v", "5", str(dst)])
            if dst.exists():
                page.paste(Image.open(dst), (60 + j * W, y))
    page.save(out / f"verif_{k // 8 + 1:02d}.jpg", quality=80)
    print(f"page {k // 8 + 1} ({k + 1}-{min(k + 8, len(L))})", flush=True)
