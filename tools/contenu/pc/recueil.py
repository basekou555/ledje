"""recueil.py — rassemble tous les storyboards en UNE page (sommaire + chaque storyboard + pistes sans storyboard).
Usage : python recueil.py <sortie.html> <storyboard.html> [<storyboard.html> ...]
Chaque storyboard.html doit avoir son .json à côté (même nom, sans _storyboard)."""
import json, re, sys
from pathlib import Path

sortie, pages = Path(sys.argv[1]), [Path(p) for p in sys.argv[2:]]
lignes, corps = [], []
for i, p in enumerate(pages):
    js = p.with_name(p.name.replace("_storyboard.html", ".json")) if p.name.endswith("_storyboard.html") else p.with_suffix(".json")
    sc = json.loads(js.read_text(encoding="utf-8"))
    html = p.read_text(encoding="utf-8")
    duree = re.search(r"Durée totale estimée : <b>(\d+) s", html)
    f = sc.get("fiche", {})
    types = {m.get("type", "rush") for m in sc["moments"]}
    teste = ", ".join(x for x in ("motion", "a-filmer", "genere") if x in types).replace("a-filmer", "à filmer").replace("genere", "à générer") or "rushes seuls"
    ancre = f"sb{i}"
    lignes.append(f'<tr data-a="{ancre}"><td><a href="#{ancre}">{sc["titre"]}</a></td><td>{f.get("Intention", "")}</td><td>{f.get("Format", "")}</td>'
                  f'<td>{f.get("Canal", "")}</td><td>{duree.group(1) if duree else "?"} s</td><td>{teste}</td></tr>')
    body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
    corps.append(f'<article id="{ancre}">{body}<p class="retour"><a href="#haut">Retour au sommaire</a></p></article>')

