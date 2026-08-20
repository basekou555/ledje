# visual/ — le générateur de prompts visuels

**Rôle** : produire des prompts d'image prêts à générer (Higgsfield, ChatGPT Image, Gemini), à partir
d'un catalogue d'options fixes plutôt qu'à l'inspiration. C'est un **système de compilation**, pas une
banque de prompts : on choisit des identifiants, le prompt se rédige à partir d'eux.

> **Ce dossier existe depuis juillet 2026 et n'était référencé nulle part hors `CLAUDE.md`.** Une session
> qui lit le relais ou le journal des décisions ne pouvait pas savoir qu'il existait. Ce README est le
> pont manquant.

## Règles du dossier

- **Zone MIXTE.** `ledje-master-prompt.md` et `ledje-visual-language.md` sont **protégés** : aucune
  modification sans accord explicite de Basekou. `ledje-prompt-library.md`, `ledje-shot-book.md` et
  `ledje-asset-log.md` évoluent librement avec l'usage.
- Tout prompt compilé passe la grille de `../01_adn/conformite.md` — **aucune allégation santé, même
  implicite, image comprise**.
- **Yeux jamais visibles** (non négociable). **Aucun symbole religieux explicite.**

## Les fichiers, dans l'ordre de dépendance

| Fichier | Ce qu'il contient | Régime |
|---|---|---|
| [`ledje-visual-language.md`](ledje-visual-language.md) | La constitution artistique : ce que les images racontent et pourquoi | 🔒 protégé |
| [`ledje-master-prompt.md`](ledje-master-prompt.md) | **Le cahier des charges** — ce qui ne change jamais : produit, negative prompt, ordre de priorité, présence humaine, narrative, checklist | 🔒 protégé |
| [`ledje-prompt-library.md`](ledje-prompt-library.md) | Le catalogue d'options : sujet, décor, caméra, lumière, matières, composition, props, action, émotion + presets par intention | libre |
| [`ledje-shot-book.md`](ledje-shot-book.md) | La liste des shots, chacun avec sa recette d'IDs et son delta narratif | libre |
| [`ledje-asset-log.md`](ledje-asset-log.md) | L'historique des générations et ce qu'on en a appris | libre |

La procédure de compilation en 9 étapes vit dans [`CLAUDE.md`](../../CLAUDE.md) à la racine.

---

## Le format d'entrée exact

Deux entrées possibles, et une seule sortie.

