"""storyboard.py — un script en images : pour chaque moment, 3 images du plan TEL QU'IL SERA CADRÉ (9:16),
le texte du haut, ce qui est dit, la source et le timecode. Sort une page HTML autonome (images intégrées).

Un moment peut aussi être (champ `type`) :
  - "rush"     : un morceau de rush (défaut) — `rush`, `in`, `out`, `cadrage`
  - "a-filmer" : un plan qui n'existe pas encore — `consigne` (ce qu'il faut filmer), `duree`
  - "motion"   : un plan de motion design / texte animé — `ecran` (le texte affiché), `duree`, `fond` (couleur)
  - "genere"   : un plan à générer (IA image/vidéo) — `consigne`, `duree`
  - "photo"    : une photo du disque — `rush` (chemin de l'image), `duree`
Usage : python storyboard.py <script.json> <sortie.html>"""
import base64, json, subprocess, sys, tempfile, textwrap
from pathlib import Path

TM = ("zscale=t=linear:npl=160,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,"
      "zscale=t=bt709:m=bt709:r=tv,format=yuv420p,eq=gamma=1.08:contrast=1.2:saturation=1.35,"
      "colorbalance=rs=0.04:bs=-0.04:rm=0.03:bm=-0.03")
COULEURS = {"a-filmer": "0x5a5148", "genere": "0x3d4a5c", "motion": "0x1f3d2b"}
ETIQUETTE = {"rush": "rush", "a-filmer": "À FILMER", "genere": "À GÉNÉRER", "motion": "MOTION", "photo": "photo"}
sc = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
tmp = Path(tempfile.mkdtemp(prefix="sb-"))
(tmp / "f.ttf").write_bytes(Path("C:/Windows/Fonts/arialbd.ttf").read_bytes())


def hdr(src):
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=color_transfer",
                        "-of", "csv=p=0", src], capture_output=True, text=True).stdout
    return "smpte2084" in o or "arib-std-b67" in o


def b64(p):
    return base64.b64encode(p.read_bytes()).decode() if p.exists() else ""


def vignette(src, t, cadrage, i, j):
    dst = tmp / f"{i}_{j}.jpg"
    crop = f"crop=ih*9/16:ih:(iw-ih*9/16)*{cadrage}:0," if cadrage is not None else ""
    vf = (TM + "," if hdr(src) else "") + f"{crop}scale=216:384:force_original_aspect_ratio=increase,crop=216:384"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0, t):.2f}", "-i", src, "-frames:v", "1",
                    "-vf", vf, "-q:v", "4", str(dst)])
    return b64(dst)


def carte(texte, couleur, i, j, etiquette):
    """Une image de maquette : fond de couleur, étiquette en haut, le texte au centre."""
    dst = tmp / f"{i}_{j}.jpg"
    (tmp / f"t{i}.txt").write_text("\n".join(textwrap.wrap(texte, 16)) or " ", encoding="utf-8")
    (tmp / f"e{i}.txt").write_text(etiquette, encoding="utf-8")
    vf = (f"drawtext=fontfile=f.ttf:textfile=e{i}.txt:x=(w-text_w)/2:y=14:fontsize=18:fontcolor=white@0.7,"
          f"drawtext=fontfile=f.ttf:textfile=t{i}.txt:x=(w-text_w)/2:y=(h-text_h)/2:fontsize=22:fontcolor=white:line_spacing=6")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c={couleur}:s=216x384", "-frames:v", "1",
                    "-vf", vf, str(dst)], cwd=tmp)
    return b64(dst)


