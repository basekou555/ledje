# visual/ — la production visuelle

**Rôle** : produire des prompts d'image et de vidéo prêts à générer, à partir d'un catalogue d'options
fixes plutôt qu'à l'inspiration. C'est un **système de compilation**, pas une banque de prompts : on
choisit des identifiants, le prompt se rédige à partir d'eux.

> **Ce dossier existe depuis juillet 2026 et n'était référencé nulle part hors `CLAUDE.md`.** Une session
> qui lit le relais ou le journal des décisions ne pouvait pas savoir qu'il existait. Ce README est la
> carte d'entrée qui manquait.

## Règles du dossier

- **Zone MIXTE.** `ledje-master-prompt.md` et `ledje-visual-language.md` sont **protégés** : aucune
  modification sans accord explicite de Basekou. Les autres fichiers évoluent librement avec l'usage.
- Toute modification d'un fichier protégé se trace dans `ledje-asset-log.md`, section « Modifications du
  Master Prompt » (Evolution Policy).
- Tout prompt compilé passe la grille de `../01_adn/conformite.md` — **aucune allégation santé, même
  implicite, image comprise**.
- **Yeux jamais visibles** (non négociable). **Aucun symbole religieux explicite.**
- **Terminologie** : on dit **cristal de miel**. *portion · perle · pastille · monodose* sont des interdits
  de lexique (`../01_adn/identite-verbale.md` §4.3).

## Les fichiers

| Fichier | Ce qu'il contient | Régime |
|---|---|---|
| [`ledje-generateur.md`](ledje-generateur.md) | **L'outil** : ce qu'est réellement le générateur (Higgsfield via MCP), son format d'entrée, ce que le cahier des charges impose déjà, ce qui reste au rédacteur, les coûts et les limites | libre |
| [`ledje-visual-language.md`](ledje-visual-language.md) | La constitution artistique : ce que les images racontent et pourquoi | 🔒 protégé |
| [`ledje-master-prompt.md`](ledje-master-prompt.md) | **Le cahier des charges** : produit, negative prompt, ordre de priorité, présence humaine, narrative, checklist | 🔒 protégé |
| [`ledje-prompt-library.md`](ledje-prompt-library.md) | Le catalogue d'options : sujet, décor, caméra, lumière, matières, composition, props, action, émotion + presets par intention | libre |
| [`ledje-shot-book.md`](ledje-shot-book.md) | La liste des shots, chacun avec sa recette d'IDs et son delta narratif | libre |
| [`ledje-asset-log.md`](ledje-asset-log.md) | L'historique des générations, ce qu'on en a appris, et les modifications du master prompt | libre |

## Par où commencer

- **Tu vas écrire des prompts ou des hooks pour les réseaux** → [`ledje-generateur.md`](ledje-generateur.md).
  Il dit ce qui est déjà cadré (à ne pas répéter) et ce qu'il te reste à fournir.
- **Tu compiles un shot précis** → la procédure en 9 étapes dans [`CLAUDE.md`](../../CLAUDE.md) à la racine.
- **Tu veux savoir ce qu'on a le droit de montrer** → `ledje-master-prompt.md` (negative prompt, checklist).

## Le format d'entrée, en bref

Deux entrées, une sortie.

