"""capcut_projet.py — fabrique un projet CapCut (brouillon) que Basekou ouvre et reprend à la main.
Outil existant utilisé : pyCapCut (github.com/GuanYixuan/pyCapCut). Ce script ne fait que le remplir.

Entrée : un JSON de montage (liste de plans : extrait, cadrage, texte du haut, morceau de rush pour les sous-titres)
         + la transcription mot à mot (whisper --word_timestamps) des rushes parlés.
Sortie : un brouillon dans le dossier des projets CapCut, avec 4 pistes :
         vidéo (son réel) · texte du haut · sous-titres (2 lignes max) · effets sonores.
Usage : python capcut_projet.py <montage.json> [--brouillon <dossier>]
"""
import json, subprocess, sys
from pathlib import Path
import pycapcut as cc
from pycapcut import trange, SEC

DRAFTS = Path.home() / "AppData/Local/CapCut/User Data/Projects/com.lveditor.draft"
if "--brouillon" in sys.argv:   # 25/10 : construit hors de CapCut (dossier de travail), pour maj_projet.py
    DRAFTS = Path(sys.argv[sys.argv.index("--brouillon") + 1]); DRAFTS.mkdir(parents=True, exist_ok=True)
W, H = 1080, 1920

# 28/10 : « 弹出 » (catalogue Jianying) n'existe pas dans CapCut → « perte d'animation » sur l'image.
# « Bold In » vient du catalogue CapCut (choisi par Basekou dans S-02, téléchargé par CapCut).
BOLD_IN = dict(name="Bold In", effect_id="7591705801023048976", resource_id="7591705801023048976")


def animer_texte(seg, anim, d):
    if not anim:   # 28/10 : "anim": null dans le montage = le texte apparaît et disparaît avec la coupe (S-08 : trop d'entrées identiques lassent)
        return
    if anim == "Bold In":   # pyCapCut ne connaît pas Bold In : on pose une entrée puis on la renomme
        seg.add_animation(cc.TextIntro["弹出"], d)
        a = seg.animations_instance.animations[-1]
        a.name, a.effect_id, a.resource_id = BOLD_IN["name"], BOLD_IN["effect_id"], BOLD_IN["resource_id"]
    else:
        seg.add_animation(cc.TextIntro[anim], d)


def duree(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                                capture_output=True, text=True).stdout)


def taille(f):
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                        "-of", "csv=p=0", str(f)], capture_output=True, text=True).stdout.strip().split(",")
    return int(o[0]), int(o[1])


def groupes(mots, max_car=26):
    """25/10 : des sous-titres de 2 lignes (~13 car. chacune) au plus, coupés sur la fin de phrase ; la ponctuation isolée
    (« ? », « ! ») reste collée au mot d'avant, et un morceau trop court (« Bon, ») est fusionné avec le suivant."""
    g, cur = [], []
    for m in mots:
        w = m["word"].strip()
        if w and all(c in "?!:;….," for c in w) and (cur or g):   # ponctuation seule : avec le mot d'avant
            (cur or g[-1]).append(m)
            if cur and w[-1:] in ".?!…" and len(joindre(x["word"] for x in cur)) >= 10:
                g.append(cur); cur = []
            continue
        cur.append(m)
        txt = joindre(x["word"] for x in cur)
        fin_phrase = w[-1:] in ".?!…"
        if len(txt) >= max_car or (fin_phrase and len(txt) >= 10) or (w[-1:] == "," and len(txt) >= 18):
            g.append(cur); cur = []
    if cur:
        if g and len(joindre(x["word"] for x in cur)) < 10: g[-1] += cur
        else: g.append(cur)
    return g


def joindre(mots):
    """Recolle les morceaux que whisper sépare (« C » + « 'est », « Qu'est » + « -ce ») : sinon « C 'est » à l'écran."""
    out = ""
    for w in (x.strip() for x in mots):
        if out and (w[:1] in "'’-" or out[-1:] in "'’"):
            out += w
        elif out and w and all(c in "?!:;" for c in w):   # « parle ? » : espace insécable, le « ? » ne part pas seul à la ligne
            out += " " + w
        else:
            out += (" " if out else "") + w
    return out


