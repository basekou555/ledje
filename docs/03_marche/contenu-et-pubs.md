---
statut: en_cours
domaine: marche
maj: 2026-07-13
source: "SOT Partie 6 (archive 2026-07-24)"
resume: "Méthode créa (MCSLA, référence→transposition), pub 4 plans façon Coca, scripts V1/V2, paramètres Higgsfield ; le système visuel complet vit dans ../visual/."
---

# Contenu & création publicitaire

## Méthode (discipline établie)

1. **Le branding précède les visuels.** Générer des images sans design system verrouillé = gaspillage (leçon apprise).
2. **Valider les prompts sur le papier** (FR bloc par bloc, puis EN) AVANT de dépenser un crédit. Un changement de variable à la fois.
3. **Formule MCSLA** pour la vidéo : Model · Camera · Subject · Look · Action — caméra en position 2. Mouvements nommés (Dolly In lent, Handheld léger). Un seul mouvement principal par clip. Verbes actifs.
4. Structure image : Sujet → Composition → Environnement → Lumière → Caméra → Rendu.
5. Clips de 3-5 s générés séparément, **assemblés dans CapCut**. Texte ajouté en CapCut/Canva (jamais généré par l'IA).
6. **Référence → transposition** : décortiquer une pub qui marche (captures d'écran = plus fiable), extraire le squelette technique (grammaire visuelle, caméra, rythme), transposer. On ne copie pas l'image, on copie la structure.
7. Économie de crédits : plans fixes = images (~1 cr) animées au montage ; n'animer que les plans où le mouvement est essentiel (~17 cr/clip).

## Pub produit « façon Coca » (4 plans, monde ambre, sans personnage)

Recette extraite de la référence Coca : monde mono-couleur, low-key, rim light, condensation, macro, cuts courts, payoff slogan. Transposée en ambre/digne :
1. **P1 Héros** (image) — verre + cristal de miel (texture rayon de miel), monde ambre chaud, bougie. **VALIDÉ** : asset `7dbd6316-3e53-4847-8a3f-2b051f990cde` *(généré avant la bascule terminologique — montre l'ancienne forme « perle », à régénérer en cristal)*.
2. **P2 Épanouissement** (vidéo, plan signature) — le cristal de miel touche l'eau, le miel s'épanouit façon encre. Job `23284fd1-d317-4fed-b546-a59b96e509a9` (lancé, verdict utilisateur : pas encore satisfaisant).
3. **P3 Infusion** (vidéo) — volutes qui se posent, façon thé. **Pas encore généré.**
4. **P4 Payoff** (image) — verre fini + espace texte. Texte « Parmi les bienfaits de ce bas monde » + Lédjé ajouté au montage. **Pas encore généré.**

**⚠️ Statut visuels : les vidéos actuelles ne sont pas satisfaisantes.** Décisions : (a) passage prévu à un plan Higgsfield supérieur pour accéder à Seedance complet ; (b) **retravailler les prompts dans le nouveau monde émeraude+or du design system** (l'ancien monde « ambre générique » est la cause principale) ; (c) attendre le retour de la designeuse avant la production définitive ; (d) prochain chantier visuel = **images produit/packaging réalistes** dans le design system, comme matière de dialogue avec la designeuse.

## Scripts V1 & V2 (documentés, en attente)

- **V1 « rituel du soir »** : cristal de miel, nuit, rupture du jeûne, silhouette à contre-jour. Registre contemplatif.
- **V2 « découverte » (bouteille RTD)** : test de demande cristal vs bouteille. Énergie shake, jeune, rafraîchissement. Garde-fou : jamais performance/sport/récup (= promesse santé déguisée).
- Doc : `ledje-scripts-pubs-v1-v2.md` (outputs) — ⚠️ hors repo.

## Higgsfield — paramètres appris

- Modèle image : `recraft-v4-1`, model_type `standard`, 9:16. Vidéo : `seedance_2_0` image-to-video (~17 cr/5 s), mode fast, 720p.
- Décliner le preset « IN THE DARK » : `declined_preset_id: 24bae836-2c4a-48e0-89b6-49fcc0b21612`.
- Compte : plan Basic (limité). Passage à un plan supérieur prévu.
- Skill de prompting bookmarké : `OSideMedia/higgsfield-ai-prompt-skill` (GitHub) — formule MCSLA adoptée ; installation complète = plus tard, en phase de production en volume.
- L'analyse vidéo de référence nécessite le **fichier** vidéo (jamais un lien TikTok) ; outil Higgsfield « ad reference » / analyse scène par scène disponible pour industrialiser.
- **Hero vidéo landing** : câblage prêt via `VITE_HERO_VIDEO_URL` (video autoplay muette en fond de hero) — fournir l'URL quand un clip satisfaisant existera.
- **Reference elements** : une fois une image produit validée, la sauvegarder comme élément de référence Higgsfield pour la réutiliser dans les prompts suivants (cohérence visuelle native, sans redécrire le produit à chaque fois).

## Le système de production visuelle

Le système complet (constitution artistique, master prompt, prompt library, shot book, asset log) vit dans **`../visual/`**, routé par le `CLAUDE.md` racine — on ne le duplique pas ici. Statut au moment de la découpe : système complet, **zéro image générée dans ce cadre**. Premier shot candidat : H01 "La Rencontre" (image fixe, ne dépend pas de la confirmation du format produit).

> ⚠️ Contradiction signalée (non tranchée) : le SOT archivé (§6.5) affirmait « pas de
> `prompt-library.md` maintenu à la main », mais `../visual/ledje-prompt-library.md` existe —
> introduit volontairement plus tard (cf. CLAUDE.md racine). Le CLAUDE.md fait foi.
