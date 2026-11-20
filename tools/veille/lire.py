"""lire.py — veille enregistrée, étape 2 : lire les vidéos d'un lot (l'oral et quelques images).

Tourne sur le PC de Basekou. Pour chaque vidéo téléchargée par telecharger.py :
  - transcrit l'oral avec faster-whisper (langue détectée, pas de vocabulaire imposé) ;
  - extrait 4 images avec ffmpeg, pour voir ce qui est montré à l'écran ;
  - écrit <n>.txt (lien, auteur, légende, transcription horodatée) ;
  - SUPPRIME la vidéo (elle appartient à son auteur ; on garde le texte et les images, le temps de l'analyse).
Puis inscrit les liens lus au registre (~/.ledje-veille/traites.txt).

Usage :
    python lire.py <dossier_du_lot>
    python lire.py <dossier_du_lot> --modele medium     plus rapide, moins précis
    python lire.py <dossier_du_lot> --garder            ne supprime pas les vidéos

La méthode (filtre de silences, repérage des boucles) vient de tools/contenu/pc/transcrire.py.
Ce script-là n'est pas réutilisé tel quel : il impose le français et un vocabulaire lédjé.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

REGISTRE = Path.home() / ".ledje-veille" / "traites.txt"


def duree(video: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=noprint_wrappers=1:nokey=1", str(video)],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def images(video: Path, d: float, prefixe: Path) -> list:
    sorties = []
    for i, part in enumerate((0.10, 0.35, 0.60, 0.85), 1):
        dst = prefixe.with_name(f"{prefixe.name}_img{i}.jpg")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{d * part:.2f}", "-i", str(video),
                        "-frames:v", "1", "-vf", "scale=540:-2", str(dst)], capture_output=True)
        if dst.exists():
            sorties.append(dst.name)
    return sorties


def horodatage(s: float) -> str:
    return f"{int(s // 60):02d}:{int(s % 60):02d}"


def main() -> int:
    p = argparse.ArgumentParser(description="Veille enregistrée : lire les vidéos d'un lot.")
    p.add_argument("lot", type=Path)
    p.add_argument("--modele", default="large-v3")
    p.add_argument("--garder", action="store_true", help="ne supprime pas les vidéos après lecture")
    a = p.parse_args()

    fichier_lot = a.lot / "lot.json"
    if not fichier_lot.exists():
        print(f"Pas de lot.json dans {a.lot}. Lancer d'abord telecharger.py.")
        return 2
    lot = json.loads(fichier_lot.read_text(encoding="utf-8"))
    a_lire = [e for e in lot if e.get("statut") == "ok" and (a.lot / e.get("fichier", "")).is_file()]
    if not a_lire:
        print("Aucune vidéo à lire dans ce lot.")
        return 0

    from faster_whisper import WhisperModel          # importé ici : --help marche sans la bibliothèque
    modele = WhisperModel(a.modele, device="cpu", compute_type="int8")

    lus = []
    for n, e in enumerate(a_lire, 1):
        video = a.lot / e["fichier"]
        print(f"[{n}/{len(a_lire)}] {e['url']}", flush=True)
        d = duree(video)
        e["duree_s"] = round(d, 1) or e.get("duree_s")
        e["images"] = images(video, d, a.lot / video.stem) if d else []
        try:
            segs, info = modele.transcribe(str(video), beam_size=5, vad_filter=True)
            segments = [(s.start, s.text.strip()) for s in segs if s.text.strip()]
            e["langue"] = info.language
        except Exception as err:                      # un fichier illisible ne bloque pas les suivants
            e.update(statut="non lu", erreur=f"transcription impossible : {str(err)[-200:]}")
            print(f"    non lu : {e['erreur']}", flush=True)
            continue
        textes = [t for _, t in segments]
        e["transcription_douteuse"] = any(textes.count(t) >= 3 for t in set(textes) if len(t) > 12)
        e["sans_parole"] = not segments

        lignes = [f"Lien : {e['url']}", f"Collection : {e['collection']}",
                  f"Auteur : {e.get('auteur', '')}", f"Durée : {e['duree_s']} s",
                  f"Langue détectée : {e.get('langue', '')}", "",
                  "Note relevée par Claude Chrome :", e.get("note", "") or "(aucune)", "",
                  "Légende :", e.get("legende", "") or "(aucune)", "",
                  "Ce qui est dit :"]
        if e["sans_parole"]:
            lignes.append("(aucune parole détectée : musique ou texte à l'écran seulement, voir les images)")
        if e["transcription_douteuse"]:
            lignes.append("(attention : phrases répétées, transcription douteuse)")
        lignes += [f"[{horodatage(t0)}] {texte}" for t0, texte in segments]
        txt = a.lot / f"{video.stem}.txt"
        txt.write_text("\n".join(lignes) + "\n", encoding="utf-8")
        e.update(statut="lu", texte=txt.name)
        lus.append(e["url"])
        if not a.garder:
            video.unlink(missing_ok=True)
            e.pop("fichier", None)

    fichier_lot.write_text(json.dumps(lot, ensure_ascii=False, indent=2), encoding="utf-8")
    if lus:
        REGISTRE.parent.mkdir(parents=True, exist_ok=True)
        with REGISTRE.open("a", encoding="utf-8") as f:
            f.write("\n".join(lus) + "\n")
    non_lus = [e for e in lot if e.get("statut") != "lu"]
    print(f"\n{len(lus)} vidéo(s) lue(s), {len(non_lus)} non lue(s).")
    for e in non_lus:
        print(f"  non lue : {e['url']} ({e.get('erreur', e.get('statut', ''))})")
    print(f"Textes et images : {a.lot}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
