"""retouche_projet.py — retouches CHIRURGICALES dans un projet CapCut que Basekou a déjà retouché (26/10).
maj_projet.py remplace des pistes entières : ses coupes et ses réglages sur ces pistes seraient perdus. Ici on ne
touche qu'aux segments visés, tout le reste reste tel qu'il l'a laissé. Sauvegarde avant, toutes les copies écrites.
⚠️ CapCut doit être fermé.

Usage : python retouche_projet.py "<nom du projet>" [--remplacer ancien.mp4=nouveau.mp4] [--sans-zoom] [--retirer-piste stickers] [--projets <dossier>]
  --remplacer : change le fichier d'un plan (même durée ou plus long), sans bouger ses temps ni ses réglages.
  --sans-zoom : retire les zooms par images clés de la piste vidéo principale (le cadrage fixe reste).
"""
import json, shutil, subprocess, sys, time
from pathlib import Path

DRAFTS = Path.home() / "AppData/Local/CapCut/User Data/Projects/com.lveditor.draft"
EXTRAITS = Path(__file__).resolve().parent.parent / "_extraits"
a = sys.argv
if "--projets" in a:
    DRAFTS = Path(a[a.index("--projets") + 1])
elif "CapCut.exe" in subprocess.run(["tasklist"], capture_output=True, text=True).stdout:
    sys.exit("CapCut est ouvert : ferme-le avant (sinon il écrase la retouche).")
cible = DRAFTS / a[1]


def copies(dossier):
    """Même règle que maj_projet.py : CapCut rouvre ses copies de secours, on les écrit toutes (timeline principale)."""
    out = [dossier / "draft_content.json"] + [dossier / n for n in ("template-2.tmp", "draft_content.json.bak") if (dossier / n).exists()]
    pj = dossier / "Timelines" / "project.json"
    if pj.exists():
        tl = dossier / "Timelines" / json.loads(pj.read_text(encoding="utf-8"))["main_timeline_id"]
        out += [tl / n for n in ("draft_content.json", "template-2.tmp", "draft_content.json.bak") if (tl / n).exists()]
    return out


def duree(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                                capture_output=True, text=True).stdout)


fichiers = copies(cible)
d = json.loads(fichiers[0].read_text(encoding="utf-8"))
shutil.copy2(fichiers[0], cible / f"draft_content.avant-retouche-{time.strftime('%Y%m%d-%H%M%S')}.json")
video = next(t for t in d["tracks"] if t["type"] == "video" and t.get("name") in ("video", "", None))
fait = []

if "--remplacer" in a:
    ancien, nouveau = a[a.index("--remplacer") + 1].split("=")
    f = EXTRAITS / nouveau
    us = int(duree(f) * 1e6)
    for m in d["materials"]["videos"]:
        if m.get("material_name") == ancien:
            segs = [s for t in d["tracks"] for s in t["segments"] if s["material_id"] == m["id"]]
            besoin = max(s["source_timerange"]["start"] + s["source_timerange"]["duration"] for s in segs)
            if us < besoin - 50000:
                sys.exit(f"{nouveau} ({us / 1e6:.2f} s) est plus court que l'usage du plan ({besoin / 1e6:.2f} s) : rien fait.")
            m.update(path=str(f), material_name=nouveau, duration=us, media_path="", reverse_path="", intensifies_path="",
                     reverse_intensifies_path="", intensifies_audio_path="", cartoon_path="")
            fait.append(f"{ancien} → {nouveau}")
    if not fait:
        sys.exit(f"Aucun plan « {ancien} » dans le projet : rien fait.")

if "--sans-zoom" in a:
    for s in video["segments"]:
        kf = s.get("common_keyframes") or []
        garde = [k for k in kf if not k["property_type"].startswith("KFTypeScale")]
        if len(garde) != len(kf):
            s["common_keyframes"] = garde; fait.append("zoom retiré à " + str(round(s["target_timerange"]["start"] / 1e6, 2)) + " s")

if "--retirer-piste" in a:
    nom = a[a.index("--retirer-piste") + 1]
    t = next((t for t in d["tracks"] if t.get("name") == nom), None)
    if t:
        ids = {r for s in t["segments"] for r in (s["material_id"], *s.get("extra_material_refs", []))}
        d["tracks"].remove(t)
        autres = {r for t2 in d["tracks"] for s in t2["segments"] for r in (s["material_id"], *s.get("extra_material_refs", []))}
        for k, v in d["materials"].items():
            if isinstance(v, list):
                d["materials"][k] = [m for m in v if not (isinstance(m, dict) and m.get("id") in ids - autres)]
        fait.append(f"piste « {nom} » retirée ({len(t['segments'])} segments)")

if not fait:
    sys.exit("Rien à faire.")
texte = json.dumps(d, ensure_ascii=False)
for f in fichiers:
    f.write_text(texte, encoding="utf-8")
meta = cible / "draft_meta_info.json"
if meta.exists():
    m = json.loads(meta.read_text(encoding="utf-8")); m["tm_draft_modified"] = int(time.time() * 1e6)
    meta.write_text(json.dumps(m, ensure_ascii=False), encoding="utf-8")
print(f"{cible.name} : " + " ; ".join(fait) + f" ({len(fichiers)} copies écrites)")
