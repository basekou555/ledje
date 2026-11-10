---
statut: en_cours
domaine: systeme
maj: 2026-11-10
source: "Session « Lédjé Tool » du 2026-11-10, sur demande de Basekou : « je veux qu'une session comprenne d'elle-même quel outil doit être utilisé, pourquoi et comment »"
resume: "Le mode d'emploi des outils par type de tâche : pour chaque demande courante (site, texte, réseaux, visuel, vente, argent, fournisseurs, clients, pilotage), quel skill ou connecteur utiliser, pourquoi, dans quel ordre, et ce qui prouve que c'est fait. Complète `outils.md`, qui dit QUI fait quoi ; ici on dit COMMENT. Seuls quelques outils ont été essayés le 10/11 — le tableau de fin dit lesquels."
---

# Guide des outils — quoi utiliser, pourquoi, comment

**À qui s'adresse cette fiche** : à toute session Claude qui reçoit une demande de Basekou.
[`outils.md`](outils.md) dit qui fait quoi (Claude.ai, Code, Cowork, Higgsfield…). Cette fiche
dit comment s'y prendre une fois la tâche reçue.

**Pourquoi elle existe** : les outils sont installés, mais rien ne reliait une demande à l'outil
qui la traite. Une session à qui l'on dit « rends le site plus beau » ouvrait le code et retouchait
à l'instinct. Le résultat dépendait de la session, pas de la méthode.

## 1. La méthode commune à toutes les tâches

Cinq temps, toujours dans cet ordre. Les sections suivantes disent quel outil sert à chaque temps
selon le domaine.

| Temps | Ce qu'on fait | Pourquoi |
|---|---|---|
| 1. Lire | Les fiches du domaine, via `docs/README.md` | Une décision déjà prise ne se rediscute pas par ignorance |
| 2. Regarder | L'état réel : le site rendu, le fichier, la donnée | Un défaut ne se voit pas dans une description |
| 3. Lister | Les problèmes ou les options, classés | Basekou choisit ; une session ne décide pas seule de ce qui est « mieux » |
| 4. Faire | Ce que Basekou a choisi, avec l'outil du domaine | L'outil porte les règles de la marque, pas la mémoire de la session |
| 5. Prouver | Montrer le résultat et dire ce qui n'a pas été vérifié | « C'est fait » sans preuve ne permet pas de juger |

**Deux règles qui valent partout**

- **Un outil manquant se signale.** Si un skill ou un connecteur cité ici n'est pas disponible
  dans la session, on le dit à Basekou. On ne s'en passe pas en silence.
- **Un outil non essayé se dit non essayé.** Voir le tableau de la section 12.

## 2. Site — apparence et texte

Demandes concernées : « plus beau », « mieux écrit », « plus clair », « revois telle page ».

| Étape | Outil | Comment | Pourquoi |
|---|---|---|---|
| Lire | `docs/03_marche/site-precommande.md`, `docs/04_operations/site-technique.md`, `docs/01_adn/identite-verbale.md` | Avant d'ouvrir le code | Plusieurs choix du site sont des décisions datées de Basekou (ordre des blocs, bande Instagram, parcours de paiement) |
| Regarder | Le site lancé en local (`npm run dev`) et capturé avec Playwright, déjà installé | Captures à 375 px et à 1440 px, pages `/`, `/commander`, `/prestations`, `/offrir` | Neuf visiteurs sur dix sont sur mobile ; la version bureau peut être réussie et la version mobile ratée |
| Lister | Skill `ui-design-review:ui-review` | Il classe en « à corriger », « à améliorer », « finition » et ne modifie rien | Il juge le rendu, pas le code, et sépare les vrais problèmes des goûts |
| Demander | — | Présenter la liste, signaler à part ce qui touche une décision déjà prise | Voir le temps 3 de la méthode |
| Corriger l'apparence | Skill `ui-design-review:ui-polish` | Sur les seuls points choisis | Il corrige dans le style existant (`src/index.css`) au lieu d'en inventer un autre |
| Corriger le texte | Skill `marketing:brand-review` | Tout texte nouveau ou modifié y passe AVANT d'entrer dans le code | Il porte la grille de conformité, le lexique et la voix lédjé |
| Prouver | Captures avant et après aux deux largeurs + lien de l'aperçu Vercel de la PR | L'aperçu est posté par Vercel en commentaire de la PR | Basekou juge sur son téléphone, pas sur un compte rendu |

**Ce qui ne se décide pas en session** : un texte de marque (accroche, titre de section, signature)
se propose en variantes. Il ne s'écrit pas d'office.

**Structure de page et conversion** (ordre des blocs, haut de page, boutons) : skill
`landing-page-design`. Il donne des règles générales ; les décisions de
`site-precommande.md` passent avant lui.

