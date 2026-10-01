---
statut: figé
domaine: systeme
maj: 2026-09-30
source: "SOT Partie 8 + §8.1 (archive 2026-07-24) + outillage conseil 2026-07-21 (page relais) ; générateur de prompts visuels rendu visible le 2026-08-20 (il n'était référencé que par CLAUDE.md)"
resume: "Qui fait quoi (Claude.ai / Code / Cowork, Higgsfield, CapCut, Canva, Notion, Supabase/Vercel/OVH) + inventaire des documents hors repo. 🆕 `[idée]` **Agent Reach** (MIT) : couche de LECTURE des réseaux sociaux pour agents — ⛔ ne prospecte pas, ne contacte personne. 🎯 L'accès internet générique est DÉJÀ couvert ; le vrai trou est la lecture du contenu social (TikTok, Instagram, X, Reddit, sous-titres YouTube), non couverte à ce jour. ⚠️ Deux réserves : les canaux sociaux passent par les COOKIES de Basekou (comptes récents = les plus faciles à suspendre), et l'installation documentée fait exécuter à un agent un fichier distant. Rien n'est installé."
---

# Outils & répartition

| Outil | Rôle |
|---|---|
| **Claude.ai (COO/CTO)** | Stratégie, briefs, prompts, arbitrages, garde-fous conformité |
| **Claude Code** | Tout ce qui se compile/déploie : landing, DNS/Vercel, évolutions du site, compilation des prompts visuels (via CLAUDE.md), maintenance du cerveau |
| **Claude Cowork** | Jugement + contenu dans docs/apps : sourcing, mails, recherche |
| **Higgsfield** | Génération images/vidéos (recraft-v4-1, seedance) |
| **CapCut** | Montage vidéo, assemblage clips, texte |
| **Canva** | Texte/typo sur visuels, déclinaisons |
| **Notion** | Suivi opérationnel structuré façon Wouli (dashboard + bases de données, pas de tableaux plats) : sourcing fournisseurs, entretiens Mom Test. **Page ÉTAT** : https://app.notion.com/p/3d84bc5926a8811cb601d33c71e39a42 — ⛔ ancienne page relais GELÉE le 2026-09-11 : https://app.notion.com/p/39e4bc5926a88163b425c0607514a3b6 |
| **Supabase / Vercel / OVH** | Back, hosting, domaine |

Heuristique : **Cowork pour le jugement et le contenu ; Code pour ce qui se compile, se déploie ou tourne en tâche planifiée ; Notion pour le suivi opérationnel vivant (statuts, pipelines).**

## `[idée]` Agent Reach — lire les réseaux sociaux depuis une session agent (ouvert le 2026-09-30)

**Ce que c'est** : une couche d'accès internet pour agents IA, en licence **MIT** — `https://github.com/Panniantong/Agent-Reach`. Une CLI unique (`agent-reach`) donne à un agent la capacité de **LIRE** une douzaine de plateformes sans les configurer une par une : **Twitter/X, Reddit, Instagram, Facebook, TikTok**, YouTube *(extraction de sous-titres)*, GitHub, flux RSS, recherche sémantique Exa, lecture de pages via Jina. Plus des plateformes chinoises sans usage ici *(Bilibili, XiaoHongShu, Boss直聘)*. Architecture par « canal » avec basculement : si un outil échoue, il tente le suivant.

⛔ **Ce que le nom fait croire et qui est faux : « Reach » ne veut pas dire prospection.** **L'outil ne contacte personne, ne construit aucun fichier de prospects, n'envoie rien.** ➡️ **Il lit. C'est tout, et c'est déjà beaucoup.**

**Intention de Basekou, le 30/09** : *« il m'intéresse pour la lecture des réseaux sociaux et pour l'accès à internet pour "agent". »*

### 🎯 Les deux usages n'ont PAS le même intérêt, et la différence est vérifiable

