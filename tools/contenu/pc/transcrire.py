"""transcrire.py — transcription des rushes ENTIERS avec faster-whisper large-v3 (choisi le 25/10 au banc d'essai :
le contexte compte plus que la taille du modèle ; le filtre de silences évite les phrases inventées).
Sortie au format whisper (segments + mots horodatés), lisible par capcut_projet.py : _transcripts/large-v3/<rush>.json
Ensuite : relecture par le sens des seuls passages douteux.
Usage : python transcrire.py <rush> [<rush> ...]   (déjà transcrit → ignoré)
"""
import json, sys, time
from pathlib import Path
import whisper                                    # seulement pour décoder le son (ffmpeg)
from faster_whisper import WhisperModel

SORTIE = Path(__file__).resolve().parent.parent / "_transcripts" / "large-v3"
SORTIE.mkdir(parents=True, exist_ok=True)
VOCAB = ("Basekou parle de lédjé, une eau miellée faite d'eau et de miel. Dégustation à l'aveugle, l'odeur, l'arôme, "
         "le goût, les étiquettes, la miellerie, l'apiculteur.")

modele = WhisperModel("large-v3", device="cpu", compute_type="int8")
for r in sys.argv[1:]:
    dst = SORTIE / (Path(r).stem + ".json")
    if dst.exists():
        continue
    t0 = time.time()
    try:
        audio = whisper.load_audio(r)
    except Exception as e:                       # 26/10 : un fichier illisible ne bloque plus les suivants
        print(f"⚠️ {Path(r).name} : son illisible ({str(e)[-80:]})", flush=True); continue

    def passe(vocab):
        segs, info = modele.transcribe(audio, language="fr" if vocab else None, beam_size=5, vad_filter=True,
                                       word_timestamps=True, initial_prompt=VOCAB if vocab else None)
        return [{"start": s.start, "end": s.end, "text": s.text.strip(),
                 "words": [{"word": w.word, "start": w.start, "end": w.end, "probability": w.probability} for w in (s.words or [])]}
                for s in segs], info

    segments, info = passe(True)
    textes = [s["text"] for s in segments]
    # 26/10 : sur une autre langue ou un son confus, le vocabulaire fait tourner le modèle en boucle
    # (« c'est l'heure de l'arôme » × 10). Si une même phrase revient 3 fois, on refait sans vocabulaire ni langue imposée.
    boucle = any(textes.count(t) >= 3 for t in set(textes) if len(t) > 12)
    if boucle:
        segments, info = passe(False)
    out = {"rush": r, "modele": "faster-whisper large-v3", "vocabulaire": not boucle, "langue": info.language,
           "segments": segments}
    dst.write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"{Path(r).name} : {info.duration:.0f} s de son, {time.time() - t0:.0f} s de calcul", flush=True)
