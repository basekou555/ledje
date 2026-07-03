CLAUDE.md — Lédjé
Auto-chargé par Claude Code à chaque session dans ce repo, quelle que soit la tâche. Ce fichier oriente vers la bonne procédure selon le type de travail demandé — il ne couvre pas un seul sujet.
Ce dépôt contient

* Le code de la landing page (React/TypeScript + Supabase + Vercel).
* Les documents de référence de la marque (`docs/`) : vision, conformité, design system, et le système de production visuelle (`docs/visual/`).
Dans tous les cas, commence par lire `docs/LEDJE_SOURCE_OF_TRUTH.md` — c'est la source unique pour la marque, la conformité, l'état du produit. En cas de contradiction entre ta mémoire et ce document, le SOT gagne.
Règles qui s'appliquent à TOUTE tâche, quel que soit le sujet

* Aucune allégation santé, explicite ou implicite (SOT §2.5) — vrai pour le copy du site comme pour les prompts d'image.
* Aucun symbole religieux explicite (SOT §1.3bis).
* Si une tâche touche la marque, la conformité ou les valeurs : vérifier dans le SOT avant d'agir, ne jamais improviser.
Si la tâche concerne le SITE (landing page, déploiement, DNS, Supabase)

* Référence technique complète : `docs/LEDJE_SOURCE_OF_TRUTH.md`, Partie 5 (pièges connus : variables d'environnement Vercel qui écrasent le fallback, policies Supabase INSERT-only à ne pas modifier, ne jamais réintroduire de `.select()` après un insert anon).
* Workflow git (SOT §5.8) : repartir de `origin/main` à jour, nouvelle PR draft, ne jamais empiler sur du mergé.
* Toute modification de copy (accroche, CTA, textes) doit respecter les règles de conformité ci-dessus.
Si la tâche concerne la PRODUCTION VISUELLE (compiler un prompt, générer un shot)
Documents de référence (dans cet ordre de dépendance)

1. `docs/LEDJE_SOURCE_OF_TRUTH.md` — déjà lu si tu as suivi l'instruction générale ci-dessus.
2. `docs/visual/ledje-visual-language.md` — la constitution artistique.
3. `docs/visual/ledje-master-prompt.md` — le bloc canonique hérité par tout prompt.
4. `docs/visual/ledje-shot-book.md` — la liste des shots, chacun avec son delta spécifique.
5. `docs/visual/ledje-asset-log.md` — l'historique des générations et ce qu'on en a appris.
Ta mission quand Basekou te demande de "compiler" un shot

1. Lis le shot demandé dans `docs/visual/ledje-shot-book.md` (son ID, ex. H01).
2. Prends le `docs/visual/ledje-master-prompt.md` en base.
3. Ajoute uniquement le delta du shot (sujet/action, décor, composition, blocs DA cités).
4. Avant de finaliser, consulte `docs/visual/ledje-asset-log.md` : si un shot similaire a déjà été généré et validé, réutilise ce qui a marché et évite ce qui a été noté comme raté — c'est la boucle d'apprentissage, le système doit s'améliorer à chaque génération.
5. Rédige le prompt final en anglais (structure : SCENE → PRODUCT → COMPOSITION → CAMERA → LIGHT → MATERIALS → ÉMOTION), prêt à copier dans Higgsfield.
6. Rappelle, si pertinent, d'utiliser les reference elements de Higgsfield pour le produit une fois qu'une version est validée.
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
* Ne jamais modifier `ledje-master-prompt.md` ou `ledje-visual-language.md` sans le signaler explicitement à Basekou et attendre confirmation.
Si la tâche ne rentre dans aucune des deux catégories ci-dessus
Demande une clarification plutôt que de deviner — surtout si la tâche touche au positionnement, aux valeurs, ou à une décision déjà tranchée dans le SOT (Decisions Log, Partie 10).
Ce qu'on ne construit PAS (décision consciente)
Pas de dossier `subjects/actions/decor/camera/...` séparé en dizaines de fichiers pour la production visuelle, pas d'outil web/app séparé, pas de `prompt-library.md` maintenu à la main. La simplicité du système est ce qui le garde maintenable.
