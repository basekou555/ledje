#!/usr/bin/env python3
"""rendu.py — rend une pièce à partir d'une RECETTE (fichier YAML), sans montage à la main.

Le montage n'est pas fait dans un logiciel : il est DÉCRIT dans une recette (quels rushes, quels
timecodes, quel texte, quel son) et ce script la rend avec ffmpeg. La même recette rendue deux
fois donne la même pièce ; changer un paramètre (un hook, un plan) et re-rendre produit une
variante comparable — c'est ce qui permet d'apprendre (grille-contenu.md, « variantes comparables »).

Gabarit de recette : docs/05_systeme/templates/template-recette-piece.yaml

Usage :
    python3 rendu.py recette.yaml                 # rend la pièce
    python3 rendu.py recette.yaml --dry-run       # affiche la commande ffmpeg sans rendre
    python3 rendu.py recette.yaml --sortie x.mp4  # force le fichier de sortie

Garde-fous intégrés :
  - tant que `piece.statut` n'est pas `valide-publication`, un filigrane TEST est incrusté
    (le régime « _TEST » de toute la chaîne — contenu-drive.md) ;
  - un plan dont le `in`/`out` dépasse le rush est refusé ;
  - le texte n'est jamais généré : il vient de la recette, écrit et relu par un humain.
"""
from __future__ import annotations

import argparse
import json
import os
import platform
import shlex
import subprocess
import sys
import shutil
import tempfile
import textwrap
from pathlib import Path

try:
    import yaml  # type: ignore
except ImportError:  # pragma: no cover
    print("PyYAML manquant : pip install pyyaml", file=sys.stderr)
    sys.exit(2)

RATIOS = {"9:16": (1080, 1920), "1:1": (1080, 1080), "16:9": (1920, 1080), "4:5": (1080, 1350)}
_TEMPORAIRES: list[Path] = []  # dossiers des textes, supprimés après le rendu
POLICES_CANDIDATES = [
    "C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/arial.ttf",
    "/Library/Fonts/Arial Bold.ttf", "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]


def tc_vers_s(val) -> float:
    """'00:01:12.5' | '1:12.5' | '72.5' | 72.5 → secondes."""
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    parts = str(val).strip().split(":")
    total = 0.0
    for part in parts:
        total = total * 60 + float(part.replace(",", "."))
    return total


def ffprobe_duree_et_son(chemin: Path) -> tuple[float, bool]:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(chemin)],
        capture_output=True, text=True, check=False,
    )
    if out.returncode != 0:
        raise SystemExit(f"ffprobe ne lit pas {chemin} : {out.stderr.strip()}")
    info = json.loads(out.stdout or "{}")
    duree = float((info.get("format") or {}).get("duration") or 0)
    son = any(s.get("codec_type") == "audio" for s in info.get("streams", []))
    return duree, son


def police_par_defaut(recette_police: str | None) -> str:
    if recette_police:
        return recette_police
    for cand in POLICES_CANDIDATES:
        if Path(cand).exists():
            return cand
    raise SystemExit("aucune police trouvée : indiquez sortie.police dans la recette (chemin d'un .ttf)")


def citer(valeur: str) -> str:
    """Met une valeur entre apostrophes pour le graphe de filtres ffmpeg.

    Entre apostrophes, seule l'apostrophe elle-même est spéciale : on la sort de la citation
    ('\\'' ), tout le reste (deux-points, virgules, pourcents, chemins Windows) passe tel quel.
    """
    valeur = valeur.replace("\\", "/")
    return "'" + valeur.replace("'", "'\\''") + "'"


