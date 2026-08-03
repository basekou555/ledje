---
statut: figé
domaine: systeme
maj: 2026-07-24
source: "Validé par Basekou en session 2026-07-24 (+ compléments même jour : garde-fous métier, council-context protégé) — remplace la Partie 9 (@update) du SOT archivé"
resume: "Les règles du cerveau : hiérarchie des sources, protégé/libre, rituels de session (page relais Notion, resynchro Project Knowledge), tri de l'inbox."
---

# Workflow de mise à jour du cerveau

## 1. Hiérarchie des sources (en cas de contradiction)

1. **Basekou en session** (décision explicite) — gagne toujours.
2. **Le cerveau** (`docs/`) — la fiche concernée, champ `maj` faisant foi.
3. **`decisions-log.md`** — l'historique qui explique le présent, jamais l'inverse : si le log contredit une fiche, la fiche à jour gagne et l'écart est signalé.
4. **Mémoire de session / Project Knowledge Claude** — toujours perdante face au repo.

## 2. Protégé / libre (qui a le droit de modifier quoi)

- **Protégé** — modification uniquement sur demande explicite de Basekou (déclencheur `@update` ou demande équivalente), jamais suggérée spontanément : `visual/ledje-master-prompt.md`, `visual/ledje-visual-language.md`, `council-context.md` (avec répercussion obligatoire dans l'artefact « Salle du conseil »), `01_adn/conformite.md`, et cette fiche. `decisions-log.md` est **append-only** (on ajoute une ligne, on ne réécrit jamais l'historique).
- **⚠️ DÉVERROUILLAGE TEMPORAIRE de `01_adn/` (décidé le 2026-07-31)** — le positionnement et le branding vont beaucoup bouger dans les prochains jours ; on est trop early pour verrouiller autant d'éléments. Les fiches ADN peuvent donc être modifiées **sans validation préalable au cas par cas**, à trois conditions non négociables :
  1. **Le circuit de traçabilité reste entier** : une branche + une PR par changement, jamais de commit direct sur `main`, et **une ligne au `decisions-log.md`** pour chaque décision — comme pour le reste du cerveau. Le merge de Basekou reste la validation.
  2. **`conformite.md` n'est PAS concernée** : le réglementaire (DGCCRF, CE 1924/2006) ne devient pas révisable parce que le projet est jeune. Elle reste protégée et `figé`.
  3. **Régime temporaire** : à re-verrouiller quand le positionnement et le branding se stabilisent. Tant que ce déverrouillage court, les fiches ADN portent `statut: en_cours` — elles décrivent une direction de travail, pas un socle acquis.
- **Libre** — l'IA met à jour au fil du travail, en le signalant dans son rapport : `00_inbox/`, fiches `03_marche/` et `04_operations/` (statuts, suivis, dates), `backlog.md`, index/README, `visual/ledje-prompt-library.md`, `visual/ledje-asset-log.md`, templates.
- **Intermédiaire** — `02_produit/` : modification proposée dans la réponse, appliquée après OK de Basekou (une spec produit engage le sourcing et la conformité).

## 3. Rituels de session

### Ouverture
1. Lire `docs/README.md` (la carte).
2. **Consulter la page relais Notion** — l'état chaud de la semaine, qui peut être en avance sur les fiches : https://app.notion.com/p/39e4bc5926a88163b425c0607514a3b6
3. Ouvrir uniquement les fiches du domaine concerné, choisies via les `resume` des index. Ne jamais charger tout le cerveau.
4. Sync check git : repartir d'`origin/main` à jour avant toute écriture.

### Clôture
1. Toute info nouvelle apprise en session → mise à jour **chirurgicale** de la fiche concernée (`maj` + `statut` ajustés) ; si pas triable à chaud → capture datée dans `00_inbox/`.
2. Toute décision prise → une ligne dans `decisions-log.md`.
3. Commit atomique par fiche, message clair.
4. **Réflexe resynchro Project Knowledge** : si une fiche modifiée fait partie de la copie Project Knowledge Claude, terminer le rapport de session par un rappel explicite « à resynchroniser dans Project Knowledge ».

## 4. Règles critiques (invariantes)

- **Garde-fous métier** : tout texte sortant (script, légende, page, étiquette, kit de vente, mail partenaire) passe la grille de `../01_adn/conformite.md` — aucune allégation santé explicite ou implicite, évocation jamais proclamation, terminologie verrouillée (« cristal de miel » / « eau miellée » ; perle, portion, monodose, pastille, bonbon, « ancestral » bannis). Étape fixe.
- Modifications chirurgicales uniquement — jamais réécrire une fiche entière.
- Zéro invention : un trou reste balisé « à compléter ».
- Contradiction repérée = signalée à Basekou, jamais tranchée seul.
- Fiche créée/renommée/supprimée → le `README.md` du dossier est mis à jour dans le même commit.
- `@update` reste le déclencheur explicite pour toucher au **protégé** ; il n'est jamais suggéré.

## 5. Tri de l'inbox

Sur demande (« trie l'inbox ») ou quand une session touche un domaine ayant des captures en attente : chaque capture est dispatchée vers ses fiches (mise à jour chirurgicale), puis supprimée. Une capture non triable reste, avec la raison notée dedans.
