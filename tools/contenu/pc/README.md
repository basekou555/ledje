# tools/contenu/pc — l'atelier de montage du PC de Basekou

Copie versionnée, au 2026-10-29, des outils qui tournent **sur le PC de Basekou**, dans
`C:\Users\basek\Desktop\Ledje rush bureau\_outils\`. C'est là qu'ils servent : les chemins
(`D:\LEDJE`, le Bureau, le dossier des projets CapCut) sont ceux de cette machine. Le dépôt en garde
une copie pour qu'ils ne vivent plus uniquement hors dépôt (risque noté au decisions-log le 27/10).
**Quand un outil change sur le PC, on recopie ici.**

Depuis le 22/10, la chaîne réelle ne passe plus par `rendu.py` (montage décrit en YAML puis rendu par
ffmpeg). Elle passe par **CapCut** : la session fabrique ou met à jour un projet CapCut, Basekou le
reprend à la main, et le résultat jugé est la vidéo exportée de CapCut.

## La chaîne, dans l'ordre

| Étape | Outil | Ce qu'il fait |
|---|---|---|
| Repérer | `nouveaux_rushes.py` | repère les nouveaux rushes (Bureau, disque `D:\LEDJE`) et les prépare pour le dérushage |
| Voir | `planches_pages.py`, `mosaique.py`, `planches_verif.py` | planches-contact rapides sur du 4K HEVC |
| Entendre | `transcrire.py` | transcription des rushes entiers, faster-whisper large-v3 (choisi au banc d'essai du 25/10, `banc_transcription.py`) |
| | `analyse_son.py` | ce qu'il y a dans le son à part la voix (musique, bruitages, volume) |
| Écrire | `storyboard.py`, `recueil.py` | le script en images, puis tous les storyboards en une page |
| Découper | `extraire.py`, `extraire_son.py` | extraits courts des rushes 4K HDR, convertis en SDR ; morceaux de son seul |
| | `sans_voix.py` | retire une voix d'un morceau de rush en gardant le vrai son autour (Demucs) |
| Monter | `capcut_projet.py` | un JSON de montage → un projet CapCut (pistes vidéo, titres, sous-titres, sons) |
| | `maj_projet.py` | met à jour un projet CapCut **existant** en ne remplaçant que les pistes demandées |
| | `retouche_projet.py`, `anim_bold_in.py`, `anim_retirer.py`, `vitesse_bloc.py`, `st_hauteur.py` | retouches ciblées dans un projet déjà retouché par Basekou |
| | `sous_titres_relus.py`, `temps_morts.py` | sous-titres relus par le sens ; repérage des mises en place en début de plan |
| Contrôler | `planche_montage.py` | 1re, milieu et dernière image de chaque plan, cadrées comme dans CapCut |
| | `controle_video.py` | contrôle de la vidéo **exportée** : une image toutes les 0,5 s, niveau sonore toutes les 0,1 s |

## Ce qu'il faut savoir avant de s'en servir

- **CapCut doit être complètement fermé** avant d'écrire dans un projet (sinon il réécrit par-dessus).
  Vérifier : `tasklist | findstr /i capcut` ne doit rien renvoyer. Chaque écriture fait une sauvegarde datée.
- **Un seul projet CapCut par storyboard**, mis à jour sur place (règle de Basekou du 25/10).
- **Les exports** vont dans `Ledje rush bureau\Export\`, une version par pièce ; l'ancienne part à la corbeille.
- **Bibliothèques** : pyCapCut 0.0.4, faster-whisper, ffmpeg/ffprobe dans le PATH ; Demucs est installé
  à part dans `_outils\_libs` (chargé à la main, sans torchaudio).
- **Aucun secret dans ces fichiers.** Le jeton Hugging Face (séparation des voix) reste dans
  `_outils\externes\` sur le PC et n'entre jamais au dépôt.
- Sur Windows, lancer avec `PYTHONIOENCODING=utf-8` (les scripts affichent des flèches et des accents).
