---
statut: en_cours
domaine: marche
maj: 2026-07-13
source: "SOT §5.0, 5.5, 5.9 (archive 2026-07-24) — refonte décidée 2026-07-10"
resume: "Le site comme machine à convertir : refonte en cours (bouteille séduit, cristal convertit), structure de parcours, copy, écart avec l'état déployé."
---

# Site — conversion & précommande

## Refonte du site — décisions stratégiques (2026-07-10)

Refonte en cours suite aux retours utilisateur (Valentin, cf. plus bas) et à la clarification produit. Décisions cadre :

**Nom de la boisson sur le site : « eau miellée »** (simple, direct, descriptif — c'est une *boisson*, pas un pot de miel).

**Deux produits, deux rôles :**
- **La bouteille = produit phare mis en scène** (héros visuel, émotion, rituel montré) — MAIS **non vendue en ligne** (contrainte logistique : fermentation, poids, chaîne du froid).
- **Le cristal de miel = produit de conversion**, ce qu'on **pré-vend** en ligne (sec, stable, léger, expédiable). Le site séduit avec la bouteille, convertit sur le cristal.

**Précommande (cœur business — le site finance la production industrielle) :** mécanique et tarifs dans `../02_produit/prix.md` (1 cristal = 1 €, min. 5 €, remboursé si pas de lancement). **Email** : capté automatiquement via la précommande (acheteurs) + **une ligne discrète** pour les tièdes (« Pas encore prêt ? Laisse ton email »), jamais un formulaire concurrent de la précommande. La précommande est l'action principale mise en avant.

**Header de navigation** (remplace l'ancienne bannière inutile) : logo à gauche (clic → haut de page), CTA **« Précommander »** en or à droite (visible en permanence), raccourcis = **ancres internes** qui scrollent vers les sections (rester sur la landing, ne pas casser le tunnel). Choix des 2-4 raccourcis à figer une fois les sections écrites. **Page Mosquée (audience B2B) : plus tard**, quand le canal est rodé.

**Structure de parcours (logique « questions du visiteur ») :** Hero (c'est quoi + séduire) → Pourquoi Lédjé (créer le désir, le sens) → Origine/pureté (rassurer : vrai miel français) → le rituel + la ummah (appartenance + geste comme couleur) → Précommande (agir). Le **geste** n'ouvre jamais une section — il vient en second rideau (cf. `../01_adn/vision-positionnement.md`).

**Hero :** accroche = *« De l'eau fraîche, du miel pur. »* / sous-titre = *« Le rappel d'un bienfait pour la ummah. »* — ⚠️ deux accroches concurrentes coexistent dans les décisions, arbitrage à faire avec la com : cf. `../01_adn/identite-verbale.md`. (« bienfait » isolé = à revalider conformité avant mise en ligne, choix assumé par Basekou pour l'instant). Visuel = une personne de la cible (marqueur culturel : tenue traditionnelle, ou subtil ; **sans yeux/visage** — lunettes, angles) dans un moment de vie qui respire l'équilibre ; la santé et l'appartenance passent par l'**image**, jamais par le texte. Nouvelle **vidéo Hero** à produire (brief séparé `ledje-brief-video-hero.md` — ⚠️ hors repo : séquence refus en rayon → bouteille → cristal → transmission → partage → signature).

## Copy & états du formulaire (voix Lédjé — version déployée)

- CTA : **« Je veux être prévenu »** · Label : « Ton email » · Chargement : « Un instant… »
- Succès : « C'est noté. On te prévient au lancement. » · Déjà inscrit : « Tu es déjà sur la liste — on ne t'oublie pas. »
- Email invalide : « Cet email semble incorrect. Vérifie l'adresse et réessaie. » · Échec réseau : « La connexion a échoué. Réessaie dans un instant. »
- Consentement : « En t'inscrivant, tu acceptes de recevoir nos nouvelles. Pas de spam, désinscription en un clic. »
- **Questionnaire** (après email, optionnel, bouton « Passer ») — version déployée : Q1 Fréquence (signal de réachat) : Tous les jours / Plusieurs fois par semaine / De temps en temps / Surtout pendant le Ramadan. Q2 Attraction (multi) : La tradition musulmane / Le goût de la boisson / L'accessibilité / Une marque qui partage mes valeurs / La composition simple et pure. Q3 Format d'entrée (`entry_format`) : Un pack découverte, sans engagement / Un abonnement, pour ne plus y penser / Un coffret à offrir. Fin : « Merci. À très vite. » *(Note conformité : l'option « bon pour la santé » a été refusée et remplacée par « La composition simple et pure » — allégation implicite interdite.)*
- **Réservation Stripe** (après le questionnaire, version déployée) : bloc « Tu veux une place dans la première production ? » → CTA « Je réserve ma place — 5 € » (Payment Link, acompte remboursable). Événement `stripe_click`. *(À faire évoluer vers la mécanique de précommande cristal 1 €/min. 5 €.)*

## État déployé (antérieur à la refonte)

Ordre en prod : **Hero** (vidéo plein écran ; voile + texte en fondu à ~5 s) → **Le Geste** (carrousel horizontal des 3 photos, piloté par le scroll vertical, section figée/pinned, natif, repli vertical en `prefers-reduced-motion`) → **L'Origine** (fond ambre dégradé, image → **vidéo « miel qui coule »** au survol/tap, `preload="none"`) → **Bouteille** (teaser « Bientôt », packshot sur fond émeraude profond + halo) → **FAQ** (accordéon natif `<details>`) → **Formulaire** email → **Questionnaire** → **Réservation Stripe**.

⚠️ **Cet état est antérieur à la refonte** : la nouvelle structure (nom « eau miellée », bouteille phare non vendue en ligne, précommande cristal, header de navigation, nouveau hero) **n'est pas encore implémentée**. Le site parle encore de « portion/geste » → à réaligner sur « cristal de miel » et à restructurer.

**Retours test utilisateur (Valentin, 2026-07-09)** : liste de corrections (clarté produit, CTA/conversion, hero, finition UX, textes) — matière de la refonte. Conformité maintenue : **aucune allégation santé**, même en FAQ (proposition refusée).

## Renvois

- Technique (stack, Supabase, pièges Vercel, a11y, git) : `../04_operations/site-technique.md`
- Tracking & acquisition : `acquisition-tiktok.md`
