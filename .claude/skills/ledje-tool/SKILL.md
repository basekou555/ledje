---
name: ledje-tool
description: "Trame de travail d'une session « lédjé tool » : mettre en place, essayer, régler ou retirer un outil (plugin, skill, connecteur, tâche planifiée), écrire ou corriger une trame de session, et former Basekou à son usage de Claude. À utiliser quand Basekou parle d'installer ou de tester un outil, de couper un plugin, d'un connecteur qui ne marche pas, de « comment faire pour que les sessions… », ou demande pourquoi Claude a mal travaillé."
---

# Trame d'une session « lédjé tool »

Déroulée pour la première fois le 2026-11-10 (tri des plugins, guide des outils, trames de
session). Les fiches de référence : `docs/05_systeme/outils.md` (qui fait quoi, limites datées)
et `docs/05_systeme/guide-outils.md` (quel outil pour quelle tâche).

**Règle d'or : un outil non essayé se dit non essayé.** Cette session écrit ce que les autres
sessions croiront. Une supposition écrite ici devient une certitude ailleurs.

## Étape 1 — Lire

1. `docs/README.md`, puis `docs/05_systeme/outils.md` et `docs/05_systeme/guide-outils.md`.
2. La liste des skills, connecteurs et serveurs en échec affichée au démarrage de la session :
   c'est l'état réel, il prime sur les fiches.
3. `docs/05_systeme/decisions-log.md` pour l'outil concerné (un outil déjà écarté ne se
   repropose pas sans fait nouveau).

## Étape 2 — Savoir où se règle chaque chose

Une session ne peut pas tout régler. Avant de promettre, situer la demande :

| Ce qu'on veut changer | Où ça se règle | Qui le fait |
|---|---|---|
| Un plugin (activer, couper, retirer) | Application Claude : Customize, puis Plugins | Basekou |
| Un connecteur (autoriser, reconnecter) | Application ou claude.ai : Connectors | Basekou |
| Un skill du dépôt (`.claude/skills/`) | Une PR | La session |
| Une consigne lue par toutes les sessions | `CLAUDE.md`, par une PR | La session, Basekou relit |
| Une règle du process | `docs/05_systeme/workflow-maj.md` — fiche protégée | La session, sur demande explicite |
| Le réseau de l'environnement cloud, ses variables | Réglages de l'environnement | Basekou approuve |
| Une tâche planifiée | Outils de planification de la session | La session, sur demande |

Trois skills vivent au dépôt et non dans l'application : `landing-page-design`,
`ui-ux-pro-max`, `find-skills`. Ils ne se coupent pas dans les réglages.

**Ne pas répondre de mémoire sur le fonctionnement de Claude** : les réglages changent plus vite
que ce qu'une session en sait. Chercher dans la documentation officielle, citer la page, et dire
ce qui n'est pas documenté.

## Étape 3 — Essayer avant d'écrire

Pour un outil nouveau ou jamais essayé :

1. L'essayer sur **un cas réel de lédjé**, pas sur un exemple inventé.
2. Noter : ce qu'il produit, ce qu'il ignore de la marque, ce qu'il coûte (argent, crédits,
   temps), ce qu'il exige (compte, cookies, abonnement, accès réseau).
3. S'il échoue, chercher la cause réelle avant de conclure. Le réseau des sessions cloud
   fonctionne en liste blanche : un refus peut venir de l'environnement et non de l'outil
   (cas d'Agent Reach, `outils.md`).
4. Ne jamais installer en laissant un agent exécuter un fichier distant sans l'avoir lu.
5. Ne jamais brancher un outil sur les comptes de la marque (TikTok, Instagram) par leurs
   cookies sans l'accord de Basekou : un compte récent se suspend facilement.

## Étape 4 — Écrire au bon endroit

| Ce qu'on a appris | Où ça s'écrit |
|---|---|
| Un outil existe, marche, ne marche pas, a une limite | `outils.md`, avec la date de vérification |
| Quel outil pour quelle tâche, dans quel ordre | `guide-outils.md`, et son tableau « réellement essayé » |
| La procédure complète d'un type de session | Un skill `ledje-…` dans `.claude/skills/` |
| Une consigne que toute session doit lire | Une ligne de `CLAUDE.md` qui renvoie à la fiche ou au skill |
| Une décision de Basekou | Une ligne dans `decisions-log.md` |

`CLAUDE.md` reste un routeur : une ligne et un renvoi, pas la procédure. Le détail va dans un
skill, qui ne se charge en entier que lorsqu'on l'appelle.

## Étape 5 — Écrire ou corriger une trame de session

1. Partir d'une séance réellement déroulée, ou des fiches du domaine. Jamais de l'imagination.
2. Chaque étape nomme l'outil exact, dit pourquoi, et dit quoi faire s'il manque.
3. Lister les décisions qui ne se rediscutent pas, avec leur date.
4. Finir par la preuve attendue et par le renvoi à `ledje-passation`.
5. Marquer dans `guide-outils.md` § 11 bis si la trame a été déroulée ou seulement écrite.
6. Quand une session signale qu'une trame l'a mal guidée, corriger la trame, pas seulement le
   résultat.

## Étape 6 — Former Basekou

Partir d'un cas réel qui s'est mal passé, pas d'un cours. Pour chaque point : ce qui s'est passé,
pourquoi, ce qu'il peut écrire la prochaine fois. Phrases courtes, pas de jargon ; un terme
technique s'explique à sa première apparition.

Ce qui améliore le plus une demande : l'endroit exact, la raison de la demande, ce qu'il ne faut
pas toucher, ce qui attend une validation, la preuve attendue.

## Étape 7 — Prouver et fermer

1. Un réglage fait par Basekou dans l'application ne se voit que dans une **nouvelle** session :
   le dire, et lui dire quoi y vérifier.
2. Une consigne ajoutée à `CLAUDE.md` n'existe qu'après la fusion de la PR, et seulement pour
   les sessions ouvertes ensuite.
3. Dérouler `ledje-passation`.

## Ce que cette session ne fait pas

- Elle ne corrige pas le site, n'écrit pas de contenu, ne touche pas au produit : elle écrit le
  brief ou la trame, et une session du domaine fait le travail.
- Elle ne fusionne pas une PR à la place de Basekou.
- Elle ne recommande pas un outil sur sa popularité ni sur sa description.
