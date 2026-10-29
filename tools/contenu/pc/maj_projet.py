"""maj_projet.py — met à jour un projet CapCut EXISTANT au lieu d'en créer un nouveau (règle de Basekou du 25/10 :
un seul projet par storyboard, on capitalise sur les retours). On reconstruit le montage hors de CapCut, puis on
remplace dans le vrai projet SEULEMENT les pistes demandées (avec leurs matériaux). Tout le reste — ses animations,
ses volumes, ses ajouts — est laissé tel quel. Une copie de sauvegarde est faite avant.
⚠️ CapCut doit être fermé (sinon il réécrit le fichier par-dessus).

Usage : python maj_projet.py "<nom du projet CapCut>" <montage.json> --pistes sous-titres,effets[,video,titres,inserts,stickers] [--retirer TEST]
"""
import json, shutil, subprocess, sys, time
from pathlib import Path

DRAFTS = Path.home() / "AppData/Local/CapCut/User Data/Projects/com.lveditor.draft"
TRAVAIL = Path(__file__).resolve().parent.parent / "_montages" / "_brouillons"

nom, montage = sys.argv[1], sys.argv[2]
pistes = sys.argv[sys.argv.index("--pistes") + 1].split(",")
if "--projets" in sys.argv:      # essai sur une copie, hors du dossier de CapCut
    DRAFTS = Path(sys.argv[sys.argv.index("--projets") + 1])
elif "CapCut.exe" in subprocess.run(["tasklist"], capture_output=True, text=True).stdout:
    sys.exit("CapCut est ouvert : ferme-le avant (sinon il écrase la mise à jour).")

cible = DRAFTS / nom
mt = json.loads(Path(montage).read_text(encoding="utf-8"))
subprocess.run([sys.executable, str(Path(__file__).parent / "capcut_projet.py"), montage, "--brouillon", str(TRAVAIL)], check=True)
src = json.loads((TRAVAIL / mt["nom"] / "draft_content.json").read_text(encoding="utf-8"))

def copies(dossier):
    """26/10 : CapCut garde des copies de secours (template-2.tmp, .bak) et c'est elles qu'il rouvre si elles diffèrent :
    on écrit donc dans toutes, à la racine et dans la timeline principale (les autres timelines sont à Basekou)."""
    out = [dossier / "draft_content.json"] + [dossier / n for n in ("template-2.tmp", "draft_content.json.bak") if (dossier / n).exists()]
    pj = dossier / "Timelines" / "project.json"
    if pj.exists():
        tl = dossier / "Timelines" / json.loads(pj.read_text(encoding="utf-8"))["main_timeline_id"]
        out += [tl / n for n in ("draft_content.json", "template-2.tmp", "draft_content.json.bak") if (tl / n).exists()]
    return out


fichiers = copies(cible)
dst = json.loads(fichiers[0].read_text(encoding="utf-8"))
sauve = cible / f"draft_content.avant-maj-{time.strftime('%Y%m%d-%H%M%S')}.json"
shutil.copy2(fichiers[0], sauve)


def piste(d, cle):
    """Piste par nom (titres, sous-titres, effets, inserts, stickers) ; « video » = la piste vidéo principale (la 1re)."""
    for t in d["tracks"]:
        if (cle == "video" and t["type"] == "video" and t.get("name") in ("video", "", None)) or t.get("name") == cle:
            return t
    return None


def refs(seg):
    return {seg["material_id"], *seg.get("extra_material_refs", [])}


def materiaux(d):
    return {m["id"]: (k, m) for k, v in d["materials"].items() if isinstance(v, list) for m in v if isinstance(m, dict) and "id" in m}


for cle in pistes:
    ps, pd = piste(src, cle), piste(dst, cle)
    if ps is None:
        print(f"⚠️ piste « {cle} » absente du nouveau montage : ignorée"); continue
    if pd is None:                                   # 26/10 : nouvelle piste (inserts, stickers) → on l'ajoute
        pd = dict(ps, segments=[])
        if ps["type"] == "video":                    # une piste vidéo d'inserts se place juste au-dessus des autres vidéos
            k = max(i for i, t in enumerate(dst["tracks"]) if t["type"] == "video") + 1
            dst["tracks"].insert(k, pd)
        else:
            dst["tracks"].append(pd)
    vieux = set().union(*(refs(s) for s in pd["segments"])) if pd["segments"] else set()
    ailleurs = set().union(*(refs(s) for t in dst["tracks"] if t is not pd for s in t["segments"]))
    for k, v in dst["materials"].items():          # on retire les matériaux des anciens segments (s'ils ne servent qu'ici)
        if isinstance(v, list):
            dst["materials"][k] = [m for m in v if not (isinstance(m, dict) and m.get("id") in vieux - ailleurs)]
    ms = materiaux(src)
    for s in ps["segments"]:                         # on recopie ceux des nouveaux segments
        for r in refs(s):
            if r in ms:
                k, m = ms[r]
                dst["materials"].setdefault(k, []).append(m)
    pd["segments"] = ps["segments"]
    print(f"✅ « {cle} » : {len(ps['segments'])} segments remplacés")

for cle in (sys.argv[sys.argv.index("--retirer") + 1].split(",") if "--retirer" in sys.argv else []):
    pd = piste(dst, cle)                           # 26/10 : ex. la piste « TEST » (plus de filigrane)
    if pd is None: continue
    vieux = set().union(*(refs(s) for s in pd["segments"])) if pd["segments"] else set()
    dst["tracks"].remove(pd)
    ailleurs = set().union(*(refs(s) for t in dst["tracks"] for s in t["segments"]))
    for k, v in dst["materials"].items():
        if isinstance(v, list):
            dst["materials"][k] = [m for m in v if not (isinstance(m, dict) and m.get("id") in vieux - ailleurs)]
    print(f"✅ piste « {cle} » retirée")

# 27/10 : piste vidéo remplacée → la durée est celle du nouveau montage (sinon une fin noire quand il raccourcit)
dst["duration"] = src.get("duration", 0) if "video" in pistes else max(dst.get("duration", 0), src.get("duration", 0))
texte = json.dumps(dst, ensure_ascii=False)
for f in fichiers:
    f.write_text(texte, encoding="utf-8")
meta = cible / "draft_meta_info.json"                 # date de modification et durée, comme si CapCut avait enregistré
if meta.exists():
    m = json.loads(meta.read_text(encoding="utf-8"))
    m["tm_draft_modified"] = int(time.time() * 1e6); m["tm_duration"] = dst.get("duration", m.get("tm_duration"))
    meta.write_text(json.dumps(m, ensure_ascii=False), encoding="utf-8")
print(f"Projet « {nom} » mis à jour ({len(fichiers)} fichiers). Sauvegarde : {sauve.name}")