## 3. Site — technique et déploiement

| Besoin | Outil | À savoir |
|---|---|---|
| État d'un déploiement, erreurs, journaux | Connecteur Vercel | Projet `ledje`, équipe `wouli`. Commencer par les erreurs d'exécution, puis les journaux |
| Schéma, journaux, fonctions | Connecteur Supabase | `supabase.co` est refusé par le réseau des sessions cloud : on passe par le connecteur, pas par un appel direct. Ne jamais toucher aux policies INSERT-only |
| Paiement | Connecteur Stripe | Mode réel uniquement ; les objets de test se créent à la main dans le tableau de bord. Le connecteur se déconnecte seul par moments (constat du 10/11) |
| Fonction de paiement | `supabase/functions/commande-payee/banc-essai.mts` | À relancer après toute retouche de la fonction |
| Relecture du code avant PR | Skill `code-review` | Sur le diff de la branche |
| Suivi de la PR | Abonnement à l'activité de la PR | La session corrige une CI rouge et répond aux relectures sans attendre |

Les pièges connus (variables Vercel, pas de `.select()` après un insert anonyme, page
`/commande-confirmee`) sont dans `site-technique.md`. Ils se lisent avant, pas après.

## 4. Écrire pour les réseaux

| Étape | Outil | Pourquoi |
|---|---|---|
| Lire | `docs/03_marche/grille-contenu.md` | Elle dit quoi dire, à quel niveau, à quelle cadence |
| Écrire | Skill `marketing:draft-content`, qui s'appuie sur `marketing:content-creation` | Adaptés à lédjé : grille de contenu, voix, garde-fous |
| Formats précis | Skills `social-media-skills:hook-writer`, `tiktok-script`, `reels-script`, `caption-writer`, `carousel-writer` | Ils connaissent les contraintes de chaque format. Ils ne connaissent PAS la marque |
| Vérifier | Skill `marketing:brand-review` | Obligatoire après un skill `social-media-skills`, qui est générique |
| Planifier | Skill `marketing:campaign-plan` | Lancement de compte, dégustation, Ramadan |

**Le registre religieux est exclu des réseaux** (`docs/01_adn/identite-verbale.md`). Un skill
générique ne le sait pas.

## 5. Production visuelle

La procédure complète est dans `CLAUDE.md` (« compiler un shot ») et `docs/visual/README.md`.
Rappel des outils :

| Besoin | Outil | À savoir |
|---|---|---|
| Écrire le prompt | Les fichiers de `docs/visual/`, compilés par la session | En français par défaut, en anglais pour Higgsfield. Le bloc NEGATIVE ne s'omet jamais |
| Générer | ChatGPT Image ou Gemini au quotidien ; connecteur Higgsfield quand il est utilisé | Basekou lance et juge |
| Texte sur un visuel, déclinaisons | Connecteur Canva | Un fichier déposé seul est introuvable à la main : créer un DESIGN et y poser les pièces page par page |

## 6. Chaîne de contenu (rushes, montage)

Les outils de `tools/contenu/` tournent **sur la machine de Basekou**, jamais dans une session :
une session n'a ni le disque ni les médias. Une session écrit des recettes, pas des verdicts.
Référence : `docs/04_operations/contenu-rushes.md`.

Le connecteur OpusClip demande un abonnement payant pour fonctionner depuis une session.

## 7. Vente et restaurateurs

| Besoin | Outil | À savoir |
|---|---|---|
| Préparer un RDV | Skill `sales:call-prep` + `docs/03_marche/canal-restaurant.md` | La page Notion « Argumentaire de RDV restaurateur » est interne et n'a jamais été corrigée par le terrain |
| Compte rendu d'un RDV | Connecteur Grain, puis skill `sales:call-summary` | Grain est l'outil de notes de réunion retenu |
| Suivi des prospects | Notion | Un fait doit être dans le TEXTE d'une page : une pièce jointe est illisible pour une session |
| Factures impayées | Skill `small-business:invoice-chase` | Rien ne part sans l'accord de Basekou |

## 8. Argent

| Besoin | Outil |
|---|---|
| Trésorerie à 30, 60, 90 jours | Skill `small-business:cash-flow-snapshot` |
| Marge par bouteille, scénarios de prix | Skill `small-business:margin-analyzer` |
| Clôture du mois, pièces manquantes | Skill `small-business:month-end-prep` |

**Tous lisent Stripe** : si le connecteur est déconnecté, ils tournent sans données, et la session
doit le dire au lieu de produire un document vide. **Aucun montant ne s'écrit au dépôt**
(`workflow-maj.md`) : ces documents restent internes.

