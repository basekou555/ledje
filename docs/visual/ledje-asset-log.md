# Lédjé — Asset Log (la boucle d'apprentissage)

*Historique des générations. C'est ce qui ferme la boucle : chaque ligne est une leçon que le système réutilise pour le prochain shot. Claude Code consulte ce fichier avant de compiler un nouveau prompt (cf. CLAUDE.md).*

**Comment l'utiliser** : après chaque génération jugée, ajoute une ligne. La colonne **Recette** reprend les IDs choisis dans `ledje-prompt-library.md` (`DEC-.. / CAM-.. / LIGHT-.. / MAT-.. / COMP-.. / ACT-.. / EMO-..`) — c'est ce qui permet d'identifier vite une combinaison sans avoir à rouvrir le prompt complet. Sois bref — l'objectif est la réutilisation rapide, pas la documentation exhaustive.

| Shot ID | Date | Recette (IDs) | Asset ID (Higgsfield) | Verdict | Ce qui a marché | Ce qui n'a pas marché | À réutiliser / éviter la prochaine fois |
|---|---|---|---|---|---|---|---|
| — (hors système) | 2026-09-11 | *aucune* — générées sur ChatGPT Image sans passer par le shot-book | Drive · « Lédjé contenu » | 🟡 2 sur 7 | Le **détourage sur fond transparent** (`composite.png`) est le seul asset réellement réutilisable : il se pose sur n'importe quel fond. `12_13_19` (portrait serré, jeu d'ombres) est la seule qui tienne la DA : lumière naturelle douce, un seul sujet, aucun cliché. | `12_17_25` (éclaboussure CGI) et `14_43_32` (glaçons + fumée, fond noir) sont hors territoire — contraste dur et studio visible, contre DA-01. `12_07_54` et `12_11_51` portent le **rayon de miel** et la **cuillère à miel**, tous deux sur la liste des interdits. `12_09_37` et `12_05_45` sont des documents de travail, pas des visuels. | ⚠️ **Trois écarts de spec à corriger au prochain lot** : bouchon rendu **noir** (spec = doré brossé) ; liquide en **ambre foncé qui lit comme du thé glacé** (spec = pâle, presque transparent, « eau fraîche d'abord ») ; et le blueprint invente une palette `#2E4D3A`/`#F4A62A` qui n'est pas l'émeraude du dépôt. ⚠️ **Le tableau nutritionnel et le code-barres du blueprint sont inventés** (60 kJ/14 kcal, `3770000000000`) et **contredisent l'étiquette réelle** (118 kJ/28 kcal) — aucune de ces images ne doit sortir telle quelle. ✅ **À NE PAS refaire dire au système** : le wordmark de ces images **n'est pas inventé**, c'est le vrai (vérifié contre l'étiquette v1.2). ➕ Toutes en 1:1 — le site demande du 9:16 et du 16:9. |

---

## Réglages capitalisés (boucle d'apprentissage à deux niveaux)

*Cette section reste vide jusqu'à ce qu'un pattern se répète sur 2-3 générations.*

- **Niveau preset** (une option gagne pour une intention précise, ex. Attirer/Prouver/Inviter) → mettre à jour directement le tableau "Presets" dans `ledje-prompt-library.md`. Pas besoin de validation de Basekou pour ce niveau — ce sont des choix créatifs, pas des lois de marque. Noter ici le changement et sa justification.
- **Niveau loi de marque** (une option gagne au-delà d'une seule intention, ex. une lumière qui marche pour Attirer ET Inviter ET Prouver) → proposer l'intégration à `ledje-master-prompt.md` comme nouveau "strong default". Validation explicite de Basekou obligatoire (cf. Evolution Policy, master-prompt.md).

- **2026-09-11 — la boucle tourne pour la première fois.** Sept générations évaluées ; aucune n'est passée par une recette du shot-book, donc **aucun preset ne peut être confirmé ni infirmé** par ce lot. Ce qu'il apprend est ailleurs, et vaut pour la suite : **ce que le prompt ne contraint pas, le modèle l'invente** — ici le bouchon, la couleur du liquide, la palette et des valeurs nutritionnelles. Le bloc `PRODUCT` du master-prompt existe précisément pour ça ; il n'a pas été utilisé.

---

## Modifications du Master Prompt (traçabilité — cf. Evolution Policy)

*Toute modification de `ledje-master-prompt.md` est consignée ici avec sa justification.*

| Date | Ce qui change | Justification | Validation |
|---|---|---|---|
| 2026-08-20 | **Terminologie produit** : « Honey Portion » → **« Honey Crystal / cristal de miel »**, avec rappel que *portion · perle · pastille · monodose* sont des interdits de lexique. | Le master-prompt employait des termes bannis par `../01_adn/identite-verbale.md` §4.3. Le prompt est un objet interne, donc pas d'infraction en soi — mais le mot remontait dans le copy en passant par le shot-book. | Basekou, en session |
| 2026-08-20 | **Rôles produit rétablis** : la **bouteille 33 cl est le produit de lancement** (fabriquée et vendue), le **cristal est le produit de conversion en ligne** (pas encore produit). L'ancienne réserve « bouteille = phase 2 » est requalifiée : elle porte sur la **vente en ligne uniquement**. | Les deux rôles étaient inversés dans le master-prompt et le visual-language, ce qui faisait décrire comme « anticipé » un produit qui existe, et comme « de lancement » un produit sans conditionneur. | Basekou, en session |
| 2026-08-20 | **Typographie de l'étiquette** : la spec `Fraunces` est retirée. Nouvelle règle — **ne jamais spécifier de police**, garder le texte d'étiquette **suggéré et non rendu lisible**. | Fraunces est abandonnée depuis la refonte, et l'arbitrage de la typo système n'est pas tranché. S'ajoute un constat de production (MMD du 14/08) : l'IA rend les mentions en lettres aléatoires — mieux vaut ne pas les faire rendre du tout. | Basekou, en session |
| 2026-08-20 | **Palette** : le renvoi « SOT §3.2 » (archivé) est supprimé. **Seul l'émeraude tient** ; l'or et l'ambre passent en couleurs **remises en question**, à employer avec retenue. Distinction posée : l'ambre du **miel** est un fait de matière, pas une couleur de marque. | La palette est rouverte depuis le 2026-07-28 (`../01_adn/identite-visuelle.md`, statut `bloquant`). Le master-prompt les donnait comme acquises. | Basekou, en session |