PETITS = {"un", "une", "le", "la", "les", "de", "des", "du", "ça", "que", "se", "je", "tu", "on", "il", "elles", "à", "et", "si", "parce", "peu"}


def ligne2(txt, n=16):
    """Retour à la ligne au milieu, pour 2 lignes centrées au plus."""
    if len(txt) <= n: return txt
    mots = txt.split(); best = None
    for i in range(1, len(mots)):
        a, b = " ".join(mots[:i]), " ".join(mots[i:])
        s = max(len(a), len(b)) + (6 if mots[i - 1].lower() in PETITS else 0)   # 27/10 : pas de ligne finie par « un », « les », « que »…
        if best is None or s < best[0]: best = (s, a + "\n" + b)
    return best[1]


mt = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
base = Path(mt["dossier"])
draft = cc.DraftFolder(str(DRAFTS)).create_draft(mt["nom"], W, H, 30, allow_replace=True)
draft.add_track(cc.TrackType.video)
draft.add_track(cc.TrackType.video, "inserts")   # 26/10 : b-roll / inserts posés par-dessus le plan principal
draft.add_track(cc.TrackType.text, "titres")
draft.add_track(cc.TrackType.text, "stickers")   # 26/10 : emoji animés (en attendant les vrais stickers CapCut)
draft.add_track(cc.TrackType.text, "sous-titres")
draft.add_track(cc.TrackType.audio, "effets")   # 23/10 : effets sonores discrets, remplaçables dans CapCut
draft.add_track(cc.TrackType.audio, "effets2")  # 26/10 : effets calés sur un mot (peuvent tomber sur un whoosh de titre)
draft.add_track(cc.TrackType.audio, "voix")     # 27/10 : sa voix prise dans un autre rush, posée sur l'image qui montre ce qu'il dit
draft.add_track(cc.TrackType.audio, "fond")         # 28/10 : un fond continu (la pièce) sous des bruits ponctuels, pour qu'il n'y ait pas de trou
draft.add_track(cc.TrackType.audio, "sons-reels")   # 27/10 : les vrais bruits des gestes (pack posé), à vitesse normale
SONS = Path(mt["dossier"]) / "_sons"

mots_rush = {}
style_titre = cc.TextStyle(size=14, bold=True, align=1, auto_wrapping=True, max_line_width=0.85)
style_st = cc.TextStyle(size=10, bold=True, align=1, auto_wrapping=True, max_line_width=0.8)
bord = cc.TextBorder(width=40.0)
VOL_SONS = {"whoosh": 0.9, "pop": 0.6}   # les autres sons (ding, boing, impact, bip, clic, montee) : 0,8 par défaut
POLICE = cc.FontType[mt["police"]] if mt.get("police") else None   # 26/10 : une police CapCut, au choix par montage


def poser_son(nom, debut, vol=None, dmax=None):
    fs = SONS / f"{nom}_fort.wav"
    if not fs.exists(): print(f"⚠️ son « {nom} » absent"); return
    dd = duree(fs) - 0.01 if dmax is None else min(dmax, duree(fs) - 0.01)
    for piste_son in ("effets2", "effets"):
        try:
            draft.add_segment(cc.AudioSegment(str(fs), trange(f"{debut}s", f"{dd}s"), volume=vol or VOL_SONS.get(nom, 0.8)), piste_son)
            return
        except cc.exceptions.SegmentOverlap:
            continue
    print(f"⚠️ son « {nom} » à {debut:.1f} s : pas de place sur les pistes d'effets")


def remplir(f):
    """Échelle pour remplir le 9:16 (comme le plan principal sans cadrage)."""
    w, h = taille(f); fit = min(W / w, H / h)
    return (H / (h * fit)) if w / h > W / H else 1.0
titre_en_cours = None


def poser_titre(tt):
    if not tt: return
    ts = cc.TextSegment(tt["txt"], trange(f"{tt['debut']}s", f"{tt['fin'] - tt['debut']}s"), style=style_titre, border=bord, font=POLICE,
                        clip_settings=cc.ClipSettings(transform_y=tt["y"]))
    animer_texte(ts, tt["anim"], 0.4 * SEC)   # l'animation ne joue qu'à l'arrivée d'un nouveau texte
    draft.add_segment(ts, "titres")