lignes, total = [], 0.0
for i, m in enumerate(sc["moments"]):
    typ = m.get("type", "rush")
    if typ == "rush":
        a, b = m["in"], m["out"]
        d = (b - a - m.get("retire", 0)) / m.get("vitesse", 1.0)   # un plan accéléré ×3 dure 3 fois moins
        imgs = [vignette(m["rush"], a + (b - a) * p, m.get("cadrage"), i, j) for j, p in enumerate((0.1, 0.5, 0.9))]
        src = f'{Path(m["rush"]).name} · {a:.1f} → {b:.1f} s · {d:.1f} s' + (f' (accéléré ×{m["vitesse"]:g})' if m.get("vitesse", 1) != 1 else "")
    elif typ == "photo":
        d = m.get("duree", 2.0)
        imgs = [vignette(m["rush"], 0, None, i, 0)]
        src = f'{Path(m["rush"]).name} (photo) · {d:.1f} s'
    else:
        d = m.get("duree", 2.0)
        texte = m.get("ecran") or m.get("consigne", "")
        imgs = [carte(texte, m.get("fond", COULEURS[typ]), i, 0, ETIQUETTE[typ])]
        src = f'{ETIQUETTE[typ]} · {d:.1f} s'
    total += d
    html_imgs = "".join(f'<img src="data:image/jpeg;base64,{x}">' for x in imgs)
    consigne = f'<p class="consigne">{m["consigne"]}</p>' if m.get("consigne") and typ != "rush" else ""
    alerte = f'<p class="alerte">⚠️ {m["alerte"]}</p>' if m.get("alerte") else ""
    dit = f'<p class="dit">« {m["dit"]} »</p>' if m.get("dit") else ""
    lignes.append(f"""<section class="{typ}"><div class="num">{i + 1}</div><div class="imgs">{html_imgs}</div><div class="txt">
<p class="haut">{m.get("haut", "")}</p>{dit}{consigne}<p class="src">{src}</p>{alerte}</div></section>""")

fiche = "".join(f"<tr><th>{k}</th><td>{v}</td></tr>" for k, v in sc.get("fiche", {}).items())
html = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{sc["titre"]}</title><style>
:root{{--fond:#faf7f0;--texte:#222;--doux:#777;--carte:#fff;--accent:#b7791f}}
@media (prefers-color-scheme:dark){{:root{{--fond:#1b1a17;--texte:#eee;--doux:#aaa;--carte:#26241f;--accent:#e0a84a}}}}
body{{background:var(--fond);color:var(--texte);font-family:system-ui,sans-serif;margin:0 auto;padding:16px;max-width:900px}}
h1{{font-size:1.3rem}} .intro{{color:var(--doux)}} table{{border-collapse:collapse;margin:8px 0}}
th{{text-align:left;padding:3px 10px 3px 0;color:var(--accent);vertical-align:top;white-space:nowrap}} td{{padding:3px 0}}
section{{display:flex;gap:12px;background:var(--carte);border-radius:10px;padding:10px;margin:12px 0;flex-wrap:wrap}}
section.a-filmer{{border-left:4px solid #a08060}} section.motion{{border-left:4px solid #2f7a4d}} section.genere{{border-left:4px solid #4a6a9c}}
.num{{font-weight:700;font-size:1.4rem;color:var(--accent);min-width:28px}}
.imgs{{display:flex;gap:4px}} .imgs img{{width:90px;height:160px;object-fit:cover;border-radius:4px}}
.txt{{flex:1;min-width:220px}} .haut{{color:var(--accent);font-weight:600;margin:0}}
.dit{{font-size:1.05rem;margin:.3em 0}} .consigne{{font-style:italic;margin:.3em 0}} .src{{color:var(--doux);font-size:.85rem;margin:0}}
.duree{{font-size:1.1rem}} .alerte{{color:#c0392b;font-size:.9rem;margin:.3em 0 0}}
</style></head><body><h1>{sc["titre"]}</h1><table>{fiche}</table><p class="intro">{sc.get("intro", "")}</p>
<p class="duree">Durée totale estimée : <b>{total:.0f} s</b> · {len(lignes)} moments</p>{"".join(lignes)}</body></html>"""
Path(sys.argv[2]).write_text(html, encoding="utf-8")
print(f"{len(lignes)} moments, {total:.0f} s → {sys.argv[2]}")
