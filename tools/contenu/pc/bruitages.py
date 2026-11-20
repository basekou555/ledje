"""bruitages.py — chercher et télécharger des bruitages libres sur Openverse.

Openverse (openverse.org) indexe des millions de sons sous licence libre. Ce script ne garde que
les sons du domaine public (CC0 et « public domain mark ») : aucune mention d'auteur n'est due, ce
qui évite d'en oublier une dans une légende. Pas de musique : on cherche des bruitages courts
(règle de Basekou, pas de musique de fond).

Les recherches marchent mieux en anglais : les fiches des sons sont presque toutes en anglais.
Exemples : « water pouring », « glass clink », « bottle cap open », « ice cubes », « bee buzz ».

Usage :
    python bruitages.py "water pouring"                    5 sons de 10 s au plus
    python bruitages.py "glass clink" --nombre 8 --duree-max 4
    python bruitages.py "bee buzz" --voir                  liste sans télécharger

Sortie : Bureau\\Ledje rush bureau\\_sons\\openverse\\ (ou --sortie), et une ligne par son dans
sources.tsv (titre, auteur, licence, page d'origine), pour savoir d'où vient chaque fichier.
"""
import argparse
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://api.openverse.org/v1/audio/"
LICENCES = "cc0,pdm"
AGENT = "ledje-bruitages/1.0"
SORTIE = Path.home() / "Desktop" / "Ledje rush bureau" / "_sons" / "openverse"


def chercher(requete: str, nombre: int, duree_max_s: float) -> list:
    params = {"q": requete, "license": LICENCES, "page_size": 20}   # 20 au plus sans compte (401 au-delà)
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": AGENT})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode("utf-8"))
    sons = []
    for s in data.get("results", []):
        duree = (s.get("duration") or 0) / 1000
        if not s.get("url", "").startswith("https://") or not duree or duree > duree_max_s:
            continue
        sons.append(s)
        if len(sons) >= nombre:
            break
    return sons


def nom_fichier(requete: str, s: dict) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", requete.lower()).strip("-")[:40]
    ext = (s.get("filetype") or "mp3").lower()
    return f"{base}_{s['id'][:8]}.{ext}"


def main() -> int:
    p = argparse.ArgumentParser(description="Bruitages libres (domaine public) depuis Openverse.")
    p.add_argument("requete")
    p.add_argument("--nombre", type=int, default=5)
    p.add_argument("--duree-max", type=float, default=10.0, help="en secondes (défaut 10)")
    p.add_argument("--sortie", type=Path, default=SORTIE)
    p.add_argument("--voir", action="store_true", help="liste les sons sans les télécharger")
    a = p.parse_args()

    sons = chercher(a.requete, a.nombre, a.duree_max)
    if not sons:
        print("Aucun son libre trouvé. Essayer d'autres mots, en anglais, ou --duree-max plus grand.")
        return 1
    if not a.voir:
        a.sortie.mkdir(parents=True, exist_ok=True)
    sources = a.sortie / "sources.tsv"
    for s in sons:
        nom = nom_fichier(a.requete, s)
        ligne = f"{s.get('duration', 0) / 1000:5.1f} s  {s.get('license', '')}  {s.get('title', '')}  ({s.get('creator', '')})"
        if a.voir:
            print(ligne)
            continue
        dst = a.sortie / nom
        if not dst.exists():
            req = urllib.request.Request(s["url"], headers={"User-Agent": AGENT})
            with urllib.request.urlopen(req, timeout=60) as r:
                dst.write_bytes(r.read())
            with sources.open("a", encoding="utf-8") as f:
                f.write("\t".join([nom, s.get("title", ""), s.get("creator", ""), s.get("license", ""),
                                   s.get("foreign_landing_url", "")]) + "\n")
        print(f"{nom}  {ligne}")
    if not a.voir:
        print(f"\n{len(sons)} son(s) dans {a.sortie}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
