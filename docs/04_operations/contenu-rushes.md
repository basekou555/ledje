---
statut: hypothèse
domaine: operations
maj: 2026-10-21
source: "Session Claude Code du 2026-10-21 (17h-18h CEST, branche claude/exciting-babbage-hm0xps), construite sur chaine-contenu.md, contenu-drive.md, grille-contenu.md, conformite.md, identite-visuelle.md, le decisions-log (2026-08-20 → 2026-10-17) et le SOT archivé (Partie 6). PROPOSITION — rien n'y est tranché par Basekou."
resume: "Le système rushes → pièces : trois objets (le rush indexé, la recette, le gabarit de format), six étapes dont trois outillées dans tools/contenu/, ce que le cerveau impose déjà, le premier lot proposé sur les trois gisements, et les neuf arbitrages qui reviennent à Basekou."
---

# Le système rushes → pièces — proposition

**Ici : comment on fabrique des pièces répétables à partir des rushes déjà tournés et des
prochains, sans montage à la main.** La chaîne (7 maillons, 2 points de validation, 3 limites) est
dans [`chaine-contenu.md`](chaine-contenu.md) ; les fichiers et leur nommage dans
[`contenu-drive.md`](contenu-drive.md) ; ce qu'on dit et pourquoi dans
[`../03_marche/grille-contenu.md`](../03_marche/grille-contenu.md). Cette fiche ne répète rien de
tout ça : elle dit **comment un rush devient une pièce**, et ce qu'il faut décider pour que ça tourne.

> **En une phrase** : une pièce = un **gabarit de format** appliqué à une **recette** qui pioche dans
> des **rushes indexés**. La recette est un fichier texte ; un script la rend ; Basekou valide la
> recette avant le rendu et la pièce avant la publication. Changer un paramètre de la recette et
> re-rendre donne une variante comparable — c'est ce qui permet d'apprendre.

## 1. Ce que le cerveau impose déjà — et ce que ça fait au système

Rien de nouveau dans ce tableau : chaque ligne cite sa source. Il est là pour qu'on voie d'un coup
d'œil **pourquoi le système a la forme qu'il a**.

