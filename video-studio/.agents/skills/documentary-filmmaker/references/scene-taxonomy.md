# Scene Taxonomy — Functions, Durations, and Visual Specs

**Source**: Forensic scene-cut analysis of 3 reference documentaries (see style-bible.md §2).

---

## The 7 Scene Functions

Every reference video is composed of these 7 scene types, in roughly this narrative order:

### 1. Establishing (Hook)
- **Purpose**: Establish topic + visual language in first seconds
- **Duration**: 5–17s (125–425 frames)
- **Count**: Exactly 1 per video
- **Visual**: Wide landscape, map, or iconic archival image
- **Motion**: Slow zoom OUT (reveal) — 0.10 scale
- **Measured examples**: V1 title 7.28s, V3 map 17.16s
- **Audio**: Title narration + music fade-in

### 2. Narrative Anchor (Core Story)
- **Purpose**: Carry the entire emotional weight of the story
- **Duration**: 20–40s (500–1000 frames) — THE longest scene
- **Count**: Exactly 1 per video
- **Visual**: The single most important image or compound sequence
- **Motion**: Compound — slow zoom + offset pan (0.12 + 0.08)
- **Measured examples**: V1 26.00s, V3 37.44s
- **Audio**: Longest uninterrupted narration passage (75–120 words)

### 3. Evidence Beats (Supporting Visuals)
- **Purpose**: Prove claims, show artifacts, add texture
- **Duration**: 2–6s (50–150 frames)
- **Count**: 2–6 per video
- **Visual**: Photos, documents, maps, artifacts
- **Motion**: Single zoom OR pan (0.05 / 0.04), alternate direction each beat
- **Measured examples**: V1 scenes 3,4,6,7,8 (3.72–5.52s); V2 scenes 2,3,4 (1.24–3.48s)
- **Audio**: Narration continues; beat change is visual only

### 4. Text/Date Cards (Expository)
- **Purpose**: Display dates, names, locations, key facts
- **Duration**: 1–3s (25–75 frames)
- **Count**: 1–3 per video
- **Visual**: Parchment/paper background, serif text, centered or upper-left
- **Motion**: Static scale 1.0 + text fade (12–16 frames in, 8–12 out)
- **Measured examples**: V1 53.16s (1.08s), V2 27.08s (3.92s)
- **Audio**: Narration pauses OR continues under; music swells to -18 dB

### 5. Portrait / Character (Human Element)
- **Purpose**: Put a face on the story — emotional connection
- **Duration**: 2–4s (50–100 frames)
- **Count**: 1–2 per video
- **Visual**: Portrait or key figure, rule-of-thirds framed
- **Motion**: Slow zoom toward eyes (0.04)
- **Measured examples**: V1 scene 4 (3.72s), V2 scene 7 (1.16s)
- **Audio**: Narration names the figure; music swells subtly

### 6. Legacy / Closing (Modern Connection)
- **Purpose**: Bridge past → present; why it matters now
- **Duration**: 2–5s (50–125 frames)
- **Count**: 1 per video
- **Visual**: Modern imagery OR original artifact recontextualized
- **Motion**: Slow zoom out (reveal context) or gentle pan
- **Measured examples**: V1 scene 9,10 (2.00s, 1.08s); V2 scene 11 (2.96s)
- **Audio**: Narration gives the takeaway; music resolves

### 7. End Card (Outro)
- **Purpose**: Title/logo/credits + fade to black
- **Duration**: 2s + 0.28s fade (50 frames + 7 frames)
- **Count**: 1 per video
- **Visual**: Style-background, title, "Produced by" credit
- **Motion**: Static; gentle opacity pulse optional
- **Measured examples**: All 3 videos end with ~0.28s fade-to-black (7 frames)
- **Audio**: Music fades out 3s, cuts at end card

---

## Micro-Cut (Punctuation Flash)

- **Purpose**: Stylistic emphasis — a 1-frame flash, not a scene
- **Duration**: 1 frame (0.04s) exactly
- **Count**: 0–3 per video (reference videos use 1–2)
- **Visual**: High-contrast flash — white/palette-color frame OR 1-frame clip
- **Audio**: Narration flows THROUGH it (never stops)
- **Placement**: Just before or after a dramatic reveal
- **Measured examples**: V1 at 41.32s (0.08s — 2 frames), V2 at 31.00s (0.04s)

---

## Scene Sequence Template

```
[Hook] → [Anchor] → [Beat] → [Beat] → [Text Card] → [Beat] → [Portrait] → [Legacy] → [End]
```

### For 60s video (1500 frames @ 25fps):

| # | Function | Frames | Seconds | Cumulative |
|---|----------|--------|---------|------------|
| 1 | Establishing | 175 | 7.0 | 7.0 |
| 2 | Anchor | 650 | 26.0 | 33.0 |
| 3 | Beat A | 100 | 4.0 | 37.0 |
| 4 | Text Card | 50 | 2.0 | 39.0 |
| 5 | Beat B | 85 | 3.4 | 42.4 |
| 6 | Portrait | 75 | 3.0 | 45.4 |
| 7 | Legacy | 100 | 4.0 | 49.4 |
| 8 | End Card | 50 | 2.0 | 51.4 |
| — | (buffer) | — | ~8.6 | 60.0 |

**Adjust**: Total = 1500 frames. If under, extend Anchor (preferred) or Legacy. If over, trim Beat scenes first.

---

## Pacing Targets by Style

| Style | Cuts/min | Anchor | Beat | Feel |
|-------|----------|--------|------|------|
| **Sepia/1914** | 8–12 | 26s | 3–5s | Grand narrative, deliberate |
| **Parchment** | 18–22 | 7.6s (short!) | 1–3s | Debative, energetic, document-driven |
| **Sage-Map** | 3–5 | 30s+ | 4–6s | Meditative, geographic, expansive |

> **Note**: Parchment style anchors are SHORTER (7.6s) — the whole video is faster. Its "anchor" is the constitutional debate at 11.16–18.76s. Don't force a 26s anchor into Parchment style.

---

## Transition Spec (from style-bible §5)

| Transition | Frames | Use |
|------------|--------|-----|
| Standard cross-dissolve | 16–24 | Between ALL narrative scenes |
| Chapter dissolve | 30–40 | Hook→Anchor, Anchor→Beats |
| Fade to color | 50 (2s) | End card (sepia/parchment/slate color, not black) |
| Micro-cut flash | 1 | Emphasis punctuation (max 3/video) |
| Hard cut | 1 | NEVER between narrative beats (only flash transitions) |

---

## Scene Selection Checklist (per function)

For each planned scene, confirm:
- [ ] One clear function from the 7 (+ micro-cut)
- [ ] Duration within function range
- [ ] Ken Burns motion assigned (pattern ≠ previous scene)
- [ ] Narration coverage estimated (3 words/sec of scene)
- [ ] Music level for this scene (-28 / -18 / -12 dB)
- [ ] Text overlay: content, position, font, contrast pair verified
- [ ] Transition type + frames defined
- [ ] Total cumulative frames stay within video budget