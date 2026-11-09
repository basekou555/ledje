"""mosaique.py — 3 images par clip (10 %, 50 %, 90 %), nom + durée incrustés, 6 clips par page.
Rapide (seek direct), pour voir d'un coup ce que contient une série de clips courts.
Usage : python mosaique.py <dossier_sortie> <prefixe_pages> <fichier> [fichier ...]"""
import json, shutil, subprocess, sys, tempfile
from pathlib import Path

TM = ("zscale=t=linear:npl=160,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,"
      "zscale=t=bt709:m=bt709:r=tv,format=yuv420p")
out, prefixe, fichiers = Path(sys.argv[1]), sys.argv[2], [Path(f).resolve() for f in sys.argv[3:]]
out.mkdir(parents=True, exist_ok=True)
tmp = Path(tempfile.mkdtemp(prefix="mos-"))
shutil.copy("C:/Windows/Fonts/arialbd.ttf", tmp / "f.ttf")
vignettes = []
for i, f in enumerate(fichiers):
    info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format",
                                      "-show_streams", str(f)], capture_output=True, text=True).stdout or "{}")
    v = next((s for s in info.get("streams", []) if s.get("codec_type") == "video"), {})
    d = float(info.get("format", {}).get("duration", 0) or 0)
    hdr = v.get("color_transfer") in ("smpte2084", "arib-std-b67")
    (tmp / "t.txt").write_text(f"{f.name}  {d:.0f}s", encoding="utf-8")
    for j, p in enumerate((0.1, 0.5, 0.9)):
        dst = tmp / f"{i:03d}_{j}.jpg"
        vf = (TM + "," if hdr else "") + "scale=300:300:force_original_aspect_ratio=decrease,pad=300:300:(ow-iw)/2:0:gray"
        if j == 0:
            vf += ",drawtext=fontfile=f.ttf:textfile=t.txt:x=4:y=4:fontsize=17:fontcolor=white:box=1:boxcolor=black@0.7"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{d * p:.2f}", "-i", str(f), "-frames:v", "1",
                        "-vf", vf, dst.name], cwd=tmp)
        if not dst.exists():  # image noire si l'extraction échoue
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "color=gray:s=300x300",
                            "-frames:v", "1", dst.name], cwd=tmp)
        vignettes.append(dst)
    print(f.name, f"{d:.0f}s", flush=True)
# Pages : 6 clips (lignes) × 3 images, pour rester lisible.
for k in range(0, len(vignettes), 18):
    lot = vignettes[k:k + 18]
    lst = tmp / "l.txt"
    lst.write_text("".join(f"file '{p.name}'\n" for p in lot), encoding="utf-8")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "l.txt",
                    "-vf", "tile=6x3:padding=3:color=black", "-frames:v", "1", "-q:v", "3",
                    str(out / f"{prefixe}_p{k // 18 + 1:02d}.jpg")], cwd=tmp)
shutil.rmtree(tmp, ignore_errors=True)