| Règle (source) | Conséquence pour le système |
|---|---|
| **Deux points de validation** : rien ne se génère sans Basekou, rien ne part sans lui *(chaine-contenu.md)* | La recette porte un `statut` que seul Basekou fait avancer : `brouillon → valide-production → rendu → valide-publication`. Le rendu porte un **filigrane TEST** tant que le dernier statut n'est pas écrit. |
| **Limite n° 1** : une session ne voit ni le disque ni les médias Higgsfield *(chaine-contenu.md)* | Les scripts tournent **sur la machine de Basekou**, là où sont les rushes. Une session écrit des recettes à partir de **l'index** (texte), pas des vidéos. |
| **Limite n° 2** : pas de son synthétique disponible ; **le son est à refaire** *(pilote du 08/09)* | Le fonds règle le problème par construction : **les rushes portent du son réel**. Le gabarit par défaut garde le son des rushes ; la voix off de Basekou se mixe par-dessus. |
| **Limite n° 3** : la voix off de Basekou n'existe pas encore ; texte à l'écran en repli *(chaine-contenu.md)* | Le texte à l'écran est un paramètre de chaque plan de la recette. La voix off est un fichier de `02_voix/` que la recette référence — dès qu'il existe. |
| **Matière source ≠ image publiée** : les 79 rushes, visage de Basekou compris, sont exploitables comme matière ; **une personne réelle qui n'est pas lui : non tranché** *(identite-visuelle.md, 2026-10-17)* | L'index tague `personnes` (aucune · mains · basekou · tiers). **Un rush tagué `tiers` ne peut pas sortir** tant que l'arbitrage n° 5 n'est pas rendu — il se dérushe et se tague quand même. |
| **L'oral public est une communication durable**, même régime qu'une étiquette ; personne n'a relu le live *(decisions-log 2026-10-02)* | Tout rush où quelqu'un parle du produit est tagué `oral: oui` → **transcription puis `relecture.py`** avant tout clip (étape 4). Le script pointe les timecodes ; Basekou décide. |
| **Le produit est filmé pour de vrai, le reste passe à l'IA** *(grille-contenu.md, 2026-08-20)* ; les visuels IA de bouteille ne valaient que **jusqu'au lot étiqueté** *(decisions-log 2026-09-11)*, qui existe depuis le 29-30/09 | Les plans de bouteille viennent des rushes. ⚠️ **Le fonds s'arrête au 22/09, soit AVANT le premier lot étiqueté du 29/09** : une bouteille filmée avant cette date porte probablement une étiquette de test ou aucune — **à vérifier au dérushage** (arbitrage n° 8). |
| **Sept formats**, dont cinq se nourrissent du réel et deux de la génération *(grille-contenu.md)* | Le système couvre **le geste · la voix off · le produit en situation · le terrain · la sensation**. Pour **l'évidence** et **le détournement de pub**, il ne fournit que **la chute** : le plan produit réel qui conclut. *(Le script de rendu accepte n'importe quel fichier vidéo comme « plan », un clip généré déposé dans `03_generes/` compris — la chaîne est agnostique à la source.)* |
| **La cadence vient des formats IA ; le réel est le socle de crédibilité** *(grille-contenu.md)* | Ce système ne vise pas 20 pièces par semaine. Il vise **des pièces vraies, répétables, qui tiennent la promesse « abonne-toi, on montre comment on produit »** *(decisions-log 2026-10-14)*. |
| **Variantes comparables : un seul paramètre change** *(grille-contenu.md, pilote du 08/09)* | Une variante = une copie de la recette avec `variable_testee` renseignée et `reference` qui pointe la pièce d'origine. |
| **Plancher hebdomadaire des quatre niveaux** *(grille-contenu.md, 2026-08-24)* | Chaque recette porte `niveau`. Le contrôle est une lecture des recettes de la semaine, pas un outil. |
| **Les hooks parlent uniquement au consommateur** *(grille-contenu.md)* | Le champ `hook` de la recette est relu avec cette règle ; `draft-content` et `brand-review` s'appliquent au texte comme à n'importe quel contenu. |
| **L'ID, pas le chemin** ; `_TEST` est le régime de toute la chaîne ; Notion = statuts, Drive = fichiers, dépôt = règles *(contenu-drive.md)* | L'index référence un `drive_id` par rush dès qu'il est déposé. Les rendus suivent le nommage `descriptif-AAAA-MM-JJ_SUFFIXE`. Le statut de la **pièce** reste dans Notion ; le statut de la **recette** n'est que son reflet local. |
| **Filmer plus qu'on ne publie** ; un lot embouteillé ne se refilme pas *(grille-contenu.md)* | Le fonds ne contient **ni la production du 29/09, ni l'événement du 11/10, ni le salon du 17/10** *(contenu-drive.md)*. Le système ne les invente pas : la règle de tournage est la seule réponse, et elle est au n° 6 de la liste « ce que Basekou seul peut fournir ». |

## 2. Les trois objets

### 2.1 Le rush indexé — `rushes-index.csv`

