"""extraire.py — découpe des extraits courts dans les rushes 4K HDR, convertis en SDR (BT.709).

Pourquoi : rendu.py découpe avec `trim` dans le graphe de filtres, donc décode tout le rush depuis
le début (des minutes de 4K HEVC par plan), et ne convertit pas le HDR (image grise et délavée).
Ici : seek rapide (-ss avant -i), tonemapping HDR → SDR, sortie H.264 légère que la recette pointe.

Usage : python extraire.py <dossier_rushes> <liste.txt>
liste.txt : une ligne par extrait — `nom ; rush ; in ; out [; réglage]`  (timecodes en s ou hh:mm:ss.s)
           réglage (facultatif) : une clé de RETOUCHE ci-dessous, ajoutée après le tonemapping.
Sortie : <dossier_rushes>/_extraits/<nom>.mp4 (déjà présent → ignoré)
"""
import subprocess, sys
from pathlib import Path

# Réglage validé le 2026-10-22 sur les rushes du 15/07 (PQ) : peau juste, blancs propres.
TONEMAP = ("zscale=t=linear:npl=160,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,"
           "zscale=t=bt709:m=bt709:r=tv,format=yuv420p,"
           # 23/10 : plus franc (Basekou trouvait l'image terne) — contraste, saturation, légère chaleur.
           "eq=gamma=1.08:contrast=1.2:saturation=1.35,colorbalance=rs=0.04:bs=-0.04:rm=0.03:bm=-0.03")


# 24/10 : retouches par rush, en plus du réglage commun (5e colonne facultative de la liste).
RETOUCHE = {
    # Samsung de jour (PQ) : le réglage commun les rend trop orangés → un peu plus froid, moins saturé.
    "jour": "eq=saturation=0.9,colorbalance=rs=-0.07:bs=0.07:rm=-0.06:bm=-0.03",
    "nuit+": "eq=contrast=1.1:saturation=1.2",   # S-02 (nuit du 15/07) : Basekou trouvait encore l'image terne
}


def s(tc: str) -> float:
    t = 0.0
    for p in tc.strip().split(":"):
        t = t * 60 + float(p.replace(",", "."))
    return t


racine = Path(sys.argv[1])
sortie = racine / "_extraits"
sortie.mkdir(exist_ok=True)
for ligne in Path(sys.argv[2]).read_text(encoding="utf-8").splitlines():
    if not ligne.strip() or ligne.startswith("#"):
        continue
    champs = [x.strip() for x in ligne.split(";")]
    nom, rush, t_in, t_out = champs[:4]
    retouche = RETOUCHE.get(champs[4], "") if len(champs) > 4 else ""
    dst = sortie / f"{nom}.mp4"
    if dst.exists():
        continue
    debut, duree = s(t_in), s(t_out) - s(t_in)
    src = racine / rush
    trc = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=color_transfer", "-of", "csv=p=0", str(src)], capture_output=True, text=True).stdout
    hdr = any(x in trc for x in ("smpte2084", "arib-std-b67"))
    # Hauteur 1920 : un 16:9 garde de quoi être recadré en 9:16 sans perte ; un 9:16 sort en 1080x1920.
    vf = (f"{TONEMAP}," if hdr else "") + (f"{retouche}," if retouche else "") + "scale=-2:1920:flags=lanczos"
    # 23/10 : volume égalisé (les téléphones et les distances varient de 13 dB d'un rush à l'autre).
    af = "loudnorm=I=-16:TP=-1.5:LRA=11"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{debut:.3f}", "-i", str(src),
                    "-t", f"{duree:.3f}", "-vf", vf, "-af", af, "-c:v", "libx264", "-preset", "fast", "-crf", "16",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", str(dst)], check=True)
    print(f"{nom} : {rush} {t_in} → {t_out} ({duree:.1f} s)", flush=True)
