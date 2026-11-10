---
name: ledje-maj-sot
description: "Trame de travail d'une session « MAJ SOT » du projet lédjé : mettre à jour le cerveau (les fiches de docs/), descendre au dépôt les faits de la page ÉTAT et de sa file, trier l'inbox, purger la page ÉTAT, vérifier qu'aucun fait déclaré ne s'est perdu. À utiliser quand Basekou dit « mets à jour le SOT », « trie l'inbox », « descends la file », « fais le digest », « nettoie la page ÉTAT », ou lors de la revue de semaine."
---

# Trame d'une session « MAJ SOT »

**Première version, écrite le 2026-11-10 à partir des fiches, jamais déroulée.** Le nom « MAJ SOT »
n'est défini nulle part au dépôt : cette trame le comprend comme la séance qui tient le cerveau à
jour. À corriger si Basekou entend autre chose.

La référence est `docs/05_systeme/workflow-maj.md`. Cette trame en donne l'ordre de marche ; en
cas d'écart, la fiche gagne.

**Règle d'or : la lecture est toujours totale.** Le motif est lourd : la page relais a été gelée
à 180 000 caractères parce que plus personne ne la lisait, et sept faits s'y étaient perdus
(10/09).

## Étape 1 — Lire tout

1. `docs/README.md` et `docs/05_systeme/workflow-maj.md`.
2. La **page ÉTAT** de Notion, ligne par ligne, jusqu'au bout des cellules longues, et sa file.
3. Le « Journal des sessions » de Notion depuis la dernière mise à jour.
4. `docs/00_inbox/` : un inbox vide est l'état normal, un inbox qui gonfle est une alerte.
5. Les PR fusionnées depuis la dernière mise à jour : leur description est le relevé de séance.

L'ancienne page relais est gelée depuis le 11/09 : on la lit pour le détail, on n'y écrit plus.

## Étape 2 — Repartir d'un dépôt à jour

Repartir de `origin/main`, nouvelle branche, PR draft. Jamais de commit direct sur `main`.

**Une session qui ne peut pas pousser** (Cowork : le proxy refuse le push, et le connecteur
GitHub refuse l'écriture — deux verrous distincts) dépose dans la file de la page ÉTAT. Elle ne
prétend pas avoir mis à jour le dépôt.

## Étape 3 — Descendre les faits

Pour chaque fait trouvé à l'étape 1 qui n'est pas encore dans une fiche :

1. **Le test d'entrée** : est-ce que ça change l'état ? Si non, ça n'entre pas.
2. Trouver la fiche du domaine par les `resume` des index. Lire la fiche avant de la modifier.
3. **Modification chirurgicale** : on ajoute ou on corrige un passage, on ne réécrit jamais une
   fiche entière.
4. Mettre à jour `maj` et `statut` dans l'en-tête. Le `resume` dit le périmètre de la fiche,
   jamais ses conclusions.
5. Séparer ce qui est constaté de ce qui est déclaré par Basekou.
6. Un commit par fiche, message clair.

| Le fait est… | Il va… |
|---|---|
| Une décision | Dans `decisions-log.md` : une ligne ajoutée, jamais de réécriture |
| Une action à faire | Dans `backlog.md` |
| Non triable à chaud | Dans `docs/00_inbox/AAAA-MM-JJ-sujet.md`, avec la raison |
| Contradictoire avec une fiche | Signalé à Basekou ; ne pas trancher |

## Étape 4 — Respecter les zones

| Zone | Fichiers | Règle |
|---|---|---|
| Protégée | `conformite.md`, `workflow-maj.md`, `council-context.md`, `visual/ledje-master-prompt.md`, `visual/ledje-visual-language.md` | Seulement sur demande explicite de Basekou ; jamais suggéré |
| Intermédiaire | `docs/02_produit/` | Proposer dans la réponse, appliquer après son accord |
| ADN | `docs/01_adn/` sauf `conformite.md` | Modifiable : branche, PR, ligne au journal |
| Libre | `00_inbox/`, `03_marche/`, `04_operations/`, `backlog.md`, index, prompt-library, asset-log, gabarits | Mettre à jour et le signaler |

Fiche créée, renommée ou supprimée : le `README.md` du dossier se met à jour dans le même commit.

## Étape 5 — Trier l'inbox

Chaque capture est dispatchée vers ses fiches, puis supprimée. Une capture non triable reste,
avec la raison notée dedans.

## Étape 6 — Nettoyer la page ÉTAT

- **20 lignes est le plafond dur** : une 21ᵉ ligne exige d'en fermer une.
- **12 000 caractères déclenche un nettoyage**, pas une lecture partielle.
- Une phrase y reste si elle répond à « où ça en est maintenant ». Le passé va au journal, une
  consigne générale va dans `workflow-maj.md`.
- La page se réécrit, elle ne s'allonge pas. Aucun bloc de clôture de séance.
- Ne pas raisonner sur la taille de la page d'un passage à l'autre : deux passages ne comptent
  pas de la même façon (leçon du 21/10).
- Vider la file : c'est la session qui écrit au dépôt qui la vide, pas la routine qui la lit.

## Étape 7 — Interroger ce qui dort

Relever les attentes sans nouvelle (un devis demandé, une réponse attendue, un test à relire) et
les poser à Basekou, pour qu'un oubli ne se referme pas en silence. Ne pas transformer une date
en échéance, ni redemander ce qui est déjà tranché (erreurs des 08/10 et 13/10).

## Étape 8 — Prouver et fermer

1. La description de la PR est le relevé : ce qui a été fait, ce qui a été tranché, ce qui est
   reporté et pourquoi, les leçons.
2. Si une fiche modifiée fait partie de la copie Project Knowledge : terminer par le rappel
   « à resynchroniser dans Project Knowledge ».
3. Dire ce qui n'a pas pu être vérifié (boîte Zoho, ancien Drive, pièces jointes Notion).
4. Dérouler `ledje-passation`.

## Ce qui ne se fait pas

- Aucun montant ne s'écrit au dépôt.
- Zéro invention : un trou reste balisé « à compléter ».
- On ne fusionne pas une PR à la place de Basekou.
- Les règles R0 à R7 de `workflow-maj.md` sont, depuis le 07/11, des hypothèses de méthode en
  test ; les règles critiques (conformité, fiches protégées, montants) ne le sont pas.