## 9. Fournisseurs et contrats

| Besoin | Outil |
|---|---|
| Relire un devis, des CGV, un accord | Skill `small-business:contract-review` |
| Lire ou annoter un PDF | Skills `pdf-viewer` |
| Évaluer un fournisseur | Skill `operations:vendor-review` + `docs/04_operations/fournisseurs.md` |

Une spec produit engage le sourcing et la conformité : toute modification de `docs/02_produit/`
se propose, elle ne s'applique qu'après l'accord de Basekou.

## 10. Clients

| Besoin | Outil |
|---|---|
| Synthèse des retours (formulaire `/avis`, dégustations) | Skill `small-business:customer-pulse` |
| Répondre à une réclamation | Skill `small-business:handle-complaint` |

## 11. Pilotage et cerveau

| Besoin | Outil |
|---|---|
| Brief du lundi | Skill `small-business:monday-brief` |
| Bilan du vendredi | Skill `small-business:friday-brief` |
| « Je ne sais pas par où commencer » | Skill `small-business:smb-router` |
| État courant | Page ÉTAT de Notion (lecture toujours totale) |
| Mettre à jour une fiche | `workflow-maj.md` : protégé, libre, intermédiaire |
| Décision prise | Une ligne dans `decisions-log.md`, jamais de réécriture |
| Veille sur un concurrent | Skill `marketing:competitive-brief` — jamais de comparaison ni de nom en public |

## 11 bis. Les sessions de Basekou et leur trame

Liste donnée par Basekou le 2026-11-10. Une **trame** est un skill du dépôt (`.claude/skills/`),
chargé par toutes les sessions : il détaille les étapes, les outils et la preuve attendue pour un
type de session. On l'appelle par son nom (`/ledje-site`) ou la session le déclenche seule.

| Session | Trame | État |
|---|---|---|
| Lédjé site | `ledje-site` | Écrite le 10/11, à éprouver à l'usage |
| Lédjé tool (outils, formation à Claude) | — | À écrire |
| COO | — | À écrire |
| Com et branding | — | À écrire |
| Produit | — | À écrire |
| MAJ SOT | — | À écrire |
| Système de création de contenu | — | À écrire |
| Toutes, avant d'en changer | `ledje-passation` | Écrite le 10/11 |

Les trames restantes s'écrivent une par une, **après** que celle du site a été éprouvée : une
trame écrite sans avoir été déroulée est une supposition.

**Trois skills vivent déjà au dépôt** et non dans l'application : `landing-page-design`,
`ui-ux-pro-max` et `find-skills`. Ils se retirent par une PR, pas dans les réglages.

## 12. Ce que l'environnement ne sait pas faire

| Limite | Conséquence | Contournement |
|---|---|---|
| Le réseau des sessions cloud fonctionne en liste blanche | `instagram.com`, `tiktok.com`, `supabase.co` et d'autres sont refusés | Passer par un connecteur quand il existe ; sinon demander à Basekou de regarder |
| Aucune session ne lit le contenu des réseaux sociaux | On ne peut pas vérifier un profil ni observer ce qui marche | Basekou colle le texte ou une capture |
| Une pièce jointe Notion déposée par Basekou est illisible | Le fait est présent et inaccessible | Coller le texte dans le corps de la page |
| Cowork ne peut pas écrire au dépôt | Deux verrous distincts (proxy et droits du connecteur) | La file de la page ÉTAT |
| Les outils `tools/contenu/` et les générateurs `gen_*.py` vivent sur le poste de Basekou | Non réexécutables depuis une session | Basekou les lance |

Détail et dates de vérification : [`outils.md`](outils.md).

## 13. Ce qui a été réellement essayé

Cette fiche a été écrite le 10/11 à partir de la liste des outils chargés dans la session. **La
plupart n'ont pas été essayés.** Une session qui en utilise un pour la première fois complète ce
tableau.

| Outil | Essayé | Résultat |
|---|---|---|
| Playwright (captures du site) | 10/11 | Fonctionne, accueil et `/commander` capturés à 375 px et 1440 px |
| `ui-design-review:ui-review` | 10/11 | Fonctionne. Sa banque d'exemples (UXKIN) ne se connecte pas depuis une session cloud ; la revue se fait sans |
| Aperçu Vercel sur une PR | 10/11 | Fonctionne, lien posté en commentaire de la PR |
| `ledje-site`, `ledje-passation` | Non | Écrits le 10/11, pas encore déroulés par une autre session |
| Tous les autres skills cités | Non | — |

## Renvois

- Qui fait quoi, limites datées, tri des plugins : [`outils.md`](outils.md)
- Le routeur des sessions : `CLAUDE.md` (racine)
