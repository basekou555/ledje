---
name: ledje-passation
description: "Vérification à faire AVANT de changer de session sur le projet lédjé : s'assurer que tout ce qui a été appris, décidé ou commencé est transmis à la session suivante. À utiliser quand Basekou dit qu'il passe à une autre session, qu'il ferme celle-ci, qu'il va continuer ailleurs, ou demande « est-ce que tout est transmis », « fais la passation », « on clôture ». Vaut pour toute session : Claude Code, COO, Com, Cowork, Claude.ai."
---

# Passation — vérifier que tout est transmis avant de changer de session

**Pourquoi** : une session ne sait rien de ce qu'une autre a fait. Elle ne lit que ce qui est
écrit : la branche `main` du dépôt, la page ÉTAT de Notion, et le message que Basekou lui écrit.
Une session ouverte dans le projet Claude.ai ou Cowork voit en plus les documents du projet, mais
c'est une copie qui peut dater : elle ne remplace pas le dépôt. Tout ce qui n'est écrit dans
aucun de ces endroits est perdu. Règle posée par Basekou le 2026-11-10
(`docs/05_systeme/workflow-maj.md`, Clôture).

**Le test** : une session qui démarre demain, sans cette conversation, peut-elle reprendre le
travail sans que Basekou réexplique ? Si la réponse est non, la passation n'est pas finie.

*Version du 2026-11-16, corrigée deux fois d'après les retours de sessions qui l'ont déroulée :
échéances et repères ajoutés au message, variante pour les sessions sans accès au dépôt, comptage
de la file, questions séparées des gestes, état de la file dit en tête, puis une section à part
dans la page ÉTAT pour les passations (décision de Basekou du 17/11).*

## D'abord : cette session écrit-elle au dépôt ?

- **Oui** (session Claude Code qui pousse et ouvre une PR) : dérouler la **variante A**.
- **Non** (COO, Com, Cowork, Claude.ai — pas de push possible) : dérouler la **variante B**.
  Ne pas répondre « pas fait » ou « sans objet » aux points de la variante A : ils ne s'appliquent
  pas, la preuve est ailleurs.

Pour chaque point, répondre **fait**, **pas fait** ou **sans objet**, avec la preuve.

## Variante A — la session écrit au dépôt

1. **Les faits.** Chaque information nouvelle est écrite dans la fiche concernée (`maj` à jour),
   ou dans `docs/00_inbox/` si elle n'est pas triable à chaud. *Preuve : le nom de la fiche.*
2. **Les décisions.** Chaque décision de Basekou a sa ligne dans `decisions-log.md`.
   *Preuve : la ligne.*
3. **Le travail est sur le dépôt.** Tout est commité et poussé ; `git status` est propre.
   *Preuve : la sortie de la commande.*
4. **L'état de la PR est dit sans ambiguïté.** Ouverte, en draft, fusionnée ou non.
   ⚠️ **Une PR non fusionnée n'existe pas pour la session suivante** : elle part de `main`.
   *Preuve : vérifier sur `origin/main` que le fichier y est, ne pas le supposer.*
5. **La file et les passations en attente, dans la page ÉTAT.** Seule une séance qui écrit au
   dépôt peut les vider : elle descend chaque ligne de la file et chaque bloc de la section
   « Passations à descendre » dans sa fiche, puis les supprime. Avant de fermer, compter les
   deux. S'il reste quelque chose, le vider, ou dire dans le message de passation que ça ne l'a
   pas été. Une file pleine, ou deux passations en attente, bloquent toutes les sessions qui
   n'écrivent pas au dépôt.
   *Preuve : le nombre de lignes et de blocs, avant et après.*

## Variante B — la session n'écrit pas au dépôt

1. **Les faits et les décisions de la passation s'écrivent en UN bloc daté, dans la section
   « Passations à descendre » de la page ÉTAT** (juste sous la file), pour qu'une séance Claude
   Code les descende dans les fiches. Une seule écriture, à un endroit que toute session lit.
   **Pas dans la file** : elle est plafonnée à dix lignes et sert aux faits isolés déposés en
   cours de séance. Une passation de huit faits l'a fait déborder le 16/11.
   ⚠️ **Avant d'écrire : compter les passations déjà en attente. Le plafond est de DEUX.** S'il y
   en a déjà deux, ne pas en ajouter une troisième : le dire à Basekou, et l'écrire en première
   ligne du message de passation. La première chose à faire est alors d'ouvrir une séance Code.
   **Le bloc reste court : un fait ou une décision par ligne, avec son niveau.** Le détail (le
   contexte, les raisons, ce qui a été essayé) va dans le relevé du Journal des sessions, au
   point 2, et le bloc y renvoie par un lien. La page ÉTAT ne doit pas regonfler.
   *Preuve : le nombre de blocs avant et après, et le bloc ajouté.*
