---
name: ledje-contenu
description: "Trame de travail d'une session « Système de création de contenu » du projet lédjé : la chaîne qui va des rushes aux pièces publiées sur Instagram et TikTok — indexer des rushes, écrire une recette de montage, préparer un storyboard, relire un oral, planifier les publications, améliorer les outils de tools/contenu. À utiliser quand Basekou parle de rushes, de dérushage, de montage, de CapCut, d'une recette, d'une pièce à publier ou de la cadence de publication."
---

# Trame d'une session « Système de création de contenu »

**Première version, écrite le 2026-11-10 à partir des fiches, jamais déroulée.**

**Règle d'or : une session écrit des recettes, jamais des verdicts.** `valide-production`,
`valide-publication` et `ecarte` s'écrivent sur décision de Basekou, comme les suffixes
`_VALIDE` et `_ECARTE` des fichiers.

## Étape 1 — Lire

1. `docs/README.md`, la page ÉTAT de Notion (lecture totale).
2. `docs/04_operations/chaine-contenu.md` : les sept maillons (idées, planification, écriture,
   production visuelle, montage, conformité, mesure) et les deux validations de Basekou — avant
   de produire, avant de publier.
3. `docs/04_operations/contenu-rushes.md` : le système rushes vers pièces. **Son statut est
   « hypothèse »** ; plusieurs arbitrages de Basekou restent ouverts (§ 7).
4. `docs/04_operations/contenu-drive.md` : où vivent les fichiers et comment ils se nomment.
5. `docs/03_marche/grille-contenu.md` : ce qu'on dit, à quel niveau, dans quel format.
6. `tools/contenu/README.md` et `tools/contenu/pc/README.md` avant de toucher à un outil.

## Étape 2 — Savoir ce que la session ne peut pas faire

- **Les outils et les médias sont sur le poste de Basekou.** Une session n'a ni le disque ni les
  rushes : elle écrit la recette ou le script, il lance.
- Elle ne voit pas les médias générés, n'a pas de son de synthèse, et ne lit pas le contenu des
  réseaux sociaux. Pour juger une pièce, Basekou envoie une capture ou décrit.
- Depuis le 22/10 le montage se fait dans CapCut, avec les outils de `tools/contenu/pc/`.
  CapCut doit être **fermé** avant qu'un outil écrive dans un projet.
- Le connecteur OpusClip demande un abonnement payant pour fonctionner depuis une session.

## Étape 3 — Les six étapes de la chaîne

| Étape | Qui | Avec quoi |
|---|---|---|
| 0. Sauvegarder les rushes | Basekou | Son disque et le Drive |
| 1. Dérusher et indexer | Basekou lance, la session lit l'index | `tools/contenu/derush.py` et les outils de `pc/` |
| 2. Choisir et écrire la recette | La session | Le gabarit `docs/05_systeme/templates/template-recette-piece.yaml` |
| 3. Monter | Basekou | CapCut, un projet par storyboard |
| 4. Relire | Basekou lance, la session lit le résultat | `tools/contenu/relecture.py` |
| 5. Publier et mesurer | Basekou | Les comptes de la marque |

## Étape 4 — Écrire une recette

1. Partir de **l'index**, jamais d'un souvenir de la conversation.
2. Référencer un fichier par son **identifiant Drive**, jamais par son chemin : un fichier change
   de dossier d'étape en étape.
3. Choisir le format dans la liste de `grille-contenu.md` et le niveau de message.
4. Écrire le texte à l'écran soi-même : il n'est jamais généré par une IA d'image.
5. **Tout rush marqué `oral: oui` passe par `relecture.py` avant un clip.** L'outil pointe les
   passages à vérifier ; ce n'est pas un verdict.
6. **Un rush marqué `tiers`** (une personne réelle qui n'est pas Basekou) : les fiches se
   contredisent sur l'état de cette règle. Tant que Basekou ne l'a pas confirmée, il ne sort pas.

## Étape 5 — Passer la conformité

Chaque script, légende et texte à l'écran :

- passe le skill `marketing:brand-review` et la liste `tools/contenu/lexique-interdit.txt` ;
- ne porte aucun effet sur le corps, même suggéré ;
- ne porte **aucun registre religieux** : il est exclu des réseaux ;
- respecte la règle des yeux : jamais visibles sur une image fabriquée ; Basekou filmé lui-même
  en est exclu.

## Étape 6 — Planifier

- La cadence prévue et la cadence réelle sont dans `grille-contenu.md` ; elles diffèrent
  fortement. Planifier sur le réel, pas sur la cible.
- Outils : skill `marketing:campaign-plan` pour un lancement, skills
  `social-media-skills:content-calendar` et `batch-content-plan` pour un calendrier. Ces skills
  sont génériques et non essayés : repasser leur sortie à la grille de marque.
- Le compte Instagram est `@its.ledje`. Le compte TikTok n'est pas identifié au dépôt : le
  demander avant de l'écrire.

## Étape 7 — Améliorer un outil de `tools/contenu/`

1. Lire le README du dossier et l'outil en entier avant de le modifier.
2. La session ne peut pas l'exécuter sur de vrais médias. Écrire le changement, dire comment
   Basekou le teste, et quel résultat il doit voir.
3. Les arbitrages de montage (durées, coupes, choix d'un plan) appartiennent à Basekou et
   n'entrent pas au dépôt.

## Étape 8 — Consigner et fermer

1. Ce que la séance a appris sur la méthode : dans `contenu-rushes.md`, qui reste une hypothèse
   tant que Basekou n'a pas rendu ses arbitrages.
2. Une pièce jugée par Basekou : son verdict s'écrit sur sa décision, avec sa date.
3. `docs/03_marche/acquisition-tiktok.md` n'a pas été mise à jour depuis juillet et dit encore
   le canal inactif : le signaler si la séance s'appuie dessus.
4. Dérouler `ledje-passation`.
