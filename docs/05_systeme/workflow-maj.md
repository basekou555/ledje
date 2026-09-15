---
statut: figé
domaine: systeme
maj: 2026-09-11
source: "Validé par Basekou en session 2026-07-24 (+ compléments même jour : garde-fous métier, council-context protégé) — remplace la Partie 9 (@update) du SOT archivé ; section 6 ajoutée le 2026-09-10 sur demande explicite de Basekou (captation, tri, péremption, relance des attentes dormantes)"
resume: "Les règles du cerveau : hiérarchie des sources, protégé/libre, rituels de session (page relais Notion, resynchro Project Knowledge), tri de l'inbox. ➕ Section 6 (10/09) — les règles de vie de l'information. R0 LE DIGEST lit TOUT le relais, ligne par ligne, jusqu'au bout des cellules longues — c'est sa charge (règle de Basekou, 10/09) ; R1 tout fait déclaré entre le jour même · R2 critère de ce qui entre (est-ce que ça change l'état ?) + garde-fou de clôture · R3 péremption, le relais porte l'ÉTAT et non son histoire, purge à chaque revue de semaine · R4 la session INTERROGE les attentes dormantes (114 marqueurs au 10/09) pour qu'un oubli ne se referme pas en silence. ➕ R5 (11/09) — LE TEST D'ENTRÉE DU RELAIS : une phrase y entre si elle répond à « où ça en est MAINTENANT » et à rien d'autre (présent → relais · passé → journal · impératif général → ce fichier) ; aucun bloc de clôture de séance au relais, état courant ~800 caractères max. ⚠️ Motif mesuré : le relais a repris +10 977 caractères le lendemain de sa purge, dont 73 % écrits par la session qui venait d'écrire R3 elle-même. ⚠️ Diagnostic corrigé en séance : les sessions déposaient bien, c'est LE DIGEST qui n'a pas lu le relais — devenu illisible (une cellule de 21 261 caractères)."
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
2. **Consulter la page ÉTAT** — une page, **20 lignes, 4 000 caractères plafond**, qui se RÉÉCRIT et ne s'allonge jamais : https://app.notion.com/p/3d84bc5926a8811cb601d33c71e39a42
   ⛔ **L'ancienne page relais est GELÉE depuis le 2026-09-11** (180 000 caractères, plus personne ne la lisait — digest compris). On la lit pour le détail, **on n'y écrit plus** : https://app.notion.com/p/39e4bc5926a88163b425c0607514a3b6
3. Ouvrir uniquement les fiches du domaine concerné, choisies via les `resume` des index. Ne jamais charger tout le cerveau.
4. Sync check git : repartir d'`origin/main` à jour avant toute écriture.
5. ⚠️ **Angles morts de vérification, à connaître avant d'affirmer « aucune trace »** *(consignés le 2026-09-10)* : la boîte **`basekou@ledje.fr` (Zoho)** n'est reliée à aucun outil — tout échange fournisseur qui y passe est **déclaré**, jamais constaté. Et depuis le **08/09**, le connecteur **Google Drive pointe sur `basekou.diaby.pro@gmail.com`** : **l'ancien dossier « Lédjé » (Fournisseur, Admin, Com, dossier litige, devis) reste sur `basekou555` et n'est visible que s'il a été partagé.** Une absence de trace dans l'un de ces deux endroits ne prouve rien.

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

Ces règles répondent à un constat de séance : **le SOT peut être rigoureux et faux en même temps**, parce que l'information ne l'atteint pas, ou qu'elle y stagne.

⚠️ **DIAGNOSTIC CORRIGÉ EN SÉANCE LE 2026-09-10, par Basekou — et il déplace la faute.** La première version de cette section mettait en cause la **transmission** par les sessions. **C'est faux : les sessions avaient fait leur travail.** Vérifié en séance : la page relais portait, daté et sourcé, ce que les fiches ignoraient — la conversion en g/100 mL **déjà faite le 07/09 par une session COO** sur la densité de Joan, la composition exacte de la commande de miel, et une question ouverte sur le QUID. **Rien de tout cela n'a été inventé ni perdu par elles.**

**Le maillon qui a cédé est en aval, et Basekou le situe précisément : LE DIGEST.** Il n'a pas relayé ce que le relais portait. *(La session du 10/09 ne l'avait pas lu non plus — mais elle travaille sur le digest, c'est le circuit prévu.)*

🔗 **Cause mécanique : le relais est devenu illisible.** Au 10/09, une seule cellule portait **21 261 caractères** et cinq lignes concentraient **37 % de la page**. **Une cellule que personne ne peut parcourir n'est pas relayée.** **La règle R3 n'est donc pas du ménage : c'est ce qui rend le digest capable de faire son travail.**

