# Le cerveau Lédjé — carte générale

**Point d'entrée du second cerveau du projet Lédjé.** Toute personne ou IA qui travaille sur le
projet part d'ici. Le repo est la source de vérité : en cas de contradiction entre la mémoire
d'une session (ou la copie Project Knowledge Claude) et ces fiches, **les fiches gagnent**.

## Comment naviguer (humain comme IA)

1. Identifier le domaine concerné par la tâche (tableau ci-dessous).
2. Ouvrir le `README.md` du dossier : il liste les fiches avec leur `resume` (une ligne chacune).
3. Ne lire **que** les fiches nécessaires — jamais tout le cerveau.
4. Chaque fiche porte un frontmatter : `statut` (figé / en_cours / hypothèse / bloquant),
   `domaine`, `maj` (date de fraîcheur propre à la fiche), `source`, `resume`.
5. Les règles de mise à jour (hiérarchie des sources, protégé/libre, rituels de session)
   vivent dans `05_systeme/workflow-maj.md`.

## Les dossiers

| Dossier | Rôle | Vitesse de changement |
|---|---|---|
| [`00_inbox/`](00_inbox/README.md) | Captures brutes terrain, à trier vers les fiches | Entrées/sorties permanentes |
| [`01_adn/`](01_adn/README.md) | Ce qui définit Lédjé : vision, positionnement, marque, conformité, identités | Bouge rarement — zone protégée |
| [`02_produit/`](02_produit/README.md) | Le produit physique et son cadre : cristal, bouteille, prix, étiquetage | Bouge sur décision |
| [`03_marche/`](03_marche/README.md) | Face au client : canaux, site, contenu, recherche utilisateur | Bouge chaque semaine |
| [`04_operations/`](04_operations/README.md) | L'arrière-boutique : fournisseurs, production, admin, technique | Bouge chaque semaine |
| [`05_systeme/`](05_systeme/README.md) | Le méta : templates, décisions, backlog, conseil, workflow | Outillage stable |

## Ce qui vit ailleurs (et pourquoi)

- **`visual/`** — le système de production visuelle (langage, master prompt, prompt library,
  shot book, asset log). Système autonome avec sa propre boucle de vie, routé par le
  `CLAUDE.md` racine. On ne le duplique pas ici, on le référence.
- **`ledje-brief-designer.md`** — brief designeuse, document de travail transmis tel quel.
- **`CLAUDE.md`** (racine du repo) — le routeur des sessions Claude Code (site / visuel / cerveau).
- **Notion** — le suivi opérationnel vivant (pipelines sourcing, Mom Test). Les fiches portent
  l'état durable et les décisions ; Notion porte le quotidien.
  Page relais : https://app.notion.com/p/39e4bc5926a88163b425c0607514a3b6

## Règles qui s'appliquent partout

- **Aucune allégation santé**, explicite ou implicite → `01_adn/conformite.md`.
- **Zéro invention** : une info manquante reste balisée « à compléter ».
- **Contradiction repérée = signalée à Basekou**, jamais tranchée en autonomie.
- Décision prise → une ligne dans `05_systeme/decisions-log.md` (append-only).

> Migration en cours : les fiches marquées « à créer — étape 4 » dans les index sont en
> attente de la découpe du SOT monolithique, qui sera ensuite archivé
> (`_ARCHIVE_SOT_monolithique_[date].md`), jamais supprimé.
