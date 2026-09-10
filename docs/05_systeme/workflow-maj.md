---
statut: figé
domaine: systeme
maj: 2026-09-10
source: "Validé par Basekou en session 2026-07-24 (+ compléments même jour : garde-fous métier, council-context protégé) — remplace la Partie 9 (@update) du SOT archivé ; section 6 ajoutée le 2026-09-10 sur demande explicite de Basekou (captation, tri, péremption, relance des attentes dormantes)"
resume: "Les règles du cerveau : hiérarchie des sources, protégé/libre, rituels de session (page relais Notion, resynchro Project Knowledge), tri de l'inbox. ➕ Section 6 (10/09) — les 4 règles de vie de l'information : R1 tout fait déclaré entre le jour même · R2 critère de ce qui entre (est-ce que ça change l'état ?) + garde-fou de clôture · R3 péremption, le relais porte l'ÉTAT et non son histoire, purge à chaque revue de semaine · R4 la session INTERROGE les attentes dormantes (114 marqueurs au 10/09) pour qu'un oubli ne se referme pas en silence."
---

# Workflow de mise à jour du cerveau

## 1. Hiérarchie des sources (en cas de contradiction)

1. **Basekou en session** (décision explicite) — gagne toujours.
2. **Le cerveau** (`docs/`) — la fiche concernée, champ `maj` faisant foi.
3. **`decisions-log.md`** — l'historique qui explique le présent, jamais l'inverse : si le log contredit une fiche, la fiche à jour gagne et l'écart est signalé.
4. **Mémoire de session / Project Knowledge Claude** — toujours perdante face au repo.

## 2. Protégé / libre (qui a le droit de modifier quoi)

- **Protégé** — modification uniquement sur demande explicite de Basekou (déclencheur `@update` ou demande équivalente), jamais suggérée spontanément : `visual/ledje-master-prompt.md`, `visual/ledje-visual-language.md`, `council-context.md` (avec répercussion obligatoire dans l'artefact « Salle du conseil »), `01_adn/conformite.md`, et cette fiche. `decisions-log.md` est **append-only** (on ajoute une ligne, on ne réécrit jamais l'historique).
- **⚠️ DÉVERROUILLAGE TEMPORAIRE de `01_adn/` (décidé le 2026-07-31)** — le positionnement et le branding vont beaucoup bouger dans les prochains jours ; on est trop early pour verrouiller autant d'éléments. Les fiches ADN peuvent donc être modifiées **sans validation préalable au cas par cas**, à trois conditions non négociables :
  1. **Le circuit de traçabilité reste entier** : une branche + une PR par changement, jamais de commit direct sur `main`, et **une ligne au `decisions-log.md`** pour chaque décision — comme pour le reste du cerveau. Le merge de Basekou reste la validation.
  2. **`conformite.md` n'est PAS concernée** : le réglementaire (DGCCRF, CE 1924/2006) ne devient pas révisable parce que le projet est jeune. Elle reste protégée et `figé`.
  3. **Régime temporaire** : à re-verrouiller quand le positionnement et le branding se stabilisent. Tant que ce déverrouillage court, les fiches ADN portent `statut: en_cours` — elles décrivent une direction de travail, pas un socle acquis.
- **Libre** — l'IA met à jour au fil du travail, en le signalant dans son rapport : `00_inbox/`, fiches `03_marche/` et `04_operations/` (statuts, suivis, dates), `backlog.md`, index/README, `visual/ledje-prompt-library.md`, `visual/ledje-asset-log.md`, templates.
- **Intermédiaire** — `02_produit/` : modification proposée dans la réponse, appliquée après OK de Basekou (une spec produit engage le sourcing et la conformité).

## 3. Rituels de session

### Ouverture
1. Lire `docs/README.md` (la carte).
2. **Consulter la page relais Notion** — l'état chaud de la semaine, qui peut être en avance sur les fiches : https://app.notion.com/p/39e4bc5926a88163b425c0607514a3b6
3. Ouvrir uniquement les fiches du domaine concerné, choisies via les `resume` des index. Ne jamais charger tout le cerveau.
4. Sync check git : repartir d'`origin/main` à jour avant toute écriture.

### Clôture
1. Toute info nouvelle apprise en session → mise à jour **chirurgicale** de la fiche concernée (`maj` + `statut` ajustés) ; si pas triable à chaud → capture datée dans `00_inbox/`.
2. Toute décision prise → une ligne dans `decisions-log.md`.
3. Commit atomique par fiche, message clair.
4. **Réflexe resynchro Project Knowledge** : si une fiche modifiée fait partie de la copie Project Knowledge Claude, terminer le rapport de session par un rappel explicite « à resynchroniser dans Project Knowledge ».

## 4. Règles critiques (invariantes)

- **Garde-fous métier** : tout texte sortant (script, légende, page, étiquette, kit de vente, mail partenaire) passe la grille de `../01_adn/conformite.md` — aucune allégation santé explicite ou implicite, évocation jamais proclamation, terminologie verrouillée (« cristal de miel » / « eau miellée » ; perle, portion, monodose, pastille, bonbon, « ancestral » bannis). Étape fixe.
- Modifications chirurgicales uniquement — jamais réécrire une fiche entière.
- Zéro invention : un trou reste balisé « à compléter ».
- Contradiction repérée = signalée à Basekou, jamais tranchée seul.
- Fiche créée/renommée/supprimée → le `README.md` du dossier est mis à jour dans le même commit.
- `@update` reste le déclencheur explicite pour toucher au **protégé** ; il n'est jamais suggéré.

