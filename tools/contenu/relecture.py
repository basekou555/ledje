#!/usr/bin/env python3
"""relecture.py — relit un transcript (ou un texte) contre le lexique interdit de Lédjé.

Maillon 6 de la chaîne (la conformité), appliqué à L'ORAL : ce qui a été dit dans un rush
(live, voix off, Basekou qui parle) est une communication publique dès qu'un clip en sort —
même régime qu'une étiquette (decisions-log 2026-10-02). Ce script ne juge rien : il POINTE
les timecodes où un terme du lexique apparaît, pour que Basekou décide (couper, reformuler,
garder).

Entrées acceptées : .srt, .vtt, ou .txt (une ligne par phrase ; un préfixe « [mm:ss] » ou
« [hh:mm:ss] » est lu comme timecode s'il est présent).

Usage :
    python3 relecture.py transcript.srt
    python3 relecture.py transcript.srt --lexique lexique-interdit.txt --json rapport.json

Code de sortie : 1 si au moins un terme est trouvé (la pièce ne passe pas en l'état), 0 sinon.
Règle en plus du lexique : toute mention du sucre sans « jusqu'à » dans le même segment est
signalée (conformite.md : le « jusqu'à » reste obligatoire, y compris à l'oral).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from dataclasses import dataclass, asdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
LEXIQUE_DEFAUT = HERE / "lexique-interdit.txt"

# Les catégories ci-dessous bloquent la publication en l'état ; les autres sont des avertissements.
BLOQUANTES = {"SANTE", "DIET", "CHIFFRE", "MARQUE"}


def normaliser(texte: str) -> str:
    """Minuscules, sans accents, apostrophes unifiées — pour comparer sans se tromper."""
    texte = texte.replace("’", "'").replace("‘", "'")
    texte = unicodedata.normalize("NFD", texte)
    texte = "".join(c for c in texte if unicodedata.category(c) != "Mn")
    return texte.lower()


@dataclass
class Terme:
    terme: str
    categorie: str
    regle: str
    motif: re.Pattern


@dataclass
class Segment:
    timecode: str
    texte: str


@dataclass
class Trouvaille:
    timecode: str
    terme: str
    categorie: str
    regle: str
    extrait: str


def charger_lexique(chemin: Path) -> list[Terme]:
    termes: list[Terme] = []
    for ligne in chemin.read_text(encoding="utf-8").splitlines():
        ligne = ligne.strip()
        if not ligne or ligne.startswith("#"):
            continue
        parts = [p.strip() for p in ligne.split("|")]
        if len(parts) < 2:
            continue
        terme = parts[0]
        categorie = parts[1].upper()
        regle = parts[2] if len(parts) > 2 else ""
        norm = normaliser(terme)
        # \b ne connaît pas les apostrophes : on borne par « pas une lettre/chiffre ».
        motif = re.compile(r"(?<![a-z0-9])" + re.escape(norm) + r"(?![a-z0-9])")
        termes.append(Terme(terme, categorie, regle, motif))
    return termes


TC_SRT = re.compile(r"(\d{2}:\d{2}:\d{2})[,.](\d{3})\s*-->")
TC_TXT = re.compile(r"^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*(.*)$")


def lire_segments(chemin: Path) -> list[Segment]:
    contenu = chemin.read_text(encoding="utf-8", errors="replace")
    suffixe = chemin.suffix.lower()
    segments: list[Segment] = []

    if suffixe in {".srt", ".vtt"}:
        tc = "00:00:00"
        tampon: list[str] = []

        def vider():
            if tampon:
                segments.append(Segment(tc, " ".join(tampon).strip()))
                tampon.clear()

        for ligne in contenu.splitlines():
            ligne = ligne.strip()
            m = TC_SRT.search(ligne)
            if m:
                vider()
                tc = m.group(1)
                continue
            if not ligne or ligne.isdigit() or ligne.upper().startswith("WEBVTT") or ligne.startswith("NOTE"):
                if not ligne:
                    vider()
                continue
            tampon.append(re.sub(r"<[^>]+>", "", ligne))
        vider()
        return segments

    for i, ligne in enumerate(contenu.splitlines(), start=1):
        ligne = ligne.strip()
        if not ligne:
            continue
        m = TC_TXT.match(ligne)
        if m:
            segments.append(Segment(m.group(1), m.group(2)))
        else:
            segments.append(Segment(f"ligne {i}", ligne))
    return segments


def relire(segments: list[Segment], termes: list[Terme]) -> list[Trouvaille]:
    trouvailles: list[Trouvaille] = []
    for seg in segments:
        norm = normaliser(seg.texte)
        extrait = seg.texte if len(seg.texte) <= 140 else seg.texte[:137] + "…"
        for t in termes:
            if t.motif.search(norm):
                trouvailles.append(Trouvaille(seg.timecode, t.terme, t.categorie, t.regle, extrait))
        if re.search(r"(?<![a-z])sucres?(?![a-z])", norm) and "jusqu'a" not in norm:
            trouvailles.append(
                Trouvaille(
                    seg.timecode,
                    "sucre (sans « jusqu'à »)",
                    "CHIFFRE",
                    "conformite.md — toute mention du sucre porte le « jusqu'à », y compris à l'oral",
                    extrait,
                )
            )
    return trouvailles


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("transcript", type=Path, help="fichier .srt / .vtt / .txt à relire")
    p.add_argument("--lexique", type=Path, default=LEXIQUE_DEFAUT, help="lexique (défaut : lexique-interdit.txt à côté du script)")
    p.add_argument("--json", type=Path, help="écrit aussi le rapport en JSON à ce chemin")
    args = p.parse_args(argv)

    if not args.transcript.exists():
        print(f"introuvable : {args.transcript}", file=sys.stderr)
        return 2
    termes = charger_lexique(args.lexique)
    segments = lire_segments(args.transcript)
    trouvailles = relire(segments, termes)

    print(f"Relecture de {args.transcript.name} — {len(segments)} segments, {len(termes)} termes du lexique")
    if not trouvailles:
        print("✅ Aucun terme du lexique. (Ce n'est pas un verdict de conformité : une allégation peut être implicite, image comprise.)")
    else:
        print(f"{'timecode':<12} {'catégorie':<10} {'terme':<28} extrait")
        for t in trouvailles:
            marque = "⛔" if t.categorie in BLOQUANTES else "⚠️"
            print(f"{t.timecode:<12} {marque} {t.categorie:<8} {t.terme:<28} {t.extrait}")
        par_cat: dict[str, int] = {}
        for t in trouvailles:
            par_cat[t.categorie] = par_cat.get(t.categorie, 0) + 1
        print("\nRésumé : " + " · ".join(f"{c} ×{n}" for c, n in sorted(par_cat.items())))
        print("⛔ = bloque la publication en l'état · ⚠️ = à arbitrer. Les règles citées sont dans docs/01_adn/.")

    if args.json:
        args.json.write_text(
            json.dumps({"fichier": str(args.transcript), "segments": len(segments), "trouvailles": [asdict(t) for t in trouvailles]}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    return 1 if trouvailles else 0


if __name__ == "__main__":
    sys.exit(main())
