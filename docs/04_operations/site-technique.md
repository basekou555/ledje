---
statut: figé
domaine: operations
maj: 2026-10-22
source: "SOT §5.1-5.4, 5.6, 5.7, 5.8 (archive 2026-07-24) — état vérifié en prod"
resume: "La technique du site : stack, fichiers clés, Supabase (pièges voulus), piège majeur Vercel, analytics, accessibilité, workflow git."
---

# Site — état technique (vérifié en prod)

**Le rôle marketing du site (refonte, copy, précommande) : `../03_marche/site-precommande.md`.** Ici : la machine.


## 🛒 2026-10-22 — Le parcours d'achat : six liens de paiement, et un mail après encaissement

**État au 22/10, après le test de Basekou en production.**

### Le parcours, dans l'ordre

1. **`/commander`** — formulaire *(packs, ville, prénom, quand, contact, canal)*. La commande est écrite dans `commandes` **avant** tout le reste : un client qui abandonne ensuite reste joignable.
2. **L'écran « Plus qu'à régler »** — **un seul bouton : payer**. Rien d'autre, et surtout aucun lien qui quitte le site.
3. **Stripe** — le lien correspond à la quantité choisie.
4. **`/commande-confirmee`** — la page d'après paiement, **et c'est là que le client prévient** par le canal qu'il a choisi.

### 🔴 L'ORDRE DE CES DEUX GESTES EST UNE DÉCISION, pas un héritage — inversion du 23/10

**Le 22/10, « prévenir » venait AVANT « payer »** *(l'idée : la discussion s'ouvre même si le paiement est abandonné)*. **Basekou a testé et tranché l'inverse** : *« il faut faire payer avant de faire envoyer le message, parce que sinon on quitte l'appli, on oublie de revenir pour payer »*.

🎯 **Le raisonnement est juste et il vaut d'être gardé : ouvrir WhatsApp ou Instagram fait SORTIR DU SITE.** Revenir régler après avoir changé d'application demande un effort que personne ne fait — et le geste gratuit était placé avant le geste payant. ⛔ **Ne pas remettre de lien sortant sur l'écran d'avant-paiement.** Après paiement, ce coût n'existe plus : l'argent est encaissé, le client peut partir où il veut.

📌 **Pas de redirection automatique vers Stripe** : on n'envoie personne sur une page de paiement sans qu'il ait appuyé.

### ⚠️ Trois pièges à connaître avant de toucher à ce parcours

**① LA QUANTITÉ NE SE PRÉ-REMPLIT PAS DANS UN PAYMENT LINK.** Aucun paramètre d'URL ne la porte. D'où **un lien par quantité**, 1 à 6 packs, dans `LIENS` (`src/Commander.tsx`). ⛔ **Ajouter un choix au-delà de 6 sans créer le lien correspondant fait disparaître le bouton de paiement** — `lienPaiement` retombe sur `null`, et la commande partirait sans moyen de payer. L'ancien lien à quantité ajustable est **désactivé** côté Stripe : c'était lui qui obligeait à ressaisir la quantité.

**② `/commande-confirmee` EST UNE PREUVE DE PAIEMENT, pas une page comme les autres.** On n'y arrive que par la redirection Stripe, qui ne se déclenche qu'après un paiement réussi. ⛔ **Ne jamais la mettre dans un menu, un bouton ou un lien du site** : ce serait annoncer un paiement qui n'a pas eu lieu. ⚠️ La redirection est écrite **en dur sur `ledje.fr`** côté Stripe ⇒ depuis un aperçu de PR, le paiement ramène en **production**, pas sur l'aperçu.

