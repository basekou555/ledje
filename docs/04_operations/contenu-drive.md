---
statut: en_cours
domaine: operations
maj: 2026-09-11
source: "Drive « Lédjé contenu » (arborescence posée par Basekou le 2026-09-08) + test de rangement du 2026-09-11 (8 images)"
resume: "Où vivent les fichiers de contenu (photo, vidéo, IA ou tourné) : la chaîne de dossiers Drive, la convention de nommage, et pourquoi l'asset-log logue un ID Drive et jamais un chemin."
---

# Le Drive contenu — rangement et nommage

**Ici : où vit un fichier et comment il s'appelle.** Ce qu'on a appris d'une génération vit
ailleurs, dans [`../visual/ledje-asset-log.md`](../visual/ledje-asset-log.md) ; les recettes de
plans dans [`../visual/ledje-shot-book.md`](../visual/ledje-shot-book.md).

Le Drive **« Lédjé contenu »** couvre **tout le contenu de marque** — photo et vidéo, généré par
IA comme tourné au téléphone. Ce n'est pas un dossier de production visuelle IA : la production
visuelle n'en est qu'un affluent.

## La chaîne (arborescence posée le 2026-09-08)

| Dossier | Ce qu'il contient |
|---|---|
| `00_regles/` | **Uniquement des renvois, jamais de décision** (règle de Basekou, inscrite dans le dossier). La décision vit dans ce cerveau. |
| `01_plans-reels/` | Les rushes tournés / photographiés pour de vrai |
| `02_voix/` | Les prises son, voix off |
| `03_generes/` | Ce qui sort d'un générateur (ChatGPT Image, Gemini, Higgsfield…) |
| `04_montages/` | Les assemblages en cours |
| `05_publies/` | Ce qui est effectivement sorti |

**Ce sont des étapes, pas des bibliothèques.** Un fichier **se déplace** en avançant dans la
chaîne. C'est la propriété la plus importante de cette structure, et celle qui a une conséquence
directe (voir « L'ID, pas le chemin »).

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
