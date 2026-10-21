# tools/contenu — les outils du système rushes → pièces

Trois scripts, un lexique, zéro interface. Ils exécutent ce que décrit
[`docs/04_operations/contenu-rushes.md`](../../docs/04_operations/contenu-rushes.md) ; la règle vit là-bas,
pas ici. Ils tournent **sur la machine où sont les rushes** (le disque `D:\LEDJE`), pas dans une session
distante — une session Claude Code ne voit ni le disque ni les médias (limite n° 1 de
`chaine-contenu.md`).

| Script | Étape | Entrée → sortie |
|---|---|---|
| `derush.py` | 1 · dérusher | un dossier de rushes → `rushes-index.csv` (+ proxies 720p, + vignettes) |
| `rendu.py` | 3 · rendre | une recette `.yaml` → un `.mp4` (filigrane TEST tant que non validé) |
| `relecture.py` | 4 · relire l'oral | un transcript `.srt/.vtt/.txt` → les timecodes des termes du lexique |
| `lexique-interdit.txt` | — | la liste des termes, chacun avec la règle du cerveau qu'il cite |

## Prérequis (une fois)

- Python 3.10+ et `pip install pyyaml`
- ffmpeg + ffprobe dans le PATH (Windows : https://www.gyan.dev/ffmpeg/builds/, prendre « release essentials » et ajouter `bin\` au PATH)
- Pour la transcription de l'oral (en amont de `relecture.py`) : n'importe quel outil qui sort un `.srt` — par exemple `pip install openai-whisper` puis `whisper rush.mp4 --language fr --model small --output_format srt`. *(Choix non tranché au dépôt ; le script lit un `.srt`, d'où qu'il vienne.)*

## 1. Dérusher

```
python tools/contenu/derush.py D:\LEDJE --planches D:\LEDJE\_planches --transcrire D:\LEDJE\_transcripts
```

- Écrit `D:\LEDJE\rushes-index.csv` (ou `--index <chemin>`). Relançable à volonté : les colonnes techniques
  sont rafraîchies, **les tags déjà écrits sont conservés**.
- **Qui remplit les tags : la session Claude Code**, pas Basekou. Elle lit les planches-contact
  (`--planches`, une image toutes les 5 s avec timecode) et les transcriptions (`--transcrire`, whisper),
  puis écrit gisement, sujet, formats, personnes, son, oral, état, timecodes utiles. Basekou corrige.
- Les colonnes de tag et leurs valeurs attendues sont en tête de `derush.py` (`COLONNES_TAG`) et
  expliquées dans la fiche. Le vocabulaire des tags est celui de la grille de contenu.
- Les dossiers dont le nom commence par `_` ou `.` ne sont jamais pris pour des rushes.
- Les proxies (720p, légers) servent à monter vite ; les vignettes (3 images par rush) donnent un coup d'œil.

## 2. Écrire une recette

Dupliquer [`docs/05_systeme/templates/template-recette-piece.yaml`](../../docs/05_systeme/templates/template-recette-piece.yaml).
Une recette = brief (format, niveau, sujet, hook, légende) + plans (rush, in, out, cadrage, texte, son) + audio.

## 3. Rendre

```
python tools/contenu/rendu.py ma-recette.yaml            # rend
python tools/contenu/rendu.py ma-recette.yaml --dry-run  # montre la commande ffmpeg
```

- Sortie 9:16 (1080×1920) par défaut ; `1:1`, `4:5`, `16:9` possibles. Un 16:9 est recadré en 9:16
  selon `cadrage` (gauche / centre / droite / `x=0.3`).
- `audio.source` : `rushes` (le son réel), `fichier` (une voix off mixée au-dessus des rushes atténués),
  `silence`.
- **Filigrane TEST** automatique tant que `piece.statut` ≠ `valide-publication`. Le statut s'écrit à la
  main, sur verdict de Basekou.
- Un plan dont `in`/`out` sortent du rush arrête le rendu avec le message qui dit lequel.

## 4. Relire l'oral avant tout clip

```
python tools/contenu/relecture.py transcript.srt
```

Affiche chaque timecode où apparaît un terme du lexique, avec sa catégorie et la règle citée.
Code de sortie 1 s'il y en a au moins un. ⛔ = bloque en l'état (SANTE, DIET, CHIFFRE, MARQUE) ;
⚠️ = à arbitrer (LEXIQUE, RELIGIEUX). En plus du lexique : toute mention du sucre sans « jusqu'à ».

Ce n'est **pas** un verdict de conformité — une allégation peut être implicite, image comprise
(`docs/01_adn/conformite.md`). C'est un filet, qui pointe là où regarder.

## Ce que ces outils ne font pas

- Ils ne choisissent rien : ni le rush, ni le hook, ni le verdict. Les deux points de validation
  restent à Basekou (`chaine-contenu.md`).
- Ils ne génèrent aucune image ni aucun texte.
- Ils ne déposent rien au Drive et ne publient rien.

## Vérification

Testés le 2026-10-21 (session distante, ffmpeg 6.1) sur trois rushes synthétiques — 16:9 à 30 et 60 i/s
avec son, 9:16 sans son — : index créé puis mis à jour sans perdre les tags, proxies et vignettes
produits, rendu 9:16 (recadrage gauche et `x=0.3`, accéléré ×2, texte avec apostrophes, filigrane) et
rendu 1:1 avec voix off mixée, refus d'un plan hors durée, relecture d'un `.srt` à 4 segments.
**Pas encore testés sur les vrais rushes 4K/60 du disque** : c'est le premier essai à faire.
