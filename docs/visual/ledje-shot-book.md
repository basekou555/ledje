# Lédjé — Shot Book (organisé par intentions de communication)

*Plan de tournage. Complète `ledje-visual-language.md` (les règles) — ne pas répéter ici ce qui y est déjà fixé (lumière, personnages, interdits). Chaque fiche ne liste que ce qui CHANGE d'une image à l'autre.*

**v2 — refactoring (décision Basekou) :** le shot-book est désormais organisé **uniquement par intentions de communication**, plus par actes/catégories de production (H, G, EC, Q...). Les intentions sont pérennes : elles servent aussi bien la landing que le site, l'e-commerce, les réseaux, les campagnes et les futures vidéos. C'est un refactoring, pas un changement de philosophie — le Visual Language, le Master Prompt et l'Asset Log sont inchangés. Aucune fiche n'a été perdue : la table de correspondance anciens IDs → nouveaux IDs est ci-dessous.

**Priorités conservées :** `P1` = à produire maintenant (valider une première direction, lancer un test) · `P2` = rédigé pour s'entraîner et préparer la production en volume — rien ne s'y génère avant validation des P1.

**⚠️ Produit :** tant que le format de lancement n'est pas confirmé par les fournisseurs (portion simple vs bonbon transformé, cf. visual-language.md), les shots produit restent génériques ("une portion de miel qui se dissout"), sans détail de texture ou de mécanisme non vérifié. Le packaging n'ayant pas de spec définitive, les fiches packshot le décrivent de façon générique.

---

## Les 6 intentions

| Intention | Mission | Question du visiteur |
|---|---|---|
| **Attirer** | Créer une émotion immédiate, arrêter le scroll, donner envie de découvrir Lédjé. | *Pourquoi cette marque attire mon attention ?* |
| **Expliquer** | Faire comprendre le concept : la rencontre miel/eau, le rituel, le geste, le fonctionnement. | *Qu'est-ce que Lédjé ?* |
| **Prouver** | Apporter des preuves : qualité, fabrication, matières, transparence, détails. | *Pourquoi puis-je faire confiance à ce produit ?* |
| **Projeter** | Permettre de s'imaginer vivre le rituel : quotidien, bureau, table, parc, partage. | *Est-ce que ce rituel a sa place dans ma vie ?* |
| **Inviter** | Donner envie de passer au geste : préparation, dégustation, produit, packshots de conversion. | *Et si j'essayais ?* |
| **Conclure** | Laisser une dernière impression forte, une fin calme et mémorable. | *Qu'est-ce que je retiens de Lédjé ?* |

## Blocs réutilisables (DA — Direction Artistique)

