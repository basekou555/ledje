Lédjé — Master Prompt
Le socle canonique. Chaque prompt de shot = ce document + le delta spécifique du shot (voir shot-book.md). Sections alignées avec l'ordre de compilation défini dans visual-language.md.
Source : dérivé de `LEDJE_SOURCE_OF_TRUTH.md` (Partie 3, Design System) et `ledje-visual-language.md`. Si le Design System change, ce fichier doit être resynchronisé.
Global Identity
Photographie éditoriale contemporaine, sobre et digne — jamais froide, jamais ostentatoire. Registre : sobriété vivante, pas minimalisme froid.
Descripteurs autorisés pour guider le modèle : "editorial product photography", "contemporary premium lifestyle campaign" (qualité photographique, pas positionnement de marque). 🧪 À tester, pas encore tranché : l'interdiction stricte de tout vocabulaire "luxe" reste la règle par défaut ("on n'est pas une marque de luxe"). La nuance ci-dessus (descripteurs techniques neutres autorisés, clichés "quiet luxury"/"old money"/"ultra luxury" toujours bannis) est une hypothèse à tester sur quelques générations avant d'être verrouillée — cf. Evolution Policy. Logger le résultat dans `asset-log.md`.
À éviter systématiquement : rustic farmhouse, vintage still life, cottagecore, imagerie "vieille pub de miel". Fil narratif de toute image : la rencontre (miel/eau, tradition/contemporain).
Priority Order
Quand un modèle ne peut pas tout satisfaire à la fois, cet ordre tranche :