## 5. Tri de l'inbox

Sur demande (« trie l'inbox ») ou quand une session touche un domaine ayant des captures en attente : chaque capture est dispatchée vers ses fiches (mise à jour chirurgicale), puis supprimée. Une capture non triable reste, avec la raison notée dedans.

## 6. Ce qui entre, ce qui sort, ce qui se demande *(posé le 2026-09-10, sur demande explicite de Basekou)*

Ces quatre règles répondent à un constat de séance : **le SOT peut être rigoureux et faux en même temps**, parce que l'information ne l'atteint pas, ou qu'elle y stagne. Deux cas vécus en trois jours — la commande à Joan (08/09) et son taux d'humidité (10/09) — ont été portés par Basekou pendant que les fiches écrivaient le contraire.

### R1 — Tout FAIT déclaré en séance entre au SOT le jour même

**Un fait, un chiffre, une action réalisée : dès que Basekou l'énonce, il est consigné.** La règle ne se limite pas aux données fournisseur : elle couvre tout ce qui change l'état — un prix, une date, un contact, un envoi, un retrait, un refus, une mesure.

**Le test** : *une fois la séance finie, est-ce que cette information se retrouve sans Basekou ?* Si non, elle n'est pas consignée.

⚠️ **Une donnée qui transite par une surface non reliée** (boîte `basekou@ledje.fr`, appel, conversation) **n'atteint le SOT que si quelqu'un l'y dépose.** Une session qui reçoit une telle donnée et ne la dépose pas la fait disparaître.

### R2 — Le critère de ce qui entre : *est-ce que ça change l'état ?*

| Entre | N'entre pas |
|---|---|
| Un fait nouveau, un chiffre, une décision | Le **trajet** vers une décision *(règle du 31/08)* |
| Un blocage qui apparaît ou se lève | Une intention déjà consignée, re-énoncée |
| Une valeur qui en remplace une autre | Une reformulation de ce que la fiche dit déjà |
| Une contradiction repérée | Un rappel d'un sujet explicitement mis en sommeil |

**Les deux fautes symétriques, à surveiller également** : ① **réécrire ce qui est déjà écrit** — un sujet reposé pour la dixième fois encombre et fait perdre confiance ; ② **laisser passer un fait important** parce qu'il est arrivé au détour d'une phrase. La seconde coûte plus cher que la première.

**Garde-fou de clôture** : avant de clore, **relire les réponses terrain une par une** et vérifier que chacune a produit soit une ligne au journal, soit une décision explicite de ne rien écrire. Aucune réponse ne se perd en route.

### R3 — Péremption : une ligne de relais porte l'ÉTAT COURANT, pas son histoire

**Constat du 10/09 : les cellules de la page relais Notion accumulent depuis juillet** — certaines portent vingt entrées datées à la suite. Elles deviennent illisibles, et **une information périmée y côtoie l'information vraie sans qu'on puisse les distinguer.**

**La règle** : la page relais est un **état**, pas un journal. L'historique a déjà son lieu — `decisions-log.md`, append-only, qui est fait pour ça.

Donc, à chaque passage sur une ligne de relais :
1. **Dire ce qui remplace quoi.** Une valeur nouvelle ne s'ajoute pas à côté de l'ancienne : elle la remplace, et la mention « remplace X du {date} » suffit à garder la trace.
2. **Ne garder que l'état courant + les 2 ou 3 derniers mouvements.** Le reste est déjà au journal des décisions ; il en sort.
3. **Un sujet clos passe en ✅ avec sa décision, et sa ligne se raccourcit** — elle n'a plus à porter son instruction.
4. **Purge de la page relais : à chaque revue de semaine.** C'est le moment où l'on sait ce qui a bougé.

⚠️ **Le journal des décisions ne se purge JAMAIS** — il est append-only. C'est précisément parce qu'il garde tout que le relais peut se permettre d'oublier.

### R4 — La session INTERROGE les attentes dormantes

**Le problème** : si Basekou oublie une information et que le SOT ne l'a pas, **personne ne la tient à jour** — et ce qu'elle ouvrait se referme sans que quiconque le décide. Ce sont des opportunités perdues par silence, pas par arbitrage.

**La règle** : une session ne se contente pas d'enregistrer ce qu'on lui donne, **elle va chercher ce qui n'est pas revenu.**

Concrètement, à l'ouverture :
- Le SOT porte des **marqueurs d'attente** — `à confirmer`, `en attente`, `à compléter`, `à trancher`, `non déterminé`, `à vérifier`. **Ils étaient 114 au 2026-09-10.**
- La session en **relève ceux qui n'ont pas bougé depuis longtemps** et en pose **un ou deux** dans la question terrain — pas la liste, **les plus vieux et les plus coûteux**.
- La question se formule **en fait, pas en reproche** : « la fiche dit *X en attente depuis le {date}* — est-ce que ça a bougé, ou est-ce qu'on le ferme ? »

**Trois issues, toutes acceptables** : l'information arrive et s'écrit · le sujet se ferme explicitement et sort du stock · il reste ouvert et on note qu'il a été revu.

⚠️ **Ce qui n'est pas acceptable, c'est qu'il reste là sans que personne ne le regarde.** Un marqueur d'attente jamais rouvert n'est pas une attente : c'est un oubli qui a l'air d'un suivi.