➡️ **R0 — LE DIGEST LIT TOUT LE RELAIS, ligne par ligne, cellules longues comprises.** *(Règle posée par Basekou le 2026-09-10.)* C'est **sa** charge, pas celle de la séance : le digest est le point où le relais devient exploitable.

**Ce que « lire tout » veut dire, concrètement** :
- **Descendre jusqu'au bout de chaque cellule.** L'information fraîche est **à la fin**, pas au début — les entrées s'ajoutent chronologiquement. Un digest qui ne lit que le haut d'une cellule lit son historique et rate son état.
- **Repérer ce qui n'est pas encore descendu en fiche.** Une donnée présente au relais et absente de `docs/` est **un sujet**, pas un détail — c'est exactement ce qui s'est produit avec la conversion du 07/09.
- **Relever les questions posées et restées sans réponse.** Le QUID 8 % / 8,5 % était ouvert depuis le 07/09 au relais, et n'a jamais été posé à Basekou.

⚠️ **Et le corollaire pour la séance** : quand le digest et le terrain divergent, **le relais fait foi** — il est la source chaude, le digest en est un dérivé daté. L'écart se signale au lieu d'être absorbé en silence.

### R1 — Tout FAIT déclaré en séance entre au SOT le jour même

**Un fait, un chiffre, une action réalisée : dès que Basekou l'énonce, il est consigné** — au relais ET dans la fiche concernée. La règle ne se limite pas aux données fournisseur : elle couvre tout ce qui change l'état — un prix, une date, un contact, un envoi, un retrait, un refus, une mesure. *(⚠️ Déposer au relais NE SUFFIT PAS : le cas du 07/09 montre qu'une donnée peut y vivre trois jours sans jamais descendre en fiche. **Le relais est un point de passage, pas une destination.**)*

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

### R5 — Le test d'entrée du relais : « où ça en est MAINTENANT »

**Le constat, mesuré le 2026-09-11.** La page relais avait été purgée la veille de 214 100 à 171 431 caractères. **Le lendemain elle était à 183 571 — +10 977 en un jour, sur 8 lignes, et aucune ligne n'avait maigri.**

**L'attribution, faite ligne par ligne** : **+2 961 pour une ligne NEUVE** créée par une autre session *(un sujet nouveau occupe légitimement de la place)* — et **+8 000, soit 73 %, écrits par la session de clôture elle-même**, c'est-à-dire par celle qui venait d'écrire la règle R3.

⚠️ **Le pire item, isolé : 2 699 caractères de blocs « CLÔTURE DE SÉANCE »**, empilés l'un sous l'autre. Un compte rendu de séance **existe déjà à deux endroits** — `decisions-log.md` et le relevé Notion. **Il était écrit une troisième fois, dans le seul endroit qui n'est pas fait pour ça.**

**Le diagnostic** : R3 disait « l'état, pas son histoire » — **elle ne nommait qu'un interdit sur deux.** Une cellule de relais se met à gonfler parce qu'on y mélange **trois registres qui ont chacun leur maison** :

| Registre | Exemple | Sa maison |
|---|---|---|
| **L'ÉTAT** | « le retrait a lieu le 13/09 » · « l'étiquette au tirage est la v1.2 » | ✅ **le relais** |
| **L'HISTOIRE** | « la même date fausse est revenue vingt-deux jours plus tard » | `decisions-log.md` |
| **LA LEÇON / LA RÈGLE** | « une relecture de conformité se fait fiche en main » | **ce fichier** |

**LA RÈGLE — le test tient en une question.** *Une phrase entre au relais si elle répond à **« où ça en est maintenant »**, et à rien d'autre.*
- Écrite **au présent**, avec sa date.
- **Au passé** → journal des décisions.
- **À l'impératif général** → `workflow-maj.md`.

**Deux garde-fous chiffrés**, parce qu'une règle sans budget ne tient pas :
1. ⛔ **Aucun bloc de clôture de séance dans le relais.** Jamais. Il a déjà deux maisons.
2. 📏 **L'état courant d'une cellule tient en ~800 caractères.** Au-delà, c'est qu'il contient autre chose que de l'état — relire et trier avant d'écrire.

*(Appliquée à la journée du 11/09, cette règle donnait **≈ +1 500 caractères au lieu de +8 000**.)*

⚠️ **Ce que cet épisode apprend sur les règles elles-mêmes** : R3 a été écrite le 10/09 et enfreinte le 11/09 **par la session qui l'avait écrite**. Une règle qui énonce un principe sans donner de **test applicable phrase par phrase** ne se tient pas au moment d'écrire — parce qu'au moment d'écrire, **tout paraît utile à la prochaine session.** C'est le test, pas le principe, qui fait le travail.
