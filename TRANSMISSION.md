# TRANSMISSION — Projet Lédjé (pour une future session Claude)

> Document de passation. À lire en entier avant toute intervention.
> Objectif : reprendre le projet avec le bon niveau de contexte, sans casser
> la conversion (capture email) ni l'identité de marque.

---

## 1. C'est quoi Lédjé

Marque de **miel pur en portion, à dissoudre dans un verre d'eau fraîche**.
Positionnement : tradition, geste, qualité, origine locale française.
Ce dépôt = la **landing page one-page** qui teste l'intérêt après un clic
depuis TikTok. La conversion principale = **inscription email à une liste
d'attente**. Un questionnaire post-inscription mesure le signal de réachat.

### Règle d'or de conformité (NE JAMAIS ENFREINDRE)
**Aucune allégation santé.** Interdits absolus dans tout le copy :
« sain », « vitalité », « énergie », « immunité », « antioxydant »,
« purifie », « bon pour la digestion », « allégé / light / minceur ».
On parle uniquement tradition, geste, qualité, origine. Registre spirituel
par évocation, jamais par proclamation (pas de symbole religieux explicite).

---

## 2. Stack & architecture

- **Front** : React 18 + TypeScript + Vite 6. Pas de framework CSS — CSS
  vanilla avec tokens (variables CSS) dans `src/index.css`.
- **Back / données** : Supabase (Postgres + RLS). Pas de serveur applicatif.
  Le client écrit directement via la clé `anon` (RLS applique la sécurité).
- **Hébergement** : Vercel (projet `ledje`, équipe/slug `wouli`).
- **Domaine** : ledje.fr / www.ledje.fr (redirige vers www).

### Fichiers clés
| Fichier | Rôle |
|---|---|
| `src/App.tsx` | Toute la page : hero, geste, origine, formulaire, questionnaire, footer. Composants `Alveole`, `HexBullet`, icônes line-art. Logique Supabase appelée ici. |
| `src/lib/supabase.ts` | Client Supabase + `trackEvent`, `submitEmail`, `submitSurvey`. |
| `src/index.css` | Design system complet (tokens couleurs, typo, toutes les sections). |
| `index.html` | Polices Google (Fraunces + Inter), meta, favicon. |
| `vercel.json` | Build Vite + rewrite SPA (toutes les routes → index.html). |
| `public/favicon.svg` | Alvéole or sur fond émeraude. |

---

## 3. Supabase — IMPORTANT

### Projet ACTUEL (le bon)
- **Nom** : `ledje`
- **Project ref / id** : `qihlqrmbcbfzjwfegsxv`
- **Région** : eu-west-3 (Paris)
- **URL** : `https://qihlqrmbcbfzjwfegsxv.supabase.co`
- **Org** : `basekou555's Org` (`txigvgsqelricwwvbrtw`)

### Ancien projet (NE PLUS UTILISER)
- `ddvboxgescsptvhkjgjl` = projet de l'app événements **wouli**. La landing
  y avait été branchée par défaut au début, puis **migrée** vers le projet
  dédié ci-dessus. Les tables Lédjé y ont été **supprimées**. Ne jamais
  rebrancher Lédjé dessus.

### Schéma (3 tables, toutes RLS activée, policy INSERT anon `with_check = true`)
- **`waitlist`** : `id` (uuid pk), `email` (text unique not null),
  `utm_source`, `utm_medium`, `utm_campaign` (text nullable), `created_at`.
- **`survey_responses`** : `id` (uuid pk), `waitlist_id` (uuid fk → waitlist,
  nullable), `frequency` (text), `attraction` (text[]), `intent` (text),
  `created_at`.
- **`page_events`** : `id` (uuid pk), `event_type` (text — `page_view`,
  `cta_click`, `scroll_50`, `scroll_100`, `page_exit`), `time_on_page_sec`
  (int nullable), `utm_source` (text nullable), `created_at`.

### Détails de sécurité / pièges
- Les policies n'autorisent **que INSERT** pour `anon` (pas de SELECT) →
  personne ne peut lire les emails côté client. Volontaire.
- `submitEmail` génère l'**UUID côté client** (`crypto.randomUUID()`) et
  n'utilise **pas** `.select()` après l'insert. Raison : un `POST ?select=id`
  exigerait une policy SELECT → sinon 401. **Ne pas réintroduire de
  `.select()` après un insert anon.**