**Entrée A — un ID de shot existant.** Exemple : `ATT-01`. Le shot-book porte déjà sa recette complète.
On peut substituer un paramètre à la volée (« ATT-01 mais en lumière de fin d'après-midi » → `LIGHT-02`).

**Entrée B — une envie en langage naturel.** On identifie d'abord **l'intention de communication** parmi
les six (Attirer · Expliquer · Prouver · Projeter · Inviter · Conclure), on propose le preset de cette
intention et le shot correspondant, **et on demande confirmation avant de compiler**.

**La recette** est une suite d'identifiants, dans cet ordre :

```
SUJ-.. / DEC-.. / CAM-.. / LIGHT-.. / MAT-.. / COMP-.. / ACT-.. / EMO-..   (+ PRP-.. si props)
```

Le **SUJET (SUJ)** vient toujours en tête : c'est le héros physique de l'image, et c'est lui qui pilote le
bloc `PRODUCT` du prompt. À ne pas confondre avec **ACT**, qui est le geste.

**La sortie** est un prompt **en anglais**, autonome (compréhensible sans accès à ces fichiers), structuré :

```
SCENE → PRODUCT → COMPOSITION → CAMERA → LIGHT → MATERIALS → ÉMOTION
```

---

## Ce que le cahier des charges impose DÉJÀ

**À ne pas réécrire dans un prompt** — c'est le socle, il est ajouté à la compilation :

- **Registre** : photographie éditoriale contemporaine, sobre et digne. Sobriété vivante, jamais
  minimalisme froid. Bannis : rustic farmhouse, vintage still life, cottagecore, « vieille pub de miel ».
- **Ordre de priorité** quand le modèle ne peut pas tout satisfaire : exactitude produit → narratif →
  émotion → composition → décoratif.
- **Narrative** : chaque image répond à trois questions — que s'est-il passé une seconde avant, que se
  passe-t-il, que va-t-il se passer une seconde après. Une image qui n'y répond pas est un objet figé.
- **Photographie** : toutes les images doivent ressembler à des photogrammes d'un même film. Une trace de
  mouvement discret dans chaque cadre.
- **Défauts forts** : focale humaine, faible profondeur de champ, hauteur d'œil · lumière naturelle douce
  (matin diffus ou fin d'après-midi), jamais de flash ni de studio visible · matières autorisées
  (pierre, verre, eau, lin, coton, bois massif, papier texturé, miel, laiton brossé, céramique).
- **Présence humaine** : mains, silhouettes, profils, gestes ; le moins de visage possible ; **yeux
  jamais visibles**.
- **Composition** : 3 éléments principaux maximum, espace négatif généreux, un seul sujet.
- **Negative prompt** : aucun symbole religieux · aucun regard · aucun texte IA suggérant un effet santé ·
  aucune évocation de marque concurrente · aucun signal de luxe ostentatoire · aucun matériau interdit
  (plastique brillant, marbre noir, chrome, résine, miroir, décors futuristes, clichés « bio »).

## Ce qui reste à la charge du rédacteur

**Une seule chose, et c'est la seule qui compte : le delta narratif.** L'instant précis raconté, celui qui
ne se réduit à aucun identifiant. Tout le reste se choisit dans le catalogue.

Concrètement, pour une pièce : l'intention, la recette (ou le preset de l'intention), et deux ou trois
lignes décrivant le moment. Rien d'autre.

## Un exemple de prompt valide

Shot `ATT-01` — *La Rencontre*, recette `SUJ-03 / DEC-00 / CAM-02 / LIGHT-02 / MAT-03 / COMP-01 / ACT-02 / EMO-01` :

```
SCENE — A quiet interior surface, neutral and uncluttered. Late-afternoon daylight enters
from one side. Nothing else competes for attention.

PRODUCT — A clear, straight, unbranded glass of still water. A small warm-amber piece of
honey, simple geometric shape, has just met the surface of the water and is beginning to
diffuse — slow, infusion-like, no effervescence; the water stays clear.

COMPOSITION — Three elements maximum. One subject. Generous negative space on one side,
left free for typography.

CAMERA — Macro, human focal length, shallow depth of field, eye level. No wide-angle
distortion, no drone or FPV effect.

LIGHT — Natural, soft, credible; late-afternoon. No flash, no neon, no visible studio,
no aggressive contrast.

MATERIALS — Glass, water, honey, limestone or travertine, raw linen. Cream and sand
neutrals dominate; a single emerald accent, never a full emerald background.

EMOTION — Calm, alive. The image should make one want to slow down for thirty seconds.

NEGATIVE — No religious symbols. No visible eyes or gaze. No AI-generated text. No named
competitor reference. No ostentatious luxury signals (excessive gilding, crystal, black
marble, chrome). No glossy plastic, resin, mirrored surfaces, futuristic sets, or
"organic-cliché" imagery (meadows, swarms of bees).
```

## Limites connues

- **Aucune génération n'a encore été validée.** `ledje-asset-log.md` est vide : les presets sont des
  hypothèses de bon sens, pas des résultats prouvés. La boucle d'apprentissage n'a jamais tourné.
- **Le système est conçu pour l'image fixe de marque** — 8 à 10 shots iconiques, organisés par intention.
  Il n'est pas dimensionné pour une production sociale à ~20 pièces par semaine, majoritairement vidéo
  (`../03_marche/grille-contenu.md`). Les deux besoins peuvent cohabiter, mais le shot-book ne fournit ni
  hooks, ni scripts, ni découpage de plans.
- **Le format de lancement du cristal n'est pas confirmé** par les fournisseurs : les shots produit
  restent volontairement génériques, sans détail de texture ni de mécanisme non vérifié.

## ⚠️ Écarts avec l'ADN — relevés le 2026-08-20, non corrigés

Ces quatre points sont **signalés, pas modifiés** : ils touchent des fichiers protégés.

1. **Terminologie du produit.** Le master-prompt et la prompt-library nomment le produit de lancement
   « Honey Portion » / « la portion », et `SUJ-01` s'appelle « La perle ». Or **portion, monodose, perle et
   pastille sont des interdits stratégiques du lexique** — on dit **cristal de miel**
   (`../01_adn/identite-verbale.md` §4.3, `../02_produit/cristal.md`). Le prompt est un objet interne et
   anglais, donc ce n'est pas une infraction en soi ; le risque est que le mot remonte dans le copy en
   passant par le shot-book.
2. **Typographie.** Le master-prompt fixe `Label: Emerald green, gold typography (Fraunces)`. Fraunces est
   retirée depuis la refonte ; l'étiquette réelle porte la typo « Alice », et l'arbitrage de la typo
   système n'est pas tranché (`../01_adn/identite-visuelle.md`).
3. **Palette.** Le master-prompt donne l'or et l'ambre comme acquis et renvoie au « SOT §3.2 », archivé
   depuis le 2026-07-24. La palette est **rouverte** : seul l'émeraude tient
   (`../01_adn/identite-visuelle.md`, statut `bloquant`).
4. **Produit de lancement.** Le master-prompt présente le cristal comme « produit de lancement » et la
   bouteille comme « phase 2 ». Le produit de lancement réel est la **bouteille 33 cl d'eau miellée** ; le
   cristal est le produit de **conversion en ligne** (`../03_marche/site-precommande.md`).
