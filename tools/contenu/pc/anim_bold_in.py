"""28/10 — remplace l'animation d'entrée « 弹出 » (inconnue de CapCut → « perte d'animation ») par « Bold In »
dans un projet CapCut existant, sans toucher au reste (tes coupes, tes retouches).

    python anim_bold_in.py "<dossier du projet>" [--essai]

Écrit draft_content.json, template-2.tmp et Timelines/<id>/draft_content.json s'ils existent,
après une sauvegarde datée à la seconde. CapCut doit être fermé. --essai : n'écrit rien, compte seulement.
"""
import json, shutil, subprocess, sys, time
from pathlib import Path

BOLD_IN = {"name": "Bold In", "id": "7591705801023048976", "resource_id": "7591705801023048976",
           "category_id": "ruchang", "category_name": "text", "material_type": "sticker", "panel": "", "path": ""}
cache = Path.home() / "AppData/Local/CapCut/User Data/Cache/effect/7591705801023048976"
if cache.exists():   # déjà téléchargée par CapCut (S-02) : on lui donne le chemin, comme CapCut le fait
    BOLD_IN["path"] = next(cache.iterdir()).as_posix()

projet = Path(sys.argv[1]); essai = "--essai" in sys.argv

# Une animation sans chemin (« path » vide) n'a pas été téléchargée dans ce projet : on reprend le chemin
# que CapCut a donné à la même animation dans un autre projet, s'il existe encore dans le cache.
chemins = {}
for autre in projet.parent.glob("*/draft_content.json"):
    try: dd = json.loads(autre.read_text(encoding="utf-8"))
    except Exception: continue
    for m in dd["materials"].get("material_animations", []):
        for a in m["animations"]:
            if a.get("path") and Path(a["path"]).exists(): chemins[a["resource_id"]] = a["path"]
if not essai and "capcut.exe" in subprocess.run(["tasklist"], capture_output=True, text=True).stdout.lower():
    sys.exit("CapCut est ouvert : ferme-le avant.")

fichiers = [projet / "draft_content.json", projet / "template-2.tmp"] + list((projet / "Timelines").glob("*/draft_content.json"))
stamp = time.strftime("%Y%m%d-%H%M%S")
for f in fichiers:
    if not f.exists(): continue
    d = json.loads(f.read_text(encoding="utf-8"))
    n = 0
    for m in d["materials"].get("material_animations", []):
        for a in m["animations"]:
            if a.get("name") == "弹出":
                a.update(BOLD_IN); n += 1
            if not a.get("path") and a.get("resource_id") in chemins:
                a["path"] = chemins[a["resource_id"]]; n += 1
    print(f"{f.relative_to(projet)} : {n} animation(s) remplacée(s)")
    if n and not essai:
        shutil.copy2(f, f.with_name(f"{f.stem}.avant-bold-in-{stamp}{f.suffix}"))
        f.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