1. Product accuracy — garde-fou technique contre la dérive de l'IA (elle réinvente le produit si on ne la contraint pas). Ce n'est pas une hiérarchie de valeur narrative — le produit n'est jamais "le héros" (cf. visual-language.md), mais il doit être rendu correctement quand il est visible, sinon la marque devient méconnaissable.
2. Narrative — le moment raconté (cf. section Narrative ci-dessous).
3. Emotion — le calme vivant recherché.
4. Composition — cadrage, espace négatif.
5. Decorative elements — matières et props secondaires.
Product Definition
Non-negotiable (jamais d'exception)

```
Bottle
  Material: PET transparent
  Capacity: 33 cl
  Shape: Slim, straight cylinder, short neck
  Cap: Brushed gold
  Label: Emerald green, gold typography (Fraunces)
  Liquid: Pale golden amber, near-transparent — reads as fresh water first, never a thick juice
  Status: communication anticipée uniquement (phase 2) — jamais présentée en achat immédiat

Honey Portion (produit de lancement)
  Form: simple geometric shape (square / rectangle / disc) — NOT a carved sphere (non confirmé industriellement)
  Color: warm amber
  Behaviour on dissolving: slow infusion-like diffusion, no effervescence, water stays clear
  Status: format exact et argument "jamais chauffé" en attente de vérification fournisseur

Glass
  Clear, straight, minimal
  No branding on the glass itself

Alvéole (symbole)
  Thin hexagon outline, one filled cell at center
  Discreet presence, not systematic

```

Strong defaults (déviation possible si le shot le justifie, documenté dans shot-book.md)
Voir sections Camera, Light, Materials ci-dessous — chacune indique ses défauts forts.
Shot-specific
Définis au cas par cas dans `shot-book.md` (sujet, action, décor, composition particulière).
Narrative
Chaque image raconte un instant. Elle doit répondre à trois questions :

* Que s'est-il passé une seconde avant ?
* Que se passe-t-il maintenant ?
* Que va-t-il se passer une seconde après ?
Une image qui ne peut pas répondre à ces trois questions est un objet figé, pas une image Lédjé. C'est la différence entre une belle photo et une image de marque.
Photography
Chaque image doit ressembler à un photogramme d'un même film — même lumière, mêmes matières, même calme, comme si un seul photographe avait tout shooté en une journée. Une trace de mouvement discret dans chaque image (goutte, reflet, main qui entre dans le cadre, lin froissé).
Strong default.
Camera
Focale humaine, faible profondeur de champ pour isoler le sujet. Angle à hauteur d'œil par défaut. Pas de grand angle déformant, pas d'effet drone/FPV.
Strong default — le shot-book peut préciser un angle différent si justifié.
Light
Toujours naturelle, douce, crédible — matin diffus ou fin d'après-midi. Jamais de flash, néon, studio visible, contraste agressif.
Strong default.
Materials
Autorisées : pierre calcaire/travertin, verre, eau, lin, coton, bois massif, papier texturé, miel, laiton brossé, céramique artisanale. Interdites (non-negotiable) : plastique brillant, marbre noir, chrome, résine, surfaces miroir, décors futuristes, clichés "bio" (prairies, abeilles à profusion), tout ce qui lit comme ostentatoire.
Palette (cf. SOT §3.2) : dominantes neutres (crème `#EDE0C8`, sable, pierre, blanc cassé) + accents émeraude (`#2E6B4F` moyen / `#0F3D2A` profond), or (dégradé `#FBE9A8`→`#E8B65C`→`#A9740F`), ambre (`#E0A52E`). Nuance par médium : packshot produit = l'émeraude peut dominer (fond) ; lifestyle = émeraude en touche signature, les neutres dominent.
Human Presence
Mains, silhouettes, profils, gestes uniquement. Non-negotiable : jamais de visage identifiable, jamais les yeux visibles. Idéalement hors champ.
Actions
Chaque image capture une transition, jamais un objet statique.
Exemples : placing · pouring · shaking · dissolving · reaching · lifting · opening · leaving · returning.
L'action précise de chaque shot est définie dans sa fiche shot-book (delta) ; ce bloc fixe la règle générale : toute image montre un mouvement en train de se faire, même subtil.
Composition
Maximum 3 éléments principaux par image. Espace négatif généreux (intégration de texte ultérieure). Un seul sujet principal.
Negative Prompt
Non-negotiable, sur toute image :

* Aucun symbole religieux explicite.
* Aucun visage identifiable, aucun regard/yeux visibles.
* Aucun texte généré par l'IA suggérant un effet santé — le texte s'ajoute en montage.
* Aucune comparaison ou symbole visuel évoquant une marque concurrente nommée.
* Aucun signal visuel de luxe ostentatoire (dorures excessives, cristal, marbre noir, chrome).
* Aucun matériau de la liste interdite (cf. Materials).
Success Checklist (avant d'accepter une image)

* [ ] Produit immédiatement identifiable (sauf exception narrative volontaire et assumée)
* [ ] Une seule idée racontée
* [ ] Une action / transition visible
* [ ] Le miel et l'eau sont tous les deux présents (physiquement ou suggérés)
* [ ] L'image appartient au même univers que les précédentes (cf. Global Identity)
* [ ] De l'espace existe pour la typographie
* [ ] Aucun élément ne détourne le regard du sujet
Test de validation (question ultime)
"Est-ce que cette image donne envie de vivre ce moment ?" (pas d'acheter, pas de posséder). Filtre complémentaire : "Donne-t-elle envie de ralentir 30 secondes ?"
Evolution Policy
Pour que ce document reste une référence fiable dans le temps et ne devienne pas un fourre-tout :

* Le Master Prompt n'est modifié que lorsqu'un changement bénéficie à plusieurs shots — jamais pour une préférence ponctuelle.
* Une règle n'est ajoutée qu'après validation sur plusieurs générations (cf. `asset-log.md`, section "Réglages capitalisés").
* Les préférences ponctuelles restent dans `shot-book.md`, jamais ici.
* Toute modification de ce document est documentée dans `asset-log.md` avec sa justification.
Comment ce document s'utilise
Un prompt de shot = Master Prompt (ce fichier) + Shot Delta (fiche du shot-book.md). Claude Code peut cibler une section précise (ex. régénérer seulement en changeant Light) sans toucher au reste.
