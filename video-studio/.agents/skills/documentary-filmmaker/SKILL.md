---
name: documentary-filmmaker
description: |
  Expert system for creating Ken Burns–style historical documentaries from topic to rendered video.
  Use when the user wants to produce a documentary video, needs pacing/structure guidance for historical content,
  or wants to apply the "documentary factory" forensic style rules to a new project.
  Encapsulates 25fps pipeline specs, scene grammar, color palettes, audio targets, and Ken Burns motion rules
  derived from forensic analysis of 3 reference documentaries.
version: 1.0.0
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
  - AskUserQuestion
  - WebSearch
  - WebFetch
---

# Documentary Filmmaker Skill

**Forensic foundation**: This skill encodes rules extracted from frame-accurate analysis of 3 reference documentaries (1914, Chaos to Constitution, France to America). Every parameter — 25 fps, -14 LUFS, 10 cuts/min, sepia/parchment/sage palettes, Ken Burns motion — is measured, not guessed.

---

## When to Use

Trigger this skill when the user:
- Wants to create a historical/documentary video
- Says "make a documentary", "Ken Burns style", "historical video"
- Needs pacing, structure, or visual grammar guidance for nonfiction content
- Wants to apply the documentary-factory pipeline standards to a custom project

---

## Phase 1: Strategic Framing (Interactive)

### Step 1 — Discovery

> "What historical topic, era, or story? Who's the audience (general, students, enthusiasts)? Target duration?"

**WAIT** for answer. Then ask follow-ups only for missing pieces:
- No audience → "Who specifically watches? (YouTube general, classroom, history buffs?)"
- No duration → "Target length? (Short: 60–90s, Standard: 3–5min, Long: 10min+)"
- No visual assets mentioned → "Any existing archives/photos, or pure stock/generated?"

Do NOT proceed until you have: **topic, audience, duration, asset status**.

### Step 2 — Creative Direction (Pick One)

