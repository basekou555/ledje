# Lédjé — Prompt Library (catalogue d'options modulaires)

*Ce fichier introduit une couche entre `ledje-master-prompt.md` (les lois de marque, jamais modifiées sans validation de Basekou) et `ledje-shot-book.md` (les fiches de shot). Il donne, pour chaque paramètre visuel qui PEUT varier d'une photo à l'autre, une liste d'options nommées avec un ID court et un cahier des charges fixe — pour que "la table à manger" ou "l'angle macro" ressemble toujours à la même chose, quel que soit le shot qui l'utilise.*

**Pourquoi ce fichier existe (traçabilité de la décision)** : la v1 de l'architecture documentaire (voir "Ce qu'on ne construit PAS" dans `CLAUDE.md`) excluait consciemment un système d'options séparé, jugé surdimensionné pour un premier lot de 8-10 images. Basekou a explicitement demandé son introduction pour pouvoir choisir/ajuster chaque paramètre d'une photo sans repartir de zéro à chaque compilation, et pour que le système capitalise automatiquement sur ce qui marche. Cette page remplace cette restriction.

**Rapport avec les blocs DA de `ledje-visual-language.md` / `ledje-shot-book.md`** : les blocs DA-01 à DA-04 sont des règles universelles (quasi toujours vraies, non un choix créatif). Les ID de ce fichier sont des choix *à l'intérieur* de ces règles — ex. DA-01 impose "toujours une lumière naturelle douce", `LIGHT-01`/`LIGHT-02`/`LIGHT-03` choisissent *laquelle*.

---

## Comment ça s'utilise