| Usage | État réel | Verdict |
|---|---|---|
| **② Accès internet générique** *(lire une page, chercher sur le web)* | ✅ **DÉJÀ COUVERT** par les sessions Claude Code *(lecture d'URL, recherche web)* et par les connecteurs *(GitHub, Notion, Grain, Google, Higgsfield, Canva, Supabase, Vercel…)* | ⚠️ **Apport quasi nul** |
| **① Lecture des RÉSEAUX SOCIAUX** *(TikTok, Instagram, X, Reddit, sous-titres YouTube)* | 🔴 **PAS COUVERT DU TOUT à ce jour** — aucun outil de la session ne sait lire le contenu social. *(Les outils TikTok d'Higgsfield servent à PUBLIER, pas à lire ; OpusClip découpe une vidéo qu'on lui donne.)* | ✅ **C'est le vrai trou, et c'est exactement sa zone** |

📌 **Donc l'intuition est juste sur le point qui compte** : le manque n'est pas l'accès à internet, c'est **l'accès au contenu social**. ➡️ **Et ce manque touche directement deux fiches** : `../03_marche/acquisition-tiktok.md` et `../03_marche/grille-contenu.md` — **la cadence sociale a été dimensionnée sans jamais pouvoir observer ce qui marche dans la catégorie.** ✅ **L'extraction de sous-titres YouTube est le canal le plus immédiatement utile** : elle rend lisible du contenu long *(interviews de fondateurs de boissons, retours de restaurateurs)* sans le regarder.

### ⚠️ Deux réserves, factuelles, à lever avant tout usage

1. 🔴 **Twitter, Instagram et TikTok passent par les COOKIES du navigateur de Basekou** — donc ses sessions réelles, stockées dans `~/.agent-reach/config.yaml`. ⛔ **Un accès automatisé est contraire aux conditions de ces plateformes, et un compte RÉCENT est le plus facile à suspendre.** 📌 **Les comptes TikTok et Instagram de Lédjé ont été créés fin septembre et n'ont rien publié : les perdre avant la première publication coûterait plus que l'outil n'apporte.** ✅ **Sortie possible, à vérifier : n'activer que les canaux SANS cookie** *(YouTube, RSS, web, Exa)* **— ce sont justement les plus utiles ici.**
2. ⚠️ **La méthode d'installation documentée consiste à donner une URL à un agent et à le laisser suivre les instructions qu'il y trouve.** ➡️ **Un agent télécharge un fichier distant et exécute son contenu — dans une session qui a accès au dépôt, à Supabase et à Vercel.** 📌 **Ce n'est pas une accusation : c'est une propriété de l'outil, et elle se connaît AVANT.** ✅ **Le code est MIT et auditable ; l'installation peut se faire en lisant le script d'abord.**

⚠️ **Popularité non vérifiée** : l'API GitHub répond **403** depuis les sessions de ce projet. Les chiffres affichés sur la page rendue ne sont pas recopiés ici faute de confirmation. **Ne pas argumenter « c'est très populaire » sur cette base.**

⛔ **RIEN N'EST INSTALLÉ, RIEN N'EST DÉCIDÉ.** **Ce qui manque pour trancher : ce qu'on veut LIRE exactement, et sur quelle fiche ça débouche.**

### 🔒 Pourquoi Cowork ne peut pas écrire au dépôt — le motif exact, vérifié le 2026-09-24

**Cette contrainte était écrite depuis le 10/09 comme « le connecteur GitHub est en lecture seule par conception ».** ⚠️ **C'est inexact, et la formulation a duré quinze jours.** ✅ **Motif réel, obtenu en testant** *(routine Cowork, 24/09)* : la session **CLONE et LIT sans problème** ; c'est le **`push` qui est refusé par le proxy**, avec le message *« basekou555/ledje is not in this session's authorized repository set »*.

### 📎 Une pièce jointe dans Notion n'est PAS lisible par la routine — établi le 2026-09-28

**Cas réel** : les notes du RDV O'Daba du 27/09 existent bien dans Notion, sur une page *« Discussions avec odaba »*. ⛔ **Mais la page ne contient qu'un FICHIER JOINT** — la transcription d'un mémo vocal *(`Voix_260927_215141`, enregistré le 27/09 à 21h51)*. ➡️ **La routine lit la page, voit le fichier, et ne peut pas l'ouvrir** : l'outil de téléchargement ne sait lire que les pièces jointes créées par l'intégration elle-même, et renvoie `object_not_found` sur celles déposées par Basekou.

🎯 **Ce que ça établit, et c'est une règle d'usage plus qu'une limite technique : « je l'ai mis dans Notion » ne suffit pas.** ➡️ **Un fait doit être dans le TEXTE d'une page pour être lisible ; dans un fichier joint, il est présent et inaccessible.**

📌 **Forme nouvelle du mécanisme des sept faits perdus de septembre : le fait n'est ni oublié ni absent — il est ILLISIBLE par ceux qui en ont besoin.** ✅ **Sortie simple : coller le texte dans le corps de la page**, le fichier pouvant rester en pièce jointe comme original.

🔴 **ET UN SECOND BLOCAGE, DISTINCT, A ÉTÉ TESTÉ LE 25/09 : l'écriture par le CONNECTEUR GitHub renvoie `403 Resource not accessible by integration`** *(constaté sur une création de branche)*. ➡️ **Il y a donc DEUX verrous, de natures différentes : l'un au proxy sur le `push`, l'autre sur les droits du connecteur.** ⛔ **LEVER L'UN NE LÈVERAIT PAS L'AUTRE** — et c'est ce qui change le geste : ajouter le dépôt aux sources d'une session ne donnera rien tant que le connecteur reste en 403, et inversement.

➡️ **Ce n'est donc PAS un droit GitHub manquant, ni une propriété du connecteur : c'est que le dépôt n'est pas déclaré dans les sources autorisées de CETTE session-là.** 📌 **La différence compte, parce qu'elle change ce qu'il faudrait faire pour la lever** : on ne cherche pas un jeton ou une permission GitHub, on ajoute le dépôt aux sources de la session. ⛔ **Rien n'est décidé là-dessus** — la file 📥 de la page ÉTAT reste le chemin des sessions qui ne peuvent pas écrire, et elle fonctionne.

## Salle du conseil (2026-07-21)

**Salle du conseil niveau B construite** : 5 appels API indépendants + Chairman, socle de contexte projet validé et intégré en dur. Le socle canonique est versionné dans le repo : [`council-context.md`](council-context.md) — **protégé** : toute mise à jour passe par Basekou, et **doit être répercutée dans l'artefact « Salle du conseil »**, sinon les deux divergent.

**Règle outillage (2026-07-21)** : les outils partagés sont **intégrés tels quels** par défaut — pas de réécriture unilatérale par Claude.

## Documents stratégiques complémentaires — ⚠️ HORS REPO

Ces documents sont référencés par le projet mais ne vivent pas dans ce dépôt (localisation réelle : à compléter — probablement conversations Claude / exports) :

| Document | Contenu | Localisation |
|---|---|---|
| `ledje-retroplanning-general.md` | Rétroplanning macro par pôles (Produit & Fournisseurs, Business, Communication, Tech, Recherche utilisateur, Opérations), ancré sur Ramadan 2027 (≈ 8 février) et Aïd (≈ 9-10 mars). Le détail du pôle Communication vit dans sa discussion dédiée — seulement les dépendances inter-pôles ici. | à compléter |
| `ledje-lean-canvas.md` | Premier jet (~80 % rempli), carte d'identité business à partager. Case la plus faible et à tester en priorité : la proposition de valeur unique. | à compléter |
| `ledje-scripts-pubs-v1-v2.md` | Outputs scripts pubs V1/V2 | à compléter |
| `ledje-brief-video-hero.md` | Brief de la nouvelle vidéo hero (séquence refus en rayon → bouteille → cristal → transmission → partage → signature) | à compléter |

## Ce qui vit dans le repo

- Le cerveau : `docs/` (ce système).
- **Le générateur de prompts visuels** : `docs/visual/` — mode d'emploi, format d'entrée, ce que le
  cahier des charges impose déjà et ses limites dans [`../visual/README.md`](../visual/README.md).
  C'est lui qui produit les prompts d'image envoyés à Higgsfield (et utilisables tels quels sur
  ChatGPT Image ou Gemini). ⚠️ Il est dimensionné pour l'image fixe de marque, pas pour la cadence
  de contenu social (`../03_marche/grille-contenu.md`).
- Le brief designeuse : `docs/ledje-brief-designer.md`.
- Le routeur de sessions : `CLAUDE.md` (racine).
- Le code du site : `src/`, `public/`, `index.html`, `vercel.json`.
