---
name: higgsfield-ai-prompt
description: >-
  Turn natural-language requests into production-ready prompts for Higgsfield AI,
  the cinematic image/video/audio generation platform. Use when the user wants to
  generate, edit, or art-direct visuals on Higgsfield (Cinema Studio, Seedance,
  Kling, Soul characters, Marketing Studio), pick the right model, write a strong
  prompt, or drive the Higgsfield MCP tools. Built around the MCSLA formula
  (Model · Camera · Subject · Look · Action).
---

# Higgsfield AI Prompt Skill

Higgsfield turns text + reference media into cinematic images, videos, audio, and
3D. This skill helps you (1) pick the right model, (2) write a structured prompt,
and (3) drive the live `Higgsfield` MCP tools correctly.

## The MCSLA formula

Every strong Higgsfield prompt answers five questions, in order:

| Slot | Question | Examples |
|------|----------|----------|
| **M — Model** | Which model/engine? | `soul_2`, `seedance_2_0`, `kling3_0`, `marketing_studio_video` |
| **C — Camera** | How is it shot? | lens, angle, movement, framing — *push in on 35mm, low angle, slow dolly* |
| **S — Subject** | Who/what is in frame? | the character, product, or scene — be specific and concrete |
| **L — Look** | What's the mood/grade? | lighting, color, film stock, time of day, genre — *teal-orange, golden hour, 35mm grain* |
| **A — Action** | What happens? | the motion or beat — *she turns and smiles as rain starts* |

Write the prompt as natural prose ordered Subject → Look → Action → Camera, then
choose the Model separately. Keep it concrete; cut adjectives that don't change
the pixels. One clear action per shot beats three vague ones.

**Prose template:**
> `[Subject, concrete description]. [Look: lighting, color, film stock, time].
> [Action: one clear beat]. [Camera: lens, angle, movement].`

**Example:**
> A lone astronaut stands at the lip of a red canyon, helmet under one arm.
> Cold blue dusk light, teal-and-rust color grade, 35mm film grain. She tilts her
> head up as two moons rise. Slow push-in on a 35mm lens, low angle.

## Workflow

1. **Clarify intent** — image vs. video vs. audio/3D? One-off or reusable
   character? Commercial/product or creative?
2. **Pick the model** — if unsure, call `models_explore(action:'recommend')` with
   the goal + input context (text-only, reference image, image-to-video, product
   URL). See `references/models.md`.
3. **Confirm constraints** — call `models_explore(action:'get', model_id:…)` for
   the chosen model's `aspect_ratios`, `durations`, `params`, and `medias[].roles`
   before building params. Don't guess enum values.
4. **Write the prompt** using MCSLA.
5. **Preflight cost** (optional) — pass `get_cost: true` to return credit cost
   without submitting a job.
6. **Generate** — call `generate_image` / `generate_video` / `generate_audio` /
   `generate_3d` with top-level model params under `params`.
7. **Iterate or edit** — for changes to an existing asset, prefer the dedicated
   edit tool over re-generating (see "Editing").

## Handling reference media (critical)

`medias[].value` must be a **media_id** (UUID) or a prior **job_id** — never a
raw `https://` URL or local path.

- **Local file (Apps UI):** call `media_upload_widget` — do not ask the user to
  attach files in chat; remote tools can't read those.
- **Web URL:** call `media_import_url`, then pass the returned `media_id`.
- **Output of a prior generation:** pass its `job_id` directly.

Each `medias[]` entry needs a `role`. Roles vary by model — inspect the model's
declared `medias[].roles` via `models_explore(action:'get')`. Common roles:
`image`, `start_image`, `end_image`, `audio`.

## Picking a model (quick map)

| Goal | Default model |
|------|---------------|
| Commercial / product / ad image | `marketing_studio_image` |
| Text-only character / avatar | `soul_cast` |
| Reusable trained identity (image) | `soul_2` + `soul_id` |
| One-off character reference | `soul_2` or `nano_banana_pro` |
| Portrait / fashion / UGC / editorial | `soul_2` |
| 4K / text-in-image / diagrams | `nano_banana_pro` |
| Ad / product video | `marketing_studio_video` |
| YouTube URL → short clip | `clipify` (Personal Clipper) |
| Identity-faithful video | `seedance_2_0` |
| Multi-shot / audio / motion transfer video | `kling3_0` |
| Fast text-to-video / single start-frame | `kling3_0_turbo` |

When in doubt, let `models_explore(action:'recommend')` choose. See
`references/models.md` for the full decision tree and `references/camera.md` for
camera and lighting vocabulary.

## Characters: Soul vs. Element

For "use my face" / "make a character" / "digital twin" requests, pick a path —
do not silently train:

- **Train a Soul** (`show_characters action='train'`) — identity-faithful, ONE
  person, 5–20 photos, ~10 min. Usable only with `soul_2` (Soul V2) and
  `soul_cinema_studio`. One `soul_id` per generation.
- **Save as Element** (`show_reference_elements action='create'`) — instant,
  single image, multiple subjects allowed; works with Nano Banana Pro/2, GPT
  Image 2, Seedream, Cinema Studio, Seedance 2.0, Kling 3.0. Use this for
  multi-character shots ("me + a friend") since a Soul is one identity per gen.

## Editing existing assets

Prefer the dedicated tool over re-generating from scratch:

| Want | Tool |
|------|------|
| Higher resolution / enhance (2K/4K) | `upscale_image` / `upscale_video` |
| Expand / uncrop an image | `outpaint_image` |
| Change a video's aspect ratio | `reframe` |
| Cutout / transparent background | `remove_background` |
| Recast / puppeteer / motion transfer | `motion_control` |

`motion_control` (Kling 3.0) animates a character still with motion from a
reference video: pass `image_id` (the still) and `motion_video_id` (the driver).
It ignores `prompt`/`count`; `scene_control` picks whether the background comes
from the `image` or the `video`.

## Other live tools worth knowing

- `virality_predictor` — predict a video's virality / hook strength / retention.
- `show_marketing_studio` — product-ad pipeline (URL or uploaded product image).
- `presets_show` + `generate_video(model:'higgsfield_preset', preset_id:…)` —
  preset-driven UGC / Tutorial / Unboxing / Product Review videos.
- `balance` / `show_plans_and_credits` — check credits before large jobs.

## Prompting discipline

- **One beat per shot.** Multiple actions blur identity and physics.
- **Concrete over ornamental.** "Rain beads on the windshield" beats "beautiful
  atmospheric scene."
- **Lock the look once**, then vary action/camera across shots for consistency.
- **Negatives sparingly** — describe what you want, not a list of what you don't.
- **Iterate one variable at a time** so you know what changed the result.
- **Preflight cost** (`get_cost: true`) before count>1 or high-res jobs.

See `references/examples.md` for full worked prompts across models.
