---
name: ledje-site
description: "Trame de travail d'une session sur le site lédjé (ledje.fr). À utiliser dès que Basekou demande de rendre le site plus beau, mieux écrit, plus clair, de revoir une page, de corriger un texte ou un affichage, ou d'ajouter un bloc. Impose l'ordre : lire, regarder le site rendu, lister, laisser Basekou choisir, corriger, prouver."
---

# Trame d'une session « lédjé site »

Cette trame a été déroulée pour de vrai le 2026-11-10 (revue de l'accueil et de `/commander`).
Elle complète `docs/05_systeme/guide-outils.md` § 2 et 3.

**Règle d'or : on ne modifie rien avant que Basekou ait choisi.** Une demande comme « plus beau »
ou « mieux écrit » appelle d'abord une liste, pas un commit.

## Étape 1 — Lire (avant d'ouvrir le code)

1. `docs/README.md`, puis la page ÉTAT de Notion (lecture totale).
2. `docs/04_operations/site-technique.md` : la machine et ses pièges.
3. `docs/03_marche/site-precommande.md` : le rôle du site et les décisions de parcours.
4. `docs/01_adn/identite-verbale.md` et `docs/01_adn/conformite.md` si un texte est en jeu.
5. Les commentaires en tête de `src/App.tsx` et `src/Commander.tsx` : ils portent la raison datée
   de presque chaque bloc.

**Ce qui est décidé et ne se rediscute pas en session** — on peut le signaler, jamais le changer
d'office :

- la bande Instagram sous le haut de page de l'accueil (Basekou, 16/10) ;
- l'ordre « payer d'abord, prévenir ensuite » du parcours de commande (23/10) ;
- aucun lien sortant sur l'écran d'avant-paiement ;
- `/commande-confirmee` n'est jamais mise dans un menu ni un bouton ;
- l'accroche du haut de page est provisoire et NON tranchée : on ne la réécrit pas ;
- pas de registre religieux en façade, aucune allégation santé, « lédjé » en minuscules avec
  accents, « eau miellée », tutoiement.

## Étape 2 — Regarder le site rendu

```bash
npm ci
```

```bash
npx vite --port 5173 --host 127.0.0.1
```

Capturer avec Playwright (déjà installé, ne pas le réinstaller) :

- **largeurs** : 375 × 812 (mobile, neuf visiteurs sur dix) et 1440 × 900 ;
- **pages** : `/`, `/commander`, `/prestations`, `/offrir`, `/avis` ;
- **`reducedMotion: 'reduce'`** dans le contexte : sinon les textes animés au défilement restent
  invisibles sur une capture pleine page ;
- **faire défiler la page avant de capturer** : les images sont en chargement différé ;
- **vérifier `document.documentElement.scrollWidth`** : il doit être égal à la largeur de l'écran
  (pas de défilement horizontal) ;
- le parcours de commande se rejoue sans payer avec `/commander?test=1`.

Sans variables Supabase locales, les formulaires n'écrivent nulle part : on juge l'affichage, pas
l'enregistrement.

## Étape 3 — Lister

Lancer le skill `ui-design-review:ui-review` sur les captures. Sa banque d'exemples (UXKIN) ne se
connecte pas depuis une session cloud : la revue se fait sans, c'est normal.

Pour chaque problème : où il est, pourquoi il gêne le visiteur, la correction proposée. Trois
niveaux : à corriger, à améliorer, finition.

**À chercher en particulier**, parce que ces défauts ont été trouvés le 10/11 :

- un texte qui contredit l'écran suivant ou l'état réel du produit ;
- le haut de page mobile, qui peut être raté alors que la version bureau est réussie ;
- le bouton d'achat moins visible qu'un bouton secondaire ;
- un formulaire qui n'arrive qu'après plusieurs écrans de défilement.

## Étape 4 — Demander

Présenter la liste numérotée à Basekou. Mettre à part ce qui touche une décision de l'étape 1.
**Attendre son choix.** Dire quelles pages n'ont pas été regardées.

## Étape 5 — Corriger

- Repartir de `origin/main` à jour, nouvelle branche, nouvelle PR draft. Ne jamais empiler sur
  du fusionné.
- **Apparence** : skill `ui-design-review:ui-polish`, sur les seuls points choisis. Les couleurs,
  tailles et espacements viennent des variables de `src/index.css`, on n'en invente pas.
- **Texte** : tout texte nouveau ou modifié passe par le skill `marketing:brand-review` AVANT
  d'entrer dans le code. Un texte de marque (accroche, titre de section, signature) se propose en
  trois variantes dans la réponse, sans modifier le fichier.
- **Un prix** se vérifie dans `docs/02_produit/prix.md` avant de s'écrire.
- **Ne jamais** : toucher aux policies Supabase, ajouter un `.select()` après un insert anonyme,
  poser un `document.title` dans une page, ajouter une quantité de packs sans son lien de paiement.

## Étape 6 — Prouver

1. `npm run build` passe.
2. Captures avant et après, aux deux largeurs, des pages touchées.
3. Skill `code-review` sur le diff si du code de logique a changé.
4. Pousser, ouvrir la PR draft, s'abonner à son activité. L'aperçu Vercel est posté en
   commentaire : donner le lien à Basekou, qui juge sur son téléphone.
5. Dire ce qui a été vérifié à l'écran et ce qui ne l'a pas été. Le paiement réel et
   l'enregistrement en base ne se vérifient pas depuis une session.

## Étape 7 — Fermer

Mettre à jour `site-technique.md` ou `site-precommande.md` si l'état du site a changé, ajouter une
ligne à `decisions-log.md` pour toute décision de Basekou, puis dérouler le skill
`ledje-passation` avant de quitter la session.

## Si un outil manque

Si `ui-design-review:ui-review`, `ui-design-review:ui-polish` ou `marketing:brand-review` n'est
pas disponible, le dire à Basekou et continuer à la main en suivant les mêmes étapes. Ne pas faire
comme si la revue avait eu lieu.