**A — un ID de shot existant** (ex. `ATT-01`) : le shot-book porte déjà sa recette. On peut substituer un
paramètre à la volée (« ATT-01 mais en lumière de fin d'après-midi » → `LIGHT-02`).

**B — une envie en langage naturel** : on identifie d'abord **l'intention de communication** parmi les six
(Attirer · Expliquer · Prouver · Projeter · Inviter · Conclure), on propose le preset et le shot
correspondants, **et on demande confirmation avant de compiler**.

La recette s'écrit `SUJ-.. / DEC-.. / CAM-.. / LIGHT-.. / MAT-.. / COMP-.. / ACT-.. / EMO-..` (+ `PRP-..`).
Le **SUJET** vient toujours en tête : c'est le héros physique, et c'est lui qui pilote le bloc `PRODUCT`.
À ne pas confondre avec **ACT**, qui est le geste.

La sortie est un prompt **en anglais**, autonome, structuré
`SCENE → PRODUCT → COMPOSITION → CAMERA → LIGHT → MATERIALS → ÉMOTION`.

*(Le schéma technique réel de l'outil — paramètres, modèles, variantes, références produit, préchiffrage
des crédits — et la formule vidéo sont dans [`ledje-generateur.md`](ledje-generateur.md).)*

## Ce qui reste à la charge du rédacteur

**Une seule chose, et c'est la seule qui compte : le delta narratif.** L'instant précis raconté, celui qui
ne se réduit à aucun identifiant. Tout le reste se choisit dans le catalogue.

Concrètement, pour une pièce : l'intention, la recette (ou le preset de l'intention), et deux ou trois
lignes décrivant le moment. Rien d'autre.

## Un exemple de prompt compilé

Shot `ATT-01` — *La Rencontre*, recette `SUJ-03 / DEC-00 / CAM-02 / LIGHT-02 / MAT-03 / COMP-01 / ACT-02 / EMO-01` :

```
SCENE — A quiet interior surface, neutral and uncluttered. Late-afternoon daylight enters
from one side. Nothing else competes for attention.

PRODUCT — A clear, straight, unbranded glass of still water. A small warm-amber honey crystal,
simple geometric shape, has just met the surface of the water and is beginning to
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

## Limites, en un coup d'œil

- **Aucune génération validée à ce jour** : `ledje-asset-log.md` ne porte aucune ligne de production, donc
  les presets sont des hypothèses de bon sens, pas des résultats prouvés. La boucle d'apprentissage n'a
  jamais tourné.
- **Le système est conçu pour l'image fixe de marque** — 8 à 10 shots organisés par intention. Il n'est pas
  dimensionné pour ~20 pièces de contenu social par semaine, majoritairement vidéo
  (`../03_marche/grille-contenu.md`) : il ne fournit ni hooks, ni scripts, ni découpage de plans.
- **Le format du cristal n'est pas confirmé** par les fournisseurs : les shots produit restent
  volontairement génériques.

*(Le détail — coûts en crédits, limites du plan, verdict sur les vidéos déjà produites — est dans
[`ledje-generateur.md`](ledje-generateur.md).)*

## ✅ Écarts avec l'ADN — relevés ET corrigés le 2026-08-20

Quatre écarts avaient été relevés. **Basekou a validé leur correction en session** ; elle est appliquée aux
fichiers protégés comme aux autres, et tracée dans `ledje-asset-log.md`.

1. **Terminologie** — le système nommait le produit « portion » / « perle ». **Corrigé : on dit *cristal de
   miel* partout.** Le master-prompt porte désormais le rappel de l'interdit ; `SUJ-01` s'appelle
   « Le cristal de miel ».
2. **Typographie** — la spec `Fraunces` est **retirée**. Nouvelle règle : **ne jamais spécifier de police
   dans un prompt**, et garder le texte d'étiquette **suggéré, jamais rendu lisible**. Double motif :
   l'identité typographique n'est pas tranchée, et l'IA rend les mentions en lettres aléatoires — constat
   de production du 14/08.
3. **Palette** — le renvoi au « SOT §3.2 » (archivé) est supprimé. **Seul l'émeraude tient** ; l'or et
   l'ambre sont **remis en question** comme couleurs de marque. *(L'ambre du **miel** est un fait de
   matière, pas une couleur de marque — il n'est pas concerné.)*
4. **Rôles produit** — ils étaient **inversés**. Rétabli : la **bouteille 33 cl d'eau miellée est le
   produit de lancement**, fabriquée et vendue aujourd'hui ; le **cristal est le produit de conversion en
   ligne**, pas encore produit et sans conditionneur identifié. L'ancienne réserve « bouteille = phase 2 »
   est requalifiée : elle porte sur la **vente en ligne uniquement**, pas sur l'existence du produit.
