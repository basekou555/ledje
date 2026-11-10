---
name: ledje-produit
description: "Trame de travail d'une session « Produit » du projet lédjé : recette et dosage de l'eau miellée, tests de conservation et lecture des lots, date limite de consommation, étiquetage réglementaire, tableau nutritionnel, fournisseurs de miel, de bouteilles et d'étiquettes, démarches d'hygiène. À utiliser quand Basekou parle d'un lot, d'un test, d'une dose, d'un pourcentage de miel, de l'étiquette, d'un devis fournisseur, de la DDPP ou de ce qu'il a le droit d'écrire sur la bouteille."
---

# Trame d'une session « Produit »

**Première version, écrite le 2026-11-10 à partir des fiches, jamais déroulée.**

**Règle d'or : zéro invention.** Une spec produit engage le sourcing et la conformité. Ce qui
n'est pas confirmé reste écrit « à compléter ».

## Étape 1 — Lire

1. `docs/README.md`, la page ÉTAT de Notion (lecture totale).
2. `docs/02_produit/README.md`, puis la fiche du sujet :
   - la bouteille et sa recette : `docs/02_produit/eau-miellee-33cl.md` ;
   - l'étiquette : `docs/02_produit/reglementaire-etiquetage.md` ;
   - le prix : `docs/02_produit/prix.md` ;
   - la production et les tests : `docs/04_operations/production-artisanale.md` ;
   - les fournisseurs : `docs/04_operations/fournisseurs.md` ;
   - l'hygiène et l'administration : `docs/04_operations/demarches-admin.md`.
3. La page Notion « Tests de formulation — journal brut » : c'est là que la session Produit note
   ses relevés datés. Elle lui appartient, c'est donc elle qui la corrige.
4. Les dernières lignes de `decisions-log.md` sur le sujet. **On ne repose pas un point tranché** :
   lire la date de la dernière décision avant de recommander quoi que ce soit.

## Étape 2 — Savoir ce qui est tranché

Vérifier chaque point dans la fiche avant de s'y appuyer ; cette liste date du 10/11.

- La bouteille porte une date limite de consommation, pas une date de durabilité minimale.
  Aucune date n'est pré-imprimée.
- L'assemblage de miels est arrêté depuis le 15/10 ; un des trois miels d'origine en est sorti.
- La dose est figée depuis le 07/11, et le pourcentage de miel imprimé depuis le 09/11.
- L'étiquette porte un seul champ, « À consommer jusqu'au » : la date vaut numéro de lot.
- Le format du pack est arrêté ; sa mécanique interne ne s'annonce pas au client.

**Ouvert au 10/11 :** la durée de la date limite, l'étude de laboratoire sans réponse, le droit
d'écrire « eau de source », deux attestations fournisseur non reçues, les saveurs.

## Étape 3 — Les règles du dossier produit

- **Zone intermédiaire** : toute modification de `docs/02_produit/` se propose dans la réponse et
  s'applique après l'accord de Basekou.
- **Aucun montant ne s'écrit au dépôt.** Les chiffres vont dans la page Notion de comptabilité.
  Si un montant est déjà présent dans une fiche, le signaler ; ne pas en ajouter.
- Le plancher de prix est interne : il ne sort jamais dans un texte destiné à un client ou à un
  partenaire.
- Terminologie verrouillée : « eau miellée », « cristal de miel ».
- On n'écrit jamais « le produit tient X jours ».
- Séparer ce qui est **constaté** de ce qui est **déclaré** par Basekou. La boîte
  `basekou@ledje.fr` n'est reliée à aucun outil : une réponse de fournisseur ou d'administration
  qui y arrive ne se voit pas depuis une session.

## Étape 4 — Lire un test de conservation

Consignes écrites dans `production-artisanale.md`, à rappeler à Basekou avant une lecture :

1. Lire le lot gardé à température ambiante **fermé** d'abord, puis l'ouvrir au-dessus de
   l'évier : une bouteille en plastique peut gonfler.
2. Le lot ambiant ne se goûte pas. L'échantillon prélevé se jette.
3. Lire à la même heure d'un relevé à l'autre, et noter l'heure réelle.
4. Un lot resté trop longtemps hors du froid se détruit ; le seuil est dans la fiche.

Noter le relevé brut dans le journal Notion, sans interprétation. L'interprétation vient après,
séparée.

## Étape 5 — Calculer

Piège déjà rencontré (16/09) : rapporter le miel au volume d'**eau** au lieu du **produit fini**.
Tout pourcentage et toute valeur nutritionnelle se calculent sur le produit fini.

Quand un chiffre change (dose, pourcentage), **tout ce qui en dépend change avec lui** : la liste
d'ingrédients, le tableau nutritionnel, la fiche, la maquette. Cas réel du 10/11 : une étiquette
portant le nouveau pourcentage dans la liste et les valeurs de l'ancien dans le tableau.
Refaire la liste complète de ce qui porte le chiffre avant de dire que c'est corrigé.

## Étape 6 — Étiquette et réglementaire

- La source est `reglementaire-etiquetage.md`, qui cite les textes. Un rapport interne n'est pas
  un texte de loi : le dire quand on s'appuie dessus.
- Vérifier les mentions obligatoires une par une, puis leur **taille légale** à la dimension
  réelle de l'étiquette, en millimètres.
- La maquette vit dans Canva. Vérifier ses dimensions réelles avant de travailler dessus.
- Tout texte d'étiquette passe la grille de `docs/01_adn/conformite.md` : aucun effet sur le
  corps, même suggéré.
- La session ne remplace pas un conseil juridique ni un laboratoire : sur une question de droit
  ouverte, dire qu'elle est ouverte.

## Étape 7 — Fournisseurs et devis

| Besoin | Outil |
|---|---|
| Relire un devis ou des conditions de vente | Skill `small-business:contract-review` |
| Lire un PDF | Skills `pdf-viewer` |
| Évaluer un fournisseur | Skill `operations:vendor-review` |
| Marge et scénarios de prix | Skill `small-business:margin-analyzer` — document interne, rien au dépôt |

Fournisseur actif (réponse reçue, négociation, commande) : sa propre fiche, avec le gabarit
`docs/05_systeme/templates/template-fiche-fournisseur.md`. Simple piste : une ligne dans
`fournisseurs.md`.

## Étape 8 — Consigner et fermer

1. Un fait nouveau entre dans la fiche le jour même, avec sa date. Un document déposé au Drive se
   **signale** à Basekou : un rapport déposé sans être signalé est resté ignoré (02/09).
2. Une décision : une ligne dans `decisions-log.md`.
3. L'état courant a changé : la page ÉTAT. Ne plus écrire dans l'ancienne page relais, gelée.
4. Dérouler `ledje-passation`.
