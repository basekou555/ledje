# Lédjé — Asset Log (la boucle d'apprentissage)

*Historique des générations. C'est ce qui ferme la boucle : chaque ligne est une leçon que le système réutilise pour le prochain shot. Claude Code consulte ce fichier avant de compiler un nouveau prompt (cf. CLAUDE.md).*

**Comment l'utiliser** : après chaque génération jugée, ajoute une ligne. La colonne **Recette** reprend les IDs choisis dans `ledje-prompt-library.md` (`DEC-.. / CAM-.. / LIGHT-.. / MAT-.. / COMP-.. / ACT-.. / EMO-..`) — c'est ce qui permet d'identifier vite une combinaison sans avoir à rouvrir le prompt complet. Sois bref — l'objectif est la réutilisation rapide, pas la documentation exhaustive.

| Shot ID | Date | Recette (IDs) | Asset ID (Higgsfield) | Verdict | Ce qui a marché | Ce qui n'a pas marché | À réutiliser / éviter la prochaine fois |
|---|---|---|---|---|---|---|---|
| *(exemple)* H01 | — | — | — | — | — | — | — |
| **Plan A — « la main qui verse »** *(nouveau, à ficher au shot-book)* | 2026-09-11 | `SUJ-04 / DEC-05 / CAM-01 / LIGHT-02 / MAT-01 / COMP-01 / ACT-01 / EMO-01` | — *(hors Higgsfield : ChatGPT Image, essai gratuit)* | ✅ **VALIDÉ** — « le visuel est cool » | **Le mouvement règle l'ennui** : filet en plein vol, main sans visage, verre qui se remplit. **Le liquide éclairci est confirmé** — vu hors de la bouteille dans le verre, il se lit *eau légèrement miellée* et non *thé glacé*. **Le monde DEC-05 tient** (travertin + enduit + ombre de fenêtre rasante). **Un seul bouchon** cette fois : la consigne « goulot nu, un seul bouchon dans l'image » a corrigé le doublon de ChatGPT. | **Le texte de l'étiquette est réinventé** (« van miellée », « 33d », « PET » parasite) — la bouteille détourée n'était pas fournie en référence. **Pas de condensation**, malgré la consigne renforcée. | ✅ **Réutiliser** : le trio mouvement + main sans visage + preuve du liquide hors bouteille ; le monde DEC-05 ; la formule « goulot nu, UN SEUL bouchon ». ⛔ **Éviter** : générer l'étiquette sans fournir le détourage en image de référence. ➡️ **Prochain essai** : même plan avec le détourage attaché. |

---

## Réglages capitalisés (boucle d'apprentissage à deux niveaux)

*Cette section reste vide jusqu'à ce qu'un pattern se répète sur 2-3 générations.*

- **Niveau preset** (une option gagne pour une intention précise, ex. Attirer/Prouver/Inviter) → mettre à jour directement le tableau "Presets" dans `ledje-prompt-library.md`. Pas besoin de validation de Basekou pour ce niveau — ce sont des choix créatifs, pas des lois de marque. Noter ici le changement et sa justification.
- **Niveau loi de marque** (une option gagne au-delà d'une seule intention, ex. une lumière qui marche pour Attirer ET Inviter ET Prouver) → proposer l'intégration à `ledje-master-prompt.md` comme nouveau "strong default". Validation explicite de Basekou obligatoire (cf. Evolution Policy, master-prompt.md).

- *(rien pour l'instant — premier lot de génération à venir)*

---

## Modifications du Master Prompt (traçabilité — cf. Evolution Policy)

*Toute modification de `ledje-master-prompt.md` est consignée ici avec sa justification.*

| Date | Ce qui change | Justification | Validation |
|---|---|---|---|
| 2026-08-20 | **Terminologie produit** : « Honey Portion » → **« Honey Crystal / cristal de miel »**, avec rappel que *portion · perle · pastille · monodose* sont des interdits de lexique. | Le master-prompt employait des termes bannis par `../01_adn/identite-verbale.md` §4.3. Le prompt est un objet interne, donc pas d'infraction en soi — mais le mot remontait dans le copy en passant par le shot-book. | Basekou, en session |
| 2026-08-20 | **Rôles produit rétablis** : la **bouteille 33 cl est le produit de lancement** (fabriquée et vendue), le **cristal est le produit de conversion en ligne** (pas encore produit). L'ancienne réserve « bouteille = phase 2 » est requalifiée : elle porte sur la **vente en ligne uniquement**. | Les deux rôles étaient inversés dans le master-prompt et le visual-language, ce qui faisait décrire comme « anticipé » un produit qui existe, et comme « de lancement » un produit sans conditionneur. | Basekou, en session |
| 2026-08-20 | **Typographie de l'étiquette** : la spec `Fraunces` est retirée. Nouvelle règle — **ne jamais spécifier de police**, garder le texte d'étiquette **suggéré et non rendu lisible**. | Fraunces est abandonnée depuis la refonte, et l'arbitrage de la typo système n'est pas tranché. S'ajoute un constat de production (MMD du 14/08) : l'IA rend les mentions en lettres aléatoires — mieux vaut ne pas les faire rendre du tout. | Basekou, en session |
| 2026-08-20 | **Palette** : le renvoi « SOT §3.2 » (archivé) est supprimé. **Seul l'émeraude tient** ; l'or et l'ambre passent en couleurs **remises en question**, à employer avec retenue. Distinction posée : l'ambre du **miel** est un fait de matière, pas une couleur de marque. | La palette est rouverte depuis le 2026-07-28 (`../01_adn/identite-visuelle.md`, statut `bloquant`). Le master-prompt les donnait comme acquises. | Basekou, en session |
