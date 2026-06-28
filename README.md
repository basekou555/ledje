# Higgsfield AI Prompt Skill

A focused Claude skill that turns natural-language requests into production-ready
prompts for [Higgsfield AI](https://higgsfield.ai) — the cinematic image, video,
audio, and 3D generation platform — and drives the live Higgsfield MCP tools.

Built around the **MCSLA formula**: **M**odel · **C**amera · **S**ubject ·
**L**ook · **A**ction.

## What it does

- Picks the right Higgsfield model for the job (Cinema Studio / Soul, Seedance,
  Kling, Marketing Studio, Nano Banana Pro, …).
- Writes structured, cinematic prompts using MCSLA.
- Maps each request to the correct MCP tool and parameter shape, including the
  rules for reference media (`media_id` / `job_id`, never raw URLs) and Soul vs.
  Element character paths.
- Recommends the dedicated edit tools (upscale, outpaint, reframe, remove
  background, motion control) instead of re-generating.

## Layout

```
.
├── SKILL.md              # main dispatcher: MCSLA, workflow, model map, tool rules
└── references/
    ├── models.md         # model decision tree + how to read constraints
    ├── camera.md         # camera, lighting, color, lens & look vocabulary
    └── examples.md       # worked MCSLA prompts + MCP call shapes
```

## Install

**Claude Code:** clone into your skills directory:

```bash
git clone <this-repo> ~/.claude/skills/higgsfield-ai-prompt
```

**Claude Cowork:** drop the folder into your workspace.

**Claude.ai Projects:** upload `SKILL.md` as the instruction base.

The skill activates when you ask Claude to generate, edit, or art-direct visuals
on Higgsfield, choose a model, or write a Higgsfield prompt.

## Requirements

For live generation, the Higgsfield MCP server must be connected so tools like
`generate_image`, `generate_video`, `models_explore`, and `motion_control` are
available. Without it, the skill still works as a prompt-engineering reference.

## License

MIT
