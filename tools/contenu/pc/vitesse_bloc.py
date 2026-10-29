"""28/10 — change la vitesse des plans accélérés d'un projet CapCut existant (ex. ×3 → ×2) et décale tout ce qui suit.

    python vitesse_bloc.py "<dossier du projet>" <ancienne> <nouvelle> [--essai]

Seuls les plans vidéo à l'ancienne vitesse changent. Les textes et la suite du montage suivent le nouveau temps.
Les sons gardent leur durée (vitesse normale) et restent calés sur le même instant du geste.
CapCut fermé, sauvegarde datée à la seconde.
"""
import json, shutil, subprocess, sys, time
from pathlib import Path

projet, v0, v1 = Path(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])
essai = "--essai" in sys.argv
if not essai and "capcut.exe" in subprocess.run(["tasklist"], capture_output=True, text=True).stdout.lower():
    sys.exit("CapCut est ouvert : ferme-le avant.")
US = 1e6


def traiter(d, bavard):
    speeds = {m["id"]: m for m in d["materials"].get("speeds", [])}
    video = next(t for t in d["tracks"] if t["type"] == "video")
    rapides = [s for s in video["segments"] if abs(s.get("speed", 1) - v0) < 0.1]
    # correspondance ancien temps → nouveau temps, morceau par morceau
    morceaux = sorted((s["target_timerange"]["start"], s["target_timerange"]["start"] + s["target_timerange"]["duration"]) for s in rapides)

    def f(t):
        decal = 0.0
        for a, b in morceaux:
            if t <= a: break
            if t < b: return t + decal + (t - a) * (v0 / v1 - 1)
            decal += (b - a) * (v0 / v1 - 1)
        return t + decal

    for tr in d["tracks"]:
        for s in tr["segments"]:
            tt = s["target_timerange"]; a, b = tt["start"], tt["start"] + tt["duration"]
            na = round(f(a))
            if tr["type"] == "audio":
                tt["start"] = na                     # un son garde sa durée réelle
            else:
                tt["start"], tt["duration"] = na, round(f(b)) - na
            if s in rapides:   # vitesse exacte = durée source / durée à l'écran (sinon CapCut et capcut-cli voient un décalage)
                v = s["source_timerange"]["duration"] / tt["duration"]
                s["speed"] = v
                for r in s.get("extra_material_refs", []):
                    if r in speeds: speeds[r]["speed"] = v
    d["duration"] = round(f(d["duration"]))
    if bavard:
        for tr in d["tracks"]:
            for s in tr["segments"]:
                tt = s["target_timerange"]
                print(f"  {tr.get('name', tr['type']):11} {tt['start'] / US:6.2f} + {tt['duration'] / US:5.2f}  vitesse {s.get('speed', 1):.2f}")
        print(f"  durée totale : {d['duration'] / US:.2f} s")
    return len(rapides)


stamp = time.strftime("%Y%m%d-%H%M%S")
for f_ in [projet / "draft_content.json", projet / "template-2.tmp"] + list((projet / "Timelines").glob("*/draft_content.json")):
    if not f_.exists(): continue
    d = json.loads(f_.read_text(encoding="utf-8"))
    n = traiter(d, bavard=(f_.parent == projet and f_.name == "draft_content.json"))
    print(f"{f_.relative_to(projet)} : {n} plan(s) passé(s) de ×{v0:g} à ×{v1:g}")
    if n and not essai:
        shutil.copy2(f_, f_.with_name(f"{f_.stem}.avant-vitesse-{stamp}{f_.suffix}"))
        f_.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
