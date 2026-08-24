---
statut: en_cours
domaine: visual
maj: 2026-08-24
source: "Restitution demandée par Basekou (session 2026-08-20) : le chantier générateur n'était documenté nulle part. Dérivé de docs/visual/*, docs/03_marche/contenu-et-pubs.md, et du schéma réel du MCP Higgsfield."
resume: "Ce qu'est le générateur (Higgsfield via MCP, pas un outil maison), son format d'entrée réel, ce que le cahier des charges impose déjà (à ne pas répéter dans les prompts), ce qui reste au rédacteur, les limites et les contradictions ouvertes."
---

# Le générateur de contenu (Higgsfield)

*Fiche de restitution. Objectif : qu'une session qui écrit des prompts (hooks, scripts, plans)
sache exactement ce qui est déjà cadré — pour ne pas le répéter ni le contredire — et ce qu'il
lui reste à fournir. Cette fiche ne duplique pas le système visuel : elle y renvoie.*

## Il n'y a pas de « générateur maison »

Le dépôt ne contient **aucun générateur** : ni code, ni script, ni service, ni fichier de
configuration. Le « générateur » est **Higgsfield** (SaaS externe), désormais piloté depuis les
sessions Claude Code via le **MCP Higgsfield** (`generate_image`, `generate_video`, plus les
outils d'édition : upscale, outpaint, remove_background, reference elements…).

Le « cahier des charges » n'est pas un fichier unique non plus : il est **éclaté** sur le système
de production visuelle (`docs/visual/`) et la méthode créa (`docs/03_marche/contenu-et-pubs.md`).
Il a été pensé pour des **images fixes** + une **pub produit à 4 plans** ; la partie **vidéo** et
le cas **plan réel** sont sous-documentés (voir « Contradictions »).

## Le format d'entrée réel

Le générateur n'attend **pas** un objet à champs narratifs nommés. Il attend un **texte libre +
des paramètres structurés**. Schéma réel des outils MCP :

```
generate_image / generate_video
  params.model         (requis)  ID modèle. Docs projet : image "recraft-v4-1",
                                  vidéo "seedance_2_0". La liste live se lit via models_explore.
  params.prompt        (texte libre)
  params.aspect_ratio            ex. "9:16"
  params.count                   1-4 variantes du MÊME prompt (mêmes inputs)
  params.duration      (vidéo)   secondes
  params.medias[]                références : { role, value } ; value = media_id
                                  (canal des Reference Elements)
  params.get_cost                préchiffre les crédits sans générer
  params.use_unlim               crédits (défaut) vs essais gratuits
```

Les paramètres « narratifs » (sujet, action, lumière…) **n'existent pas côté API** : ils vivent
**dans le texte du prompt**, selon une structure maison :

- **Image** : Sujet → Composition → Environnement → Lumière → Caméra → Rendu.
- **Vidéo — formule MCSLA** : *Model · Camera · Subject · Look · Action* (caméra en position 2),
  **un seul mouvement caméra nommé** par clip (ex. « Dolly In lent »), verbes actifs.

Le système visuel (`docs/visual/`) ajoute une compilation par IDs : SUJET → décor → caméra →
lumière → matières → composition → action → émotion (cf. `ledje-prompt-library.md`), montés sur
les invariants de `ledje-master-prompt.md`.

## Déjà cadré — à NE PAS répéter dans les prompts

Source : `ledje-master-prompt.md` (invariants) + `contenu-et-pubs.md` (paramètres vidéo).

- **Ratio** : 9:16. **Durée clip** : 3-5 s, générés séparément, assemblés dans CapCut.
- **Style** : photographie éditoriale contemporaine sobre ; jamais rustic / vintage / cottagecore /
  « vieille pub de miel » ; lumière naturelle douce (matin ou fin d'après-midi) ; focale humaine,
  faible profondeur de champ ; pas de grand-angle, drone, flash, néon, studio visible.
- **Palette** : neutres (crème / sable / pierre) + accent **émeraude**. ⚠️ **L'or et l'ambre sont remis en question** comme couleurs de marque (palette rouverte, cf. `../01_adn/identite-visuelle.md`) — les employer avec retenue, jamais comme socle d'une image. *(L'ambre du miel lui-même est un fait de matière, pas une couleur de marque.)*
- **Matières** : liste autorisée / interdite (cf. master-prompt, section Materials).
- **Produit** : cristal de miel = forme géométrique simple, dissolution lente sans effervescence,
  eau qui reste claire ; bouteille = spec figée, rendue comme un vrai produit fini. ⚠️ **L'étiquette : ne jamais spécifier de police**, et garder le texte **suggéré, jamais rendu lisible** — l'identité typographique n'est pas tranchée, et l'IA rend les mentions en lettres aléatoires.
- **Présence humaine** : mains / silhouettes / profils ; **jamais les yeux visibles** (non négociable).
- **Composition** : max 3 éléments, espace négatif pour le texte.
- **Texte** : jamais généré par l'IA — ajouté en CapCut / Canva. Le payoff (signature + lédjé)
  s'ajoute au montage.
- **Langue** : prompt final en anglais (validé en FR sur le papier d'abord).
- **Negative prompt standard** : symbole religieux, yeux visibles, texte santé, marque concurrente,
  luxe ostentatoire, matières interdites.
- **Économie** : plan fixe = image (~1 cr) animée au montage ; n'animer (~17 cr/5 s) que si le
  mouvement est essentiel.

## À la charge du rédacteur — le delta

Pour qu'un prompt soit exploitable, il apporte **uniquement** :

- Le **SUJET** (le héros du plan) et l'**ACTION / transition** précise (le mouvement en cours).
- Le **décor** précis et l'**instant narratif** (les 3 questions : avant / maintenant / après).
- Pour la vidéo : le **mouvement caméra nommé** (MCSLA).
- Le cas échéant : le fait que **ce plan est tourné en vrai** (voir ci-dessous).

## Le cas « plan réel » — non codifié (à trancher)

Principe voulu par Basekou : **le produit est filmé pour de vrai, le reste passe à l'IA**. Le
générateur **ne doit jamais inventer la bouteille** (l'étiquette change à chaque plan) ; il peut
en revanche **traiter des plans réels** (image-to-video, composition autour d'un plan tourné).

État actuel : `ledje-master-prompt.md` place « Product accuracy » en priorité n°1 (garde-fou
anti-dérive IA) et l'image-to-video existe côté outil, mais la **discipline « ne jamais générer la
bouteille / composer sur des plans tournés »** n'est écrite nulle part. ⚠️ **À trancher et à
codifier** (ce serait l'objet d'une éventuelle ébauche de cahier des charges vidéo, hors périmètre
de cette restitution).

## Limites connues

- Compte Higgsfield **plan Basic** (limité) — passage plan supérieur prévu pour Seedance complet.
- **Les vidéos produites à ce jour sont jugées non satisfaisantes** (cause : l'ancien « monde ambre
  générique » ; à refaire dans le monde émeraude+or du design system).
- L'analyse d'une pub de référence exige le **fichier vidéo** (jamais un lien TikTok).
- Règle **1 image = 1 intention = 1 prompt = 1 usage** ; jamais de variantes multiples dans un prompt.
- **Zéro image encore générée** dans le cadre du système visuel actuel (`ledje-asset-log.md` vide) :
  les presets de `ledje-prompt-library.md` sont des hypothèses, pas des résultats prouvés.
- Coûts indicatifs : ~1 cr / image, ~17 cr / clip 5 s.

## Contradictions signalées (non résolues)

1. **« perle » (et « portion ») sont des termes bannis.** `identite-verbale.md` (« portion ·
   monodose · perle · pastille → on dit **cristal de miel** ») et `cristal.md` (la « perle de miel
   gravée » n'existe pas industriellement, abandonnée). Or `ledje-prompt-library.md` nommait
   **SUJ-01 « la perle »** et décrivait le sujet comme « la portion de miel » (introduit en v1.2 à
   la demande orale de Basekou). ✅ **Rename validé (Basekou, 2026-08-20)** : SUJ-01 devient
   « le cristal de miel » — correctif appliqué à `prompt-library.md`, `shot-book.md`, `CLAUDE.md`.
   ✅ **RÉSOLU le 2026-08-20** : `ledje-master-prompt.md` (fiche protégée) est corrigé **sur accord
   explicite de Basekou** — « Honey Portion » devient « Honey Crystal / cristal de miel », avec le rappel
   de l'interdit. Tracé dans `ledje-asset-log.md`, section « Modifications du Master Prompt ».
2. **Grille de contenu — résolu.** La `03_marche/grille-contenu.md` est désormais à jour (version
   **20/08**) : **7 formats répétables** dont deux à forte génération — **l'évidence** et **le
   détournement de pub** — et « le cahier des charges du générateur » listé comme bloquant, pointant
   vers cette fiche. La version documentaire du 17/08 est remplacée. Plus de divergence.
3. **Rôles produit — ✅ RÉSOLU le 2026-08-20.** Le master-prompt et le visual-language présentaient le
   **cristal comme « produit de lancement »** et la **bouteille comme « phase 2 »** : les deux rôles étaient
   inversés. Rétabli sur accord de Basekou — la **bouteille 33 cl est le produit de lancement** (fabriquée
   et vendue, canal restaurant), le **cristal est le produit de conversion en ligne** (pas encore produit,
   aucun conditionneur identifié). L'ancienne réserve « bouteille = phase 2 » portait sur la **vente en
   ligne uniquement**, pas sur l'existence du produit : on peut la montrer comme réelle, parce qu'elle l'est.
4. **« l'évidence » : réconcilié dans la grille 20/08.** La version récente tranche la collision : «
   l'évidence » est un **format** qui découle explicitement de l'**ingrédient 3 du territoire**
   (`territoire-de-marque.md`, « l'évidence du produit »). Plus de contradiction une fois la grille
   20/08 déposée.
5. **Allégation santé implicite (image comprise).** Les formats génératifs « l'évidence » et « le
   détournement de pub » sont ceux qui risquent le plus l'allégation implicite ; le filtre
   `conformite.md` et le garde-fou V2 (jamais performance / sport / récup) s'appliquent à chaque pièce.
6. **Yeux visibles.** Interdiction non négociable — contrainte forte pour tout format à personnages
   (le geste, le terrain, la voix off, UGC).
7. **Le cahier existant est image-centré.** La partie vidéo (MCSLA) n'est qu'esquissée dans
   `contenu-et-pubs.md` ; pour une production en volume, la spec vidéo reste à écrire.
8. **Rappel déjà consigné** : le SOT archivé disait « pas de prompt-library maintenue à la main »,
   mais elle existe — le `CLAUDE.md` racine fait foi.

## Renvois

- Système visuel : `ledje-master-prompt.md`, `ledje-visual-language.md`, `ledje-prompt-library.md`,
  `ledje-shot-book.md`, `ledje-asset-log.md` (routés par le `CLAUDE.md` racine).
- Méthode créa & paramètres Higgsfield appris : `../03_marche/contenu-et-pubs.md`.
- Grille & territoire : `../03_marche/grille-contenu.md`, `../01_adn/territoire-de-marque.md`.
- Garde-fous : `../01_adn/conformite.md`, `../01_adn/identite-verbale.md`.
- Outillage : `../05_systeme/outils.md`.
