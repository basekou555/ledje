---
statut: en_cours
domaine: operations
maj: 2026-09-11
source: "Drive « Lédjé contenu » (arborescence posée par Basekou le 2026-09-08) + test de rangement du 2026-09-11 (8 images)"
resume: "Où vivent les fichiers de contenu (photo, vidéo, IA ou tourné) : la chaîne de dossiers Drive, la convention de nommage, et pourquoi l'asset-log logue un ID Drive et jamais un chemin."
---

# Le Drive contenu — rangement et nommage

**Ici : où vit un fichier et comment il s'appelle.** Comment le travail circule — les 7 maillons,
les 2 points de validation, l'outillage : [`chaine-contenu.md`](chaine-contenu.md). Ce qu'on a
appris d'une génération : [`../visual/ledje-asset-log.md`](../visual/ledje-asset-log.md). Les
recettes de plans : [`../visual/ledje-shot-book.md`](../visual/ledje-shot-book.md).

Le Drive **« Lédjé contenu »** couvre **tout le contenu de marque** — photo et vidéo, généré par
IA comme tourné au téléphone. Ce n'est pas un dossier de production visuelle IA : la production
visuelle n'en est qu'un affluent. Il vit sur le **compte pro**, basculé le 2026-09-08 pour que les
vidéos aient de la place.

📌 **Ces dossiers ne sont pas un rangement, ce sont des points de passage de relais.** La chaîne a
été dessinée en entier avant d'être outillée, pour savoir **où les agents se passeraient la main** ;
l'arborescence en est la trace. C'est ce qui explique qu'elle épouse les étapes du travail et non
les types de fichiers.

## La chaîne (arborescence posée le 2026-09-08)

| Dossier | Ce qu'il contient |
|---|---|
| `00_regles/` | **Uniquement des renvois, jamais de décision** (règle de Basekou, inscrite dans le dossier). La décision vit dans ce cerveau. |
| `01_plans-reels/` | Les rushes tournés / photographiés pour de vrai |
| `02_voix/` | Les prises son, voix off |
| `03_generes/` | Ce qui sort d'un générateur (ChatGPT Image, Gemini, Higgsfield…) — contient `shot book/`, voir ci-dessous |
| `04_montages/` | Les assemblages en cours |
| `05_publies/` | Ce qui est effectivement sorti |

