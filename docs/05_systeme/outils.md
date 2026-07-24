---
statut: figé
domaine: systeme
maj: 2026-07-21
source: "SOT Partie 8 + §8.1 (archive 2026-07-24) + outillage conseil 2026-07-21 (page relais)"
resume: "Qui fait quoi (Claude.ai / Code / Cowork, Higgsfield, CapCut, Canva, Notion, Supabase/Vercel/OVH) + inventaire des documents hors repo."
---

# Outils & répartition

| Outil | Rôle |
|---|---|
| **Claude.ai (COO/CTO)** | Stratégie, briefs, prompts, arbitrages, garde-fous conformité |
| **Claude Code** | Tout ce qui se compile/déploie : landing, DNS/Vercel, évolutions du site, compilation des prompts visuels (via CLAUDE.md), maintenance du cerveau |
| **Claude Cowork** | Jugement + contenu dans docs/apps : sourcing, mails, recherche |
| **Higgsfield** | Génération images/vidéos (recraft-v4-1, seedance) |
| **CapCut** | Montage vidéo, assemblage clips, texte |
| **Canva** | Texte/typo sur visuels, déclinaisons |
| **Notion** | Suivi opérationnel structuré façon Wouli (dashboard + bases de données, pas de tableaux plats) : sourcing fournisseurs, entretiens Mom Test. Page relais : https://app.notion.com/p/39e4bc5926a88163b425c0607514a3b6 |
| **Supabase / Vercel / OVH** | Back, hosting, domaine |

Heuristique : **Cowork pour le jugement et le contenu ; Code pour ce qui se compile, se déploie ou tourne en tâche planifiée ; Notion pour le suivi opérationnel vivant (statuts, pipelines).**

## Salle du conseil (2026-07-21)

**Salle du conseil niveau B construite** : 5 appels API indépendants + Chairman, socle de contexte projet validé et intégré en dur. Le socle canonique est versionné dans le repo : [`council-context.md`](council-context.md) — **protégé** : toute mise à jour passe par Basekou, et **doit être répercutée dans l'artefact « Salle du conseil »**, sinon les deux divergent.

**Règle outillage (2026-07-21)** : les outils partagés sont **intégrés tels quels** par défaut — pas de réécriture unilatérale par Claude.

## Documents stratégiques complémentaires — ⚠️ HORS REPO

Ces documents sont référencés par le projet mais ne vivent pas dans ce dépôt (localisation réelle : à compléter — probablement conversations Claude / exports) :

| Document | Contenu | Localisation |
|---|---|---|
| `ledje-retroplanning-general.md` | Rétroplanning macro par pôles (Produit & Fournisseurs, Business, Communication, Tech, Recherche utilisateur, Opérations), ancré sur Ramadan 2027 (≈ 8 février) et Aïd (≈ 9-10 mars). Le détail du pôle Communication vit dans sa discussion dédiée — seulement les dépendances inter-pôles ici. | à compléter |
| `ledje-lean-canvas.md` | Premier jet (~80 % rempli), carte d'identité business à partager. Case la plus faible et à tester en priorité : la proposition de valeur unique. | à compléter |
| `ledje-scripts-pubs-v1-v2.md` | Outputs scripts pubs V1/V2 | à compléter |
| `ledje-brief-video-hero.md` | Brief de la nouvelle vidéo hero (séquence refus en rayon → bouteille → cristal → transmission → partage → signature) | à compléter |

## Ce qui vit dans le repo

- Le cerveau : `docs/` (ce système).
- Le système de production visuelle : `docs/visual/` (5 fichiers).
- Le brief designeuse : `docs/ledje-brief-designer.md`.
- Le routeur de sessions : `CLAUDE.md` (racine).
- Le code du site : `src/`, `public/`, `index.html`, `vercel.json`.
