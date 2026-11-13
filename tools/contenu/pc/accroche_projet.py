"""accroche_projet.py — fabrique un projet CapCut « accroche » à partir de la version de Basekou.

Écrit le 2026-11-13. Seule l'ouverture change : on copie le projet retouché (tous ses réglages restent),
puis on ajoute ou on retire un morceau au début et on décale tout le reste.

    PYTHONIOENCODING=utf-8 python accroche_projet.py <recette.json>

La recette (JSON) :
    {"source": "S-14 huit heures TEST 2026-10-24", "nom": "S-14 accroche A huit heures 2026-11-13",
     "operations": [ {"type": "plan_devant", "plan": 6}, ... ]}

Opérations :
  plan_devant     copie le plan n° `plan` de la piste vidéo principale (et ses sous-titres) au tout début ;
                  option "duree" (s) pour le raccourcir, "muet": true pour couper son son.
  retirer_debut   retire le premier plan et ses sous-titres ; un titre qui le chevauche est raccourci.
  video_devant    met au début un nouvel extrait : {"fichier", "duree", "vitesse", "modele_plan", "volume"}.
  son             pose un son : {"fichier", "debut", "piste" (nom de piste audio), "volume"}.
  sous_titre      pose un sous-titre au style de `modele` (projet) : {"texte", "debut", "duree", "modele"}.
  fond_intro      rejoue le début de la piste « fond » sous l'ouverture : {"duree"}.

⚠️ CapCut doit être complètement fermé. Le projet source n'est jamais modifié.
"""
import copy, json, os, shutil, subprocess, sys, time, uuid
from pathlib import Path

DRAFTS = Path(os.environ["LOCALAPPDATA"]) / "CapCut" / "User Data" / "Projects" / "com.lveditor.draft"
BUREAU = Path(r"C:\Users\basek\Desktop\Ledje rush bureau")
US = 1_000_000


def nid():
    return uuid.uuid4().hex


def lire(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def contenu(dossier):
    """La version la plus récente du montage : la racine ou la timeline principale."""
    cands = [dossier / "draft_content.json"]
    pj = dossier / "Timelines" / "project.json"
    if pj.exists():
        cands.append(dossier / "Timelines" / lire(pj)["main_timeline_id"] / "draft_content.json")
    cands = [c for c in cands if c.exists()]
    return lire(max(cands, key=lambda c: c.stat().st_mtime))


def fichiers_a_ecrire(dossier):
    out = [dossier / "draft_content.json"] + [dossier / n for n in ("template-2.tmp", "draft_content.json.bak") if (dossier / n).exists()]
    pj = dossier / "Timelines" / "project.json"
    if pj.exists():
        tl = dossier / "Timelines" / lire(pj)["main_timeline_id"]
        out += [tl / n for n in ("draft_content.json", "template-2.tmp", "draft_content.json.bak") if (tl / n).exists()]
    return out


def index_materiaux(d):
    return {m["id"]: (k, m) for k, l in d["materials"].items() if isinstance(l, list)
            for m in l if isinstance(m, dict) and "id" in m}


def cloner_segment(seg, src, dst):
    """Copie un segment et tous ses matériaux (principal + extra) de `src` vers `dst`, avec de nouveaux ids."""
    ix = index_materiaux(src)
    s = copy.deepcopy(seg)
    s["id"] = nid()
    k, m = ix[seg["material_id"]]
    m2 = copy.deepcopy(m); m2["id"] = nid()
    dst["materials"].setdefault(k, []).append(m2)
    s["material_id"] = m2["id"]
    refs = []
    for r in seg.get("extra_material_refs", []):
        if r in ix:
            k, m = ix[r]
            m3 = copy.deepcopy(m); m3["id"] = nid()
            dst["materials"].setdefault(k, []).append(m3)
            refs.append(m3["id"])
    s["extra_material_refs"] = refs
    return s, m2


def piste(d, nom=None, type_=None):
    for t in d["tracks"]:
        if (nom is None or t.get("name") == nom) and (type_ is None or t["type"] == type_):
            return t
    return None


def decaler(d, dt):
    for t in d["tracks"]:
        for s in t["segments"]:
            s["target_timerange"]["start"] += dt


def inserer(t, seg):
    t["segments"].append(seg)
    t["segments"].sort(key=lambda s: s["target_timerange"]["start"])


def duree_media(f):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=width,height",
                          "-of", "json", str(f)], capture_output=True, text=True).stdout
    j = json.loads(out)
    vs = [s for s in j.get("streams", []) if s.get("width")]
    return float(j["format"]["duration"]), (vs[0]["width"], vs[0]["height"]) if vs else (None, None)


