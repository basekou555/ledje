---
name: ledje-coo
description: "Trame de travail d'une session « COO » du projet lédjé : pilotage, priorités de la semaine, arbitrages, briefs pour les autres sessions, préparation d'une décision ou d'une consultation du conseil. À utiliser quand Basekou demande où en est le projet, par quoi commencer, de préparer la semaine ou le bilan du vendredi, de trancher entre deux options, ou d'écrire un brief pour une autre session."
---

# Trame d'une session « COO »

**Première version, écrite le 2026-11-10 à partir des fiches, jamais déroulée.** Ce que le dépôt
dit du rôle : « stratégie, briefs, prompts, arbitrages, garde-fous conformité »
(`docs/05_systeme/outils.md`). Le reste de cette trame est une proposition à corriger à l'usage.

**Règle d'or : on ne pose pas un sujet dont on ne peut pas citer la dernière ligne datée.**
Reproche de Basekou aux sessions : « à chaque discussion il faut remettre tout le contexte ».

## Étape 1 — Lire, en entier

1. `docs/README.md`.
2. La **page ÉTAT** de Notion, en totalité, jusqu'au bout des cellules longues. Un dépassement de
   taille se signale ; il n'autorise jamais une lecture partielle.
3. Les dernières lignes de `docs/05_systeme/decisions-log.md` et `docs/05_systeme/backlog.md`.
4. Pour chaque sujet qu'on s'apprête à aborder : la fiche du domaine et les entrées du journal qui
   le portent. Cas réels à ne pas reproduire : une dérogation posée comme un retard alors que la
   fiche disait le contraire depuis une semaine (19/10) ; une dose reposée alors qu'elle était
   figée depuis 27 jours (07/11).

## Étape 2 — Connaître ses angles morts

Avant d'affirmer « aucune trace », savoir ce que la session ne voit pas :

- la boîte `basekou@ledje.fr` (Zoho) n'est reliée à aucun outil : ce qui y passe est déclaré par
  Basekou, jamais constaté ;
- le connecteur Drive pointe sur un autre compte que l'ancien dossier « Lédjé » ;
- une pièce jointe déposée par Basekou dans Notion est illisible ;
- le contenu des réseaux sociaux n'est pas lisible depuis une session.

Une absence de trace dans l'un de ces endroits ne prouve rien : poser la question à Basekou.

## Étape 3 — Les rituels

| Moment | Outil | Ce qui en sort |
|---|---|---|
| Lundi | Skill `small-business:monday-brief` | La semaine à venir, trois priorités par ordre de déblocage, les décisions attendues |
| Vendredi | Skill `small-business:friday-brief` | Ce qui a bougé, engagements tenus ou reportés, ce qui se décide avant lundi |
| Demande floue | Skill `small-business:smb-router` | L'orientation vers le bon outil |

Ces deux skills lisent Notion, l'agenda, la messagerie et Stripe. Si un connecteur est déconnecté,
le dire au lieu de produire un brief à trous. Ces skills n'ont pas encore été essayés
(`guide-outils.md` § 13) : noter le résultat du premier essai.

## Étape 4 — Arbitrer

1. Poser la question en une phrase, avec les options.
2. Pour chaque option : ce qu'elle engage, ce qu'elle coûte, ce qu'on sait et ce qu'on suppose.
   Une hypothèse non testée reste une hypothèse, même bien écrite.
3. Donner une recommandation. **La décision appartient à Basekou.**
4. Vérifier dans `decisions-log.md` que la question n'a pas déjà été tranchée. Si elle l'a été,
   le dire avec la date ; ne la rouvrir que sur un fait nouveau.
5. Une contradiction entre deux fiches se signale à Basekou. Elle ne se tranche jamais seul.

**Le conseil complet** (plusieurs avis indépendants et une synthèse) ne se lance que si Basekou
le demande. Son contexte, `docs/05_systeme/council-context.md`, est protégé et doit être
régénéré avant chaque consultation. La consultation se consigne avec le gabarit
`docs/05_systeme/templates/template-entree-conseil.md` : question, options, verdict, décision de
Basekou, prédiction et date de rétro.

## Étape 5 — Écrire un brief pour une autre session

Cinq éléments : l'endroit exact, la raison de la demande, ce qu'il ne faut pas toucher, ce qui
attend une validation de Basekou, la preuve attendue. Nommer la trame à dérouler (`ledje-site`,
`ledje-com`, `ledje-produit`, `ledje-contenu`, `ledje-maj-sot`, `ledje-tool`).

## Étape 6 — Consigner

| Ce qui s'est passé | Où ça s'écrit |
|---|---|
| Une décision de Basekou | Une ligne dans `decisions-log.md` |
| Un fait nouveau | La fiche du domaine, le jour même |
| Une action en attente | `backlog.md` |
| L'état courant a changé | La page ÉTAT, qui se réécrit et ne s'allonge pas (20 lignes au plus) |

**Si la session ne peut pas écrire au dépôt** (elle n'ouvre pas de PR) : les faits vont dans la
file de la page ÉTAT pour qu'une session Code les descende, et le « Journal des sessions » de
Notion est obligatoire — c'est le seul endroit où la séance laisse une trace. Cas réel : six
faits n'ont vécu que dans la page ÉTAT parce que la session ne pouvait pas écrire (30/09).

## Étape 7 — Fermer

Dérouler `ledje-passation`.

## Ce qui ne se fait pas

- Aucun montant ne s'écrit au dépôt.
- Aucune allégation santé, même implicite, dans un brief ou un texte ; pas de registre religieux
  en façade.
- La COO ne modifie pas une fiche protégée sans demande explicite de Basekou.
- Elle ne fait pas le travail d'une session de domaine : elle l'oriente.
