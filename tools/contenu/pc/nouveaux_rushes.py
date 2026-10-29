"""nouveaux_rushes.py — repère les NOUVEAUX rushes (Bureau « Ledje rush bureau » et disque D:\\LEDJE s'il est branché)
et les prépare pour le dérushage. Demande de Basekou (26/10) : que les nouveaux rushes soient détectés tout seuls.

Pour chaque vidéo qui n'est dans aucun index :
  1. attend que la copie soit finie (fichier ajouté il y a plus de 10 min, ou même taille qu'au passage précédent) ;
  2. l'ajoute à l'index (colonnes techniques ; état « nouveau » ; les tags restent vides) ;
  3. fait une planche-contact (_planches/nouveaux/<rush>.jpg) et la transcription large-v3 si le rush a du son ;
  4. l'inscrit dans _rushes-nouveaux/a-taguer.json, que la tâche programmée lit pour taguer.
Ne touche jamais aux rushes eux-mêmes. Ne tague rien (c'est la session qui regarde et tague ; Basekou corrige).
Usage : python nouveaux_rushes.py [--sans-transcription]
"""
import csv, json, subprocess, sys, time
from datetime import datetime
from pathlib import Path

B = Path(__file__).resolve().parent.parent
SOURCES = [(B, B / "rushes-index.csv", "R", False), (Path("D:/LEDJE"), B / "rushes-index-disque.csv", "D", True)]
VIDEOS = {".mp4", ".mov", ".m4v"}
ETAT = B / "_rushes-nouveaux" / "etat.json"
VERROU = B / "_rushes-nouveaux" / "verrou"
# 26/10 : un vieux passage resté en arrière-plan a réécrit l'index avec une copie périmée → un seul passage à la fois,
# et on relit l'index et la file juste avant chaque écriture (on ajoute, on n'écrase jamais avec une vieille copie).
if VERROU.exists() and time.time() - VERROU.stat().st_mtime < 3 * 3600:
    sys.exit(f"Un autre passage tourne déjà (verrou du {datetime.fromtimestamp(VERROU.stat().st_mtime):%d/%m %H:%M}) : rien fait.")
VERROU.parent.mkdir(exist_ok=True); VERROU.write_text(str(datetime.now()), encoding="utf-8")
A_TAGUER = B / "_rushes-nouveaux" / "a-taguer.json"
ETAT.parent.mkdir(exist_ok=True)
etat = json.loads(ETAT.read_text(encoding="utf-8")) if ETAT.exists() else {"tailles": {}}
a_taguer = json.loads(A_TAGUER.read_text(encoding="utf-8")) if A_TAGUER.exists() else []
IGNORE = ("_extraits", "_planches", "_montages", "_controle", "_transcripts", "_sons", "_outils", "_rushes-nouveaux",
          "_proxies", "_vignettes", "_brouillons", "_projets-retires", "_references")


def probe(f):
    j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                                   "format=duration:stream=codec_type,width,height,r_frame_rate:stream_side_data=rotation:format_tags=creation_time",
                                   "-of", "json", str(f)], capture_output=True, text=True).stdout or "{}")
    v = next((s for s in j.get("streams", []) if s.get("codec_type") == "video"), {})
    a = any(s.get("codec_type") == "audio" for s in j.get("streams", []))
    w, h = v.get("width", 0), v.get("height", 0)
    rot = abs(next((sd.get("rotation", 0) for sd in v.get("side_data_list", []) if "rotation" in sd), 0))
    if rot == 90: w, h = h, w
    num, den = (v.get("r_frame_rate", "0/1").split("/") + ["1"])[:2]
    date = j.get("format", {}).get("tags", {}).get("creation_time", "")[:10] or datetime.fromtimestamp(f.stat().st_mtime).strftime("%Y-%m-%d")
    return dict(duree=float(j.get("format", {}).get("duration", 0) or 0), w=w, h=h, fps=round(int(num) / max(1, int(den)), 2),
                son=a, date=date)