def plan_devant(d, op):
    v = piste(d, type_="video")
    seg = v["segments"][op["plan"]]
    a = seg["target_timerange"]["start"]; L = seg["target_timerange"]["duration"]
    D = int(op.get("duree", L / US) * US) if op.get("duree") else L
    copie, _ = cloner_segment(seg, d, d)
    copie["target_timerange"] = {"start": 0, "duration": D}
    sp = copie.get("speed", 1.0) or 1.0
    copie["source_timerange"]["duration"] = int(round(D * sp))
    if op.get("muet"):
        copie["volume"] = 0.0
    st = piste(d, "sous-titres")
    subs = []
    if st:
        for s in st["segments"]:
            s0 = s["target_timerange"]["start"]
            if a <= s0 < a + D:
                c, _ = cloner_segment(s, d, d)
                c["target_timerange"] = {"start": s0 - a, "duration": min(s["target_timerange"]["duration"], a + D - s0)}
                subs.append(c)
    decaler(d, D)
    inserer(v, copie)
    for c in subs:
        inserer(st, c)
    d["duration"] += D
    return D


def retirer_debut(d, op):
    v = piste(d, type_="video")
    seg = v["segments"][0]
    L = seg["target_timerange"]["duration"]
    v["segments"].remove(seg)
    for t in d["tracks"]:
        garde = []
        for s in t["segments"]:
            tr = s["target_timerange"]
            if t is v:
                garde.append(s); continue
            if tr["start"] < L:
                fin = tr["start"] + tr["duration"]
                if t.get("name") == "titres" and fin > L:     # un titre qui continue après : raccourci
                    tr["duration"] = fin - L; tr["start"] = L
                    garde.append(s)
                elif t["type"] == "audio" and fin > L:
                    cut = L - tr["start"]
                    tr["start"] = L; tr["duration"] = fin - L
                    s["source_timerange"]["start"] += int(cut * (s.get("speed", 1.0) or 1.0))
                    s["source_timerange"]["duration"] = int(tr["duration"] * (s.get("speed", 1.0) or 1.0))
                    garde.append(s)
                # sinon (sous-titre du plan retiré) : supprimé
            else:
                garde.append(s)
        t["segments"] = garde
    decaler(d, -L)
    d["duration"] -= L
    return -L


def video_devant(d, op):
    v = piste(d, type_="video")
    modele = v["segments"][op.get("modele_plan", 0)]
    f = Path(op["fichier"]); f = f if f.is_absolute() else BUREAU / f
    dur_src, (w, h) = duree_media(f)
    vit = float(op.get("vitesse", 1.0))
    D = int(float(op["duree"]) * US)
    copie, mat = cloner_segment(modele, d, d)
    mat["path"] = str(f).replace("\\", "/")
    mat["material_name"] = f.name
    mat["duration"] = int(dur_src * US)
    if w:
        mat["width"], mat["height"] = w, h
    for k in ("local_material_id", "extra_info"):
        if k in mat: mat[k] = ""
    copie["target_timerange"] = {"start": 0, "duration": D}
    copie["source_timerange"] = {"start": int(float(op.get("debut", 0)) * US), "duration": int(round(D * vit))}
    copie["speed"] = vit
    copie["volume"] = float(op.get("volume", 0.0))
    ix = index_materiaux(d)
    for r in copie["extra_material_refs"]:
        k, m = ix[r]
        if k == "speeds":
            m["speed"] = vit
    decaler(d, D)
    inserer(v, copie)
    d["duration"] += D
    return D


