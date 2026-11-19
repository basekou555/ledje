# tools/veille — lire les vidéos enregistrées sur les réseaux

Deux scripts qui tournent **sur le PC de Basekou**. Une session cloud ne peut pas s'en servir :
`instagram.com` et `tiktok.com` y sont injoignables. La trame complète est dans
`.claude/skills/ledje-veille/SKILL.md`.

**État au 2026-11-19 : écrits, jamais lancés sur de vraies vidéos.** Seule la lecture du fichier de
liens a été vérifiée (doublons, hôtes refusés, refus d'écrire dans un dépôt).

## La chaîne

| Étape | Qui | Avec quoi |
|---|---|---|
| Relever les liens des collections enregistrées | Basekou lance Claude Chrome | le message de la trame |
| Télécharger | la session Claude Code du PC | `telecharger.py` |
| Lire l'oral et quelques images | la session Claude Code du PC | `lire.py` |
| Proposer un plan d'action | la session, dans la discussion | les textes produits + le cerveau |

## Usage

```bash
python telecharger.py liens.txt --verifier
```

```bash
python telecharger.py liens.txt
```

```bash
python lire.py "<dossier du lot affiché par telecharger.py>"
```

Le fichier de liens : une ligne par vidéo, `## Nom` pour ouvrir une collection, le reste de la ligne
sert de note (auteur, légende, texte à l'écran relevés par Claude Chrome).

## Ce qu'il faut sur le PC

- `ffmpeg` et `ffprobe` dans le PATH, `faster-whisper` : déjà là pour `tools/contenu/pc/`.
- **`yt-dlp`**, seule dépendance nouvelle : `pip install -U yt-dlp`. À installer une fois, en le disant
  à Basekou.
- Sur Windows, lancer avec `PYTHONIOENCODING=utf-8`.

## Ce que ces scripts font exprès

- **Aucun cookie de compte.** Une vidéo qui exige d'être connecté échoue, et c'est voulu : elle est
  listée dans les échecs et lue « sans le son », à partir de la note de Claude Chrome.
- **Jamais dans un dépôt.** `telecharger.py` refuse un dossier de sortie situé dans un dépôt git.
  Par défaut il écrit dans le dossier temporaire du poste.
- **La vidéo est supprimée après lecture** (`lire.py`, sauf `--garder`). Elle appartient à son
  auteur ; on garde le texte et quatre images, le temps de l'analyse.
- **Seuls Instagram et TikTok sont acceptés.** Tout autre lien est ignoré et signalé.
- **Un registre** (`~/.ledje-veille/traites.txt`, hors dépôt) évite de relire une vidéo déjà lue.
  `--tout` passe outre.

## Ce qu'ils ne font pas

- Ils ne trouvent pas les vidéos enregistrées : cette liste est privée, seul le navigateur connecté
  de Basekou la voit.
- Ils ne jugent rien : c'est la session qui compare chaque idée au cerveau et propose.
- Ils n'écrivent rien au dépôt.
