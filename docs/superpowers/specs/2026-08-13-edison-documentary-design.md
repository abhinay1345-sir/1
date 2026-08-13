# Edison Documentary — Design Spec

**Project ID:** `2026-08-13_edison-light-bulb`
**Title:** "The Bulb Wasn't Enough"
**Target:** ~5 minutes (300s), ~740 words, 25 fps, 1280×720
**Style authority:** `STYLE_BIBLE.md` (25fps / 1280×720 / parchment-warm palette / −14 LUFS / ~10 cuts/min)
**Approach:** C (Hybrid) — new `edison-video` composition inside existing `video-studio/`, reusing component infrastructure, STYLE_BIBLE-compliant.

---

## 1. Narrative Architecture

Six acts → eight segments. Title card is a creative 4-second animated reveal. The six narrative acts run ~296s.

| # | Act | Segment | Duration | Words | Visual center |
|---|-----|---------|----------|-------|---------------|
| S1 | Title | Title card: *"The Bulb Wasn't Enough"* | 4s | — | Filament igniting behind animated type |
| S2 | Act 1 | The Problem (night, gas, candles) | 38s | ~95 | 19th-c dark streets, candles, smoke — multiple ≤4s Ken Burns shots |
| S3 | Act 2 | Edison's Real Challenge (the ecosystem) | 50s | ~125 | Blueprint → animated system diagram (continuous motion) |
| S4 | Act 3a | Public Demonstration — "Make People See It" | 40s | ~100 | Crowds around lamps, Menlo Park — ≤4s shots |
| S5 | Act 3b | Sell the System (bulb→building→street→city) | 42s | ~105 | City network expanding (continuous animation) |
| S6 | Act 4 | The Pearl Street Moment | 50s | ~120 | Pearl St → Manhattan electrifies (continuous) |
| S7 | Act 5 | The Business Lesson | 38s | ~95 | Historical → modern skyline bridge |
| S8 | Act 6 | Ending — light spreads, modern skyline | 34s | ~75 + tagline | Darkness → lamps → modern city |

**Pacing:** ~10–14 cuts/min (every image ≤4s). ~80–90 total shots across 300s. High variance rhythm (STYLE_BIBLE): anchor motion-graphic sequences run longer internally but cut their sub-views every ≤4s.

### Hard constraints (user-mandated)
- **C1:** No single static image appears on screen longer than **4 seconds**. Motion-graphic sequences animate continuously and cut internal sub-views ≤4s.
- **C2:** Title card is **exactly 4 seconds**, with a creative animated background and animated text reveal.
- **C3:** All media — narration WAVs, music, SFX, and each visual shot — are **independent, swappable elements**. In Remotion: separate `<Audio>`/`<Sequence>` per element. In the ffmpeg mix: separate inputs per layer, not pre-baked into one track.

---

## 2. Technical Architecture (Approach C)

- **New composition `edison-video`** registered in `video-studio/src/index.ts` at **25 fps, 1280×720**. Existing `main-video` (Jobs, 30fps/1080p) untouched.
- **fps-aware motion** via `useEdisonScale()` hook (maps 1280×720 design-space coordinates; reads `fps` from `useVideoConfig()` so all Ken Burns/spring math is correct at 25fps).
- **Central timing source** `src/data/edison-script.ts`: exported array of segments `{id, startSec, endSec, narration, shots[]}`. One change to a duration ripples to narration timing, shot cuts, SFX times, and the mix. Satisfies "easy to change narration timing later."
- **Shot derivation** to satisfy C1 efficiently: each high-res source photo → 3–5 distinct ≤4s sub-shots (different pan/zoom crop regions, alternating direction per STYLE_BIBLE Ken Burns rules). Reuses few source assets, produces many shots.
- **Narration:** `scripts/generate-narration.mjs` runs `edge-tts` per segment → per-segment `.wav` in project folder *before* render; ffmpeg concatenates with measured inter-segment gaps. Deterministic.
- **Voice:** `en-US-ChristopherNeural` at rate −8% (measured, authoritative, per STYLE_BIBLE narrator profile).
- **Music:** Sourced CC-BY cinematic track first (web search Pixabay/Incompetech); fallback = 100% original procedural score synthesized with FFmpeg (layered low drones + evolving pads + filtered-noise bed + bass swells), frame-accurate, zero licensing risk. Either way the music is a **separate swappable audio element**.
- **Render → Mix:** `npm run build` (Remotion → master.mp4) then `npm run mix` (existing `mix-pipeline.mjs` → −14 LUFS, peak −1.5 dB, AAC 48k). Master video stream is copied (no generational video loss); only audio is re-mixed.

---

## 3. Component Architecture (modular — one file per scene, each tweakable)

