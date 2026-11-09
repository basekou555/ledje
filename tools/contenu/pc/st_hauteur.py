"""28/10 — déplace en hauteur les sous-titres d'un projet CapCut existant, entre deux instants, sans toucher au reste.

    python st_hauteur.py "<dossier du projet>" <début_s> <fin_s> <y> [--essai]

y : -0.42 = bas (habituel), +0.45 = haut. Seuls les textes de la piste « sous-titres » qui commencent
entre début et fin bougent. CapCut fermé, sauvegarde datée à la seconde.
"""
import json, shutil, subprocess, sys, time
from pathlib import Path

projet, a, b, y = Path(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
essai = "--essai" in sys.argv
if not essai and "capcut.exe" in subprocess.run(["tasklist"], capture_output=True, text=True).stdout.lower():
    sys.exit("CapCut est ouvert : ferme-le avant.")

stamp = time.strftime("%Y%m%d-%H%M%S")
for f in [projet / "draft_content.json", projet / "template-2.tmp"] + list((projet / "Timelines").glob("*/draft_content.json")):
    if not f.exists(): continue
    d = json.loads(f.read_text(encoding="utf-8"))
    textes = {m["id"]: json.loads(m["content"])["text"] for m in d["materials"]["texts"]}
    n = 0
    for t in d["tracks"]:
        if t["type"] != "text" or t.get("name") != "sous-titres": continue
        for s in t["segments"]:
            debut = s["target_timerange"]["start"] / 1e6
            if a <= debut < b:
                s["clip"]["transform"]["y"] = y; n += 1
                if f.name == "draft_content.json" and f.parent == projet:
                    print(f"  {debut:5.2f} s  {textes.get(s['material_id'], '?')!r}")
    print(f"{f.relative_to(projet)} : {n} sous-titre(s) déplacé(s)")
    if n and not essai:
        shutil.copy2(f, f.with_name(f"{f.stem}.avant-st-hauteur-{stamp}{f.suffix}"))
        f.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
