#!/usr/bin/env python3
"""derush.py — inventorie un dossier de rushes et tient l'index à jour (étape 1 du système rushes → pièces).

Ce que ça fait :
  1. Parcourt le dossier (récursif), lit chaque vidéo avec ffprobe : durée, résolution, cadence,
     date de tournage (métadonnée, sinon date du fichier), taille, piste son.
  2. Écrit ou MET À JOUR `rushes-index.csv` : les colonnes techniques sont rafraîchies, les colonnes
     de TAG (gisement, sujet, formats, niveau, personnes, son, oral, état, timecodes, notes, drive_id)
     sont conservées telles quelles. **C'est la session Claude Code qui les remplit**, après avoir
     regardé les planches et lu les transcriptions (ci-dessous) — pas Basekou, qui corrige seulement.
  3. En option :
     --planches  : une PLANCHE-CONTACT par rush, une image toutes les N secondes (défaut 5 s), en
                   grille — c'est ce qu'une session LIT pour savoir ce qu'il y a dans le rush ;
     --transcrire : la TRANSCRIPTION (.srt) de ce qui est dit, via `whisper` s'il est installé —
                   c'est ce qu'une session lit pour savoir ce qui a été DIT (et relecture.py après) ;
     --proxies   : des PROXIES 720p, légers, pour monter vite ;
     --vignettes : 3 images (début, milieu, fin) par rush, pour un coup d'œil.

Il ne supprime rien, n'écrit jamais dans le dossier source autre que l'index (ou l'emplacement
que vous donnez), et ne touche pas aux rushes.

Usage (Windows, disque D:\\LEDJE) :
    python derush.py D:\\LEDJE --index D:\\LEDJE\\rushes-index.csv
    python derush.py D:\\LEDJE --planches D:\\LEDJE\\_planches --transcrire D:\\LEDJE\\_transcripts
    python derush.py D:\\LEDJE --proxies D:\\LEDJE\\_proxies --vignettes D:\\LEDJE\\_vignettes

Prérequis : ffmpeg et ffprobe dans le PATH ; `pip install openai-whisper` pour --transcrire.
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

EXTENSIONS = {".mp4", ".mov", ".m4v", ".mts", ".avi", ".mkv", ".webm", ".3gp"}

# Colonnes de l'index. L'ordre est celui du CSV. Les colonnes TAG sont préservées à chaque passage.
COLONNES_TECH = ["id", "fichier", "date", "duree_s", "resolution", "fps", "orientation", "taille_mo", "son_piste"]
COLONNES_TAG = [
    "gisement",         # miellerie-st-jerome · tests-dosage · packs-eau · production · terrain · autre
    "lieu",             # où c'est filmé
    "sujet",            # un sujet de la grille (docs/03_marche/grille-contenu.md, « Les sujets »)
    "formats",          # formats candidats : geste · voix-off · situation · terrain · sensation (séparés par ;)
    "niveau",           # 1 produit · 2 expérience · 3 marque · 4 univers
    "personnes",        # aucune · mains · basekou · tiers · basekou+tiers  (tiers = personne réelle qui n'est pas lui)
    "son",              # utile · ambiance · bruit · muet  (le son RÉEL est ce qui manquait au pilote)
    "oral",             # oui/non — quelqu'un parle du produit → relecture.py obligatoire avant tout clip
    "etat",             # non-visionne · visionne · derushe · utilise · ecarte
    "timecodes_utiles", # ex. 00:12-00:19 pesée ; 01:40-01:46 versement
    "notes",
    "drive_id",         # l'ID Drive une fois le fichier (ou son proxy) déposé — jamais un chemin
]
COLONNES = COLONNES_TECH + COLONNES_TAG


def ffprobe(chemin: Path) -> dict:
    cmd = [
        "ffprobe", "-v", "error", "-print_format", "json",
        "-show_format", "-show_streams", str(chemin),
    ]
    out = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if out.returncode != 0:
        return {}
    return json.loads(out.stdout or "{}")


def _fps(stream: dict) -> str:
    val = stream.get("avg_frame_rate") or stream.get("r_frame_rate") or "0/1"
    try:
        num, den = val.split("/")
        f = float(num) / float(den) if float(den) else 0.0
    except (ValueError, ZeroDivisionError):
        f = 0.0
    return f"{f:.2f}".rstrip("0").rstrip(".")


def _date_tournage(info: dict, chemin: Path) -> str:
    tags = (info.get("format") or {}).get("tags") or {}
    for cle in ("creation_time", "com.apple.quicktime.creationdate", "date"):
        val = tags.get(cle)
        if val:
            return val[:10]
    for s in info.get("streams") or []:
        val = ((s.get("tags") or {}).get("creation_time"))
        if val:
            return val[:10]
    return datetime.fromtimestamp(chemin.stat().st_mtime).strftime("%Y-%m-%d")


def analyser(chemin: Path, racine: Path) -> dict | None:
    info = ffprobe(chemin)
    if not info:
        print(f"  ⚠️ illisible par ffprobe : {chemin}", file=sys.stderr)
        return None
    video = next((s for s in info.get("streams", []) if s.get("codec_type") == "video"), None)
    audio = next((s for s in info.get("streams", []) if s.get("codec_type") == "audio"), None)
    if not video:
        return None
    w, h = int(video.get("width") or 0), int(video.get("height") or 0)
    rot = 0
    for sd in video.get("side_data_list") or []:
        if "rotation" in sd:
            rot = int(sd["rotation"])
    if (video.get("tags") or {}).get("rotate"):
        rot = int(video["tags"]["rotate"])
    if rot % 180 != 0:
        w, h = h, w
    duree = float((info.get("format") or {}).get("duration") or video.get("duration") or 0)
    taille = int((info.get("format") or {}).get("size") or chemin.stat().st_size)
    return {
        "fichier": str(chemin.relative_to(racine)).replace(os.sep, "/"),
        "date": _date_tournage(info, chemin),
        "duree_s": f"{duree:.1f}",
        "resolution": f"{w}x{h}",
        "fps": _fps(video),
        "orientation": "vertical" if h > w else ("carre" if h == w else "horizontal"),
        "taille_mo": f"{taille / 1_048_576:.0f}",
        "son_piste": "oui" if audio else "non",
    }


def charger_index(chemin: Path) -> dict[str, dict]:
    if not chemin.exists():
        return {}
    with chemin.open(encoding="utf-8", newline="") as f:
        return {ligne["fichier"]: ligne for ligne in csv.DictReader(f)}


def ecrire_index(chemin: Path, lignes: list[dict]) -> None:
    with chemin.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLONNES)
        w.writeheader()
        for l in lignes:
            w.writerow({c: l.get(c, "") for c in COLONNES})


def proxy(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        return
    cmd = [
        "ffmpeg", "-v", "error", "-y", "-i", str(src),
        "-vf", "scale=-2:720", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
        "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(dst),
    ]
    subprocess.run(cmd, check=False)


def vignette(src: Path, dst: Path, duree: float) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists() or duree <= 0:
        return
    # Trois images (10 %, 50 %, 90 %) côte à côte, 480 px de haut chacune.
    pts = [max(0.0, duree * p) for p in (0.1, 0.5, 0.9)]
    sel = "+".join(f"between(t\\,{t:.2f}\\,{t + 0.5:.2f})" for t in pts)
    cmd = [
        "ffmpeg", "-v", "error", "-y", "-i", str(src),
        "-vf", f"select='{sel}',scale=-2:480,tile=3x1",
        "-frames:v", "1", "-vsync", "vfr", str(dst),
    ]
    subprocess.run(cmd, check=False)


def planche(src: Path, dst: Path, duree: float, pas: float, colonnes: int = 4) -> None:
    """Une image toutes les `pas` secondes, en grille de `colonnes`, 360 px de haut par image,
    avec le timecode incrusté — pour qu'une session lise le rush ET sache où couper."""
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists() or duree <= 0:
        return
    n = max(1, int(duree // pas) + 1)
    lignes = (n + colonnes - 1) // colonnes
    cmd = [
        "ffmpeg", "-v", "error", "-y", "-i", str(src),
        "-vf", (f"fps=1/{pas},scale=-2:360,"
                "drawtext=text='%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,"
                f"tile={colonnes}x{lignes}"),
        "-frames:v", "1", str(dst),
    ]
    subprocess.run(cmd, check=False)


def transcrire(src: Path, dossier: Path) -> None:
    """Transcription via la CLI whisper (openai-whisper), en .srt, français. Silencieux si absente."""
    dossier.mkdir(parents=True, exist_ok=True)
    if (dossier / src.with_suffix(".srt").name).exists():
        return
    if shutil.which("whisper") is None:
        print("  ⚠️ `whisper` introuvable — pip install openai-whisper (ou déposez un .srt à la main)", file=sys.stderr)
        return
    subprocess.run(
        ["whisper", str(src), "--language", "fr", "--model", "small", "--output_format", "srt",
         "--output_dir", str(dossier), "--verbose", "False"],
        check=False,
    )


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("source", type=Path, help="dossier des rushes (ex. D:\\LEDJE)")
    p.add_argument("--index", type=Path, help="chemin du CSV (défaut : <source>/rushes-index.csv)")
    p.add_argument("--proxies", type=Path, help="génère des proxies 720p dans ce dossier")
    p.add_argument("--vignettes", type=Path, help="génère une vignette (3 images) par rush dans ce dossier")
    p.add_argument("--planches", type=Path, help="génère une planche-contact par rush (une image toutes les --pas secondes) dans ce dossier")
    p.add_argument("--pas", type=float, default=5.0, help="intervalle des images de la planche, en secondes (défaut 5)")
    p.add_argument("--transcrire", type=Path, help="transcrit ce qui est dit (whisper, .srt) dans ce dossier")
    p.add_argument("--prefixe", default="R", help="préfixe des IDs (défaut : R → R-0001)")
    args = p.parse_args(argv)

    racine = args.source.resolve()
    if not racine.is_dir():
        print(f"dossier introuvable : {racine}", file=sys.stderr)
        return 2
    index_path = (args.index or racine / "rushes-index.csv").resolve()
    exclus = {d.resolve() for d in (args.proxies, args.vignettes, args.planches, args.transcrire) if d}

    existant = charger_index(index_path)
    nouvelles: list[dict] = []
    for chemin in sorted(racine.rglob("*")):
        if chemin.suffix.lower() not in EXTENSIONS or not chemin.is_file():
            continue
        if any(str(chemin.resolve()).startswith(str(e)) for e in exclus):
            continue
        # Les dossiers de travail (_proxies, _planches, _transcripts…) et cachés ne sont jamais des rushes.
        if any(part.startswith(("_", ".")) for part in chemin.relative_to(racine).parts[:-1]):
            continue
        tech = analyser(chemin, racine)
        if not tech:
            continue
        ancienne = existant.get(tech["fichier"], {})
        ligne = {**{c: "" for c in COLONNES}, **ancienne, **tech}
        if not ligne.get("etat"):
            ligne["etat"] = "non-visionne"
        nouvelles.append(ligne)
        if args.proxies:
            proxy(chemin, args.proxies / Path(tech["fichier"]).with_suffix(".mp4"))
        if args.vignettes:
            vignette(chemin, args.vignettes / Path(tech["fichier"]).with_suffix(".jpg"), float(tech["duree_s"]))
        if args.planches:
            planche(chemin, args.planches / Path(tech["fichier"]).with_suffix(".jpg"), float(tech["duree_s"]), args.pas)
        if args.transcrire and tech["son_piste"] == "oui":
            transcrire(chemin, args.transcrire / Path(tech["fichier"]).parent)

    # IDs : ceux qui existent sont conservés ; les nouveaux sont numérotés dans l'ordre date puis nom.
    pris = {l["id"] for l in nouvelles if l.get("id")}
    compteur = 0
    for l in sorted(nouvelles, key=lambda x: (x["date"], x["fichier"])):
        if l.get("id"):
            continue
        compteur += 1
        while f"{args.prefixe}-{compteur:04d}" in pris:
            compteur += 1
        l["id"] = f"{args.prefixe}-{compteur:04d}"
        pris.add(l["id"])
    nouvelles.sort(key=lambda x: x["id"])

    disparus = [f for f in existant if f not in {l["fichier"] for l in nouvelles}]
    ecrire_index(index_path, nouvelles)

    total_go = sum(float(l["taille_mo"]) for l in nouvelles) / 1024
    total_min = sum(float(l["duree_s"]) for l in nouvelles) / 60
    dates = sorted(l["date"] for l in nouvelles)
    print(f"{len(nouvelles)} rushes · {total_go:.1f} Go · {total_min:.0f} min", end="")
    if dates:
        print(f" · du {dates[0]} au {dates[-1]}", end="")
    print(f"\nindex : {index_path}")
    non_vus = sum(1 for l in nouvelles if l["etat"] == "non-visionne")
    sans_tag = sum(1 for l in nouvelles if not l.get("gisement"))
    print(f"non visionnés : {non_vus} · sans gisement : {sans_tag}")
    if disparus:
        print(f"⚠️ {len(disparus)} fichier(s) de l'index n'existent plus dans le dossier (lignes retirées) : {', '.join(disparus[:5])}{'…' if len(disparus) > 5 else ''}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