def planche(f, d):
    """Une image toutes les N s (N choisi pour ~60 images), en grille de 10 colonnes, timecode incrusté."""
    sortie = B / "_planches" / "nouveaux" / f"{f.stem}.jpg"; sortie.parent.mkdir(parents=True, exist_ok=True)
    pas = max(2, int(d / 60) + 1); n = int(d // pas) + 1; lignes = (n + 9) // 10
    vf = (f"fps=1/{pas},scale=192:-2,drawtext=fontfile='C\\:/Windows/Fonts/arialbd.ttf':text='%{{pts\\:hms}}':"
          f"x=4:y=4:fontsize=16:fontcolor=yellow:box=1:boxcolor=black@0.5,tile=10x{lignes}")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-skip_frame", "nokey", "-i", str(f), "-vf", vf, "-frames:v", "1", "-q:v", "4", str(sortie)])  # images clés seulement : rapide
    return sortie


def maj_item(item):
    """Relit la file et met à jour la seule entrée de ce rush (sans écraser les autres)."""
    file = json.loads(A_TAGUER.read_text(encoding="utf-8")) if A_TAGUER.exists() else []
    file = [item if x["id"] == item["id"] else x for x in file]
    A_TAGUER.write_text(json.dumps(file, ensure_ascii=False, indent=1), encoding="utf-8")


def preparer(f, rid, index_nom, duree, son):
    """Planche + transcription, puis inscription dans a-taguer.json (enregistré tout de suite)."""
    item = dict(id=rid, fichier=str(f), index=index_nom, duree_s=round(duree, 1), planche=None, transcription=None,
                detecte=f"{datetime.now():%Y-%m-%d %H:%M}")
    a_taguer[:] = json.loads(A_TAGUER.read_text(encoding="utf-8")) if A_TAGUER.exists() else []
    a_taguer.append(item); A_TAGUER.write_text(json.dumps(a_taguer, ensure_ascii=False, indent=1), encoding="utf-8")
    item["planche"] = str(planche(f, duree))
    maj_item(item)
    if son and "--sans-transcription" not in sys.argv:
        subprocess.run([sys.executable, str(B / "_outils" / "transcrire.py"), str(f)])
        tr = B / "_transcripts" / "large-v3" / f"{f.stem}.json"
        item["transcription"] = str(tr) if tr.exists() else None
        maj_item(item)
    nouveaux.append(item)
    print(f"🆕 {rid} {f.name} ({duree:.0f} s)", flush=True)


nouveaux = []
for dossier, index, prefixe, recursif in SOURCES:
    if not dossier.exists() or not index.exists():
        continue
    lignes = list(csv.DictReader(open(index, encoding="utf-8")))
    connus = {l["fichier"] for l in lignes}
    en_file = {i["id"] for i in a_taguer}
    for l in lignes:                                   # reprise : un rush resté « nouveau » sans être en file (passage interrompu)
        if l.get("etat") == "nouveau" and l["id"] not in en_file:
            f = next((x for x in ([dossier / l["fichier"]] + list(dossier.rglob(l["fichier"])) if recursif else [dossier / l["fichier"]]) if x.exists()), None)
            if f: preparer(f, l["id"], index.name, float(l["duree_s"] or 0), l.get("son_piste") == "oui")
    fichiers = dossier.rglob("*") if recursif else dossier.iterdir()
    for f in sorted(fichiers):
        if f.suffix.lower() not in VIDEOS or f.name in connus or any(x in f.parts for x in IGNORE):
            continue
        taille = f.stat().st_size
        recent = time.time() - f.stat().st_ctime < 600     # ajouté il y a moins de 10 min : la copie est peut-être en cours
        if recent and etat["tailles"].get(str(f)) != taille:   # (26/10 : passage une fois par jour → pas d'attente inutile)
            etat["tailles"][str(f)] = taille
            ETAT.write_text(json.dumps(etat, ensure_ascii=False, indent=1), encoding="utf-8"); continue
        p = probe(f)
        n = max([int(l["id"].split("-")[1]) for l in lignes if l["id"].startswith(prefixe)] or [0]) + 1
        rid = f"{prefixe}-{n:04d}"
        lig = {k: "" for k in lignes[0].keys()} if lignes else {}
        lig.update(id=rid, fichier=f.name, date=p["date"], duree_s=round(p["duree"], 1), resolution=f"{p['w']}x{p['h']}",
                   fps=p["fps"], orientation="vertical" if p["h"] > p["w"] else "horizontal",
                   taille_mo=round(f.stat().st_size / 1e6), son_piste="oui" if p["son"] else "non", etat="nouveau",
                   notes=f"détecté le {datetime.now():%d/%m %H:%M} par nouveaux_rushes.py — à taguer")
        actuelles = list(csv.DictReader(open(index, encoding="utf-8")))   # l'index tel qu'il est MAINTENANT (tags compris)
        if any(l["fichier"] == f.name for l in actuelles): connus.add(f.name); continue
        lig["id"] = rid = f"{prefixe}-{max([int(l['id'].split('-')[1]) for l in actuelles if l['id'].startswith(prefixe)] or [0]) + 1:04d}"
        lignes = actuelles + [lig]
        with open(index, "w", encoding="utf-8", newline="") as fo:
            w = csv.DictWriter(fo, fieldnames=list(lig.keys())); w.writeheader(); w.writerows(lignes)
        connus.add(f.name)
        preparer(f, rid, index.name, p["duree"], p["son"])

ETAT.write_text(json.dumps(etat, ensure_ascii=False, indent=1), encoding="utf-8")
VERROU.unlink(missing_ok=True)
print(f"{len(nouveaux)} nouveau(x) rush(es) prêt(s) à taguer ; en attente au total : {len(json.loads(A_TAGUER.read_text(encoding='utf-8')) if A_TAGUER.exists() else [])}")
