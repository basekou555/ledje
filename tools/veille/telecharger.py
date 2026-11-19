"""telecharger.py — veille enregistrée, étape 1 : télécharger les vidéos d'un fichier de liens.

Tourne sur le PC de Basekou, jamais dans une session cloud (instagram.com et tiktok.com y sont
injoignables). Télécharge avec yt-dlp, SANS cookies de compte, dans un dossier temporaire HORS dépôt.

Fichier de liens : une ligne par vidéo. Une ligne « ## Nom » ouvre une collection. Les lignes vides
et celles qui commencent par « # » (un seul dièse) sont ignorées. Tout ce qui suit le lien sur la
ligne est gardé comme note (ce que Claude Chrome a relevé : auteur, légende, texte à l'écran).

Usage :
    python telecharger.py <liens.txt>                 télécharge
    python telecharger.py <liens.txt> --verifier      lit le fichier et montre ce qui serait fait
    python telecharger.py <liens.txt> --sortie <dossier> --tout

--tout reprend aussi les liens déjà traités (registre : ~/.ledje-veille/traites.txt).
Sortie : <dossier>/lot.json, à passer à lire.py.
"""
import argparse
import datetime
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HOTES = ("instagram.com", "tiktok.com")
REGISTRE = Path.home() / ".ledje-veille" / "traites.txt"
URL = re.compile(r"https?://[^\s<>\"')\]|]+")


def dans_un_depot(dossier: Path) -> bool:
    """Vrai si le dossier est à l'intérieur d'un dépôt git : on n'y écrit pas de vidéo."""
    d = dossier.resolve()
    return any((p / ".git").exists() for p in [d, *d.parents])


def hote_admis(url: str) -> bool:
    m = re.match(r"https?://([^/]+)", url)
    hote = (m.group(1) if m else "").lower().split(":")[0]
    return any(hote == h or hote.endswith("." + h) for h in HOTES)


def lire_liens(chemin: Path):
    """Rend (entrees, ignores). Une entrée : url, collection, note."""
    entrees, ignores, vus, collection = [], [], set(), "sans collection"
    for brut in chemin.read_text(encoding="utf-8").splitlines():
        ligne = brut.strip()
        if not ligne:
            continue
        if ligne.startswith("##"):
            collection = ligne.lstrip("#").strip() or "sans collection"
            continue
        if ligne.startswith("#"):
            continue
        m = URL.search(ligne)
        if not m:
            ignores.append((ligne[:80], "aucun lien sur la ligne"))
            continue
        url = m.group(0).rstrip(".,;")
        if not hote_admis(url):
            ignores.append((url, "ni Instagram ni TikTok"))
            continue
        if url in vus:
            ignores.append((url, "en double dans le fichier"))
            continue
        vus.add(url)
        note = (ligne[:m.start()] + " " + ligne[m.end():]).strip(" |-\t")
        entrees.append({"url": url, "collection": collection, "note": note})
    return entrees, ignores


def deja_traites() -> set:
    if not REGISTRE.exists():
        return set()
    return {l.strip() for l in REGISTRE.read_text(encoding="utf-8").splitlines() if l.strip()}


def telecharger(entree: dict, n: int, sortie: Path) -> None:
    prefixe = f"{n:03d}"
    cmd = ["yt-dlp", "--no-playlist", "--no-cookies", "--no-cookies-from-browser",
           "--write-info-json", "--no-progress", "--socket-timeout", "30", "--retries", "2",
           "--max-filesize", "300M", "-f", "mp4/best",
           "-o", str(sortie / f"{prefixe}.%(ext)s"), "--", entree["url"]]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    except subprocess.TimeoutExpired:
        entree.update(statut="echec", erreur="délai dépassé (10 min)")
        return
    videos = [f for f in sortie.glob(prefixe + ".*") if f.suffix.lower() not in (".json", ".part", ".ytdl")]
    info = sortie / f"{prefixe}.info.json"
    if info.exists():
        try:
            d = json.loads(info.read_text(encoding="utf-8"))
            entree["auteur"] = d.get("uploader") or d.get("channel") or d.get("uploader_id") or ""
            entree["legende"] = (d.get("description") or d.get("title") or "")[:2000]
            entree["duree_s"] = d.get("duration")
        except (OSError, ValueError):
            pass
        info.unlink(missing_ok=True)
    if r.returncode == 0 and videos:
        entree.update(statut="ok", fichier=videos[0].name)
    else:
        derniere = [l for l in (r.stderr or r.stdout or "").splitlines() if l.strip()]
        entree.update(statut="echec", erreur=(derniere[-1] if derniere else "raison inconnue")[:300])


def main() -> int:
    p = argparse.ArgumentParser(description="Veille enregistrée : télécharger les vidéos d'un fichier de liens.")
    p.add_argument("liens", type=Path)
    p.add_argument("--sortie", type=Path)
    p.add_argument("--verifier", action="store_true", help="ne télécharge rien, montre ce qui serait fait")
    p.add_argument("--tout", action="store_true", help="reprend aussi les liens déjà traités")
    a = p.parse_args()

    entrees, ignores = lire_liens(a.liens)
    traites = set() if a.tout else deja_traites()
    a_faire = [e for e in entrees if e["url"] not in traites]
    print(f"{len(entrees)} lien(s) lu(s), {len(entrees) - len(a_faire)} déjà traité(s), "
          f"{len(ignores)} ligne(s) ignorée(s).")
    for quoi, pourquoi in ignores:
        print(f"  ignoré : {quoi} ({pourquoi})")
    if a.verifier:
        for e in a_faire:
            print(f"  à télécharger [{e['collection']}] {e['url']}")
        return 0
    if not a_faire:
        print("Rien à télécharger.")
        return 0
    if shutil.which("yt-dlp") is None:
        print("yt-dlp est introuvable. L'installer sur ce poste : pip install -U yt-dlp")
        return 2

    sortie = a.sortie or Path(tempfile.gettempdir()) / "ledje-veille" / datetime.datetime.now().strftime("%Y-%m-%d_%Hh%M")
    if dans_un_depot(sortie):
        print(f"Refus : {sortie} est dans un dépôt git. Les vidéos ne s'écrivent jamais au dépôt.")
        return 2
    sortie.mkdir(parents=True, exist_ok=True)

    for n, e in enumerate(a_faire, 1):
        print(f"[{n}/{len(a_faire)}] {e['url']}", flush=True)
        telecharger(e, n, sortie)
        print(f"    {e['statut']}" + (f" : {e.get('erreur', '')}" if e["statut"] != "ok" else ""), flush=True)

    (sortie / "lot.json").write_text(json.dumps(a_faire, ensure_ascii=False, indent=2), encoding="utf-8")
    ok = sum(1 for e in a_faire if e["statut"] == "ok")
    print(f"\n{ok} vidéo(s) téléchargée(s), {len(a_faire) - ok} échec(s).")
    print(f"Lot : {sortie / 'lot.json'}")
    print(f"Suite : python lire.py \"{sortie}\"")
    return 0


if __name__ == "__main__":
    sys.exit(main())
