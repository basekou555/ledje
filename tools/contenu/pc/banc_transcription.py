"""banc_transcription.py — banc d'essai des outils de transcription GRATUITS, en conditions réelles (25/10).
Demande de Basekou : tester sur des vidéos de moins d'une minute (pas des bouts de 3 s), laisser le contexte jouer,
et comparer avec d'autres outils gratuits. Pas de service payant.
Clips : _transcripts/banc-essai/*.wav (16 kHz mono). Sortie : _transcripts/banc-essai/resultats.json (texte + durée de calcul).
Usage : python banc_transcription.py [outil ...]
"""
import json, sys, time
from pathlib import Path

D = Path(__file__).resolve().parent.parent / "_transcripts" / "banc-essai"
CLIPS = sorted(D.glob("*.wav"))
OUT = D / "resultats.json"
res = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
PROMPT = "Basekou parle de lédjé, une eau miellée faite d'eau et de miel."


def garder(outil, clip, texte, t0):
    res.setdefault(outil, {})[clip.stem] = {"texte": texte.strip(), "secondes": round(time.time() - t0, 1)}
    OUT.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{outil} · {clip.stem} · {res[outil][clip.stem]['secondes']} s", flush=True)


def openai_whisper(nom):
    import whisper
    m = whisper.load_model(nom)
    for c in CLIPS:
        t0 = time.time()
        r = m.transcribe(str(c), language="fr", fp16=False)
        garder(f"whisper-{nom}", c, r["text"], t0)


def faster(nom, prompt=False):
    from faster_whisper import WhisperModel
    m = WhisperModel(nom, device="cpu", compute_type="int8")
    for c in CLIPS:
        t0 = time.time()
        import whisper                               # son décodé par ffmpeg (le décodeur intégré bute sur la version d'av)
        segs, _ = m.transcribe(whisper.load_audio(str(c)), language="fr", beam_size=5, vad_filter=True,
                               initial_prompt=PROMPT if prompt else None)
        garder(f"faster-{nom}" + ("+mots" if prompt else ""), c, " ".join(s.text.strip() for s in segs), t0)


def parakeet():
    import onnx_asr
    m = onnx_asr.load_model("nemo-parakeet-tdt-0.6b-v3").with_vad(onnx_asr.load_vad("silero"))
    for c in CLIPS:
        t0 = time.time()
        garder("parakeet-v3", c, " ".join(s.text for s in m.recognize(str(c))), t0)


OUTILS = {
    "whisper-medium": lambda: openai_whisper("medium"),
    "whisper-turbo": lambda: openai_whisper("turbo"),
    "faster-large-v3": lambda: faster("large-v3"),
    "faster-large-v3+mots": lambda: faster("large-v3", prompt=True),
    "parakeet-v3": parakeet,
}
for nom in (sys.argv[1:] or OUTILS):
    try:
        OUTILS[nom]()
    except Exception as e:
        print(f"⚠️ {nom} : {type(e).__name__} : {e}", flush=True)
