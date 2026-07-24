---
statut: figé
domaine: operations
maj: 2026-07-13
source: "SOT §5.1-5.4, 5.6, 5.7, 5.8 (archive 2026-07-24) — état vérifié en prod"
resume: "La technique du site : stack, fichiers clés, Supabase (pièges voulus), piège majeur Vercel, analytics, accessibilité, workflow git."
---

# Site — état technique (vérifié en prod)

**Le rôle marketing du site (refonte, copy, précommande) : `../03_marche/site-precommande.md`.** Ici : la machine.

## Stack

- **Front** : React 18 + TypeScript + Vite 6. CSS vanilla avec tokens dans `src/index.css` (pas de framework CSS).
- **Back** : Supabase (Postgres + RLS), pas de serveur applicatif. Client → clé `anon` (publique par design, RLS applique la sécurité).
- **Hébergement** : Vercel (projet `ledje`, équipe `wouli`). **Domaine** : ledje.fr / www.ledje.fr (redirect vers www). En prod, identité de marque appliquée.

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `src/App.tsx` | Toute la page : hero (vidéo + fondu texte/voile ~5 s), Le Geste (carrousel horizontal figé au scroll), L'Origine (fond ambre + vidéo « miel qui coule » au survol/tap), teaser Bouteille (packshot), FAQ, formulaire, questionnaire, réservation Stripe, footer. Composants `Alveole`, `HexBullet`, `Photo`. Logique Supabase appelée ici. |
| `src/lib/supabase.ts` | Client + `trackEvent`, `submitEmail`, `submitSurvey`. |
| `src/index.css` | Design system complet (tokens : couleurs, typo, effets, surfaces). |
| `index.html` | **Cormorant Garamond + Lora + Inter** (Google Fonts), meta, favicon. |
| `vercel.json` | Build Vite + rewrite SPA. |
| `public/favicon.svg` | Symbole de marque (rosace fleur d'alvéoles + goutte) or sur carré émeraude. |
| `public/visuals/` | Photos produit optimisées (`geste-01/02/03.jpg`, `origine.jpg`, `bouteille.jpg`) + `origine.mp4` (vidéo au survol). |

> ⚠️ Note typo (2026-07-10) : le code déployé utilise actuellement **Cormorant Garamond + Lora**. Cette typo est **provisoire** — la refonte Inès (`../01_adn/identite-visuelle.md`) la fera évoluer vers une sans-serif affirmée. Idem le symbole (alvéole à reconsidérer).

## Supabase — IMPORTANT

- **Projet ACTUEL : `ledje`** — ref `qihlqrmbcbfzjwfegsxv`, région eu-west-3 (Paris), URL `https://qihlqrmbcbfzjwfegsxv.supabase.co`, org `basekou555's Org`.
- **Ancien projet `ddvboxgescsptvhkjgjl` = app wouli. NE PLUS JAMAIS y brancher Lédjé** (tables Lédjé supprimées, migration terminée et vérifiée).

**Schéma (3 tables, RLS activée, policy INSERT anon uniquement) :**
- `waitlist` : id (uuid pk), email (unique not null), utm_source/medium/campaign, created_at.
- `survey_responses` : id, waitlist_id (fk nullable), frequency, attraction (text[]), **entry_format** (remplace l'ancien `intent` — migration `survey_v2_entry_format` appliquée en prod), created_at.
- `page_events` : id, event_type (`page_view`, `cta_click`, `scroll_50`, `scroll_100`, `page_exit`, `stripe_click`), time_on_page_sec, utm_source, created_at.

**Pièges de sécurité (voulus — ne pas « corriger ») :**
- Policies INSERT-only pour anon (pas de SELECT) → personne ne peut lire les emails côté client.
- `submitEmail` génère l'UUID **côté client** (`crypto.randomUUID()`) et n'utilise **PAS** `.select()` après insert (sinon 401). **Ne jamais réintroduire de `.select()` après un insert anon.**
- L'advisor `rls_policy_always_true` (WARN) = voulu pour un formulaire public.
- Pas d'anti-spam (acceptable pour le test ; Turnstile/hCaptcha plus tard si besoin).

## Déploiement Vercel — PIÈGE MAJEUR

Variables d'env Vercel : `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (projet qihlqrmbcbfzjwfegsxv). **Vite remplace `import.meta.env.VITE_*` au build et supprime le fallback → les env vars Vercel gagnent TOUJOURS.** Si la prod écrit dans le mauvais projet : cause n°1 = ces variables (corriger dans Vercel PUIS redéployer). Vérification du projet réellement compilé : fetch ledje.fr → récupérer le bundle `/assets/index-XXXX.js` → grep l'URL `*.supabase.co`.

Dev local : `.env.local` (gitignoré) avec les deux mêmes variables.

Câblage vidéo hero : `VITE_HERO_VIDEO_URL` (video autoplay muette en fond de hero) — fournir l'URL quand un clip satisfaisant existera.

## Analytics

UTM depuis le lien bio TikTok, stockés avec l'email et les événements. Événements passifs : page_view, cta_click, scroll_50, scroll_100, page_exit (+ time_on_page_sec). Pas d'outil tiers, pas de cookies invasifs. (Stratégie d'acquisition : `../03_marche/acquisition-tiktok.md`.)

## Accessibilité

WCAG 2.1 AA, mobile-first (99 % du trafic = TikTok). Labels visibles, erreurs en texte, focus visible, cibles ≥ 44×44 px, un seul h1, landmarks, `prefers-reduced-motion`, focus déplacé sur le questionnaire.

## Git & workflow

- Prod : `main` (déploiement auto au merge). Vercel : preview par push, prod au merge.
- Nouvelle tâche = repartir de `origin/main` à jour, **nouvelle PR draft**, jamais empiler sur du mergé.
