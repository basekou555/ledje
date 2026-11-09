"""sous_titres_relus.py — 25/10 : les sous-titres relus PAR LE SENS, plan par plan.
Retour de Basekou : « tu retranscris mes sons, pas mes mots ». Méthode : nouvelle transcription (whisper medium,
dans _transcripts/medium/), comparée à l'ancienne (small), puis chaque phrase relue et corrigée à la main par la session.
Les temps restent ceux de la transcription ; seul le texte change (capcut_projet.py : texte_corrige).
Écrit les montages du 25/10 (nouveaux noms : ceux du 24/10 ne sont pas écrasés).
Usage : python sous_titres_relus.py
"""
import json
from pathlib import Path

B = Path("C:/Users/basek/Desktop/Ledje rush bureau")
MED = "_transcripts/medium/{}.json"

# extrait → texte relu. None = pas de sous-titres (propos incompréhensibles même relus).
RELU = {
    "s02d-01": "Bon, on y va. Dégustation à l'aveugle.",          # ? « Bon les gars » selon l'ancienne transcription
    "s02d-02": "Je me bouche les oreilles aussi, parce que sinon je vais entendre, je vais deviner.",
    "s02d-03": "L'odeur, elle est agréable, mais je trouve que dans le goût, c'est un peu sur sa faim.",
    "s02d-04a": "Il ne peut pas vivre tout seul.",
    "s02d-04b": "C'est bon, mais c'est insuffisant.",
    "s02d-05": "Il ne sent pas, en fait. Je ne sens rien.",
    "s02d-06": "C'est vraiment sucré, il y a un goût sucré.",
    "s02d-07": "Il n'y a pas assez d'arôme. Dans le goût, c'est presque comme si t'avais mis des sucres dans l'eau.",
    "s02d-08": "Attends, j'ai le seum, je crois que je me suis trompé. J'ai plus d'odorat !",
    "s02d-09": "C'est léger, je sens rien.",
    "s02d-11": "Mais ça a du caractère.",
    "s02d-12": "C'est bon, ça. C'est caractère.",
    "s06-02": "Là, c'est la caverne d'Ali Baba. Tout ça, c'est le miel que vous allez pouvoir goûter.",
    "s13-01": None,                                                # son confus (prix et gros mot) : rien d'écrit
    "s13-03": "Écoute, on vient de recevoir les étiquettes. On les a unboxées.",
    "s13-04": "Ça a l'air plutôt satisfaisant. Je pense que si tu regardes bien les lettres, elles sont un peu mangées.",
    "s13-05": "Mais je suis content, parce que l'épaisseur, c'est la bonne.",   # la transcription medium a inventé une phrase
    "s05-01": "On est venu chercher le miel. Là, on a commandé du miel pour la boisson.",
    "s05-02": "De voir comment il travaille, prendre la température.",
    "s05-06": "Là, c'est la caverne d'Ali Baba.",
    "s14-05": "J'ai plus de sucre dans le cerveau, frère. Ça fait 8 heures que je suis sur le projet. Là, tu veux que je parle ? Dans mon cerveau, il commence à y avoir un brouillard.",
    "s14-06": "Je suis fatigué, frère. Je sais pas, je sais pas…",
    "s03-01": "On a de l'eau au miel, c'est vraiment…",
    "s03-02": "C'est spécial… c'est très spécial, je trouve.",
    "s03-03": "Mais en effet, il manque un truc.",
    "s03-04": "Pour moi, c'est le dosage qu'on fait à peu près dans les bouteilles.",
    "s03-05": "T'aimes bien ? Tu veux combien sur 10 ? Honnête.",
    "s03-06": "Qu'est-ce qui me manque ?",
    "s03-07": "Ah, dingue !",
    "s03-08": "Oh, wow !",
    "s03-09": "T'aimes bien ? Moi, j'aime bien. C'est le même goût ? Oui.",
    "s03-10": "Ah, parce que t'as changé ? Ah ouais, la recette, elle a évolué un petit peu.",
    "s03-11": "C'est drôle. Les bouteilles sont super, en plus.",
    "s15-04": "T'aimes bien ? Tu veux combien sur 10 ? Honnête ? Qu'est-ce qui me manque ?",
}
GARDER_TEMPS_ANCIENS = {"s13-05"}   # temps de l'ancienne transcription (la nouvelle a halluciné)

fichiers = ["S-02_toi-seul_montage_2026-10-24.json"] + [f"{c}_montage_2026-10-24.json" for c in
            ("S-06", "S-08", "S-24", "S-22", "S-13", "S-05", "S-14", "S-03", "S-15")]
for fn in fichiers:
    mt = json.loads((B / "_montages" / fn).read_text(encoding="utf-8"))
    mt["nom"] = mt["nom"].replace("2026-10-24", "2026-10-25")
    for p in mt["plans"]:
        ext = Path(p["extrait"]).stem
        if ext not in RELU:
            continue
        if RELU[ext] is None:
            for k in ("rush", "in", "out", "mots", "in_mots", "out_mots"): p.pop(k, None)
            continue
        if ext not in GARDER_TEMPS_ANCIENS:
            for k in ("rush", "in", "out", "in_mots", "out_mots"): p.pop(k, None)
            p["mots"] = MED.format(ext)
        p["texte_corrige"] = RELU[ext]
    out = B / "_montages" / fn.replace("2026-10-24", "2026-10-25")
    out.write_text(json.dumps(mt, ensure_ascii=False, indent=1), encoding="utf-8")
    print(out.name)