- L'advisor Supabase signale `rls_policy_always_true` (WARN) sur les 3 tables.
  **C'est voulu** pour un formulaire public — ce n'est pas un bug. Pas de
  protection anti-spam (acceptable pour un test ; durcir plus tard avec
  Turnstile/hCaptcha ou une Edge Function si besoin).
- La clé `anon` est **publique par design** (RLS applique la sécurité) —
  la voir dans le bundle JS est normal.

---

## 4. Déploiement Vercel — PIÈGE MAJEUR À CONNAÎTRE

Vercel a des **variables d'environnement** définies sur le projet :
```
VITE_SUPABASE_URL       = https://qihlqrmbcbfzjwfegsxv.supabase.co
VITE_SUPABASE_ANON_KEY  = <clé anon du projet qihlqrmbcbfzjwfegsxv>
```

⚠️ **Vite/esbuild remplace `import.meta.env.VITE_*` au build, puis
constant-folde et SUPPRIME la valeur de secours** dans `src/lib/supabase.ts`.
Autrement dit : **les variables d'env Vercel gagnent toujours** sur le
fallback codé en dur.

Conséquence pratique : si un jour la prod écrit dans le mauvais projet,
la cause n°1 est ces variables Vercel — **pas** le code. Il faut les
corriger dans les réglages Vercel PUIS **redéployer** (les env vars ne sont
prises en compte qu'au build).

Le fallback en dur dans `supabase.ts` ne sert que si les env vars sont
absentes (ex. `npm run dev` local sans `.env.local`).

### Comment vérifier quel projet la prod utilise réellement
Le bundle est protégé par Vercel Auth. Utiliser l'outil MCP
`mcp__Vercel__web_fetch_vercel_url` :
1. Fetch `https://ledje.fr` → suivre le redirect avec `?_vercel_share=…`.
2. Récupérer le nom du bundle `/assets/index-XXXX.js` dans le HTML.
3. Fetch ce JS et `grep` l'URL `*.supabase.co` dedans.
Le projet compilé doit être `qihlqrmbcbfzjwfegsxv`.

### Variables d'env pour le dev local
Fichier `.env.local` (gitignoré) :
```
VITE_SUPABASE_URL=https://qihlqrmbcbfzjwfegsxv.supabase.co
VITE_SUPABASE_ANON_KEY=<clé anon>
```

---

## 5. Design system Lédjé (source de vérité visuelle)

Principe : **créer un univers autour d'un produit simple.** L'identité impose
un point de vue ; la couleur reine n'est PAS l'ambre (« miel ») mais le
**vert émeraude** (sens, tradition, noblesse — par évocation).

### Tokens couleurs (dans `src/index.css`)
| Rôle | Var | Hex |
|---|---|---|
| Fond de marque dominant | `--emerald` | `#2E6B4F` |
| Sections premium | `--emerald-velvet` | `#1F4736` |
| Texte sur clair / sceau | `--emerald-deep` | `#0F3D2A` |
| Or (dégradé métallique) | `--gold` | `#E8B65C` (de `#FBE9A8` à `#A9740F`) |
| Ambre produit | `--amber` | `#E0A52E` |
| Respiration / texte sur vert | `--cream` | `#EDE0C8` |

### Règles NON négociables
- **L'or est un accent rare** (nom, CTA, filets, sceau, alvéole) — jamais en
  aplat large, **jamais en couleur de texte courant** (échoue le contraste).
- Texte courant = **crème sur vert** ou **émeraude profonde sur crème**.
- **Alterner** sections émeraude / crème pour la respiration (pas tout sombre).
- L'or est un **dégradé métallique** (reflets serrés façon dorure), pas un
  fondu plat. Voir `--gold-gradient` / `--gold-gradient-text`.
- **Alvéole** (hexagone contour or + cellule centrale) = symbole de marque
  récurrent mais **discret** : header, sceaux, puces, trame de fond, favicon.
- Typo : **Fraunces** (titres, nom) + **Inter** (texte).
- Sobre et digne. Pas d'effets criards.

### Signature de marque
- Nom **Lédjé** (Fraunces, or dégradé).
- Tagline **« Parmi les bienfaits de ce bas monde »** (Fraunces italique).
- Accroche hero : « Le Prophète ﷺ buvait le miel mêlé à l'eau fraîche. »

### Accessibilité (WCAG 2.1 AA — respecter dès le build)
Mobile-first (99 % du trafic vient de TikTok). Labels visibles sur les inputs,
erreurs en texte (pas seulement couleur), focus visible, cibles ≥ 44×44 px,
un seul `<h1>`, landmarks, `prefers-reduced-motion` respecté, focus déplacé
proprement sur le questionnaire à son apparition.

---

## 6. Copy & états du formulaire (voix Lédjé : chaleureux, sobre)

- CTA principal (bouton) : **« Je veux être prévenu »**.
- Label email : « Ton email » (placeholder `ton@email.com`).
- Chargement : « Un instant… »
- Succès : « C'est noté. On te prévient au lancement. »
- Email invalide : « Cet email semble incorrect. Vérifie l'adresse et réessaie. »
- Déjà inscrit : « Tu es déjà sur la liste — on ne t'oublie pas. »
- Échec réseau : « La connexion a échoué. Réessaie dans un instant. »
- Consentement : « En t'inscrivant, tu acceptes de recevoir nos nouvelles.
  Pas de spam, désinscription en un clic. »
- Questionnaire (après email, optionnel, bouton « Passer » visible) :
  - Q1 Fréquence (signal de réachat, le + important) : Tous les jours /
    Plusieurs fois par semaine / De temps en temps / Surtout pendant le Ramadan.
  - Q2 Attraction (choix multiple) : Le geste de la tradition / La qualité du
    miel local / Le rituel au quotidien / L'idée d'en offrir.
  - Q3 Intention : Pour toi / Pour offrir / Les deux.
  - Fin : « Merci. À très vite. »

**Cohérence lexicale** : on dit « être prévenu » / « la liste » — pas
« s'abonner » (réservé au vrai produit plus tard).

---

## 7. Analytics & tracking

- **UTM** : le lien bio TikTok porte `?utm_source=tiktok&utm_campaign=<video>`.
  Capturés et stockés avec l'email (`waitlist`) et les événements (`page_events`).
- Événements passifs envoyés dans `page_events` : `page_view` (arrivée),
  `cta_click`, `scroll_50`, `scroll_100`, `page_exit` (avec `time_on_page_sec`).
- Pas d'outil tiers, pas de cookies invasifs. Supabase suffit.

---

## 8. Git & workflow

- Branche de dev désignée : **`claude/ledge-landing-page-mq2acp`**.
- Base de prod : **`main`** (déploiement production auto sur merge).
- Les PR précédentes (#1 landing, #3 migration Supabase) sont **mergées**.
  Pour une nouvelle tâche : repartir de `origin/main` à jour sur la même
  branche, ouvrir une **nouvelle** PR (draft), ne jamais empiler sur du
  merge déjà fait.
- Vercel déploie une preview par push de branche et la prod au merge sur main.

---

## 9. État actuel (au moment de cette transmission)

✅ Landing page complète en prod sur ledje.fr, identité de marque appliquée.
✅ Capture email + questionnaire + analytics fonctionnels (vérifiés en logs).
✅ Migration vers le projet Supabase dédié `qihlqrmbcbfzjwfegsxv` terminée et
   vérifiée (bundle prod pointe bien dessus ; env vars Vercel corrigées).
✅ Anciennes tables supprimées du projet wouli.

### Pistes ouvertes / non faites
- **Vidéo produit dans le hero** : câblage déjà prêt via la variable
  `VITE_HERO_VIDEO_URL` (voir `App.tsx` : si définie, `<video>` autoplay muet
  en fond du hero, avec dégradé pour garder la lisibilité). Il suffit de
  fournir l'URL de la vidéo (muette par défaut, respecte reduced-motion).
- Vue / export des inscriptions pour suivre la campagne (non fait).
- Protection anti-spam sur le formulaire (non fait, acceptable pour le test).

---

## 10. Réflexes pour la prochaine session

1. Toujours vérifier **quel projet Supabase** est réellement compilé en prod
   avant de conclure (cf. §4) — le piège des env vars Vercel est sournois.
2. Ne pas ajouter d'allégation santé (cf. §1).
3. Ne pas mettre l'or en texte courant (cf. §5).
4. Ne pas réintroduire de `.select()` après un insert anon (cf. §3).
5. Garder les tokens couleurs centralisés pour réajuster facilement.
6. Mobile-first, toujours tester le petit écran d'abord.
