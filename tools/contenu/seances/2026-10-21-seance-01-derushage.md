# Séance 01 — dérusher le fonds et monter les deux premières pièces

*Mission pour la session Claude Code **sur le PC de Basekou**, écrite le 2026-10-21 à 22h15 CEST par la
session distante (PR #121). Pour la lancer : ouvrir Claude Code dans le dossier du dépôt `ledje` sur
le PC, et écrire : « lis `tools/contenu/seances/2026-10-21-seance-01-derushage.md` et exécute la séance ».*

## Contexte

Tu es la session qui a ce que les sessions distantes n'ont pas : **les rushes sous la main**, dans le
dossier **« ledje Rush Bureau »** sur le Bureau (le disque `D:\LEDJE` est la copie complète ; le Bureau
porte ce qui est à exploiter — règle de Basekou du 21/10). Basekou a posé le cadre le 21/10 :

- *« L'outil doit être autonome : lire les vidéos, comprendre le contenu, identifier comment l'exploiter.
  Moi je filme ; l'équipe dérushe, coupe, monte. Je veux juste valider ou faire modifier. »*
- *« Toi, l'expert de la création de contenu, force de proposition sur la technique et la réalisation.
  Moi, le capitaine du navire. »* ➡️ Propose, tranche sur la réalisation, demande-lui les choix d'entreprise.
- **TikTok = face cam, l'avancée du projet, humain** (*« j'ai du mal à imaginer un contenu de marque sur
  TikTok sans le fondateur »*). **Instagram = carrousels, mise en avant du produit et de la marque.**
  Le compte Instagram `@its.ledje` a déjà des posts dans ce sens.
- **Basekou à l'image : oui**, surtout sur TikTok. Les yeux visibles sont admis pour lui.
- **Autres personnes filmées : cacher les visages autant que possible** ; en repli, remplacer le plan
  par du b-roll ou du motion. *(Arbitrage oral du 21/10 — il lève le blocage « aucune sortie d'un rush
  tiers », à condition que le visage ne soit pas identifiable.)*
- **Conformité : au cas par cas.** Pour chaque élément qui frôle la santé ou la religion, on adapte et on
  propose une formulation qui tient. Les fiches `docs/01_adn/conformite.md` et `identite-verbale.md`
  restent la référence ; `tools/contenu/relecture.py` pointe les passages à regarder.
- **Le son** : la base est le son réel des rushes ; les effets sonores se font en finition dans CapCut,
  après validation, sur la pièce rendue. La musique n'est pas un sujet pour l'instant.
- **Les 4 clips longs** ont été visionnés par Basekou : des **tests d'échantillons** du temps de la
  construction de la recette, et une **interview à la miellerie** avec l'apiculteur ; il ne se souvient
  plus des deux autres. ⚠️ La recette a changé depuis (15 mL, assemblage 25/75 tilleul-montagne) :
  aucun chiffre ni aucune dose tirés de ces clips ne vont à l'écran.

## À lire d'abord (dépôt, branche `claude/exciting-babbage-hm0xps` — `git fetch origin && git checkout claude/exciting-babbage-hm0xps && git pull` ; si elle est mergée, `main`)

1. `docs/04_operations/contenu-rushes.md` — le système rushes → pièces.
2. `tools/contenu/README.md` — `derush.py`, `rendu.py`, `relecture.py`.
3. `docs/03_marche/grille-contenu.md` — formats, niveaux, sujets, filtre avant publication.
4. `docs/01_adn/conformite.md`, `docs/01_adn/identite-verbale.md` — les interdits (lecture prudente).

## Règles

- Tu écris les tags, les analyses, les recettes. Tu n'écris **jamais** un verdict : `valide-production`,
  `valide-publication`, `ecarte` sont à Basekou. Tout rendu porte le filigrane TEST jusqu'à sa validation.
- Aucune publication. Aucune marque nommée dans le contenu. Toute mention du sucre porte « jusqu'à ».
- Tout rush où quelqu'un parle du produit : transcription, puis `relecture.py`, puis tu montres les
  timecodes à Basekou et tu proposes une adaptation (cas par cas).
- Note la date et l'heure de ce que tu fais. Parle franco : ce qui est faible, ce qui manque.

## Étapes

