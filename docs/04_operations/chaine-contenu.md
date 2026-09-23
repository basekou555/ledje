---
statut: en_cours
domaine: operations
maj: 2026-09-11
source: "Genèse dictée par Basekou le 2026-09-11. Pilote des 3 pièces du 2026-09-08 (decisions-log, 2026-09-10). Arborescence Drive posée le 2026-09-08."
resume: "La chaîne de production du contenu : pourquoi elle existe (des agents, pas des outils), ses 7 maillons, les 2 points de validation de Basekou, où vit quoi, ce qui est outillé, ce que le pilote a prouvé et ses 3 limites."
---

# La chaîne de contenu — la machine

**Ici : comment le contenu se fabrique.** Ce qu'on dit et pourquoi — niveaux, formats, cadence,
filtre avant publication — vit dans [`../03_marche/grille-contenu.md`](../03_marche/grille-contenu.md).
Les fichiers et leur nommage : [`contenu-drive.md`](contenu-drive.md).

## Pourquoi cette chaîne existe

L'objectif énoncé par Basekou : passer **d'outils qu'il faut penser à utiliser** à **des agents qui
travaillent le contenu et viennent le voir pour décider**.

➡️ **Conséquence de méthode** : avant de construire des agents, il fallait savoir **ce qu'ils
auraient à faire et où ils se passeraient le relais**. La chaîne a donc été dessinée en entier,
puis testée **un maillon à la fois**. C'est ce qui explique la forme du Drive : ses dossiers sont
des **points de passage de relais**, pas un simple rangement.

## Les sept maillons

| # | Maillon | Ce qu'il produit |
|---|---|---|
| 1 | **Les idées** | Une banque de briefs par format, tirée de la grille du dépôt |
| 2 | **La planification** | 2 à 3 posts/jour · un tournage réel qui alimente deux formats · la liste de ce que **Basekou seul** peut fournir |
| 3 | **L'écriture** | Hook, script, légende |
| 4 | **La production visuelle** | La bouteille **filmée par Basekou** ; le reste généré |
| 5 | **Le montage** | L'assemblage |
| 6 | **La conformité** | Lexique, santé, regard, faux témoignage |
| 7 | **La mesure** | Le bilan |

## 🔒 Les deux points de validation

Fixés par Basekou. **Ils structurent toute la chaîne** :

1. **Avant qu'on produise** — *rien ne se génère sans lui.*
2. **Avant qu'on publie** — *rien ne part sans lui.*

⚠️ Ce sont les deux endroits où un agent **s'arrête et rend la main**. Une chaîne d'agents sans ces
deux arrêts n'est pas la chaîne décidée.

## Où vit quoi

| Lieu | Ce qu'il porte |
|---|---|
| **Notion** | Les **statuts** et les **validations** de Basekou |
| **Drive pro** (« Lédjé contenu ») | Les **fichiers** — basculé sur le compte pro pour que les vidéos aient de la place |
| **Le dépôt** (ce cerveau) | Les **règles** |

## Ce qui est déjà outillé

- **Le plugin marketing adapté à Lédjé** porte trois maillons en compétences : `draft-content`
  (l'écriture), `brand-review` (la relecture de marque), `performance-report` (le bilan sans
  analytics).
- **Le générateur Higgsfield** sert pour les plans — documenté dans
  [`../visual/ledje-generateur.md`](../visual/ledje-generateur.md).
- **Le montage se fait dans le studio intégré de Higgsfield**, parce que c'est **le seul endroit qui
  voit à la fois ffmpeg et les médias de Basekou**.

## Le pilote (2026-09-08) — ce qu'il a prouvé

Trois pièces, une par format : **évidence**, **détournement de pub**, **produit en situation**. Six
variantes comparables, **un seul paramètre change** à chaque fois. Briefs validés par Basekou
**après corrections** (l'évidence « quotidien » jugée trop faible, la suite de la pub trop molle,
les hooks du frigo à refaire), puis test **limité à 1A, 2A, 3A**. Quatorze plans pour **17,5
crédits**, bouteille comprise — **tolérée parce que c'est un test**. Trois montages verticaux, texte
à l'écran, filigrane.

**Verdict de Basekou** : l'image et le rythme « pas mal », **le son est à refaire**. Deux essais en
synthèse (effets ponctuels, puis textures continues) n'ont pas convaincu. **Diagnostic partagé : il
faut du son enregistré et des références.**

## Les trois limites, consignées

1. **L'environnement de Claude Code ne peut ni voir les images générées ni télécharger les médias
   Higgsfield.** ➡️ **C'est Basekou qui juge les plans**, et le passage **Higgsfield → Drive reste
   manuel**.
2. **Les modèles de bruitages et de musique de Higgsfield sont réservés à son pipeline de jeux** —
   indisponibles ici.
3. **La voix off, qui doit être celle de Basekou, n'existe pas encore.** Le **texte à l'écran** est
   le repli.

## Où on en est

**Rien n'est publié. Tout est marqué test.** *(C'est le régime de toute la chaîne aujourd'hui — pas
le statut d'un fichier isolé.)*

**Ce qu'il manque, et que Basekou seul peut fournir** :

- **2 ou 3 vidéos de référence** dont le son lui plaît — **en fichiers, pas en liens**.
- **Des enregistrements réels du produit** : bouchon, versement, bouteille posée.
- Éventuellement une **banque de sons libres** au Drive.

**Ce qui fera sortir la chaîne du régime « test »** : le miel retiré le **dimanche 13/09** et les
étiquettes imprimées font arriver **les vrais plans de la bouteille**.

## À trancher avant de construire les agents planifiés

1. **La frontière avec l'outil de catégorisation et de KPI** en construction (PR #60).
2. **La règle « bouteille générée » pour les réseaux.** ⚠️ Elle est **distincte** de la suspension
   décidée pour le site — voir la mise en garde ci-dessous.

### ⚠️ L'état réel de la règle « la bouteille n'est jamais générée par IA »

Trois actes distincts, qu'il ne faut pas confondre :

| Date | Portée | Ce qui a été décidé |
|---|---|---|
| 02/09 | **Le site** | La photo produit générée par IA est **interdite**. |
| 08/09 | **Le pilote seulement** | Bouteille générée **tolérée pour ce test**, rien d'autre. |
| 09/09 | **Le site** | La règle du 02/09 est **suspendue à titre transitoire, pas abrogée** — avec une **condition de sortie explicite : remplacée dès que le lot étiqueté existe**. |

➡️ **Les réseaux ne sont couverts par aucun des trois.** C'est le point à trancher.
➡️ **La condition de sortie du site est sur le point d'être remplie** (miel le 13/09, étiquettes
imprimées) : tout visuel de bouteille généré aujourd'hui pour le site est **daté par construction**.
⚠️ `ledje-generateur.md` marque encore cette règle « à trancher » alors qu'elle est ferme en séance
et suspendue depuis le 09/09 — écart déjà signalé le 10/09, toujours ouvert.