**③ UN SITE NE PEUT PAS ENVOYER UN MESSAGE À LA PLACE DU CLIENT.** On pré-remplit, il appuie. Et **Instagram n'a aucune API de DM pré-rempli** : on ouvre la conversation et on copie le texte. Chaque canal porte donc **sa** note — une note générique mentirait sur l'un des quatre *(défaut trouvé au test : le canal Téléphone affichait la consigne d'Instagram)*. Tout ça vit dans **`src/lib/canaux.ts`**, partagé par les deux pages depuis le 23/10 — un numéro de téléphone dupliqué à deux endroits, c'est celui qui dérive à la première retouche.

**④ LE MESSAGE EST ÉCRIT SUR `/commander` ET RELU SUR `/commande-confirmee`**, via `localStorage` *(clé `ledje_commande`)*. ⚠️ **La page de retour est un chargement NEUF** après le détour par Stripe : elle n'a jamais vu le formulaire. Si la mémoire manque *(navigation privée, autre appareil, stockage bloqué)*, **le bouton disparaît et seul le mail reste** — vérifié. La page ne doit pas promettre un message qu'elle ne peut pas pré-remplir.

### Le mail après paiement — `supabase/functions/commande-payee`

**Pourquoi côté serveur** : un client qui ferme l'onglet après avoir payé ne déclenche rien côté navigateur.

- Déclenchée par un **webhook Stripe** sur `checkout.session.completed` → `https://<projet>.supabase.co/functions/v1/commande-payee` *(`verify_jwt: false` — un webhook n'a pas de JWT)*.
- **Le contenu du formulaire n'est pas dans l'événement Stripe** : Stripe ne transporte que le `client_reference_id` posé par le site. La fonction **relit la ligne `commandes`** avec la clé de service. ✅ La table reste **INSERT-only pour `anon`, sans policy SELECT** : seule la clé de service relit.
- **Envoi par Resend**, avec **les mêmes secrets que `alerte-reclamation`** — rien de neuf à configurer de ce côté. *(Ne pas revenir au SMTP Zoho : bloqué sur le plan gratuit, cf. l'historique de cette fiche.)*
- **Signature vérifiée à la main** (HMAC-SHA256 sur `<t>.<corps brut>`), tolérance 5 min contre le rejeu. ⚠️ **Le corps doit être le texte brut** : un `JSON.parse` suivi d'un `JSON.stringify` invalide la signature.
- ⛔ **Sans `STRIPE_WEBHOOK_SECRET`, la fonction refuse tout** (500 `webhook_not_configured`). Le secret se colle dans les **secrets Edge Function du dashboard Supabase** — il ne peut pas être posé depuis une session IA, l'outil ouvre un formulaire dans le navigateur de Basekou.

### Où regarder quand un paiement n'a pas produit de mail

1. **Stripe → l'endpoint du webhook** : chaque tentative y est gardée avec sa réponse. Un **401** = le secret manque ou ne correspond pas. Un **500 `resend_not_configured`** = secret Resend absent.
2. **Supabase → logs de la fonction** `commande-payee`.
3. Un paiement **sans `client_reference_id`** *(lien partagé à la main)* envoie quand même le mail, avec « commande non retrouvée » : c'est voulu.

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

## 📱 Réseaux sociaux dans le pied de page (ajouté le 2026-10-02)

**Une rangée d'icônes Instagram et TikTok est posée dans le `<footer>` de `App.tsx`**, entre la signature et l'adresse mail. **Icônes SVG inline** — aucune dépendance, aucun appel réseau, teinte héritée par `currentColor`. Cibles de **44 × 44 px** conformément à la règle d'accessibilité ci-dessous, pour une icône de 20 px. Liens en `target="_blank"` + `rel="noopener noreferrer"`, `aria-label` par réseau, et un événement `social_click_<réseau>` dans `page_events`.

🔴 **LES URL NE SONT PAS RENSEIGNÉES, ET C'EST VOULU.** **Les comptes TikTok et Instagram existent** *(déclaré le 28/09)* **mais aucun handle n'est écrit nulle part dans le dépôt.** ⛔ **On n'invente pas une adresse de profil : un lien faux sur un site en ligne est pire que pas de lien.**

✅ **GARDE-FOU CODÉ, PAS SEULEMENT DOCUMENTÉ : une entrée dont `url` est vide n'est pas rendue, et la rangée entière disparaît si les deux le sont.** ➡️ **Si ce fichier part en production tel quel, le pied de page est exactement celui d'avant.** **Vérifié au navigateur sur le build : 0 icône à vide, 2 icônes dès qu'une URL est posée.**

📌 **Pour activer : coller l'URL complète du profil dans `SOCIALS`, en haut de `App.tsx`. Rien d'autre à toucher.**

⚠️ **Réserve de fond, consignée et non tranchée : les deux comptes n'ont RIEN publié à ce jour** *(`../03_marche/grille-contenu.md`)*. **Un visiteur qui clique arrive sur un profil vide** — et c'est le visiteur qui vient « vérifier que c'est sérieux », ce que la vitrine existe précisément pour faire. 🎯 **La question n'est donc pas technique : elle est de savoir si on ouvre la porte avant ou après la première publication.**

## Accessibilité

WCAG 2.1 AA, mobile-first (99 % du trafic = TikTok). Labels visibles, erreurs en texte, focus visible, cibles ≥ 44×44 px, un seul h1, landmarks, `prefers-reduced-motion`, focus déplacé sur le questionnaire.

## Git & workflow

- Prod : `main` (déploiement auto au merge). Vercel : preview par push, prod au merge.
- Nouvelle tâche = repartir de `origin/main` à jour, **nouvelle PR draft**, jamais empiler sur du mergé.