| Component | File | Reusable |
|-----------|------|----------|
| `EdisonTitleCard` (4s animated reveal) | `scenes/EdisonTitleCard.tsx` | — |
| `TheProblem` | `scenes/acts/TheProblem.tsx` | Act 1 |
| `EdisonsChallenge` (+ system diagram) | `scenes/acts/EdisonsChallenge.tsx` | Act 2 |
| `PublicDemonstration` | `scenes/acts/PublicDemonstration.tsx` | Act 3a |
| `SellTheSystem` (+ city network) | `scenes/acts/SellTheSystem.tsx` | Act 3b |
| `PearlStreetMoment` | `scenes/acts/PearlStreetMoment.tsx` | Act 4 |
| `BusinessLesson` | `scenes/acts/BusinessLesson.tsx` | Act 5 |
| `FinalSequence` | `scenes/acts/FinalSequence.tsx` | Act 6 |
| `KenBurnsImage` | `components/KenBurnsImage.tsx` | ✓ shared |
| `SystemDiagram` | `components/SystemDiagram.tsx` | ✓ motion graphic |
| `CityNetwork` | `components/CityNetwork.tsx` | ✓ motion graphic |
| `NewspaperAnim` | `components/NewspaperAnim.tsx` | ✓ motion graphic |
| `TextReveal` | `components/TextReveal.tsx` | ✓ typography |
| `ChapterTransition` | `components/ChapterTransition.tsx` | ✓ cross-dissolve |
| `VignetteGrain` (parchment grain + vignette overlay) | `components/VignetteGrain.tsx` | ✓ shared |

Each scene imports shared components; every media element is a discrete prop/`<Audio>`/`<Sequence>` so any single one can be swapped manually (C3).

---

## 4. Visual & Color — custom "Edison-amber" palette

Extends STYLE_BIBLE rules (no pure black/white; textured backgrounds).

```
Ink / deep shadow #1A130B   (background base)
Warm amber         #8B5E3C   (transitions, accents)
Filament glow      #FFB347   (electricity accent — the "light")
Parchment          #F5E6CC   (text on dark)
Brass              #B8860B   (diagram lines, technical)
Warm white text    #F5F0E8   (textOnDark, per STYLE_BIBLE)
```

The palette tells the story: early acts dark ink/amber/parchment → electric acts introduce `#FFB347` filament glow → final floods frame with warm light as the city electrifies.

**Typography:** Playfair Display (serif headings), Inter (body), JetBrains Mono (technical/diagram). Self-hosted in `public/fonts/` (no external CDN — keeps Remotion render hermetic).

**Title card (4s):** dark ink background → a single filament wire draws on (SVG path animation) → it glows to `#FFB347` with bloom → title text "The Bulb Wasn't Enough" reveals letter-by-letter with subtitle "Edison & the adoption of electric light". Premium, eye-catching, never static.

---

## 5. Asset Strategy

- **Historical:** Library of Congress + Wikimedia Commons public-domain (Menlo Park, Pearl Street Station, Edison portraits, 19th-c streets). Downloaded to `public/runtime/edison/images/`.
- **Reconstructions:** AI-generated ONLY where no archival equivalent (Menlo Park lab interior at night, crowd around lamps, Manhattan night skyline). Rendered in Edison-amber palette for consistency.
- **No fabricated documents:** newspaper animations use verified historical headlines (e.g. actual Dec 1879 New York Herald Menlo Park coverage) or clearly stylized cards — never presented as authentic if fabricated.
- **Asset/source list** delivered as `edison/assets-sources.md`.

---

## 6. Historical Accuracy Guardrails

- Edison did **not** invent the world's first electric light bulb — never claimed as such.
- His contribution = practical, commercially viable **incandescent lighting system**.
- Pearl Street Station opening: September 4, 1882 (documented).
- Menlo Park lab: documented as a highly visible, press-visited laboratory.
- Separated into: documented facts / reasonable interpretation / popular myths.
- No invented quotations, statistics, or fabricated newspaper reactions. Popular disputed stories verified or omitted.

---

## 7. Build Order

1. Scaffolding: composition registration, fonts, palette tokens, `edison-script.ts` timeline scaffold.
2. Narration: write full script → `generate-narration.mjs` → segment WAVs.
3. Asset acquisition: download historical + generate reconstructions (parallel; ≤2 concurrent subagents).
4. Scene-by-scene build (S1→S8), each its own commit, each independently tweakable.
5. Music: source-or-synthesize → integrate as a separate audio element.
6. Render master → ffmpeg frame-extract QC → fix → re-render.
7. Final mix → −14 LUFS YouTube deliverable.
8. Deliverables: narration script, shot-by-shot timeline, asset list, music/SFX list, credits, final MP4.

---

## 8. Quality Control (STYLE_BIBLE checklist)

- [ ] 25 fps exact (not 24, not 30)
- [ ] Integrated loudness −14 ±1 LUFS; true peak ≤ −1 dB
- [ ] No pure black (#000000) or pure white (#FFFFFF)
- [ ] Every archival image has Ken Burns motion; **no static image >4s (C1)**
- [ ] Cross-dissolve between all narrative scenes; micro-cuts ≤3 per video
- [ ] Title card exactly 4s, animated (C2)
- [ ] Text within 10% safe margins, min 24px
- [ ] Music bed continuous, crossfaded; narration continuous, no gaps between scenes
- [ ] All media elements independent/swappable (C3)

---

## 9. Deliverables

1. Complete ~5-minute documentary video (final YouTube-ready MP4)
2. Full narration script (with timestamps, visuals, camera, SFX, music, transition per beat)
3. Shot-by-shot timeline
4. Asset/source list
5. Music/SFX list
6. Credits/source information
7. Final rendered video
8. Project source code (modular Remotion components)
