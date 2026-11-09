"""temps_morts.py — repère la « mise en place » au début (et la traîne à la fin) de chaque plan d'un montage.
Retour de Basekou (26/10) : les plans ne sont pas coupés assez tard. Le plan est pris en entier alors qu'on voit
la mise en place (ex. l'ascenseur : une seconde de battement entre « ça filme » et le moment où il bouge).

Mesure, sur l'extrait du plan, image par image (10 par seconde) :
  - le mouvement : différence moyenne entre deux images successives (en petit, en gris) ;
  - le son : début de la parole d'après la transcription si le plan a des mots, sinon rien.
Le plan « démarre » quand le mouvement dépasse durablement une part du mouvement typique du plan.
Sortie : une proposition de coupe par plan (entrée / sortie, en secondes dans l'extrait). Rien n'est modifié.

Usage : python temps_morts.py <montage.json> [<montage.json> ...]
"""
import json, re, subprocess, sys
from pathlib import Path

B = Path(__file__).resolve().parent.parent
FPS = 10


def mouvement(f):
    vf = f"fps={FPS},scale=96:-2,format=gray,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-"
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-vf", vf, "-an", "-f", "null", "-"],
                         capture_output=True, text=True).stdout
    return [float(x) for x in re.findall(r"YAVG=([\d.]+)", out)]


def demarrage(m, part=0.5, tenue=3):   # 0,5 : calé le 26/10 sur sa coupe de l'ascenseur (S-08 plan 2 : 1,3 s contre 1,33 s)
    """Premier instant où le mouvement dépasse `part` du mouvement typique (80e centile) pendant `tenue` images."""
    if len(m) < 5:
        return 0.0, len(m) / FPS
    ref = sorted(m)[int(len(m) * 0.8)]
    seuil = max(ref * part, 0.6)
    actif = [v >= seuil for v in m]
    debut = next((i for i in range(len(m) - tenue) if all(actif[i:i + tenue])), 0)
    fin = len(m) - next((i for i in range(len(m) - tenue) if all(actif[len(m) - 1 - i - tenue + 1:len(m) - i])), 0)
    return debut / FPS, fin / FPS


if __name__ == "__main__":
    for mj in sys.argv[1:]:
        mt = json.loads(Path(mj).read_text(encoding="utf-8"))
        print(f"\n== {mt.get('nom', Path(mj).stem)}")
        for i, p in enumerate(mt["plans"], 1):
            ex = p.get("extrait")
            if not ex or "chute" in ex:
                continue
            f = B / ex
            m = mouvement(f)
            d, fin = demarrage(m)
            parole = None
            if p.get("mots"):
                parole = min(w["start"] for w in p["mots"]) if isinstance(p["mots"][0], dict) else None
            duree = len(m) / FPS
            note = []
            if d >= 0.3: note.append(f"mise en place {d:.1f} s")
            if duree - fin >= 0.5: note.append(f"traîne {duree - fin:.1f} s")
            if parole is not None: note.append(f"parole à {parole:.1f} s")
            courbe = "".join(" ▁▂▃▄▅▆▇█"[min(8, int(v / max(max(m), 1e-6) * 8))] for v in m[::2])
            print(f"plan {i:2d} {Path(ex).stem:16s} {duree:4.1f} s  {' ; '.join(note) or 'ok'}\n         {courbe}")