Un rush n'existe pour le système que s'il a une ligne dans l'index. Le script `derush.py` crée la
ligne et remplit les colonnes **techniques** ; les colonnes de **tag** sont remplies **par la session
Claude Code**, qui regarde la planche-contact et lit la transcription de chaque rush (produites par
le même script), puis écrit ce qu'il contient et à quoi il peut servir. **Basekou ne remplit rien :
il corrige.** Les tags **survivent à chaque relance du script**. *(Règle posée par Basekou le 21/10 :
« l'outil doit être autonome là-dessus, lire les vidéos et comprendre le contenu ».)*

| Colonne | Remplie par | Valeurs |
|---|---|---|
| `id` | script | `R-0001`… dans l'ordre des dates de tournage — stable une fois attribué |
| `fichier` `date` `duree_s` `resolution` `fps` `orientation` `taille_mo` `son_piste` | script | lus dans le fichier (ffprobe) |
| `gisement` | session | `miellerie-st-jerome` · `tests-dosage` · `packs-eau` · `production` · `terrain` · `autre` |
| `lieu` | session | libre |
| `sujet` | session | un sujet de la grille (« la dose », « le miel jamais chauffé », « un lot de production »…) |
| `formats` | session | formats candidats, séparés par `;` : `geste` · `voix-off` · `situation` · `terrain` · `sensation` |
| `niveau` | session | `1` produit · `2` expérience · `3` marque · `4` univers |
| `personnes` | session | `aucune` · `mains` · `basekou` · `tiers` · `basekou+tiers` |
| `son` | session | `utile` · `ambiance` · `bruit` · `muet` |
| `oral` | session | `oui` / `non` — quelqu'un parle du produit |
| `etat` | session | `non-visionne` *(défaut)* · `visionne` · `derushe` · `utilise` · `ecarte` |
| `timecodes_utiles` | session | `00:12-00:19 pesée ; 01:40-01:46 versement` |
| `notes` `drive_id` | session · Basekou | libre · l'ID Drive une fois déposé |

**Pourquoi un CSV et pas Notion** : c'est le seul format qu'un script lit, qu'un tableur ouvre et
qu'un dépôt versionne. Notion garde le statut des **pièces** (cf. frontière dans `contenu-drive.md`) ;
l'index décrit des **rushes**, qui n'y ont jamais eu leur place.

**Comment la session « voit » un rush** : `derush.py` produit, pour chaque rush, une
**planche-contact** (une image toutes les 5 s, timecode incrusté) et une **transcription** `.srt`
de ce qui est dit (whisper, en local). C'est ce que la session lit — pas la vidéo. Une session sur
le PC de Basekou les lit directement ; une session distante les lit si elles sont déposées au Drive
(79 planches légères, pas 17 Go). Les proxies 720p et les vignettes restent en option.

### 2.2 La recette — un fichier YAML par pièce

Gabarit : [`../05_systeme/templates/template-recette-piece.yaml`](../05_systeme/templates/template-recette-piece.yaml).
Elle tient en trois blocs :

1. **Le brief** — `format`, `niveau`, `sujet`, `intention`, `hook`, `legende`, `canal`, `statut`,
   `valide_par`, et pour une variante `variable_testee` + `reference`.
2. **Les plans** — pour chacun : le rush, `in`/`out`, le `cadrage` (un 16:9 recadré en 9:16 : gauche,
   centre, droite ou une fraction), la `vitesse`, le `texte` à l'écran et sa position, `son` gardé ou coupé.
3. **Le son** — `rushes` (le réel), `fichier` (la voix off de Basekou mixée au-dessus des rushes
   atténués) ou `silence`.

Ce que la recette **n'est pas** : un script de voix off (il vit dans `02_voix/` avec l'audio), une
image générée (elle vit dans `03_generes/`), un statut Notion (elle le reflète, elle ne le remplace pas).

### 2.3 Le gabarit de format — ce que chaque format attend de la recette

Un gabarit n'est pas du code : c'est **la structure que la recette suit pour un format donné**, tirée
de la définition du format dans la grille. Il est écrit ici une fois ; chaque recette l'applique.

| Format | Plans | Durée | Son | Texte à l'écran | Niveau dominant | Ce qu'il faut dans l'index |
|---|---|---|---|---|---|---|
| **Le geste** | 3 à 5 plans fixes de 2 à 5 s, dans l'ordre du travail | 12 à 25 s | les rushes, gardé | hook sur le plan 1, **chute sur le dernier** ; rien au milieu | 1, parfois 3 | `formats` contient `geste`, `son` ≠ `bruit` |
| **La voix off** | les mêmes plans que le geste, souvent un ou deux de plus | 30 à 60 s, **une idée** | `fichier` (sa voix) sur rushes à 0,25 | facultatif — repli si la voix manque | 3 | idem + un fichier de `02_voix/` |
| **Le produit en situation** | 1 plan, 5 à 10 s, bouteille réelle dans un vrai contexte | 5 à 10 s | les rushes | hook seulement | 1, 2 | `gisement` ≥ 29/09 *(arbitrage n° 8)* |
| **Le terrain** | 2 à 6 plans, ce qui se passe dehors | 15 à 30 s | les rushes, **le son est la pièce** | hook, parfois une légende de lieu | 3 | `personnes` — ⛔ `tiers` bloque jusqu'à l'arbitrage n° 5 |
| **La sensation** | 1 à 3 plans macro ; une des trois entrées (matière · manque · relâchement), ou les trois enchaînées | 6 à 15 s | les rushes, **indispensable** | aucun, ou la chute seule | 2 | `son: utile` ; ⚠️ « le manque » : on montre un contexte, jamais un effet |
| **L'évidence** / **le détournement de pub** | plans générés (hors système) + **1 plan réel de chute** | — | — | la liste / le pastiche en texte ou voix | 1, 4 | un plan de bouteille réelle, propre, 3 à 5 s |
| **L'écrit** | hors système (carrousel, texte) | — | — | — | 4 | — |