def drawtext(texte: str, police: str, position: str, largeur: int, hauteur: int, taille: int | None = None) -> str:
    """Le texte passe par un FICHIER (textfile=) : aucun échappement à gérer, apostrophes, deux-points,
    pourcents et retours à la ligne compris. expansion=none : le texte est pris au pied de la lettre."""
    taille = taille or max(36, largeur // 18)
    y = {"haut": "h*0.12", "centre": "(h-text_h)/2", "bas": "h*0.82-text_h"}.get(position, "h*0.82-text_h")
    # Retour à la ligne automatique : ~0,56 × la taille de police par caractère, sur 88 % de la largeur.
    max_car = max(12, int(largeur * 0.88 / (taille * 0.56)))
    lignes: list[str] = []
    for para in str(texte).split("\n"):
        lignes += textwrap.wrap(para, max_car) or [""]
    dossier = Path(tempfile.mkdtemp(prefix="ledje-texte-"))
    _TEMPORAIRES.append(dossier)
    fichier = dossier / "texte.txt"
    fichier.write_text("\n".join(lignes), encoding="utf-8")
    return (
        f"drawtext=fontfile={citer(police)}:textfile={citer(str(fichier))}:expansion=none:fontsize={taille}:fontcolor=white"
        f":borderw={max(2, taille // 16)}:bordercolor=black@0.85:x=(w-text_w)/2:y={y}:line_spacing={taille // 5}"
    )


def filigrane(police: str, largeur: int) -> str:
    taille = largeur // 6
    return (
        f"drawtext=fontfile={citer(police)}:text='TEST':fontsize={taille}:fontcolor=white@0.28"
        f":borderw=3:bordercolor=black@0.25:x=(w-text_w)/2:y=(h-text_h)/2"
    )


def construire(recette: dict, sortie_forcee: Path | None, base_recette: Path) -> tuple[list[str], Path]:
    piece = recette.get("piece") or {}
    sortie = recette.get("sortie") or {}
    audio = recette.get("audio") or {"source": "rushes"}
    plans = recette.get("plans") or []
    if not plans:
        raise SystemExit("la recette n'a aucun plan")

    ratio = str(sortie.get("ratio", "9:16"))
    if ratio not in RATIOS:
        raise SystemExit(f"ratio inconnu {ratio} — choix : {', '.join(RATIOS)}")
    TW, TH = RATIOS[ratio]
    fps = int(sortie.get("fps", 30))
    police = police_par_defaut(sortie.get("police"))
    rushes_dir = Path(str(recette.get("rushes_dir") or base_recette.parent)).expanduser()
    fichier_sortie = sortie_forcee or Path(sortie.get("fichier") or f"{piece.get('id', 'piece')}.mp4")
    if not fichier_sortie.is_absolute():
        fichier_sortie = base_recette.parent / fichier_sortie
    publiable = str(piece.get("statut", "")).strip() == "valide-publication"

    entrees: list[str] = []
    filtres: list[str] = []
    paires: list[str] = []
    fondu = float(audio.get("fondu", 0.0) or 0.0)

    for i, plan in enumerate(plans):
        rush = Path(str(plan.get("rush", "")))
        if not rush.is_absolute():
            rush = rushes_dir / rush
        if not rush.exists():
            raise SystemExit(f"plan {i + 1} : rush introuvable {rush}")
        duree_rush, a_du_son = ffprobe_duree_et_son(rush)
        t_in = tc_vers_s(plan.get("in", 0))
        t_out = tc_vers_s(plan.get("out")) if plan.get("out") is not None else duree_rush
        if t_out <= t_in or t_out > duree_rush + 0.05:
            raise SystemExit(f"plan {i + 1} : in={t_in:.2f} out={t_out:.2f} invalides (rush de {duree_rush:.2f} s)")
        vitesse = float(plan.get("vitesse", 1.0) or 1.0)
        duree_plan = (t_out - t_in) / vitesse

        cadrage = plan.get("cadrage", "centre")
        frac = {"gauche": 0.0, "centre": 0.5, "droite": 1.0}.get(str(cadrage), None)
        if frac is None:
            try:
                frac = float(str(cadrage).replace("x=", ""))
            except ValueError:
                raise SystemExit(f"plan {i + 1} : cadrage inconnu {cadrage} (gauche | centre | droite | x=0.3)")
        frac = min(1.0, max(0.0, frac))

        entrees += ["-i", str(rush)]
        v = (
            f"[{i}:v]trim=start={t_in:.3f}:end={t_out:.3f},setpts=(PTS-STARTPTS)/{vitesse},"
            f"scale=w='ceil(max({TW}/iw,{TH}/ih)*iw/2)*2':h='ceil(max({TW}/iw,{TH}/ih)*ih/2)*2':flags=lanczos,"
            f"crop={TW}:{TH}:(iw-{TW})*{frac}:(ih-{TH})/2,setsar=1,fps={fps},format=yuv420p"
        )
        if plan.get("texte"):
            v += "," + drawtext(str(plan["texte"]), police, str(plan.get("texte_position", "bas")), TW, TH, plan.get("texte_taille"))
        filtres.append(v + f"[v{i}]")

        garder_son = a_du_son and str(plan.get("son", "garder")) != "couper" and audio.get("source", "rushes") != "silence"
        if garder_son:
            a = f"[{i}:a]atrim=start={t_in:.3f}:end={t_out:.3f},asetpts=PTS-STARTPTS"
            if vitesse != 1.0:
                if not 0.5 <= vitesse <= 2.0:
                    raise SystemExit(f"plan {i + 1} : vitesse {vitesse} hors de [0.5, 2] — coupez le son de ce plan (son: couper)")
                a += f",atempo={vitesse}"
            if fondu > 0:
                a += f",afade=t=in:st=0:d={fondu},afade=t=out:st={max(0.0, duree_plan - fondu):.3f}:d={fondu}"
            a += ",aformat=sample_rates=48000:channel_layouts=stereo"
        else:
            a = f"anullsrc=r=48000:cl=stereo,atrim=0:{duree_plan:.3f},asetpts=PTS-STARTPTS"
        filtres.append(a + f"[a{i}]")
        paires.append(f"[v{i}][a{i}]")

    n = len(plans)
    filtres.append("".join(paires) + f"concat=n={n}:v=1:a=1[vcat][acat]")

    v_final = "[vcat]"
    post: list[str] = []
    if recette.get("texte_global"):
        post.append(drawtext(str(recette["texte_global"]), police, "haut", TW, TH))
    if not publiable:
        post.append(filigrane(police, TW))
    if post:
        filtres.append("[vcat]" + ",".join(post) + "[vout]")
        v_final = "[vout]"

    a_final = "[acat]"
    source = str(audio.get("source", "rushes"))
    if source == "fichier":
        fichier_audio = Path(str(audio.get("fichier", "")))
        if not fichier_audio.is_absolute():
            fichier_audio = base_recette.parent / fichier_audio
        if not fichier_audio.exists():
            raise SystemExit(f"audio.fichier introuvable : {fichier_audio}")
        entrees += ["-i", str(fichier_audio)]
        vol = float(audio.get("volume_rushes", 0.25))
        filtres.append(
            f"[acat]volume={vol}[arush];[{n}:a]aformat=sample_rates=48000:channel_layouts=stereo[avo];"
            f"[arush][avo]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]"
        )
        a_final = "[aout]"

    cmd = ["ffmpeg", "-hide_banner", "-y", *entrees, "-filter_complex", ";".join(filtres),
           "-map", v_final, "-map", a_final,
           "-c:v", "libx264", "-preset", str(sortie.get("preset", "medium")), "-crf", str(sortie.get("crf", 20)),
           "-pix_fmt", "yuv420p", "-r", str(fps), "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
           "-shortest", str(fichier_sortie)]
    return cmd, fichier_sortie


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("recette", type=Path)
    p.add_argument("--sortie", type=Path, help="fichier de sortie (sinon sortie.fichier de la recette)")
    p.add_argument("--dry-run", action="store_true", help="affiche la commande sans rendre")
    args = p.parse_args(argv)

    recette = yaml.safe_load(args.recette.read_text(encoding="utf-8")) or {}
    cmd, fichier = construire(recette, args.sortie, args.recette.resolve())
    if args.dry_run:
        print(" ".join(shlex.quote(c) for c in cmd) if platform.system() != "Windows" else subprocess.list2cmdline(cmd))
        return 0
    fichier.parent.mkdir(parents=True, exist_ok=True)
    res = subprocess.run(cmd, check=False)
    for d in _TEMPORAIRES:
        shutil.rmtree(d, ignore_errors=True)
    if res.returncode != 0:
        print("⛔ ffmpeg a échoué — relancez avec --dry-run pour voir la commande", file=sys.stderr)
        return res.returncode
    statut = (recette.get("piece") or {}).get("statut", "brouillon")
    print(f"✅ rendu : {fichier} (statut {statut}{' — filigrane TEST' if statut != 'valide-publication' else ''})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