- **DA-01** = lumière naturelle douce (matin diffus ou fin d'après-midi), jamais de flash/studio visible.
- **DA-02** = visage jamais identifiable, yeux jamais visibles ; hors champ si possible.
- **DA-03** = sobriété vivante — pas de minimalisme froid, pas de vocabulaire luxe ; une trace de mouvement/imperfection dans le cadre.
- **DA-04** = règle des 3 éléments maximum, espace négatif généreux (pour intégrer du texte plus tard).

Sauf mention contraire, toutes les fiches appliquent **DA-01, DA-03, DA-04** ; **DA-02** dès qu'une présence humaine est visible.

## Structure d'une fiche

`ID` · `Nom` · `⭐ Iconique ?` · `P (priorité)` · `Mission du shot` · `Sujet/Action (le delta narratif)` · `Recette (IDs de ledje-prompt-library.md : décor, caméra, lumière, matières, composition, action, émotion, + props)` · `Contraintes/Notes`. Le champ **Prompt** de chaque fiche vit dans l'annexe "Prompts compilés" en fin de document (vide au départ, rempli au fil des validations). Tout ce qui est invariant reste dans `master-prompt.md`.

---

## ATTIRER

| ID | Ancien | Nom | ⭐ | P | Mission | Sujet / Action | Recette | Contraintes / Notes |
|---|---|---|---|---|---|---|---|---|
| ATT-01 | H01 | La Rencontre | ⭐ | P1 | L'image signature — la transformation qui arrête le scroll | La goutte/perle de miel touche l'eau, l'instant de la dissolution qui commence | DEC-00 / CAM-02 / LIGHT-02 / MAT-03 / COMP-01 / ACT-02 / EMO-01 | Le plan le plus important du set. Émeraude en accent, pas en fond plein. |
| ATT-02 | B01 | Le Shake | ⭐ | P2 | Le geste signature de la bouteille, le teaser phase 2 | Main qui secoue la bouteille, miel qui se mélange | DEC-03 / CAM-01 / LIGHT-02 / MAT-01 / COMP-01 / ACT-07 / EMO-03 | ⚠️ Bouteille = communication anticipée uniquement (SOT §1.4), jamais présentée comme achetable. Spec verrouillée dans master-prompt. |
| ATT-03 | B02 | La Fraîcheur | | P2 | L'envie immédiate | Bouteille perlée de condensation, posée dehors | DEC-03 / CAM-02 / LIGHT-02 / MAT-01 / COMP-01 / ACT-01 / EMO-01 | ⚠️ Idem ATT-02. Pas de cuisine/frigo (décor exclu). |
| ATT-04 | B03 | Portrait bouteille | | P2 | Le packshot d'annonce | Bouteille de face, étiquette émeraude lisible | DEC-00 / CAM-05 / LIGHT-03 / MAT-02 / COMP-03 / — / — | ⚠️ Idem ATT-02. |

## EXPLIQUER

| ID | Ancien | Nom | ⭐ | P | Mission | Sujet / Action | Recette | Contraintes / Notes |
|---|---|---|---|---|---|---|---|---|
| EXP-01 | G01 | Prendre | | P1 | Ouvrir la séquence du geste | Main saisit la portion de miel | DEC-00 / CAM-01 / LIGHT-01 / MAT-01 / COMP-01 / ACT-03 / EMO-01 | |
| EXP-02 | H03 | Le Geste | | P1 | Montrer l'action, pas l'objet | Main qui verse ou dépose la portion dans l'eau | DEC-00 / CAM-01 / LIGHT-01 / MAT-01 / COMP-01 / ACT-01 / EMO-01 | |
| EXP-03 | G02 | La Dissolution | ⭐ | P1 | Le fonctionnement, moment signature | Le miel se diffuse dans l'eau, façon infusion de thé — pas d'effervescence, eau qui reste limpide | DEC-00 / CAM-02 / LIGHT-01 / MAT-03 / COMP-01 / ACT-02 / EMO-01 | Lié à ATT-01, angle différent. Le plan le plus "produit" du set. |

## PROUVER

| ID | Ancien | Nom | ⭐ | P | Mission | Sujet / Action | Recette | Contraintes / Notes |
|---|---|---|---|---|---|---|---|---|
| PRV-01 | D01 | Le Lin | | P2 | La matière comme personnage | Verre posé sur lin froissé, une ombre traverse | DEC-00 / CAM-02 / LIGHT-01 / MAT-01 / COMP-01 / ACT-05 / EMO-02 | L'ombre = la trace de mouvement. |
| PRV-02 | D02 | La Pierre | | P2 | La minéralité, le socle | Goutte d'eau qui glisse sur du calcaire, verre en amorce | DEC-00 / CAM-02 / LIGHT-02 / MAT-01 / COMP-01 / ACT-01 / EMO-02 | |
| PRV-03 | D03 | L'Ambre | | P2 | La lumière dans le miel, la qualité de la matière | Filet de miel traversé par la lumière | DEC-00 / CAM-02 / LIGHT-02 / MAT-03 / COMP-01 / ACT-02 / EMO-01 | |
| PRV-04 | D04 | L'Alvéole | | P2 | Le symbole, en discrétion | L'hexagone embossé sur papier texturé ou céramique | DEC-00 / CAM-02 / LIGHT-03 / MAT-01 / COMP-03 / — / — | Présence discrète, jamais systématique (cf. master-prompt). |
| PRV-05 | P01 | L'Eau reste claire | | P2 | La dissolution propre, montrée pas dite | Verre en pleine dissolution, limpidité visible | DEC-00 / CAM-02 / LIGHT-03 / MAT-03 / COMP-01 / ACT-02 / EMO-01 | Proche d'EXP-03 — arbitrer à la production (peut devenir un recadrage d'EXP-03 validé). |
| PRV-06 | P02 | La Portion nue | | P2 | Le produit tel qu'il est, honnête | Portion posée dans une main ouverte | DEC-00 / CAM-02 / LIGHT-01 / MAT-03 / COMP-03 / ACT-03 / EMO-01 | DA-02 strict. Forme générique tant que format non confirmé. |
| PRV-07 | P03 | Deux ingrédients | | P2 | La simplicité de la composition | Portion et verre d'eau côte à côte, geste amorcé | DEC-00 / CAM-01 / LIGHT-03 / MAT-01 / COMP-02 / ACT-01 / EMO-01 | Rappel conformité SOT §2.5 : preuve visuelle et factuelle, jamais un argument santé. Aucun texte "sans X". |
| PRV-08 | EC04 | Dos / étiquette | | P2 | La transparence — les informations | Packaging de dos | DEC-00 / CAM-05 / LIGHT-03 / MAT-01 ou MAT-02 / COMP-03 / — / — | |
| PRV-09 | EC05 | Macro étiquette | | P2 | Le soin du détail | Détail de l'étiquette émeraude, typographie Fraunces or | DEC-00 / CAM-02 / LIGHT-03 / MAT-02 / COMP-03 / — / — | |

## PROJETER

| ID | Ancien | Nom | ⭐ | P | Mission | Sujet / Action | Recette | Contraintes / Notes |
|---|---|---|---|---|---|---|---|---|
| PRJ-01 | H02 | Le Premier Rituel | | P1 | Poser l'ambiance quotidienne | Une main s'approche du verre, lumière du matin | DEC-01 / CAM-01 / LIGHT-01 / MAT-01 / COMP-02 / ACT-01 / EMO-01 | |
| PRJ-02 | H04 | Le Quotidien | | P1 | Ancrer dans une vraie vie, pas un studio | Le verre posé dans un décor de vie habité | DEC-02 ou DEC-03 / CAM-04 / LIGHT-01 / MAT-01 / COMP-02 / ACT-01 / EMO-03 | Béton/ville discret en fond si DEC-03. |
| PRJ-03 | Q01 | La Pause bureau | | P2 | Le rituel au milieu du travail | Le verre posé près de l'ordinateur, une main quitte le clavier | DEC-02 / CAM-01 / LIGHT-01 / MAT-01 / COMP-02 / ACT-01 / EMO-03 + PRP-06, PRP-09 | Jamais une scène de productivité extrême. |
| PRJ-04 | Q02 | Le Banc | | P2 | Le rituel dehors, la vraie ville | Silhouette assise de dos ou de profil, verre à la main | DEC-03 / CAM-04 / LIGHT-02 / MAT-01 / COMP-02 / ACT-03 / EMO-02 + PRP-11 (option) | Béton assumé, verdure discrète. |
| PRJ-05 | Q03 | Le Balcon du soir | | P2 | La respiration de fin de journée | Verre porté aux lèvres, ville floutée en fond | DEC-04 / CAM-01 / LIGHT-02 / MAT-01 / COMP-02 / ACT-06 / EMO-02 | Héritier d'INV-01 (même geste, lieu/moment précis). |
| PRJ-06 | Q04 | La Table du week-end | | P2 | La vie de famille, sans mise en scène | La table après le petit-déjeuner, portion posée près d'un verre | DEC-01 / CAM-03 / LIGHT-01 / MAT-01 / COMP-02 / ACT-01 / EMO-03 + PRP-01, PRP-10 | Le jouet en bois dit la famille sans montrer d'enfant. |

## INVITER

| ID | Ancien | Nom | ⭐ | P | Mission | Sujet / Action | Recette | Contraintes / Notes |
|---|---|---|---|---|---|---|---|---|
| INV-01 | G03 | La Dégustation | | P1 | Montrer l'usage complet | Verre porté à la bouche, visage hors champ, belle couleur ambre dans le verre | DEC-01 ou DEC-03 / CAM-01 / LIGHT-02 / MAT-01 / COMP-02 / ACT-06 / EMO-03 | |
| INV-02 | EC01 | Face | | P1 | Fiche produit — vue principale | Packaging de face | DEC-00 / CAM-05 / LIGHT-03 / MAT-01 ou MAT-02 / COMP-03 / — / — | Fond crème ou émeraude selon test (cf. MAT-02). |
| INV-03 | EC02 | 45° | | P1 | Fiche produit — volume | Packaging en angle | DEC-00 / CAM-06 / LIGHT-03 / MAT-01 ou MAT-02 / COMP-03 / — / — | |
| INV-04 | EC03 | Packaging ouvert | | P1 | Montrer le contenu | Packaging ouvert, portion(s) visible(s) | DEC-00 / CAM-05 ou CAM-06 / LIGHT-03 / MAT-01 ou MAT-02 / COMP-03 / ACT-04 / — | |
| INV-05 | EC06 | Le Lot | | P2 | Vendre le multipack | Plusieurs unités alignées | DEC-00 / CAM-06 / LIGHT-03 / MAT-01 ou MAT-02 / COMP-03 / — / — | |
| INV-06 | EC07 | À plat | | P2 | Vue d'ensemble du coffret | Coffret ouvert vu de dessus, portions rangées | DEC-00 / CAM-03 / LIGHT-03 / MAT-01 / COMP-03 / ACT-04 / — | |
| INV-07 | EC08 | En situation | | P2 | Le pont entre packshot et lifestyle | Packaging posé sur la table à manger, geste en amorce | DEC-01 / CAM-01 / LIGHT-01 / MAT-01 / COMP-02 / ACT-01 / — | |

## CONCLURE

| ID | Ancien | Nom | ⭐ | P | Mission | Sujet / Action | Recette | Contraintes / Notes |
|---|---|---|---|---|---|---|---|---|
| CON-01 | H05 | Le Calme | | P1 | L'émotion dominante, la dernière impression | Verre à moitié bu, personne dans le cadre, silhouette lointaine | DEC-04 / CAM-01 / LIGHT-02 / MAT-01 / COMP-02 / ACT-05 / EMO-02 | Le "après" — rarement montré par les marques de boisson. |
| CON-02 | Q05 | Le Retour | | P2 | La boucle qui se referme | Une silhouette entre dans le cadre, le verre attend sur la table | DEC-04 / CAM-01 / LIGHT-02 / MAT-01 / COMP-02 / ACT-05 / EMO-02 | Frère de CON-01, au moment inverse. Hérite de sa recette validée. |

---

## Correspondance anciens IDs → nouveaux IDs

H01→ATT-01 · H02→PRJ-01 · H03→EXP-02 · H04→PRJ-02 · H05→CON-01 · G01→EXP-01 · G02→EXP-03 · G03→INV-01 · EC01→INV-02 · EC02→INV-03 · EC03→INV-04 · EC04→PRV-08 · EC05→PRV-09 · EC06→INV-05 · EC07→INV-06 · EC08→INV-07 · Q01→PRJ-03 · Q02→PRJ-04 · Q03→PRJ-05 · Q04→PRJ-06 · Q05→CON-02 · D01→PRV-01 · D02→PRV-02 · D03→PRV-03 · D04→PRV-04 · P01→PRV-05 · P02→PRV-06 · P03→PRV-07 · B01→ATT-02 · B02→ATT-03 · B03→ATT-04

## Mapping avec la landing (la landing pioche, elle ne pilote plus)

Hero → **Attirer** · Valeurs → **Expliquer** · Fabrication → **Prouver** · Qualité → **Prouver** · FAQ → **Prouver** · CTA → **Inviter** · Footer → **Conclure**

## Ce qu'on NE fait PAS maintenant (déféré, pas abandonné)

- La GÉNÉRATION des fiches P2 : elles existent pour s'entraîner et préparer la suite, rien ne se génère avant validation des P1.
- `asset-library.md` — prématuré tant qu'aucune image n'est validée sur le produit confirmé.

## Méthode de production (rappel, cohérent avec SOT §6.1)

Pour chaque shot : partir de la Recette (IDs de `ledje-prompt-library.md`, ou le preset de l'intention), l'ajuster si Basekou le demande, puis compiler le prompt bloc par bloc (`SCENE → PRODUCT → COMPOSITION → CAMERA → LIGHT → MATERIALS → ÉMOTION`). Valider sur le papier avant de dépenser un crédit. Un changement de variable à la fois. Commencer par **ATT-01** (l'image la plus importante, socle des autres). Les essais gratuits (ChatGPT Image, Gemini) servent à dégrossir ; les éléments validés remontent dans les assets Higgsfield (reference elements) pour la production finale — logger les deux dans l'asset-log.

---

## Annexe — Prompts compilés (le champ "Prompt" de chaque fiche, vide au départ)

*Quand un prompt d'un shot est validé (l'image générée est retenue), coller ici sa version finale sous son ID, avec la date. Tant qu'un shot n'a pas de prompt validé, il n'apparaît pas dans cette annexe.*

*(vide — premier lot de génération à venir)*
