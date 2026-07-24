CLAUDE.md — Lédjé
Auto-chargé par Claude Code à chaque session dans ce repo, quelle que soit la tâche. Ce fichier oriente vers la bonne procédure selon le type de travail demandé — il ne couvre pas un seul sujet.
Ce dépôt contient

* Le code de la landing page (React/TypeScript + Supabase + Vercel).
* Les documents de référence de la marque (`docs/`) : vision, conformité, design system, et le système de production visuelle (`docs/visual/`).
Dans tous les cas, commence par lire `docs/README.md` — la carte du cerveau Lédjé (fiches atomiques avec frontmatter, un README par dossier). Ouvre ensuite uniquement les fiches du domaine concerné, via les `resume` des index. Les règles de mise à jour du cerveau (hiérarchie des sources, protégé/libre, rituels de session) : `docs/05_systeme/workflow-maj.md`. En cas de contradiction entre ta mémoire (ou Project Knowledge) et les fiches du repo, les fiches gagnent. *(L'ancien SOT monolithique est archivé : `docs/_ARCHIVE_SOT_monolithique_2026-07-24.md` — ne plus s'y référer sauf pour l'histoire.)*
Règles qui s'appliquent à TOUTE tâche, quel que soit le sujet

* Aucune allégation santé, explicite ou implicite (`docs/01_adn/conformite.md`) — vrai pour le copy du site comme pour les prompts d'image.
* Aucun symbole religieux explicite (`docs/01_adn/combats.md` et `conformite.md`).
* Si une tâche touche la marque, la conformité ou les valeurs : vérifier dans `docs/01_adn/` avant d'agir, ne jamais improviser.
Si la tâche concerne le SITE (landing page, déploiement, DNS, Supabase)

* Référence technique complète : `docs/04_operations/site-technique.md` (pièges connus : variables d'environnement Vercel qui écrasent le fallback, policies Supabase INSERT-only à ne pas modifier, ne jamais réintroduire de `.select()` après un insert anon). Côté conversion/copy : `docs/03_marche/site-precommande.md`.
* Workflow git (`docs/04_operations/site-technique.md`) : repartir de `origin/main` à jour, nouvelle PR draft, ne jamais empiler sur du mergé.
* Toute modification de copy (accroche, CTA, textes) doit respecter les règles de conformité ci-dessus.
Si la tâche concerne la PRODUCTION VISUELLE (compiler un prompt, générer un shot)
Documents de référence (dans cet ordre de dépendance)

1. `docs/README.md` + les fiches ADN pertinentes (`docs/01_adn/`, surtout `conformite.md` et `identite-visuelle.md`) — déjà lues si tu as suivi l'instruction générale ci-dessus.
2. `docs/visual/ledje-visual-language.md` — la constitution artistique.
3. `docs/visual/ledje-master-prompt.md` — ce qui ne change jamais (produit, negative prompt, présence humaine, narrative, checklist).
4. `docs/visual/ledje-prompt-library.md` — le catalogue d'options modulaires (sujet, décor, caméra, lumière, matières, composition, props, action, émotion) + les presets par intention. Le SUJET (SUJ) est le premier paramètre : le héros physique de l'image (perle / eau-verre / rencontre / bouteille / packaging), il pilote le bloc PRODUCT — à ne pas confondre avec ACT (le geste, l'action).
5. `docs/visual/ledje-shot-book.md` — la liste des shots, chacun avec sa recette d'IDs et son delta narratif spécifique.
6. `docs/visual/ledje-asset-log.md` — l'historique des générations et ce qu'on en a appris.
Ta mission quand Basekou te demande de "compiler" un shot

1. S'il donne un ID de shot existant (ex. H01) : lis sa fiche dans `docs/visual/ledje-shot-book.md`, prends sa Recette (IDs) telle quelle sauf si Basekou précise un changement ("je préfère la lumière fin d'après-midi") — dans ce cas, substitue l'ID concerné.
2. S'il décrit une envie en langage naturel sans ID précis : identifie l'intention de communication la plus proche (Attirer / Expliquer / Prouver / Projeter / Inviter / Conclure, cf. Presets dans `ledje-prompt-library.md`), propose le preset recommandé et le shot du shot-book qui correspond (ou une nouvelle fiche à créer), et demande confirmation avant de compiler.
3. Résous chaque ID de la Recette en son cahier des charges fixe dans `ledje-prompt-library.md`.
4. Prends le `docs/visual/ledje-master-prompt.md` en base (les invariants).
5. Ajoute le delta narratif propre au shot (ce qui ne se réduit à aucun ID — l'instant précis raconté).
6. Avant de finaliser, consulte `docs/visual/ledje-asset-log.md` : si un shot similaire a déjà été généré et validé, réutilise ce qui a marché et évite ce qui a été noté comme raté.
7. Rédige le prompt final en anglais (structure : SCENE → PRODUCT → COMPOSITION → CAMERA → LIGHT → MATERIALS → ÉMOTION), prêt à copier dans Higgsfield.
8. Rappelle, si pertinent, d'utiliser les reference elements de Higgsfield pour le produit une fois qu'une version est validée.
9. Après évaluation par Basekou, logue le résultat dans `ledje-asset-log.md` avec la Recette utilisée. Si un pattern se confirme (2-3 fois) pour une intention, mets à jour le preset correspondant dans `ledje-prompt-library.md` directement — pas besoin de validation de Basekou à ce niveau (contrairement à `ledje-master-prompt.md`/`ledje-visual-language.md`, qui restent verrouillés).
Note : les prompts compilés servent aussi hors Higgsfield (ChatGPT Image, Gemini — essais gratuits pour dégrossir avant la production finale). Toujours produire un prompt anglais autonome, compréhensible sans accès à ces fichiers. Quand Basekou teste hors process, lui rappeler de rapporter le verdict pour l'asset-log.
La boucle de production complète

```
Choisir un shot (shot-book.md)
        ↓
Compiler le prompt (Master Prompt + delta du shot, en tenant compte de l'asset-log)
        ↓
Générer (Basekou lance dans Higgsfield — variantes si besoin)
        ↓
Évaluer (Basekou juge : validé / à refaire / écarté)
        ↓
Logger dans docs/visual/ledje-asset-log.md (ce qui a marché, ce qui n'a pas marché, pourquoi)
        ↓
Capitaliser : si un réglage se révèle systématiquement bon, propose de l'intégrer
au Master Prompt lui-même (validation de Basekou requise — cf. Evolution Policy
dans master-prompt.md : un changement n'est adopté que s'il bénéficie à plusieurs
shots, jamais pour une préférence ponctuelle)
        ↺ (retour au début pour le shot suivant)

```

Règles spécifiques à la production visuelle

* Ne jamais inventer de spec produit non confirmée (format de lancement en attente de vérification fournisseur, voir `docs/visual/ledje-master-prompt.md`).
* Ne jamais utiliser de vocabulaire luxe non testé/validé (voir la note "à tester" dans `ledje-master-prompt.md`, section Global Identity).
* Jamais de visage identifiable ni d'yeux visibles dans les prompts.
* Ne jamais modifier `ledje-master-prompt.md` ou `ledje-visual-language.md` sans le signaler explicitement à Basekou et attendre confirmation. `ledje-prompt-library.md` (les options et leurs presets) n'a pas cette contrainte — c'est la couche destinée à évoluer vite avec l'usage (cf. boucle d'apprentissage à deux niveaux dans `ledje-asset-log.md`).
Si la tâche ne rentre dans aucune des deux catégories ci-dessus
Demande une clarification plutôt que de deviner — surtout si la tâche touche au positionnement, aux valeurs, ou à une décision déjà tranchée (`docs/05_systeme/decisions-log.md`).
Ce qu'on ne construit PAS (décision consciente, mise à jour)
Pas d'outil web/app séparé pour la production visuelle — tout reste dans ces fichiers `.md`, compilés par Claude Code. La v1 excluait aussi un système d'options modulaire séparé (jugé surdimensionné pour 8-10 images) ; Basekou en a depuis demandé l'introduction pour pouvoir choisir/ajuster chaque paramètre de photo et capitaliser plus vite sur ce qui marche — voir `docs/visual/ledje-prompt-library.md`. Ce qui reste vrai : pas de dossier séparé par paramètre (`subjects/`, `actions/`, `decor/`... en fichiers distincts) — tout le catalogue d'options tient dans ce fichier unique, pour rester simple à parcourir et à maintenir.