| Style | Palette | Motion Feel | Best For |
|-------|---------|-------------|----------|
| **Sepia/1914** | Warm sepia (#D7C39A, #9B6741, #5C423B) | Slow, deliberate, one 25s+ anchor scene | WWI–WWII, industrial era, "grand narrative" |
| **Parchment/Constitution** | Ink browns (#281C12, #30261E) + aged cream (#EFEDD8) | Medium pacing (21 cuts/min), document-focused | Founding eras, legal/political history, charters |
| **Sage-Map/France-America** | Sage greens (#628A69, #4C645C) + muted blues (#146B91) | Very slow (3.6 cuts/min), 30s+ anchor scenes | Territorial, diplomatic, geographic stories |
| **Custom** | User provides reference frames | Analyzed from reference | Specific visual match needed |

> "Which style direction fits? Or share reference frames/screenshots for custom analysis."

**WAIT** for answer.

### Step 3 — Expert Panel (Auto-Assembled)

Based on chosen style, I convene 3 perspectives:

| Expert | Sepia/1914 | Parchment | Sage-Map |
|--------|------------|-----------|----------|
| **Archivist** | "Lead with the map — geography anchors the era" | "Show the document first — text is the artifact" | "Open on territory — the land is the character" |
| **Cinematographer** | "One 26s slow zoom carries the emotional weight" | "Faster cuts (21/min) match constitutional debate energy" | "Only 4 cuts in 66s — let the landscape breathe" |
| **Sound Designer** | "-14 LUFS, continuous narration, music bed at -28dB" | "Same loudness, but more music swells at signings" | "Sparser music — let silences sit in long scenes" |

I present only where they **disagree** (your decision points).

### Step 4 — Creative Brief (Synthesized)

```
## Creative Brief

**Topic**: [user topic]
**Audience**: [who + what they know]
**Core Message**: [ONE sentence — what viewer remembers]
**Duration**: [seconds] ([frames] frames at 25fps)
**Style**: [Sepia / Parchment / Sage-Map / Custom]
**Asset Strategy**: [archive / stock / generated / mixed]

## Scene Sequence (Frame Budget at 25fps)
| # | Scene | Frames | Seconds | Function |
|---|-------|--------|---------|----------|
| 1 | Hook/Title | 175 | 7.0 | Establish visual language |
| 2 | Anchor | 650 | 26.0 | Core narrative (ONE long scene) |
| 3 | Beat A | 100 | 4.0 | Evidence beat |
| 4 | Beat B | 80 | 3.2 | Evidence beat |
| 5 | Text Card | 50 | 2.0 | Date/location |
| 6 | Portrait | 75 | 3.0 | Human element |
| 7 | Legacy | 100 | 4.0 | Modern connection |
| 8 | End Card | 50 | 2.0 | Title/logo/fade |

Total: ~1280 frames = 51.2s (adjust to target)

## Audio Spec
- Target: -14 LUFS integrated, -1 dB true peak
- Narration: ~150 wpm, continuous, compressed
- Music: Continuous bed, crossfaded at scene boundaries
- Music level: -28dB under narration, -18dB during text cards
```

> "Brief ready. Adjust anything before scene design?"

**WAIT** for confirmation.

---

## Phase 2: Scenario Design

### Step 5 — Scene Specs (Per Scene)

For each scene in the sequence, I specify:

```json
{
  "sceneId": "anchor",
  "durationFrames": 650,
  "durationSeconds": 26.0,
  "visual": {
    "source": "archive_photo_03.jpg",
    "kenBurns": { "start": { "scale": 1.0, "x": 0, "y": 0 }, "end": { "scale": 1.12, "x": -0.03, "y": 0.02 } },
    "altText": "Wide shot of 1914 Manhattan, slow zoom toward harbor"
  },
  "audio": {
    "narration": "By spring of 1914, the city had become the engine of a new American century...",
    "musicCue": "continue_bed",
    "musicLevel": -28
  },
  "textOverlay": null,
  "transition": { "type": "crossdissolve", "frames": 20 }
}
```

**Rules enforced**:
- ONE anchor scene 20–40s (650–1000 frames)
- All other scenes 2–6s (50–150 frames)
- Max 2 micro-cuts (1 frame each) per video
- Every scene has Ken Burns motion (no static >2s)
- Cross-dissolve 20 frames between ALL narrative scenes
- Text in upper 85%, min 24px, safe margins 10%

### Step 6 — Data Architecture (If Recurring)

If user wants a template for multiple episodes:
```typescript
interface EpisodeConfig {
  episodeNumber: number;
  title: string;
  dates: string;
  locations: string[];
  keyFigures: string[];
  anchorImage: string;
  beatImages: string[];
  narrationScript: string[];
  musicTrack: string;
}
```

### Step 7 — User Confirmation

> "Scenario complete. Build it, or adjust first?"

**WAIT** for confirmation.

---

## Phase 3: Build (Pipeline Execution)

### Step 8 — Run documentary-factory Pipeline

```bash
# From repo root
npm run create -- --topic "Your Topic" --duration 60 --category history
# Or resume existing:
npm run resume -- --project 2026-08-12_your-topic
```

The pipeline agents (Topic Hunter → Researcher → Scriptwriter → Asset Collector → Audio Designer → Editor) execute with the Style Bible params baked in.

### Step 9 — Review & Iterate

After render, I run the **Quality Checklist** (see references/quality-checklist.md) and present expert review scores.

---

## Phase 4: Review (Expert Scorecard)

| Dimension | Priority | Score |
|-----------|----------|-------|
| Hook clarity (first 5s) | Critical | /5 |
| Anchor scene lands | Critical | /5 |
| Pacing matches style | High | /5 |
| Ken Burns motion smooth | High | /5 |
| Audio at -14 LUFS | High | /5 |
| Color palette consistent | Medium | /5 |
| Text readability | Medium | /5 |
| Historical accuracy | Medium | /5 |

**Verdict**: Ship / One more pass / Significant rework

---

## Adaptation Guidelines

| Situation | Approach |
|-----------|----------|
| User has existing Remotion project | Skip to Phase 4 review, suggest Style Bible fixes |
| Quick video (no deliberation) | Compress Phase 1 to single question, use Sepia defaults |
| Concept only (no code) | Run Phase 1–2, output brief + scenario as document |
| Multi-episode series | Design EpisodeConfig schema, build one pilot, then parameterize |
| "Make it premium" | Force Sepia style: 25fps, 26s anchor, Impact-level typography, dramatic pauses |

---

## References (in this skill)

- `references/style-bible.md` — Full forensic Style Bible (source of truth)
- `references/quality-checklist.md` — Per-render verification
- `references/palette-specs.md` — Hex/rgb values per style
- `references/ken-burns-math.md` — Frame-accurate motion formulas at 25fps
- `references/audio-specs.md` — Loudness, music bed, narration specs
- `references/scene-taxonomy.md` — Scene function definitions and duration ranges

---

## Quick Reference Card

```
TARGET SPECS (memorize these):
├── Video: 1280×720 @ 25fps, H.264 CRF 18
├── Audio: 48kHz stereo, -14 LUFS, -1 dBTP
├── Pacing: 8–12 cuts/min (typical), 3–5 (slow), 20+ (fast)
├── Anchor: ONE scene 20–40s, rest 2–6s
├── Cuts: Cross-dissolve 20 frames standard, 1-frame micro-cut ×2 max
├── Motion: Ken Burns on EVERY image, 1.0→1.12 scale, 3%/sec pan
├── Colors: No #000000/#FFFFFF — use style palette off-blacks/off-whites
├── Text: Upper 85%, min 24px, serif heading + serif body + mono
└── Music: Continuous bed, -28dB under narration, crossfade at cuts
```