1. **Vérifier l'installation** : `python --version` (3.10+), `pip install pyyaml openai-whisper`,
   `ffmpeg -version`, `ffprobe -version`. ffmpeg absent → https://www.gyan.dev/ffmpeg/builds/ (release
   essentials, ajouter `bin\` au PATH). Confirme avec Basekou le chemin exact du dossier « ledje Rush Bureau ».
2. **Les références** : le dossier contient aussi de grosses vidéos d'autres créateurs que Basekou aime.
   Demande-lui lesquelles, déplace-les (avec son accord) dans `_references/` pour qu'elles ne soient pas
   indexées comme rushes.
3. **Dérusher** : `python tools/contenu/derush.py "<dossier>" --planches "<dossier>\_planches" --transcrire "<dossier>\_transcripts"`
   (whisper `small` ; long sur les gros clips — lance-le et avance en parallèle). Puis **lis chaque
   planche** (Read sur le .jpg : une image toutes les 5 s, timecode incrusté) et chaque `.srt`, et remplis
   les tags de `rushes-index.csv` : `gisement`, `lieu`, `sujet`, `formats`, `niveau`, `personnes`
   (aucune · mains · basekou · tiers · basekou+tiers), `son`, `oral`, `etat: derushe`,
   `timecodes_utiles` (les 3 à 6 s exploitables, avec un mot sur ce qu'on y voit), `notes`. Planche
   insuffisante sur un clip long → `--pas 2` sur lui seul. Rush `oral: oui` → `relecture.py` sur le .srt,
   timecodes consignés dans `notes`.
4. **Analyser une référence** (la plus parlante pour Basekou ; demande-lui ce qu'il aime dedans : le
   rythme, la voix, le texte, l'image — on ne copie que ça) : planche + transcription, puis
   `_references/<nom>-squelette.md` : durée, nombre et durée des plans, où tombe le hook et sous quelle
   forme, rythme des coupes, rôle de la voix off / du texte / de la musique, structure (ouverture,
   développement, chute), ce qui fait qu'elle marche, **ce qu'on reproduit avec nos rushes, ce que Basekou
   doit filmer en plus**. Méthode « référence → transposition » (`docs/03_marche/contenu-et-pubs.md`).
5. **Proposer deux pièces** à partir de `docs/05_systeme/templates/template-recette-piece.yaml` :
   - une **TikTok** qui applique le squelette de la référence, avec Basekou à l'image ou en voix si le
     fonds le permet (l'interview à la miellerie est un bon candidat : sa voix, le lieu, l'apiculteur en
     b-roll sans visage identifiable) ;
   - un **« le geste »** simple pour Instagram ou TikTok : 3 à 5 plans, son réel, hook en texte sur le
     plan 1, chute « lédjé — de l'eau, du miel » à la fin.
   Recettes dans `<dossier>\_montages\`. Soumets-les à Basekou en deux phrases chacune, puis rends :
   `python tools/contenu/rendu.py <recette>.yaml`. Donne-lui les chemins des .mp4.
6. **Itérer sur ses retours** : il dit ce qui ne va pas, tu modifies la recette, tu re-rends. Consigne
   chaque correction dans `<dossier>\_montages\apprentissages.md` (date, ce qu'il a demandé, la règle
   de montage qu'on en tire). C'est le début du style de montage Lédjé.
7. **Proposer, en expert** : à la fin, trois idées de pièces que le fonds permet et qu'il n'a pas
   demandées, et la liste de ce qu'il devrait filmer la prochaine fois (face cam compris : un rituel
   de 10 minutes, téléphone sur pied, trois sujets, et l'équipe coupe).
8. **Clore** : ce que tu as appris sur le fonds, ce que les outils ne font pas (motion design, floutage de
   visage suivi, étalonnage avancé), ce que tu proposes de changer dans `contenu-rushes.md` ou les scripts.
   Aucune modification du dépôt sans son accord ; s'il est d'accord : branche + PR brouillon + une ligne
   `[en discussion]` dans `docs/05_systeme/decisions-log.md`.

## Terminé quand

L'index est tagué pour tous les rushes du Bureau, un squelette de référence est écrit, deux pièces TEST
sont rendues et ont reçu au moins un tour de corrections de Basekou, `apprentissages.md` existe, et
Basekou a reçu trois propositions et une liste de tournage.
