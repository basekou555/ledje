# Lédjé — Shot Book (v1 allégée — priorité P1 uniquement)

*Plan de tournage. Complète `ledje-visual-language.md` (les règles) — ne pas répéter ici ce qui y est déjà fixé (lumière, personnages, interdits). Chaque fiche ne liste que ce qui CHANGE d'une image à l'autre.*

**Portée volontairement réduite :** seulement les images indispensables pour valider une première direction avec la designeuse et lancer un test. Le shot-book complet (80 images, 8 actes, prompt-compiler) est une piste pour la phase de production en volume — pas maintenant (cf. note de méthode en fin de document).

**⚠️ Produit :** tant que le format de lancement n'est pas confirmé par les fournisseurs (portion simple vs bonbon transformé, cf. visual-language.md), les shots produit restent génériques ("une portion de miel qui se dissout"), sans détail de texture ou de mécanisme non vérifié.

---

## Blocs réutilisables (DA — Direction Artistique)

Au lieu de répéter la même info dans chaque fiche, on référence un bloc :

- **DA-01** = lumière naturelle douce (matin diffus ou fin d'après-midi), jamais de flash/studio visible.
- **DA-02** = visage jamais identifiable, yeux jamais visibles ; hors champ si possible.
- **DA-03** = sobriété vivante — pas de minimalisme froid, pas de vocabulaire luxe ; une trace de mouvement/imperfection dans le cadre.
- **DA-04** = règle des 3 éléments maximum, espace négatif généreux (pour intégrer du texte plus tard).

---

## Structure d'une fiche (allégée — 8 champs, pas 16)

`ID` · `Nom` · `⭐ Iconique ?` · `Objectif` · `Décor` · `Sujet/Action` · `Blocs DA appliqués` · `Notes/contraintes spécifiques`

---

## ACTE I — HERO (P1, les 5 images fondatrices)

| ID | Nom | ⭐ | Objectif | Décor | Sujet / Action | DA | Notes |
|---|---|---|---|---|---|---|---|
| H01 | La Rencontre | ⭐ | Image signature — la transformation | Neutre, macro | La goutte/perle de miel touche l'eau, l'instant de la dissolution qui commence | DA-01, DA-03, DA-04 | Le plan le plus important du set. Émeraude en accent (reflet, fond flouté), pas en fond plein. |
| H02 | Le Premier Rituel | | Poser l'ambiance quotidienne | Table à manger | Une main s'approche du verre, lumière du matin | DA-01, DA-02, DA-04 | |
| H03 | Le Geste | | Montrer l'action, pas l'objet | Neutre | Main qui verse ou dépose la portion dans l'eau | DA-01, DA-02, DA-03 | |
| H04 | Le Quotidien | | Ancrer dans une vraie vie, pas un studio | Bureau ou extérieur urbain | Le verre posé dans un décor de vie habité | DA-01, DA-04 | Béton/ville discret en fond si extérieur. |
| H05 | Le Calme | | L'émotion dominante de la marque | Lieu de vie (salon/balcon) | Verre à moitié bu, personne dans le cadre, silhouette lointaine | DA-01, DA-03 | Le "après" — rarement montré par les marques de boisson, à exploiter. |

---

## ACTE II — LE GESTE (P1 partiel — la séquence essentielle)

| ID | Nom | ⭐ | Objectif | Décor | Sujet / Action | DA | Notes |
|---|---|---|---|---|---|---|---|
| G01 | Prendre | | Ouvrir la séquence | Neutre | Main saisit la portion de miel | DA-01, DA-02 | |
| G02 | La Dissolution | ⭐ | Le moment signature | Macro, neutre | Le miel se diffuse dans l'eau, façon infusion de thé — pas d'effervescence, eau qui reste limpide | DA-01, DA-03, DA-04 | Lié à H01, angle différent. Le plan le plus "produit" du set. |
| G03 | La Dégustation | | Montrer l'usage complet | Table ou extérieur | Verre porté à la bouche, visage hors champ, belle couleur ambre dans le verre | DA-01, DA-02, DA-04 | |

*(Le Shake — pertinent seulement pour la bouteille, phase 2/communication anticipée — voir note produit ci-dessus. À activer plus tard si besoin de contenu bouteille.)*

---

## ACTE III — PACKSHOTS E-COMMERCE (P1 minimal — le nécessaire pour la landing/boutique)

| ID | Nom | ⭐ | Objectif | Décor | Sujet / Action | DA | Notes |
|---|---|---|---|---|---|---|---|
| EC01 | Face | | Fiche produit — vue principale | Fond neutre uni | Packaging de face | DA-04 | Fond crème ou émeraude selon test (cf. visual-language, nuance fond/signature). |
| EC02 | 45° | | Fiche produit — volume | Fond neutre uni | Packaging en angle | DA-04 | |
| EC03 | Packaging ouvert | | Montrer le contenu | Fond neutre uni | Packaging ouvert, portion(s) visible(s) | DA-04 | |

---

## Ce qu'on NE fait PAS maintenant (déféré, pas abandonné)

- Le shot-book complet (Actes IV-VIII : Quotidien étendu, Détails, Preuves, déclinaisons e-commerce complètes) — à reprendre en phase de production volume.
- Le "Visual Prompt System" / compiler modulaire (dossiers subjects/actions/decor/etc.) — bookmarké, même logique que le skill Higgsfield (SOT §6.4) : utile à l'échelle, surdimensionné pour un premier lot de 8-10 images.
- `asset-library.md` — prématuré tant qu'aucune image n'est validée sur le produit confirmé.
- Le Shake / séquence bouteille détaillée — activer seulement quand on produit du contenu de communication anticipée bouteille.

## Méthode de production (rappel, cohérent avec SOT §6.1)

Pour chaque shot : construire le prompt à la main, bloc par bloc (`SCENE → PRODUCT → COMPOSITION → CAMERA → LIGHT → MATERIALS → ÉMOTION`, déjà défini dans `ledje-visual-language.md`), valider sur le papier avant de dépenser un crédit Higgsfield. Un changement de variable à la fois. Commencer par **H01** (l'image la plus importante, socle des autres).