def son(d, op):
    t = piste(d, op["piste"], "audio")
    f = Path(op["fichier"]); f = f if f.is_absolute() else BUREAU / f
    dur, _ = duree_media(f)
    copie, mat = cloner_segment(t["segments"][0], d, d)
    mat["path"] = str(f).replace("\\", "/"); mat["name"] = f.name; mat["duration"] = int(dur * US)
    for k in ("music_id", "local_material_id"):
        if k in mat: mat[k] = nid() if k == "music_id" else ""
    copie["source_timerange"] = {"start": 0, "duration": int(dur * US)}
    copie["target_timerange"] = {"start": int(float(op["debut"]) * US), "duration": int(dur * US)}
    copie["volume"] = float(op.get("volume", 1.0)); copie["speed"] = 1.0
    copie["common_keyframes"] = []
    inserer(t, copie)


def sous_titre(d, op):
    m_src = contenu(DRAFTS / op["modele"])
    st_src = piste(m_src, "sous-titres")
    copie, mat = cloner_segment(st_src["segments"][0], m_src, d)
    c = json.loads(mat["content"])
    c["text"] = op["texte"]
    for s in c["styles"]:
        s["range"] = [0, len(op["texte"])]
    mat["content"] = json.dumps(c, ensure_ascii=False)
    copie["target_timerange"] = {"start": int(float(op["debut"]) * US), "duration": int(float(op["duree"]) * US)}
    st = piste(d, "sous-titres")
    if st is None:
        st = {"attribute": 0, "flag": 0, "id": nid(), "is_default_name": False, "name": "sous-titres",
              "segments": [], "type": "text"}
        d["tracks"].append(st)
    inserer(st, copie)


def fond_intro(d, op):
    t = piste(d, "fond", "audio")
    seg = min(t["segments"], key=lambda s: s["target_timerange"]["start"])
    D = int(float(op["duree"]) * US)
    copie, _ = cloner_segment(seg, d, d)
    copie["target_timerange"] = {"start": 0, "duration": D}
    copie["source_timerange"] = {"start": 0, "duration": D}
    copie["common_keyframes"] = []
    inserer(t, copie)


OPS = {"plan_devant": plan_devant, "retirer_debut": retirer_debut, "video_devant": video_devant,
       "son": son, "sous_titre": sous_titre, "fond_intro": fond_intro}


def main():
    if subprocess.run("tasklist", capture_output=True, text=True, encoding="mbcs", errors="ignore").stdout.lower().count("capcut.exe"):
        sys.exit("⛔ CapCut est ouvert : le fermer complètement avant d'écrire un projet.")
    rec = lire(sys.argv[1])
    src = DRAFTS / rec["source"]
    dst = DRAFTS / rec["nom"]
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns("draft_content.avant-*", "_copies-*", "*.avant-*"))
    d = contenu(src)
    d["id"] = str(uuid.uuid4()).upper()
    for op in rec["operations"]:
        OPS[op["type"]](d, op)
    texte = json.dumps(d, ensure_ascii=False)
    for f in fichiers_a_ecrire(dst):
        f.write_text(texte, encoding="utf-8")
    now = int(time.time() * US)
    draft_id = str(uuid.uuid4()).upper()
    fold = str(dst).replace("\\", "/")
    meta = lire(dst / "draft_meta_info.json")
    meta.update({"draft_id": draft_id, "draft_name": rec["nom"], "draft_fold_path": fold,
                 "tm_draft_create": now, "tm_draft_modified": now, "tm_duration": d["duration"]})
    (dst / "draft_meta_info.json").write_text(json.dumps(meta, ensure_ascii=False), encoding="utf-8")
    root_f = DRAFTS / "root_meta_info.json"
    root = lire(root_f)
    root["all_draft_store"] = [e for e in root["all_draft_store"] if e.get("draft_name") != rec["nom"]]
    e = copy.deepcopy(next(e for e in root["all_draft_store"] if e.get("draft_name") == rec["source"]))
    e.update({"draft_id": draft_id, "draft_name": rec["nom"], "draft_fold_path": fold,
              "draft_cover": fold + "\\draft_cover.jpg", "draft_json_file": fold + "\\draft_content.json",
              "tm_draft_create": now, "tm_draft_modified": now, "tm_duration": d["duration"]})
    root["all_draft_store"].insert(0, e)
    root_f.write_text(json.dumps(root, ensure_ascii=False), encoding="utf-8")
    print(f"✅ « {rec['nom']} » : {d['duration'] / US:.2f} s")


if __name__ == "__main__":
    main()