Deux règles transversales, reprises de la grille : **la chute est toujours à la fin**, et **le texte
n'est jamais généré** — il est écrit, relu (`brand-review`), puis posé.

## 3. Les six étapes — qui, quoi, avec quel outil

| # | Étape | Qui | Outil | Sortie | Maillon(s) |
|---|---|---|---|---|---|
| 0 | **Sauvegarder** | Basekou | copie du disque | `01_plans-reels/` au Drive pro — originaux ou proxies *(arbitrage n° 1)* | — |
| 1 | **Dérusher** | script, puis **la session** (Basekou corrige) | `derush.py` | `rushes-index.csv` + planches + transcriptions ; la session lit les planches et écrit les tags ; **les 4 clips longs compris** | — |
| 2 | **Choisir et écrire** | une session propose, Basekou valide | l'index + `draft-content` | une recette `brouillon`, puis `valide-production` *(point de validation 1)* | 1 · 2 · 3 |
| 3 | **Rendre** | script, sur la machine de Basekou | `rendu.py` | un `.mp4` filigrané TEST dans `04_montages/` ; les variantes à côté | 4 · 5 |
| 4 | **Relire** | script, puis Basekou | `relecture.py` sur le transcript de la pièce + `brand-review` sur hook et légende + **le filtre en 5 points** de la grille | `valide-publication` *(point de validation 2)* ou `ecarte` | 6 |
| 5 | **Publier et mesurer** | Basekou | `rendu.py` (sans filigrane) · Notion · `performance-report` | `05_publies/` ; les rushes passent `etat: utilise` ; ce qui a marché remonte dans le gabarit | 7 |

**La boucle d'apprentissage** suit celle de l'asset-log, à deux niveaux : ce qu'une pièce apprend
s'écrit dans **sa recette** (`notes`) ; ce qui se confirme sur deux ou trois pièces d'un même format
remonte dans **le gabarit** (§ 2.3), ici. Rien ne remonte plus haut sans Basekou.

## 4. Où ça tourne — et pourquoi pas dans Higgsfield

Le pilote a monté dans le studio Higgsfield « parce que c'est le seul endroit qui voit à la fois
ffmpeg et les médias » *(chaine-contenu.md)*. **C'était vrai pour des plans générés ; c'est faux pour
des rushes** : ils sont sur `D:\LEDJE`, pas chez Higgsfield, et 17 Go ne s'y téléversent pas.

| Option | Ce que ça demande | Verdict proposé |
|---|---|---|
| **A — la machine de Basekou** : Python + ffmpeg, les trois scripts du dépôt, Claude Code en local pour écrire les recettes avec le disque sous la main | une installation d'une heure (cf. `tools/contenu/README.md`) | ✅ **Recommandé** — c'est le seul endroit où les rushes, les scripts et le jugement sont ensemble |
| **B — le studio Higgsfield** : téléverser des proxies, monter là-bas | le transfert des proxies à chaque lot ; le retour vers le Drive reste manuel *(limite n° 1)* | ⚠️ Possible pour une pièce isolée, pas pour un système |
| **C — CapCut à la main** | rien à installer | ⛔ Hors mission : c'est précisément ce qu'on remplace |

