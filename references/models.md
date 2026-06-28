# Model Selection Guide

The fastest path is to ask the platform: call
`models_explore(action:'recommend', query:…, input:…, type:…)` with the user's
goal and input context. Use `models_explore(action:'get', model_id:…)` to read a
model's exact `aspect_ratios`, `durations`, `params`, and `medias[].roles` before
building parameters. This file is a starting map, not a substitute for that call.

## Decision tree

```
What are you making?
│
├─ IMAGE
│   ├─ Commercial / product / ad ............ marketing_studio_image
│   ├─ Character / avatar / "my face"
│   │   ├─ Reusable trained identity ........ soul_2  + soul_id   (train via show_characters)
│   │   ├─ Multiple people in one shot ...... soul_2 / nano_banana_pro + Element(s)
│   │   └─ One-off reference ................ soul_2  or nano_banana_pro
│   ├─ Portrait / fashion / UGC / editorial . soul_2
│   └─ 4K / text-in-image / diagram ......... nano_banana_pro
│
├─ VIDEO
│   ├─ Ad / product ......................... marketing_studio_video
│   ├─ YouTube URL → short clip ............. clipify (Personal Clipper)
│   ├─ Identity-faithful (a specific person)  seedance_2_0
│   ├─ Multi-shot / audio / motion transfer . kling3_0
│   ├─ Fast text→video / single start-frame . kling3_0_turbo
│   └─ Preset UGC/Tutorial/Unboxing/Review .. higgsfield_preset + preset_id
│
├─ AUDIO ................................... generate_audio  (voice, sound, music)
└─ 3D (image → GLB mesh) .................. generate_3d
```

## Image models

| Model | Best for | Notes |
|-------|----------|-------|
| `marketing_studio_image` | product shots, ads, commercial | clean, on-brand output |
| `soul_2` (Soul V2) | portraits, fashion, UGC, editorial, trained identities | accepts a `soul_id`; identity-faithful |
| `soul_cast` | text-only character/avatar from a description | no reference image needed |
| `nano_banana_pro` | 4K, text rendering, diagrams, one-off character refs | sharpest text/detail |

## Video models

| Model | Best for | Notes |
|-------|----------|-------|
| `marketing_studio_video` | ads, product video | pairs with `show_marketing_studio` pipeline |
| `seedance_2_0` | identity-faithful video | strongest at keeping a specific person consistent |
| `kling3_0` | multi-shot, audio, motion transfer | most capable / flexible |
| `kling3_0_turbo` | fast text→video, single start-frame animation | speed-optimized |
| `clipify` | turning a YouTube URL into short clips | Personal Clipper |
| `higgsfield_preset` | preset UGC/Tutorial/Unboxing/Product Review/Try-On | needs `preset_id` from `presets_show` |

## Choosing aspect ratio & duration

Never hard-code these. Read the allowed values from
`models_explore(action:'get', model_id:…)`:

- **`aspect_ratio`** — common: `16:9` (landscape/YouTube), `9:16` (vertical/
  Reels/TikTok), `1:1` (social square), `4:5` (feed portrait). Use what the model
  declares.
- **`duration`** (video) — if omitted, the model default is used; an unsupported
  value is clamped to the nearest allowed value.

## Reference-media roles by intent

| Intent | Typical role |
|--------|--------------|
| General reference image | `image` |
| First frame of a video | `start_image` |
| Last frame of a video | `end_image` |
| Audio reference (e.g. Seedance) | `audio` |

Always confirm the exact roles a model accepts via `models_explore(action:'get')`.

## Cost preflight

Pass `get_cost: true` to `generate_image` / `generate_video` to return the credit
cost **without** submitting a job. Check `balance` or `show_plans_and_credits`
before large or high-`count` runs.