2. **Le relevé est au « Journal des sessions »** de Notion : c'est le seul endroit où une séance
   sans PR laisse une trace. *Preuve : le lien de l'entrée.*
3. **Les pages Notion modifiées sont listées**, avec ce qui y a changé. *Preuve : les liens.*
4. **La page ÉTAT est à jour** si l'état courant du projet a changé (20 lignes au plus, elle se
   réécrit, elle ne s'allonge pas).

## Points communs aux deux variantes

6. **Ce qui expire, et quand.** Toute échéance connue de la session : une date butoir, une
   facture échue, un délai de recours, une livraison attendue. Avec la date. C'est ce qu'une
   session neuve découvre trop tard si on ne le met pas en tête.
7. **Ce qui reste**, séparé en trois :
   - **les questions à Basekou** dont la réponse bloque la suite (« les bouteilles sont-elles
     arrivées ? ») — elles viennent en premier, la session suivante en a besoin dès la première
     minute ;
   - **les gestes de Basekou** (fusionner, répondre à quelqu'un, signer, refaire un réglage) ;
   - **le travail commencé et pas fini**, avec l'endroit où il s'arrête.
8. **Où ça vit.** Les trois ou quatre liens dont la session suivante aura besoin : pages et bases
   Notion, dossier Drive, PR, fiche. Sans eux elle perd son début à chercher.
9. **Les pièges déjà rencontrés.** La passation porte l'état, pas l'histoire : on ne raconte pas
   les erreurs. Mais on donne **une ligne de renvoi** vers l'endroit où elles sont écrites
   (la fiche, la ligne du journal), pour que la session suivante n'y retombe pas.
10. **Ce qui n'est PAS transmis.** Ce qui n'a été vu qu'à l'écran, ce qui vit dans un dossier
   temporaire, ce qui n'a pas été vérifié.

## Le message de passation

Terminer par un bloc que Basekou peut coller tel quel dans la session suivante. Il doit se
comprendre sans cette conversation. L'ordre compte : ce qui presse et ce qui bloque d'abord.

```text
Reprise du travail de la session « <nom> » du <date>.

Page ÉTAT : file à <n> lignes sur 10 · <n> passation(s) en attente sur 2.
<Si la file est pleine ou si deux passations attendent : PREMIÈRE CHOSE À FAIRE, les faire
descendre par une séance Claude Code. Tant que c'est plein, personne d'autre ne peut déposer.>

Ce qui expire, et quand : <échéance — date> ; <échéance — date>. (ou : rien)

Questions à Basekou avant de commencer : <ce dont la réponse bloque la suite>.

État du dépôt : <PR n° … fusionnée / PR n° … NON fusionnée, son contenu n'est pas
sur main / séance sans PR : déposé dans la file et au Journal des sessions>.

Ce qui est fait : <2 à 4 lignes, avec les fichiers ou les pages>.
Ce qui reste à faire : <liste, avec où ça s'arrête>.
Gestes qui attendent Basekou : <liste>.

Où ça vit : <3 ou 4 liens — pages Notion, Drive, PR, fiches>.
À lire avant de commencer : <fiches ou trames>.
Pièges déjà rencontrés : voir <fiche ou ligne du journal>.
Ce qui n'a pas été vérifié : <liste>.
```

## Ce qu'on ne fait pas

- On ne dit pas « tout est transmis » sans avoir déroulé les points de sa variante.
- On ne fusionne pas une PR de sa propre initiative pour que la passation « passe » ; on le fait
  si Basekou le demande.
- On n'écrit pas dans la file sans l'avoir relue et comptée, et on n'y dépose pas une passation.
- On ne recopie pas la conversation : la passation porte l'état, pas l'histoire.

## Si la session ne charge pas cette trame toute seule

Seules les sessions Claude Code chargent les trames du dépôt d'elles-mêmes. Une session COO,
Cowork ou Claude.ai doit **lire ce fichier dans le dépôt** :
`.claude/skills/ledje-passation/SKILL.md`. Pour qu'elle y pense, la consigne doit figurer dans
les instructions du projet côté Claude.ai et Cowork — c'est un réglage de Basekou, hors dépôt.
