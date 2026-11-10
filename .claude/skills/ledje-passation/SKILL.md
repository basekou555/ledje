---
name: ledje-passation
description: "Vérification à faire AVANT de changer de session sur le projet lédjé : s'assurer que tout ce qui a été appris, décidé ou commencé est transmis à la session suivante. À utiliser quand Basekou dit qu'il passe à une autre session, qu'il ferme celle-ci, qu'il va continuer ailleurs, ou demande « est-ce que tout est transmis », « fais la passation », « on clôture »."
---

# Passation — vérifier que tout est transmis avant de changer de session

**Pourquoi** : une session ne sait rien de ce qu'une autre a fait. Elle ne lit que trois choses :
la branche `main` du dépôt, la page ÉTAT de Notion, et le message que Basekou lui écrit. Tout ce
qui n'est dans aucune des trois est perdu. Règle posée par Basekou le 2026-11-10
(`docs/05_systeme/workflow-maj.md`, Clôture).

**Le test** : une session qui démarre demain, sans cette conversation, peut-elle reprendre le
travail sans que Basekou réexplique ? Si la réponse est non, la passation n'est pas finie.

## Les six vérifications

Pour chacune, répondre par **fait**, **pas fait** ou **sans objet**, avec la preuve.

1. **Les faits.** Chaque information nouvelle apprise en séance est écrite dans la fiche concernée
   (`maj` à jour), ou dans `docs/00_inbox/` si elle n'est pas triable à chaud.
   *Preuve : le nom de la fiche.*
2. **Les décisions.** Chaque décision de Basekou a sa ligne dans `decisions-log.md`.
   *Preuve : la ligne.*
3. **Le travail est sur le dépôt.** Tout est commité et poussé ; `git status` est propre et la
   branche n'a pas de commit local en avance. *Preuve : la sortie de la commande.*
4. **L'état de la PR est dit sans ambiguïté.** Ouverte, en draft, fusionnée ou non.
   ⚠️ **Une PR non fusionnée n'existe pas pour la session suivante** : elle part de `main`. Si le
   travail suivant dépend de cette PR, le dire en tête du message de passation.
   *Preuve : vérifier sur `origin/main` que le fichier y est, ne pas le supposer.*
5. **Ce qui reste.** La liste de ce qui est commencé et pas fini, avec où ça s'arrête ; les gestes
   qui restent chez Basekou (fusionner, tester, répondre, désactiver un réglage) ; les questions
   posées restées sans réponse.
6. **Ce qui n'est PAS transmis.** Le dire explicitement : ce qui n'a été vu qu'à l'écran, ce qui
   vit dans un dossier temporaire de la session, ce qui n'a pas été vérifié.

Si la séance n'ouvre pas de PR, ou si l'état courant du projet a changé, la page ÉTAT de Notion se
met à jour selon ses règles (`workflow-maj.md` : 20 lignes, elle se réécrit, elle ne s'allonge pas).

## Le message de passation

Terminer par un bloc que Basekou peut coller tel quel dans la session suivante. Il doit se
comprendre sans cette conversation :

```text
Reprise du travail de la session « <nom> » du <date>.

État du dépôt : <PR n° … fusionnée / PR n° … en draft, NON fusionnée — son contenu
n'est pas sur main>.

Ce qui est fait : <2 à 4 lignes, avec les fichiers>.
Ce qui reste : <liste, avec où ça s'arrête>.
Ce qui attend Basekou : <liste>.
À lire avant de commencer : <fiches ou skills>.
Ce qui n'a pas été vérifié : <liste>.
```

## Ce qu'on ne fait pas

- On ne dit pas « tout est transmis » sans avoir déroulé les six points.
- On ne fusionne pas une PR à la place de Basekou pour que la passation « passe ».
- On ne recopie pas la conversation : la passation porte l'état, pas l'histoire.
