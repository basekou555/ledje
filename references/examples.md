# Worked Prompt Examples

Each example shows the MCSLA breakdown, the final prose prompt, and the MCP call
shape. Always confirm `aspect_ratio` / `duration` / `medias[].roles` for the model
via `models_explore(action:'get')` first; the values below are illustrative.

---

## 1. Cinematic portrait (image, Soul V2)

- **M:** `soul_2` (+ `soul_id` if a trained identity)
- **C:** 85mm, medium close-up, eye-level, shallow depth of field
- **S:** a weathered fisherman, grey stubble, knit cap
- **L:** overcast dockside light, muted cool grade, 35mm grain
- **A:** he looks off-frame, half a smile

> A weathered fisherman with grey stubble and a navy knit cap. Soft overcast
> dockside light, muted cool grade, 35mm film grain. He glances off-frame with
> half a smile. Medium close-up on an 85mm lens, shallow depth of field.

```
generate_image({ params: {
  model: "soul_2",
  prompt: "A weathered fisherman ...",
  aspect_ratio: "4:5",
  count: 2,
  medias: [{ value: "<soul_id-or-element-uuid>", role: "image" }]
}})
```

---

## 2. Product hero (image, Marketing Studio)

- **M:** `marketing_studio_image`
- **C:** 100mm macro, 3/4 angle, deep focus
- **S:** a frosted glass perfume bottle on wet slate
- **L:** soft key + rim light, warm amber grade, high-key background
- **A:** a single water droplet about to fall from the cap

> A frosted glass perfume bottle on wet slate, single droplet about to fall from
> the cap. Soft key light with a clean rim, warm amber grade, bright high-key
> backdrop. 3/4 angle, 100mm macro, deep focus.

```
generate_image({ params: {
  model: "marketing_studio_image",
  prompt: "A frosted glass perfume bottle ...",
  aspect_ratio: "1:1"
}})
```

---

## 3. Identity-faithful clip (video, Seedance 2.0)

- **M:** `seedance_2_0`
- **C:** slow push-in, 35mm, low angle
- **S:** the same character (start frame from a prior generation)
- **L:** neon-lit alley at night, teal-and-magenta grade
- **A:** she lifts her umbrella as rain starts

> She lifts a black umbrella as rain begins to fall. Neon-lit alley at night,
> teal-and-magenta grade, wet reflections. Slow push-in on a 35mm lens, low angle.

```
generate_video({ params: {
  model: "seedance_2_0",
  prompt: "She lifts a black umbrella ...",
  aspect_ratio: "9:16",
  duration: 5,
  medias: [{ value: "<prior_job_id>", role: "start_image" }]
}})
```

---

## 4. Fast text-to-video (Kling 3.0 Turbo)

- **M:** `kling3_0_turbo`
- **C:** drone orbit, ultra-wide
- **S:** a lighthouse on a storm-battered cliff
- **L:** stormy blue hour, desaturated, 16mm grain
- **A:** waves crash and the beam sweeps across the frame

> A lighthouse on a storm-battered cliff, beam sweeping across the frame as waves
> crash below. Stormy blue-hour light, desaturated grade, 16mm grain. Ultra-wide
> drone orbit.

```
generate_video({ params: {
  model: "kling3_0_turbo",
  prompt: "A lighthouse on a storm-battered cliff ...",
  aspect_ratio: "16:9"
}})
```

---

## 5. Motion transfer (Kling 3.0 Motion Control)

Animate a character still with motion from a driving clip. No prompt needed.

```
motion_control({ params: {
  image_id: "<character-still-media_id-or-job_id>",
  motion_video_id: "<driving-clip-media_id-or-job_id>",
  resolution: "1080p",
  scene_control: "image"   // keep the character image's background
}})
```

---

## 6. Preset UGC ad (video)

1. `presets_show` → pick a `preset_id` (UGC / Tutorial / Unboxing / Product
   Review / Try-On).
2. Generate:

```
generate_video({ params: {
  model: "higgsfield_preset",
  preset_id: "<preset_id>",
  prompt: "Creator unboxes the headphones and reacts ...",
  aspect_ratio: "9:16"
}})
```

---

## Iteration log pattern

When refining, change one variable at a time and note it:

| Try | Changed | Result |
|-----|---------|--------|
| 1 | baseline | face good, lighting flat |
| 2 | + "Rembrandt key light" | better depth, too warm |
| 3 | grade → "cool steel" | locked the look ✓ |

Lock the look, then vary action/camera across shots to keep a consistent series.