PISTES = [
    ("Carrousel « la miellerie en 6 photos »", "Instagram, l'écrit : 6 photos du 13/09 (ruches, cadre, vallée, fûts, bouteille), une phrase par carte. Matière dans D:/LEDJE (.jpg/.heic)."),
    ("« Réponse à un commentaire »", "TikTok : le premier vrai commentaire (« c'est juste de l'eau sucrée ? ») devient une face cam de 20 s, avec le commentaire incrusté."),
    ("POV : tu es la cuillère", "Caméra posée sur la cuillère (à filmer) : plonger dans le pot, sortir, descendre vers le goulot. Absurde, 8 s, très partageable."),
    ("Le son seul", "Écran noir, uniquement le son : le pot qui s'ouvre, la cuillère, le filet, le bouchon, la gorgée. Le mot « lédjé » à la fin. Test pur de l'ASMR."),
    ("Une question, dix réponses", "Micro-trottoir (à filmer) : « eau miellée, ça t'évoque quoi ? ». Les mains et les voix, pas les visages. Montage rapide."),
    ("La bouteille voyage", "Série : la même bouteille posée chaque jour dans un endroit différent de la semaine en famille (cuisine, voiture, fenêtre…). 3 s par lieu. Le fil de tes 10 jours."),
    ("Les mots du goût", "On teste « doux / frais / subtil » (identité verbale, en observation) : 3 vidéos identiques, un seul mot change dans le hook. Une variante comparable, au sens de la grille."),
    ("Le geste transmis", "Pour « la gardienne du foyer » (SOT 6bis) : des mains d'adulte guident des mains plus grandes que celles d'un enfant (jamais un mineur identifiable) qui versent le miel. La transmission sans un mot."),
    ("Le premier mail fournisseur", "Capture d'écran (floutée) du premier mail envoyé à un conditionneur, avec ta voix off : « Le jour où j'ai écrit à mon premier fournisseur. » L'avancée du projet."),
    ("Rituel du soir (SOT, V1)", "Le script V1 jamais tourné : la nuit, une silhouette à contre-jour, le geste. Registre contemplatif, plans à générer + 1 plan réel de chute."),
]
pistes = "".join(f"<li><b>{t}</b> — {d}</li>" for t, d in PISTES)
CSS = """
/* Recueil de storyboards : une colonne lisible, sommaire en tableau défilant, chaque storyboard en bloc séparé. */
:root{--bg:#f2f4ef;--surface:#ffffff;--fg:#1b2420;--doux:#5d6a63;--or:#a87a14;--vert:#1f5c45;--ligne:#d7ddd3;--alerte:#b3261e;
--f-titre:"Bricolage Grotesque",system-ui,sans-serif;--f-texte:"Source Sans 3",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#111714;--surface:#1a221e;--fg:#e6ebe4;--doux:#9fada5;--or:#ddb04a;--vert:#6fbf98;--ligne:#2c3832;--alerte:#ff8a80;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#111714;--surface:#1a221e;--fg:#e6ebe4;--doux:#9fada5;--or:#ddb04a;--vert:#6fbf98;--ligne:#2c3832;--alerte:#ff8a80;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--f-texte);font-size:16px;line-height:1.5;
padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:20px 48px}
.page{max-width:880px;margin:0 auto}
h1,h2{font-family:var(--f-titre);text-wrap:balance;line-height:1.15}
h1{font-size:1.75rem;margin:0 0 .4em} h2{font-size:1.25rem;margin:1.6em 0 .5em}
.intro{color:var(--doux);max-width:65ch} a{color:var(--vert)} a:focus-visible{outline:2px solid var(--or);outline-offset:2px}
.defile{overflow-x:auto;border:1px solid var(--ligne);border-radius:8px;background:var(--surface)}
.som{border-collapse:collapse;font-size:.88rem;min-width:640px;width:100%}
.som th{text-align:left;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--doux);padding:8px}
.som td{padding:7px 8px;border-top:1px solid var(--ligne);vertical-align:top;font-variant-numeric:tabular-nums}
ul.pistes{padding-left:1.1em;max-width:70ch} ul.pistes li{margin:.35em 0}
article{margin-top:40px;padding-top:16px;border-top:3px solid var(--or)}
article table{border-collapse:collapse;margin:8px 0 12px;font-size:.92rem}
article th{text-align:left;padding:3px 12px 3px 0;color:var(--or);vertical-align:top;white-space:nowrap;font-weight:600}
article td{padding:3px 0;min-width:0}
section{display:flex;gap:12px;background:var(--surface);border:1px solid var(--ligne);border-radius:8px;padding:10px;margin:10px 0;flex-wrap:wrap}
section.a-filmer{border-left:4px solid #9a7a55} section.motion{border-left:4px solid var(--vert)} section.genere{border-left:4px solid #5675a8}
.num{font-family:var(--f-titre);font-weight:700;font-size:1.3rem;color:var(--or);min-width:26px;font-variant-numeric:tabular-nums}
.imgs{display:flex;gap:4px;flex-wrap:wrap} .imgs img{width:84px;height:150px;object-fit:cover;border-radius:4px;max-width:100%}
.txt{flex:1;min-width:0;flex-basis:220px} .haut{color:var(--or);font-weight:600;margin:0}
.dit{font-size:1.02rem;margin:.3em 0} .consigne{font-style:italic;margin:.3em 0} .src{color:var(--doux);font-size:.82rem;margin:0}
.duree{font-size:1.05rem} .alerte{color:var(--alerte);font-size:.88rem;margin:.3em 0 0}
.retour{font-size:.85rem}
.cherche{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 12px}
.cherche label{font-size:.78rem;letter-spacing:.05em;text-transform:uppercase;color:var(--doux);width:100%}
.cherche input{flex:1;min-width:0;font:inherit;padding:8px 10px;border:1px solid var(--ligne);border-radius:6px;background:var(--surface);color:var(--fg)}
.cherche input:focus-visible{outline:2px solid var(--or);outline-offset:1px}
#n{color:var(--doux);font-size:.88rem}
"""
JS = r"""<script>
(function(){
  var q=document.getElementById("q"), n=document.getElementById("n");
  var norm=function(t){return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");};
  var arts=[].slice.call(document.querySelectorAll("article"));
  var txt={}; arts.forEach(function(a){txt[a.id]=norm(a.textContent);});
  q.addEventListener("input",function(){
    var v=norm(q.value.trim()), k=0;
    arts.forEach(function(a){var ok=!v||txt[a.id].indexOf(v)>=0; a.hidden=!ok; if(ok)k++;
      var tr=document.querySelector('tr[data-a="'+a.id+'"]'); if(tr) tr.hidden=!ok;});
    n.textContent=v?(k+" storyboard"+(k>1?"s":"")+" contiennent « "+q.value.trim()+" »"):"";
  });
})();
</script>"""
html = f"""<title>Storyboards Lédjé</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap">
<style>{CSS}</style>
<div class="page">
<h1 id="haut">Storyboards Lédjé — 23 octobre 2026</h1>
<p class="intro">Écrits par la session Claude Code du PC pendant ton absence. Rien n'est validé ni monté, sauf S-02 qui est déjà un projet CapCut. Le but : explorer large, puis trier ensemble ce qu'on aime, ce qu'on n'aime pas et ce qui se réutilise.</p>
<p class="intro"><b>Trois familles.</b> S-02 à S-04 : les compilations et le premier resto, déjà travaillés avec toi. S-05 à S-23 : des idées parties de notre fonds et des formats de la grille. S-24 à S-34 : de l'exploration avec des formes empruntées ailleurs (documentaire animalier, procès, faux tuto, stop-motion, dictionnaire, lettre à soi-même). La doc sert d'appui à l'argument (ligne « Pourquoi l'explorer »), pas de moule.</p>
<p class="intro"><b>Comment lire.</b> Chaque ligne est un moment de la vidéo, avec des images cadrées comme dans la vidéo finale. Bordure brune : à filmer. Verte : motion design (maquette du texte animé). Bleue : à générer. En rouge : les passages signalés (conformité, marques, tiers). Rien n'est coupé, tu tranches.</p>
<h2>Sommaire</h2>
<div class="cherche"><label for="q">Chercher un mot dans les storyboards</label>
<input id="q" type="search" placeholder="goût, miellerie, famille, Prouver, motion…" autocomplete="off"><span id="n" aria-live="polite"></span></div>
<div class="defile"><table class="som"><tr><th>Vidéo</th><th>Intention</th><th>Format</th><th>Canal</th><th>Durée</th><th>On y teste</th></tr>{"".join(lignes)}</table></div>
<h2>Pistes en plus, sans storyboard</h2><ul class="pistes">{pistes}</ul>
{"".join(corps)}</div>
{JS}"""
sortie.write_text(html, encoding="utf-8")
print(f"{len(pages)} storyboards → {sortie} ({sortie.stat().st_size / 1e6:.1f} Mo)")
