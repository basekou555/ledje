"""28/10 — retire la voix d'un morceau de rush en gardant le vrai son autour (porte, pas, packs), avec Demucs.
Pour S-08 : sur le plan de l'ascenseur, on entend « je sais pas où je les dépose » ; Basekou veut le son sans la phrase.

    python sans_voix.py <rush> <in> <out> <sortie.wav>

Écrit aussi <sortie>-voix.wav (la voix seule) pour contrôler ce qui a été retiré.
"""
import subprocess, sys, tempfile, types
from pathlib import Path
import numpy as np, soundfile as sf
sys.path.insert(0, str(Path(__file__).parent / "_libs"))   # même installation que analyse_son.py
sys.modules.setdefault("torchaudio", types.ModuleType("torchaudio"))   # demucs l'importe, on n'en a pas besoin ici
import torch
from demucs.pretrained import get_model
from demucs.apply import apply_model

rush, a, b, sortie = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), Path(sys.argv[4])
m = get_model("htdemucs")
marge = 1.0   # Demucs travaille mieux avec un peu de contexte autour
debut = max(0.0, a - marge)
with tempfile.TemporaryDirectory() as d:
    w = Path(d) / "a.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(debut), "-t", str(b - debut + marge), "-i", rush,
                    "-ac", "2", "-ar", str(m.samplerate), str(w)], check=True)
    x, sr = sf.read(w, dtype="float32")
t = torch.from_numpy(x.T.copy())
ref = t.mean(0)
t = (t - ref.mean()) / (ref.std() + 1e-8)
with torch.no_grad():
    s = apply_model(m, t[None], split=True, overlap=0.25, progress=False)[0]
s = s * (ref.std() + 1e-8) + ref.mean()
i0, i1 = int((a - debut) * sr), int((b - debut) * sr)
voix = s[m.sources.index("vocals")].numpy().T[i0:i1]
reste = sum(s[k] for k, n in enumerate(m.sources) if n != "vocals").numpy().T[i0:i1]
sortie.parent.mkdir(parents=True, exist_ok=True)
sf.write(sortie, reste, sr)
sf.write(sortie.with_name(sortie.stem + "-voix.wav"), voix, sr)
db = lambda y: 20 * np.log10(np.sqrt(np.mean(y ** 2)) + 1e-9)
print(f"{sortie.name} : {(i1 - i0) / sr:.2f} s ; sans voix {db(reste):.1f} dB ; voix retirée {db(voix):.1f} dB")