Un prompt de shot = `ledje-master-prompt.md` (lois de marque, invariant) + **une option par paramètre choisie ici** (ou le preset par défaut de la catégorie du shot) + le delta narratif propre au shot (dans `ledje-shot-book.md`, ce qui ne peut pas se réduire à un ID — l'instant précis raconté).

Quand Basekou demande de compiler un shot :
1. S'il donne un ID de shot existant → appliquer le preset de sa catégorie (voir Presets ci-dessous), sauf s'il précise un changement ("je préfère la lumière fin d'après-midi").
2. S'il décrit une envie en langage naturel sans ID précis → proposer la catégorie de shot la plus proche (Hero / Geste-Process / Packshot) + le preset recommandé, et demander confirmation avant de compiler.
3. Toujours vérifier `ledje-asset-log.md` avant de finaliser — si un pattern a été validé plusieurs fois, il doit déjà être remonté dans le preset ci-dessous (voir boucle d'apprentissage).

---

## DÉCOR (DEC)

Chaque décor est un "set" fixe — les mêmes objets, le même monde, à chaque fois qu'il est convoqué (cohérent avec `ledje-visual-language.md` : *"la répétition crée l'identité"*).

| ID | Nom | Cahier des charges fixe |
|---|---|---|
| DEC-00 | Neutre / Macro | Fond neutre uni ou flouté (crème, sable ou pierre), sans décor narratif. Utilisé pour les plans macro et les packshots où le sujet doit être isolé. |
| DEC-01 | Table à manger | Table en bois massif clair ou pierre calcaire. Nappe/set en lin froissé blanc cassé. Une pièce de céramique artisanale claire. Un petit bouquet discret de fleurs de saison. Du pain, parfois quelques dattes. Lumière qui vient d'une fenêtre hors champ. |
| DEC-02 | Bureau | Bureau en bois clair ou pierre. Ordinateur portable fermé ou entrouvert, un carnet en papier texturé, un verre d'eau, éventuellement des lunettes. Jamais de désordre, jamais une scène de productivité extrême. |
| DEC-03 | Extérieur urbain | Parc urbain, terrasse ou quai. Béton visible en fond, discret. Verdure minimale, jamais une nature idéalisée. Un banc ou une table basse en pierre. |
| DEC-04 | Lieu de vie | Salon ou balcon. Table basse en bois ou pierre, fauteuil en lin/coton, éventuellement une bibliothèque discrète et floutée en fond. |

---

## CAMÉRA (CAM)

| ID | Nom | Cahier des charges fixe |
|---|---|---|
| CAM-01 | Hauteur d'œil (défaut) | Focale humaine, faible profondeur de champ, angle neutre à hauteur d'œil. Jamais de grand angle déformant. |
| CAM-02 | Macro extrême | Très faible profondeur de champ, isole un détail (goutte, texture, point de contact). Réservé aux moments de transformation. |
| CAM-03 | Légère plongée | Angle légèrement au-dessus, pour cadrer une table ou un geste vu de dessus. Jamais un effet drone/FPV. |
| CAM-04 | Plan large habité | Cadre plus large pour situer un décor entier (extérieur, lieu de vie), focale humaine conservée, sujet net et central. |
| CAM-05 | Packshot face | Produit cadré de face, centré, fond neutre uni — studio implicite mais lumière non visible. |
| CAM-06 | Packshot 45° | Produit cadré en angle 3/4 pour montrer le volume, fond neutre uni. |

---

## LUMIÈRE (LIGHT)

| ID | Nom | Cahier des charges fixe |
|---|---|---|
| LIGHT-01 | Matin diffus | Lumière douce et fraîche de début de journée. Associée au "premier rituel". |
| LIGHT-02 | Fin d'après-midi | Lumière chaude, dorée, oblique. Associée au "calme après". |
| LIGHT-03 | Ciel couvert doux | Lumière égale, neutre en température, sans ombre dure. Réservée aux packshots où la fidélité couleur prime. |

Rappel non-négociable (DA-01, cf. master-prompt.md) : toujours naturelle, jamais de flash/néon/studio visible.

---

## MATIÈRES / PALETTE (MAT)

| ID | Nom | Cahier des charges fixe |
|---|---|---|
| MAT-01 | Neutre dominant, émeraude en accent | Tons crème/sable/pierre dominants, une touche émeraude (reflet, détail), or/ambre en accent chaud. Défaut lifestyle. |
| MAT-02 | Émeraude dominant (fond plein) | Fond émeraude structuré — pour les packshots e-commerce et l'écrin de marque. 🧪 En test face à MAT-01 pour les packshots (cf. Global Identity, master-prompt.md) — logger le résultat. |
| MAT-03 | Ambre/or dominant | Dominante chaude ambre/or — pour les gros plans sur le miel et les moments de dissolution. |

---

## COMPOSITION (COMP)

| ID | Nom | Cahier des charges fixe |
|---|---|---|
| COMP-01 | Macro, 3 éléments, espace latéral | Sujet + eau/miel + fond flouté, espace négatif d'un côté du cadre. |
| COMP-02 | Grand espace négatif | Sujet excentré, large zone vide pour intégration de texte (landing, campagne). |
| COMP-03 | Centré symétrique | Packshot produit sur fond neutre uni, sujet centré. |

---

## ACTION (ACT)

| ID | Nom |
|---|---|
| ACT-01 | Placing / Pouring (poser, verser) |
| ACT-02 | Dissolving (dissoudre) |
| ACT-03 | Reaching / Lifting (attraper, soulever) |
| ACT-04 | Opening (ouvrir) |
| ACT-05 | Leaving / Returning (partir, revenir) |
| ACT-06 | Drinking / Tasting (porter à la bouche, déguster) |

Rappel non-négociable (master-prompt.md, section Actions) : chaque image capture une transition, jamais un objet statique — même les shots d'ambiance (H04, H05) doivent porter la trace d'une action passée ou en cours.

---

## ÉMOTION (EMO)

| ID | Nom |
|---|---|
| EMO-01 | Anticipation calme (début du rituel) |
| EMO-02 | Calme après (rituel accompli, silence habité) |
| EMO-03 | Chaleur du geste quotidien (une vie normale sublimée) |

---

## Presets par catégorie de shot

⚠️ **v1, hypothèse de départ — aucune génération n'a encore été validée dans `ledje-asset-log.md`.** Ces presets sont des recommandations de bon sens, pas des résultats prouvés. Dès qu'un choix est confirmé (validé 2-3 fois pour une catégorie), ce tableau est mis à jour directement — pas besoin de validation de Basekou pour ça (contrairement à `ledje-master-prompt.md`/`ledje-visual-language.md`, qui restent verrouillés).

| Catégorie | Décor | Caméra | Lumière | Matières | Composition | Émotion |
|---|---|---|---|---|---|---|
| **Hero** (ambiance, narratif fort) | selon le shot | CAM-01 (CAM-02 pour un plan signature) | LIGHT-01 | MAT-01 | COMP-02 | EMO-01 ou EMO-02 |
| **Geste / Process** (la transformation en train de se faire) | DEC-00 | CAM-02 | LIGHT-01 ou LIGHT-02 | MAT-03 | COMP-01 | EMO-01 |
| **Packshot e-commerce** | DEC-00 | CAM-05 ou CAM-06 | LIGHT-03 | MAT-01 (MAT-02 en test) | COMP-03 | — (produit seul, pas d'émotion humaine) |

---

## Boucle d'apprentissage (extension de l'Evolution Policy)

Deux niveaux de capitalisation, pour aller plus vite sans perdre la rigueur :

1. **Niveau preset (rapide, pas de validation requise)** : si une combinaison d'options se confirme comme la meilleure pour une catégorie de shot (2-3 générations validées dans `asset-log.md`), le tableau "Presets" ci-dessus est mis à jour directement pour refléter ce nouveau défaut.
2. **Niveau loi de marque (rare, validation de Basekou requise)** : si une option précise se révèle systématiquement la meilleure *au-delà d'une seule catégorie* (ex. une lumière qui marche pour Hero ET Packshot ET Geste), elle peut être proposée pour intégration dans `ledje-master-prompt.md` comme nouveau "strong default" — cf. Evolution Policy dans ce fichier, validation de Basekou obligatoire.
