"""28/10 — retire une animation d'entrée des textes d'un projet CapCut existant, sans toucher au reste.
Les textes apparaissent et disparaissent alors d'un coup, avec la coupe de l'image.

    python anim_retirer.py "<dossier du projet>" "Bold In" [--essai]

Même prudence que anim_bold_in.py : CapCut fermé, sauvegarde datée à la seconde.
"""
import json, shutil, subprocess, sys, time
from pathlib import Path

projet, nom = Path(sys.argv[1]), sys.argv[2]
essai = "--essai" in sys.argv
if not essai and "capcut.exe" in subprocess.run(["tasklist"], capture_output=True, text=True).stdout.lower():
    sys.exit("CapCut est ouvert : ferme-le avant.")

stamp = time.strftime("%Y%m%d-%H%M%S")
for f in [projet / "draft_content.json", projet / "template-2.tmp"] + list((projet / "Timelines").glob("*/draft_content.json")):
    if not f.exists(): continue
    d = json.loads(f.read_text(encoding="utf-8"))
    n = 0
    for m in d["materials"].get("material_animations", []):
        avant = len(m["animations"])
        m["animations"] = [a for a in m["animations"] if a.get("name") != nom]
        n += avant - len(m["animations"])
    print(f"{f.relative_to(projet)} : {n} animation(s) « {nom} » retirée(s)")
    if n and not essai:
        shutil.copy2(f, f.with_name(f"{f.stem}.avant-sans-anim-{stamp}{f.suffix}"))
        f.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
