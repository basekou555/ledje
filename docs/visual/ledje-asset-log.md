# Lédjé — Asset Log (la boucle d'apprentissage)

*Historique des générations. C'est ce qui ferme la boucle : chaque ligne est une leçon que le système réutilise pour le prochain shot. Claude Code consulte ce fichier avant de compiler un nouveau prompt (cf. CLAUDE.md).*

**Comment l'utiliser** : après chaque génération jugée, ajoute une ligne. La colonne **Recette** reprend les IDs choisis dans `ledje-prompt-library.md` (`DEC-.. / CAM-.. / LIGHT-.. / MAT-.. / COMP-.. / ACT-.. / EMO-..`) — c'est ce qui permet d'identifier vite une combinaison sans avoir à rouvrir le prompt complet. Sois bref — l'objectif est la réutilisation rapide, pas la documentation exhaustive.

| Shot ID | Date | Recette (IDs) | Asset ID (Higgsfield) | Verdict | Ce qui a marché | Ce qui n'a pas marché | À réutiliser / éviter la prochaine fois |
|---|---|---|---|---|---|---|---|
| *(exemple)* H01 | — | — | — | — | — | — | — |

---

## Réglages capitalisés (boucle d'apprentissage à deux niveaux)

*Cette section reste vide jusqu'à ce qu'un pattern se répète sur 2-3 générations.*

- **Niveau preset** (une option gagne pour une catégorie de shot précise, ex. Hero/Geste/Packshot) → mettre à jour directement le tableau "Presets" dans `ledje-prompt-library.md`. Pas besoin de validation de Basekou pour ce niveau — ce sont des choix créatifs, pas des lois de marque. Noter ici le changement et sa justification.
- **Niveau loi de marque** (une option gagne au-delà d'une seule catégorie, ex. une lumière qui marche pour Hero ET Packshot ET Geste) → proposer l'intégration à `ledje-master-prompt.md` comme nouveau "strong default". Validation explicite de Basekou obligatoire (cf. Evolution Policy, master-prompt.md).

- *(rien pour l'instant — premier lot de génération à venir)*
