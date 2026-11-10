---
name: ledje-com
description: "Trame de travail d'une session « Com et branding » du projet lédjé : écrire ou relire un texte de marque, une légende, un hook, une affiche, un flyer, un visuel de stand, une étiquette, travailler l'identité verbale ou visuelle, compiler un prompt d'image. À utiliser quand Basekou demande un texte ou un support pour lédjé, demande si un texte ou un visuel « passe », ou travaille le nom, le ton, l'accroche, la signature, la palette, la typo ou le logo."
---

# Trame d'une session « Com et branding »

**Première version, écrite le 2026-11-10 à partir des fiches, jamais déroulée.**

**Règle d'or : un support n'est pas fini tant qu'il n'a pas été vu à sa taille réelle, avec la
couche de marque.** Leçon du 10/11 : un bloc de texte sans police, logo ni décor prouve que ça
rentre, il ne fait pas un livrable.

## Étape 1 — Lire

1. `docs/README.md`, la page ÉTAT de Notion (lecture totale).
2. `docs/01_adn/README.md` : il liste les objets à ne pas confondre (cible et territoire,
   personnalité et ton, origine religieuse du produit et obligation de communication religieuse).
3. Selon la tâche :
   - un texte : `docs/01_adn/identite-verbale.md` et `docs/01_adn/conformite.md` ;
   - un visuel : `docs/01_adn/identite-visuelle.md` et `docs/01_adn/territoire-de-marque.md` ;
   - une image générée : `docs/visual/README.md`, puis la procédure « compiler un shot » de
     `CLAUDE.md` ;
   - un post : `docs/03_marche/grille-contenu.md`.

## Étape 2 — Savoir ce qui est tranché et ce qui ne l'est pas

**Tranché, ne se rediscute pas en session :**

- « lédjé » s'écrit en minuscules, avec ses accents. Seule exception : l'existant technique
  (domaine, adresses, noms de compte).
- La marque tutoie, parle français, sans anglicismes.
- On dit « eau miellée » et « cristal de miel ». Mots bannis : perle, portion, monodose,
  pastille, bonbon, ancestral, addictif.
- Le compte Instagram est `@its.ledje`.
- On combat un compromis, jamais un acteur : aucun concurrent nommé ni comparé en public.

**Non tranché — on travaille dessus, on ne l'écrit pas comme acquis :**

- la signature (« Parmi les bienfaits de ce bas monde » est une option de travail) ;
- l'accroche (trois options, aucune arrêtée) ;
- la typographie, le logo, le symbole ;
- la palette : la fiche se contredit (son en-tête la dit rouverte, son corps la dit arrêtée le
  17/10). **À faire trancher par Basekou avant de s'appuyer dessus.**

Un texte de marque se propose en variantes. La session n'en choisit pas une à la place de
Basekou.

## Étape 3 — La grille de conformité, étape fixe

Tout texte sortant y passe : script, légende, page, affiche, étiquette, mail à un partenaire.

- **Jamais un effet sur le corps**, ni dit ni suggéré. L'implicite compte autant que l'explicite,
  image comprise.
- Sur le sucre, une seule formule comparative est autorisée : celle de `conformite.md`, reprise
  mot pour mot.
- La mention sur les enfants de moins d'un an est obligatoire là où `conformite.md` l'exige.
- **Registre religieux** : il se dit à l'oral, devant un public dont on sait qu'il est musulman.
  Jamais sur les réseaux ni sur un support écrit public, affiche en mosquée comprise. Aucun
  symbole religieux explicite.
- **Yeux jamais visibles sur une image fabriquée** (générée ou mise en scène). Basekou filmé
  lui-même en est exclu. Pour une autre personne réelle filmée, la règle n'est pas arrêtée :
  demander.
- Le texte affiché à l'écran n'est jamais généré par une IA d'image.

`conformite.md` est protégée : la session l'applique, elle ne la modifie pas.

## Étape 4 — Écrire

| Besoin | Outil |
|---|---|
| Un post, une légende, un script | Skill `marketing:draft-content` |
| Un format précis (hook, carrousel, script court) | Skills `social-media-skills:…` — génériques, ils ignorent la marque |
| Un plan de lancement ou de dégustation | Skill `marketing:campaign-plan` |
| Un prompt d'image | La procédure « compiler un shot » de `CLAUDE.md` |

Puis, **toujours** : skill `marketing:brand-review` sur le texte produit, et correction des
écarts qu'il relève. La liste `tools/contenu/lexique-interdit.txt` complète le lexique.

## Étape 5 — Fabriquer un support

- **Canva** : un fichier déposé seul par le connecteur est introuvable à la main. Créer un
  DESIGN et y poser les pièces page par page.
- **Vérifier la taille réelle** en millimètres avant de travailler : une maquette aux mauvaises
  dimensions a déjà coûté une séance (09/11).
- **Un QR code** se vérifie deux fois : sa cible (ouvrir le lien) et sa lisibilité à la taille
  d'impression, jusqu'à une version très réduite.
- **L'eulogie** n'a de glyphe propre dans aucune police d'impression du poste : on imprime la
  forme en toutes lettres.
- Le logo n'existe qu'en image aplatie ; sa source vectorielle n'est pas localisée. Ne pas le
  redessiner.
- Les générateurs `gen_visuel_qr.py`, `gen_visuel_v2.py` et `gen_affiche_mosquee.py` vivent sur
  le poste de Basekou : la session écrit les paramètres, il lance.
- Aucun designer n'est mandaté à ce jour ; `docs/ledje-brief-designer.md` n'a plus de
  destinataire.

## Étape 6 — Prouver

1. Montrer le support rendu, à sa taille, pas une description.
2. Relire le texte **dans** le support, pas à côté : une relecture faite sur une image a laissé
   passer un lien illisible (08/10).
3. Dire ce qui n'a pas été vérifié (impression réelle, rendu sur téléphone).
4. Après le jugement de Basekou sur une image générée : le consigner dans
   `docs/visual/ledje-asset-log.md`.

## Étape 7 — Consigner et fermer

- Une décision de marque : une ligne dans `decisions-log.md`, et la fiche ADN mise à jour par
  une branche et une PR.
- Un support produit : l'inscrire dans `docs/05_systeme/outils.md` s'il s'agit d'un outil
  réutilisable.
- Dérouler `ledje-passation`.
