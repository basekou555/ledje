"""Planches-contact en pages (24 images par page), images clés seulement — rapide sur du 4K HEVC.
Usage : python planches_pages.py <dossier_rushes> <dossier_planches> [pas=5] [fichier ...]"""
import shutil, subprocess, sys
from pathlib import Path

src, out = Path(sys.argv[1]), Path(sys.argv[2])
pas = float(sys.argv[3]) if len(sys.argv) > 3 else 5.0
noms = sys.argv[4:] or [p.name for p in sorted(src.iterdir()) if p.suffix.lower() in {".mp4", ".mov"}]
out.mkdir(parents=True, exist_ok=True)
for nom in noms:
    f = src / nom
    tag = f.stem + ("" if pas == 5 else f"_pas{pas:g}")
    tmp = out / f"_frames_{tag}"
    shutil.rmtree(tmp, ignore_errors=True); tmp.mkdir()
    shutil.copy("C:/Windows/Fonts/arialbd.ttf", tmp / "f.ttf")
    vf = (f"fps=1/{pas},scale=-2:360,drawtext=fontfile=f.ttf:text='%{{pts\\:hms}}'"
          ":x=6:y=6:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.7")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-skip_frame", "nokey", "-i", str(f), "-an",
                    "-vf", vf, "-q:v", "4", "%04d.jpg"], cwd=tmp, check=True)
    imgs = sorted(tmp.glob("*.jpg"))
    w = int(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                            "stream=width", "-of", "csv=p=0", str(imgs[0])], capture_output=True, text=True).stdout)
    g = "4x6" if w > 400 else "6x4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "1", "-i", "%04d.jpg",
                    "-vf", f"tile={g}:padding=4:color=gray", "-q:v", "3",
                    str(out / f"{tag}_p%02d.jpg")], cwd=tmp, check=True)
    pages = len(list(out.glob(f"{tag}_p*.jpg")))
    print(f"{nom} : {len(imgs)} images, grille {g}, {pages} pages", flush=True)
    shutil.rmtree(tmp, ignore_errors=True)