def aligner(mm, texte):
    """Pose les mots corrigés sur les temps des mots transcrits (un pour un, ou à proportion si le nombre change)."""
    tc = texte.split()
    if len(tc) == len(mm):
        return [dict(m, word=w) for m, w in zip(mm, tc)]
    out = []
    for k, w in enumerate(tc):
        i = min(len(mm) - 1, k * len(mm) // len(tc)); j = min(len(mm) - 1, (k + 1) * len(mm) // len(tc))
        out.append({"word": w, "start": mm[i]["start"], "end": mm[j]["start"] if j > i else mm[i]["end"]})
    return out


def sous_titres(p, t0, fin_plan):
    """Sous-titres d'un morceau de rush (p : rush, in, out, texte_corrige?, exclure?) posé à partir de t0 sur la timeline."""
    global fin_st
    r = p["rush"]
    if r not in mots_rush:
        js = json.loads(Path(mt["transcriptions"][r]).read_text(encoding="utf-8"))
        mots_rush[r] = [m for s in js["segments"] for m in s.get("words", [])]
    a, b = p["in"], p["out"]
    mm = [m for m in mots_rush[r] if a <= m["start"] < b and m["start"] not in p.get("exclure", [])]
    tc = p.get("texte_corrige", "")
    if tc and mm:                              # 25/10 : le texte relu par le sens, posé sur les temps de la transcription
        mm = aligner(mm, tc.replace(" / ", " "))
    if " / " in tc and mm:                     # 27/10 : « / » dans le texte = coupure de sous-titre choisie (ne pas couper « un peu mangées »)
        gs, k = [], 0
        for part in tc.split(" / "):
            n = len(part.split()); gs.append(mm[k:k + n]); k += n
        gs = [g for g in gs if g]
    else:
        gs = groupes(mm)
    bornes = []
    for i, g in enumerate(gs):
        s0 = max(fin_st if not bornes else bornes[-1][1], t0 + max(0.0, g[0]["start"] - a))
        s1 = min(fin_plan, t0 + g[-1]["end"] - a + 0.15)
        bornes.append([s0, max(s1, min(s0 + 0.6, fin_plan))])   # 25/10 : au moins 0,6 s à l'écran (sinon ça clignote)
    for i in range(len(bornes) - 1):            # pas de trou de moins de 0,4 s entre deux sous-titres
        if bornes[i + 1][0] - bornes[i][1] < 0.4: bornes[i][1] = bornes[i + 1][0]
        bornes[i][1] = min(bornes[i][1], bornes[i + 1][0])
    for g, (s0, s1) in zip(gs, bornes):
        if s1 - s0 < 0.05: continue
        fin_st = s1
        txt = ligne2(joindre(x["word"] for x in g))
        draft.add_segment(cc.TextSegment(txt, trange(f"{s0}s", f"{s1 - s0}s"), style=style_st, border=bord, font=POLICE,
                                         clip_settings=cc.ClipSettings(transform_y=st_y)), "sous-titres")


t = 0.0
fin_st = 0.0   # fin du dernier sous-titre posé (pas de chevauchement sur la piste)
st_y = -0.42   # hauteur des sous-titres
for p in mt["plans"]:
    st_y = p.get("st_y", -0.42)   # 28/10 : remonter les sous-titres quand le bas de l'image porte l'action (S-13 : la boîte qu'on ouvre)
    f = base / p["extrait"]
    d = int(duree(f) * 1000) / 1000 - 0.002   # arrondi par défaut : CapCut compte en microsecondes
    d = min(d, cc.VideoMaterial(str(f)).duration / 1e6 - 0.002)   # 27/10 : la piste vidéo peut être plus courte que le fichier
    if p.get("duree"): d = min(d, p["duree"])   # 28/10 : garder seulement le début de l'extrait (S-08 : la pile finie, coupée à 1 s par Basekou)
    w, h = taille(f)
    # Cadrage : on remplit la hauteur du 9:16, et on décale pour mettre le visage au centre (modifiable dans CapCut).
    fit = min(W / w, H / h)                      # CapCut pose la vidéo « ajustée » au canevas
    zoom = (H / (h * fit)) if w / h > W / H else 1.0
    zx = p.get("zoom_extra", 1.0)                # 23/10 : zoom en plus, calé sur le BAS de l'image (on garde les verres)
    zoom *= zx
    ty = (zx - 1.0)                              # unité : demi-hauteur de canevas
    larg = w * fit * zoom                        # largeur affichée, en px de canevas
    cad = p.get("cadrage")
    tx = 0.0 if cad is None else -((cad * (larg - W)) - (larg - W) / 2) / (W / 2)
    v = p.get("vitesse", 1.0)                    # 24/10 : accéléré (packs d'eau) ; la durée à l'écran est divisée
    if v != 1.0: d = round(d - 0.05, 3)          # marge : la piste vidéo est un peu plus courte que le fichier
    seg = cc.VideoSegment(str(f), trange(f"{t}s", f"{d / v - 0.002 if v != 1.0 else d}s"), speed=v if v != 1.0 else None,
                          volume=p.get("volume", 1.0),
                          clip_settings=cc.ClipSettings(scale_x=zoom, scale_y=zoom, transform_x=tx, transform_y=ty))
    d = d / v - 0.002 if v != 1.0 else d
    # 26/10 : le montage s'adapte au contenu — zoom d'appui, animation d'entrée, transition vers le plan suivant.
    for tz, fz in p.get("punch", []):            # [[t (s, dans le plan), facteur], …] : petit zoom sur la phrase forte
        seg.add_keyframe(cc.KeyframeProperty.uniform_scale, f"{max(0.0, tz - 0.04)}s", zoom)
        seg.add_keyframe(cc.KeyframeProperty.uniform_scale, f"{tz}s", zoom * fz)
    if p.get("intro"): seg.add_animation(cc.IntroType[p["intro"]])
    if p.get("transition"): seg.add_transition(cc.TransitionType[p["transition"]])
    draft.add_segment(seg, "video")
    for ts_, nom, *vol in p.get("sfx", []):     # [[t, son, volume?], …] : effet sonore calé sur un moment précis
        poser_son(nom, t + ts_, vol[0] if vol else None)
    for te, de, emoji, *pos in p.get("emoji", []):   # [[t, durée, "🍯", x?, y?], …] : sticker emoji animé
        es = cc.TextSegment(emoji, trange(f"{t + te}s", f"{min(de, d - te)}s"), style=cc.TextStyle(size=28, align=1),
                            clip_settings=cc.ClipSettings(transform_x=pos[0] if pos else 0.45, transform_y=pos[1] if len(pos) > 1 else 0.35))
        animer_texte(es, "Bold In", 0.3 * SEC)
        draft.add_segment(es, "stickers")
    for fi, ti, di, *rest in p.get("inserts", []):   # [[extrait, t, durée, début dans l'extrait?, {vignette}?], …] : insert / b-roll
        fi = base / fi; off = rest[0] if rest else 0
        v = rest[1].get("vignette") if len(rest) > 1 else None
        if v:   # 26/10 : « montrer ce qui est dit » — petite carte aux coins arrondis par-dessus le plan (réf. « le carnet »)
            cs = cc.ClipSettings(scale_x=v.get("taille", 0.45), scale_y=v.get("taille", 0.45), transform_x=v.get("x", 0.0), transform_y=v.get("y", 0.35))
        else:
            zi = remplir(fi); cs = cc.ClipSettings(scale_x=zi, scale_y=zi)
        vs = cc.VideoSegment(str(fi), trange(f"{t + ti}s", f"{min(di, d - ti)}s"),
                             source_timerange=trange(f"{off}s", f"{min(di, d - ti)}s"), volume=0.0, clip_settings=cs)
        if v:
            vs.add_mask(cc.MaskType.矩形, size=1.0, rect_width=1.0, round_corner=v.get("coins", 12))
            vs.add_animation(cc.IntroType.放大, 0.25 * SEC); vs.add_animation(cc.OutroType.缩小, 0.2 * SEC)
        draft.add_segment(vs, "inserts")
    # Texte du haut : un seul segment tant que le texte ne change pas (25/10 : sinon il « re-saute » à chaque coupe).
    if p.get("haut") and titre_en_cours and titre_en_cours["txt"] == p["haut"]:
        titre_en_cours["fin"] = t + d
        son = p.get("son_coupe", "pop")              # même texte : petit « pop » sur la coupe
    else:
        poser_titre(titre_en_cours)
        titre_en_cours = dict(txt=p["haut"], debut=t, fin=t + d, y=p.get("titre_y", 0.72), anim=p["anim"] if "anim" in p else "Bold In") if p.get("haut") else None
        son = "whoosh" if p.get("haut") else None    # nouveau texte : « whoosh »
    son = p.get("son_force", son)
    if son and (SONS / f"{son}_fort.wav").exists():   # 25/10 : sons remontés (les premiers étaient ~30 dB sous la voix)
        fs = SONS / f"{son}_fort.wav"
        draft.add_segment(cc.AudioSegment(str(fs), trange(f"{t}s", f"{min(d, duree(fs) - 0.01)}s"),
                                          volume=VOL_SONS[son]), "effets")
    if p.get("texte"):                             # 24/10 : texte posé à la place d'une voix off pas encore enregistrée
        draft.add_segment(cc.TextSegment(ligne2(p["texte"], 24), trange(f"{max(t, fin_st)}s", f"{t + d - max(t, fin_st)}s"),
                                         style=style_st, border=bord, font=POLICE, clip_settings=cc.ClipSettings(transform_y=st_y)), "sous-titres")
        fin_st = t + d
    if p.get("mots"):                              # 24/10 : transcription mot à mot de l'extrait lui-même (temps depuis 0)
        r = p["mots"]
        if r not in mots_rush:
            js = json.loads((base / r).read_text(encoding="utf-8"))
            mots_rush[r] = [m for s in js["segments"] for m in s.get("words", [])]
        p = dict(p, rush=r, **{"in": p.get("in_mots", 0.0), "out": p.get("out_mots", d)})
    if p.get("rush"):                              # sous-titres : les mots dits dans ce morceau, au mot près
        sous_titres(p, t, t + d)
    for vx in p.get("voix", []):                   # 27/10 : {son, t, rush, in, out, texte_corrige?, volume?} — voix d'un autre rush
        fv = base / vx["son"]
        draft.add_segment(cc.AudioSegment(str(fv), trange(f"{t + vx['t']}s", f"{min(duree(fv) - 0.01, d - vx['t'])}s"),
                                          volume=vx.get("volume", 1.0)), "voix")
        if vx.get("rush"):
            sous_titres(vx, t + vx["t"], t + d)
    for ts_, fs_, *opt in p.get("sons", []):       # 27/10 : [[t, fichier, volume?, piste?], …] — vrai bruit, posé sur le geste visible
        fs_ = base / fs_
        draft.add_segment(cc.AudioSegment(str(fs_), trange(f"{t + ts_}s", f"{duree(fs_) - 0.01}s"), volume=opt[0] if opt else 1.0),
                          opt[1] if len(opt) > 1 else "sons-reels")
    if p.get("carton"):                            # 27/10 : carton plein écran (fond crème de l'étiquette, texte vert profond)
        c = p["carton"]; h = c.get("couleur", "#1A3E16").lstrip("#")
        draft.add_segment(cc.TextSegment(c["txt"], trange(f"{t}s", f"{d}s"), font=POLICE,
                                         style=cc.TextStyle(size=c.get("taille", 18), bold=True, align=1, auto_wrapping=True, max_line_width=0.8,
                                                            color=tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)))), "titres")
    t += d

poser_titre(titre_en_cours)
# 26/10 : plus de filigrane TEST. Basekou : le projet CapCut doit être la version qu'il posterait, jugée en vrai.
draft.save()

print(f"✅ projet CapCut « {mt['nom']} » : {len(mt['plans'])} plans, {t:.1f} s → {DRAFTS / mt['nom']}")