## 5. Le premier lot proposé — hypothèse, à confirmer au dérushage

⚠️ **Aucune session n'a vu un seul de ces rushes.** Ce qui suit est déduit des trois gisements
nommés le 16/10 et de la grille ; le dérushage confirmera ou corrigera.

| Priorité | Matière | Format(s) | Niveau · sujet | Pourquoi d'abord | Point de vigilance |
|---|---|---|---|---|---|
| **0** | **Les 4 clips longs jamais visionnés** | — | — | On ne sait pas ce qu'ils contiennent ; un clip long est souvent une production ou un live, donc le plus riche | S'ils portent de l'oral : transcription + relecture avant tout |
| **1** | **Les tests de dosage** | le geste · la voix off | 1 · « la dose » ; 3 · « pourquoi on ne met rien d'autre » | Le geste le moins coûteux, le plus lisible, et il tient la promesse « on montre comment on produit » | ⚠️ **La dose a changé depuis** (15 mL, assemblage 25/75 tilleul-montagne — `production-artisanale.md`) : **aucun chiffre de dose à l'écran** tiré d'un rush ancien ; aucun chiffre de sucre |
| **2** | **La miellerie de Saint Jérôme** | le terrain · la voix off | 3 · « le miel français », « pourquoi le local », « le miel jamais chauffé » | Le seul gisement qui montre **d'où vient le miel** — la preuve que le site et le flyer affirment sans image | ⛔ **Des tiers sont probables** (l'apiculteur, le lieu) → arbitrage n° 5 avant toute sortie ; « 40 min de Lyon » n'est pas vérifié au dépôt, ne pas l'écrire |
| **3** | **Les packs d'eau** | le geste · la sensation (matière) | 1 · « eau et miel, rien d'autre », « pourquoi le plastique » | Répond à la question n° 1 du spectateur — ce qu'il y a dedans — avec l'ingrédient le plus simple | Ne pas nommer la marque d'eau *(aucune marque dans le contenu)* |

Chaque pièce du lot se décline en **une variante** (même plans, autre hook) pour que le premier lot
apprenne quelque chose — sinon c'est du volume, pas un test *(grille-contenu.md)*.

### Exemple de recette, pour fixer les idées *(les timecodes et les textes sont à remplacer)*

```yaml
piece:
  id: P-2026-10-25-001
  titre: "la dose, filmée"
  format: le-geste
  niveau: 1
  sujet: "la dose"
  intention: "on voit combien de miel entre dans une bouteille, sans chiffre"
  statut: brouillon
  hook: "Tout ce qu'il y a dans une bouteille."
  rushes_utilises: [R-0041, R-0042, R-0043]
rushes_dir: "D:/LEDJE"
sortie: { fichier: "la-dose-filmee-2026-10-25_TEST.mp4", ratio: "9:16", fps: 30 }
audio: { source: rushes, fondu: 0.2 }
plans:
  - { rush: "2026-09-20/IMG_0041.MP4", in: "00:00:12", out: "00:00:15.5", cadrage: centre, texte: "Tout ce qu'il y a dans une bouteille.", texte_position: haut }
  - { rush: "2026-09-20/IMG_0042.MP4", in: "00:01:40", out: "00:01:44", cadrage: droite }
  - { rush: "2026-09-20/IMG_0043.MP4", in: "00:00:03", out: "00:00:07", texte: "lédjé — de l'eau, du miel.", texte_position: bas }
```

## 6. Ce que Basekou seul peut fournir

1. **Le disque** — ou sa copie au Drive, et l'index déjà posé dessus (à verser dans `rushes-index.csv`).
2. **Ses corrections sur les tags** écrits par la session — pas le visionnage ni le tri, qui sont à elle.
3. **Sa voix** — les fichiers de `02_voix/`, sans lesquels le format « voix off » reste du texte à l'écran.
4. **Les 2 ou 3 vidéos de référence dont le son lui plaît**, demandées depuis le 08/09 et jamais déposées — en fichiers.
5. **Les verdicts** : `valide-production`, `valide-publication`, `ecarte`. Aucune session ne les écrit.
6. **Le tournage des prochains moments** — la règle « filmer plus qu'on ne publie » est la seule réponse au trou du fonds après le 22/09.