**Ce sont des étapes, pas des bibliothèques.** Un fichier **se déplace** en avançant dans la
chaîne. C'est la propriété la plus importante de cette structure, et celle qui a une conséquence
directe (voir « L'ID, pas le chemin »).

### 🔒 Deux entrées sont gardées

Les deux points de validation de Basekou (cf. [`chaine-contenu.md`](chaine-contenu.md)) tombent
exactement sur deux dossiers :

- **Rien n'entre dans `03_generes/` sans la validation « avant qu'on produise ».**
- **Rien n'entre dans `05_publies/` sans la validation « avant qu'on publie ».**

C'est ce qui empêche un dossier d'étape de devenir un simple entonnoir : deux de ses portes ne
s'ouvrent que sur décision de Basekou.

## `03_generes/shot book/` — le territoire de la production visuelle

**Décision de Basekou, 2026-09-11** : *« je ne suis pas convaincu du mélange des deux processus, donc par sécurité on va séparer. »* La production visuelle (ce cerveau, le shot-book, les recettes) reçoit **son propre dossier**, où elle s'organise comme elle veut. **L'autre processus — la chaîne de contenu — vient y piocher ce qui l'intéresse ; il n'y dépose rien.** Le flux est à sens unique.

➡️ **Ce que ça protège** : deux logiques de rangement incompatibles cohabitaient sans le dire. Celle de la chaîne suit **l'avancement** (généré → monté → publié) ; celle du shot-book suit **l'intention de communication**, qui ne bouge jamais. Les mélanger aurait forcé l'une à adopter le vocabulaire de l'autre.

### L'arborescence interne

Elle **copie le shot-book** — six intentions, mêmes noms, même ordre — pour qu'on retrouve une image en pensant comme on pense en le lisant.

| Dossier | Contenu |
|---|---|
| `00_matiere/` | La matière première : détourages, éléments à réemployer |
| `01_attirer/` · `02_expliquer/` · `03_prouver/` · `04_projeter/` · `05_inviter/` · `06_conclure/` | Les plans, **classés par intention** |
| `09_explorations/` | Ce qui n'est pas un plan du book : essais de décor, planches de marque, pistes écartées |
| `zz_doublons-a-supprimer/` | Sas de suppression — jamais un lieu de stockage |

### Le nommage ici : **l'ID d'abord**

```
ATT-05_reposee-sechement_v2-chatgpt_2026-09-11.png
└─ID─┘ └──── nom du plan ────┘ └─variante─┘ └─date─┘
```

- **L'ID de shot en tête** : il trie tout seul, et il relie le fichier à sa fiche du shot-book **et** à sa ligne d'asset-log sans aucun index intermédiaire.
- **La variante** quand un plan a plusieurs versions — `v1-gemini`, `v2-chatgpt` : l'outil est une donnée utile ici, deux outils ne rendent pas le même plan pareil.
- **Un plan sans ID** prend l'ID **le plus proche** du book, jamais un ID inventé.

### Les mentions en capitales

Elles sont **factuelles, pas des verdicts** — elles décrivent le fichier, elles ne le jugent pas :

| Mention | Ce qu'elle dit |
|---|---|
| `_COPIE-BASSE-DEF` | C'est une copie recompressée ; **l'original n'est pas au Drive**. À remplacer dès qu'il est déposé. |
| `_DONNEES-INVENTEES-NE-PAS-DIFFUSER` | L'image affiche des données que l'IA a fabriquées (valeurs nutritionnelles, dimensions, code-barres). |
| `_NE-PAS-PUBLIER` | L'image porte un problème de conformité identifié. |

⚠️ **À ne pas confondre avec `_VALIDE` / `_ECARTE`**, qui restent réservés à un verdict de Basekou.

### Le trajet Higgsfield → Drive est manuel

L'environnement de Claude Code **ne peut pas télécharger les médias Higgsfield** (le CDN est bloqué)
ni voir les images qu'il génère. **C'est Basekou qui dépose les fichiers au Drive**, et lui seul qui
juge les plans. ➡️ Un fichier absent du Drive n'est pas un fichier perdu : il n'a simplement pas
encore été déposé.

## La convention de nommage

```
descriptif-en-kebab-case-AAAA-MM-JJ_SUFFIXE.ext
```

Modèle d'origine : `00_regles/pilote-contenu-3-pieces-2026-09-08_TEST.md`.

- **descriptif** : ce que montre le fichier, pas l'outil qui l'a produit. Un nom doit rester
  lisible quand on ne se souvient plus de la séance.
- **date** : celle de la création du fichier.
- **SUFFIXE** : l'état de validation.

| Suffixe | Sens |
|---|---|
| `_TEST` | Un essai. Pas de verdict, ou verdict en attente. |
| `_ASSET` | Une matière première réutilisable — pas une image finie, un ingrédient (ex. la bouteille détourée sur fond transparent). |
| `_VALIDE` | Jugé bon par Basekou. |
| `_ECARTE` | Jugé mauvais par Basekou. **Reste sur place**, ne part pas dans un dossier de rebut. |

⚠️ **Un suffixe de verdict ne s'écrit que sur un verdict de Basekou.** Une opinion de l'IA n'en
est pas un : écrire `_ECARTE` de sa propre initiative, c'est transformer un avis en décision. Sans
verdict, le fichier reste `_TEST`.

📌 **`_TEST` est aujourd'hui le régime de TOUTE la chaîne**, pas seulement l'étiquette d'un fichier
isolé : **rien n'est publié**. Ce qui en fera sortir, ce sont les vrais plans de la bouteille
(miel retiré le 13/09, étiquettes imprimées). Cf. [`chaine-contenu.md`](chaine-contenu.md).

### Où s'arrête ce suffixe — la frontière avec Notion

**Notion porte les statuts et les validations**, le Drive porte les fichiers. Les deux ne se
marchent pas dessus parce qu'ils ne parlent pas de la même chose :

- **Notion suit une PIÈCE** — un post, une vidéo — le long de la chaîne : brief → écrit → produit →
  monté → validé → publié.
- **Le suffixe juge un FICHIER** — un plan parmi quatorze, une variante parmi six.

➡️ Un verdict de plan (« celle-ci est déformée ») **ne remonte jamais dans Notion** ; un statut de
pièce **ne descend jamais dans un nom de fichier**. En cas de doute : si l'information intéresse
quelqu'un qui ne regarde pas les fichiers, elle est dans Notion.

**Pourquoi l'écarté reste dans son dossier** : un raté n'a de valeur que **comparé à ses voisins
réussis du même lot**. Le sortir du dossier fait perdre la leçon — et évite un `99_ecartes/` de
plus à maintenir.

## L'ID, pas le chemin

Les dossiers étant des **étapes**, un fichier change de dossier au cours de sa vie. Un chemin noté
dans une fiche casse donc au premier déplacement.

➡️ **Toute référence à un fichier du Drive se fait par son ID Drive**, jamais par son chemin.
L'ID survit au renommage **et** au déplacement — vérifié le 2026-09-11 : les 8 images du test ont
changé de nom et de dossier, leurs IDs sont inchangés.

C'est ce qui ferme un trou réel de la boucle d'apprentissage : `ledje-asset-log.md` enregistrait
des verdicts mais **perdait les images**. La colonne *Asset ID* y accueille désormais l'ID Drive.

## Ce que ce Drive n'est pas

- **`public/visuals/` (le repo) n'est pas une étape de cette chaîne.** C'est l'aval du site : il ne
  reçoit que les images **élues**, sous les noms fixes que le code attend. Il pioche dans le Drive,
  il ne le remplace pas (cf. [`../../public/visuals/README.md`](../../public/visuals/README.md)).
- **`00_regles/` n'est pas un lieu de décision** — c'est la règle de Basekou. Une convention y est
  *renvoyée*, elle n'y est pas *posée*. La présente fiche est la source ; le Drive n'en porte que
  le pointeur.

## Question ouverte

Le shot-book ne couvre aujourd'hui que des plans destinés à la génération. Faut-il que **les plans
réels** (`01_plans-reels/`) reçoivent eux aussi des IDs de shot, ou le shot-book reste-t-il l'outil
de la seule production générée ? — arbitrage de Basekou, non tranché.