## 7. Les arbitrages qui reviennent à Basekou

| # | Question | Proposition de la session |
|---|---|---|
| 1 | **Où vit la copie de sûreté** du disque local et unique *(réserve du 17/10)* ? | Les **originaux** dans `01_plans-reels/` du Drive pro (17 Go, le compte pro a été choisi pour ça) ; les proxies à côté dans `_proxies/`. |
| 2 | **Où tourne le rendu** ? | Option A, sa machine. |
| 3 | **L'index est-il versionné au dépôt** ? | Oui : `docs/04_operations/rushes-index.csv`, recopié à chaque dérushage. C'est le seul moyen pour une session d'écrire une recette sans voir le disque. |
| 4 | **Les plans réels reçoivent-ils des IDs de shot** *(question ouverte de contenu-drive.md)* ? | Non. Les rushes ont leurs `R-xxxx` et leurs tags ; le shot-book reste l'outil de la production générée. Une recette relie les deux quand une pièce mélange les sources. |
| 5 | **Une personne réelle qui n'est pas lui, filmée** : floutage, accord écrit, exclusion ? | Hors de cette session — c'est une règle ADN. En attendant : **aucune sortie** d'un rush `tiers`. |
| 6 | **Relecture de l'oral avant publication** : règle systématique ou cas par cas *(ouvert depuis le 02/10)* ? | Systématique : transcription + `relecture.py` + lecture humaine, sur tout rush `oral: oui`. |
| 7 | **Où vivent les recettes** ? | Au Drive, dans `04_montages/` à côté du rendu, nommées comme lui. *(Variante : au dépôt, une PR par lot — la revue de PR serait alors le point de validation 1. Plus traçable, plus lourd.)* |
| 8 | **La bouteille dans les rushes d'avant le 29/09** : étiquette finale ou non ? | À vérifier au dérushage. Si non : le format « produit en situation » attend des rushes postérieurs, et les rushes anciens servent les formats où la bouteille n'est pas le sujet. |
| 9 | **L'outil de transcription** de l'oral ? | Whisper en local (gratuit, hors ligne, sort un `.srt`). N'importe quel autre outil qui sort un `.srt` convient. |

## 8. Ce qui est livré dans la PR du 2026-10-21

- [`tools/contenu/derush.py`](../../tools/contenu/derush.py) — l'index, les proxies, les vignettes.
- [`tools/contenu/rendu.py`](../../tools/contenu/rendu.py) — la recette → le `.mp4`, filigrane TEST, refus d'un plan hors durée.
- [`tools/contenu/relecture.py`](../../tools/contenu/relecture.py) + [`lexique-interdit.txt`](../../tools/contenu/lexique-interdit.txt) — l'oral relu contre le cerveau, règle par règle.
- [`tools/contenu/README.md`](../../tools/contenu/README.md) — l'installation et l'usage.
- [`../05_systeme/templates/template-recette-piece.yaml`](../05_systeme/templates/template-recette-piece.yaml) — le gabarit de recette.
- Cette fiche, et les renvois depuis `chaine-contenu.md`, `contenu-drive.md`, le `CLAUDE.md` racine.

✅ **Testé le 2026-10-21 sur trois rushes synthétiques** (détail dans le README des outils).
⛔ **Pas testé sur les vrais rushes 4K/60** : c'est le premier geste à faire sur la machine de Basekou.

## 9. Ce que ce système n'est pas

- **Pas un outil web ni une app** — trois scripts et des fichiers texte, dans la ligne de « tout reste
  dans des fichiers compilés par Claude Code » *(CLAUDE.md)*.
- **Pas le système visuel** — il ne génère rien ; il prend ce que `03_generes/` lui donne.
- **Pas un nouveau lieu de statut** — Notion garde les statuts des pièces, le Drive les fichiers, le dépôt les règles.
- **Pas une cadence** — il produit des pièces vraies ; le volume, s'il vient, vient d'ailleurs.
