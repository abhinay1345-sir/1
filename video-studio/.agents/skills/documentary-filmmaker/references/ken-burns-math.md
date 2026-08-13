# Ken Burns Motion — Frame-Accurate Math at 25fps

**Source**: Forensic analysis of reference videos + standard Ken Burns cinematography.

---

## Core Constants

| Constant | Value | Why |
|----------|-------|-----|
| fps | 25 | All 3 reference videos use exactly 25 fps |
| Min scale | 1.0 | Full frame |
| Max scale | 1.15 | Measured upper bound in reference videos |
| Pan speed | ≤ 3% / sec | Imperceptible motion; visible on 10s+ scenes |
| Zoom speed | 0.15 scale / 10s | Slow enough to not feel like "camera zooming" |
| Static hold limit | 2s (50 frames) | Any image holding >2s must have motion |

---

## Motion Formula

Given a scene of `F` frames at 25fps (`T = F/25` seconds):

```
zoomAmount  = 0.08 to 0.15 (scene-length dependent)
panAmount   = 0.06 to 0.10 (of image width/height)

// For a scene of duration T seconds:
zoomRate = zoomAmount / T   // scale units per second
panRate  = panAmount / T    // fraction of dimension per second

// At frame n (0-indexed), interpolate linearly:
progress = n / (F - 1)
scale    = 1.0 + (zoomRate * T * progress)   // → 1.0 to 1.0+zoomAmount
panX     = -panRate * T * progress           // direction per pattern
panY     = panRate * T * progress
```

### Example: 26s anchor scene (650 frames)
```
zoomAmount = 0.12, panAmount = 0.08
zoomRate   = 0.12/26 = 0.0046 scale/sec
panRate    = 0.08/26 = 0.0031/sec

Frame 0:   scale 1.000, pan 0%
Frame 162: scale 1.030, pan 7.5%
Frame 325: scale 1.060, pan 15%
Frame 487: scale 1.090, pan 22.5%
Frame 650: scale 1.120, pan 30%
```

---

## Motion Patterns (Alternate Per Scene)

### Pattern 1: Slow Zoom In
```
start: scale 1.0,  center
end:   scale 1.08–1.15, center
```

### Pattern 2: Pan Left + Zoom
```
start: scale 1.05, right edge visible
end:   scale 1.15, left edge visible
```

### Pattern 3: Pan Right + Zoom
```
start: scale 1.05, left edge visible
end:   scale 1.15, right edge visible
```

### Pattern 4: Zoom Out (Reveal)
```
start: scale 1.15, focus detail
end:   scale 1.0, full context
```

### Pattern 5: Diagonal Pan (rare, for maps)
```
start: scale 1.08, top-right
end:   scale 1.18, bottom-left
```

---

## Direction Alternation Rule

Never repeat the same motion pattern twice in a row. Sequence cycles:
`ZoomIn → PanLeft → ZoomIn → PanRight → ZoomOut → PanLeft → ...`

This prevents "motion drift" fatigue and keeps each cut feeling fresh.

---

## Scene-Duration-Based Presets

| Scene Type | Duration | Pattern | Params |
|------------|----------|---------|--------|
| **Anchor** (20–40s) | 500–1000 frames | Compound (zoom + slow pan) | zoom 0.12, pan 0.08 |
| **Beat** (2–6s) | 50–150 frames | Single zoom OR pan | zoom 0.05, pan 0.04 |
| **Establishing** (5–17s) | 125–425 frames | Zoom Out (reveal) | zoom 0.10 |
| **Portrait** (2–4s) | 50–100 frames | Slow zoom toward eyes | zoom 0.04 |
| **Text Card** (1–3s) | 25–75 frames | None (static + fade text) | scale 1.0 |
| **Micro-cut** (0.04s) | 1 frame | N/A | scale 1.0 |

---

## Critical Rules

1. **Every image moves** — a static image for >2s reads as a "slideshow", not a documentary
2. **Never cross the frame edge** — pan must not reveal black bars on any side
3. **Ken Burns on scale, not crop** — render the full source then scale+pan within it (no resolution loss)
4. **Compound motion for anchors** — a 26s pure zoom feels mechanical; add 5–10% pan offset
5. **Ease-in / ease-out** — use smoothstep/spring on progress, NOT linear, for scenes >5s:
   ```
   eased = progress * progress * (3 - 2 * progress)  // smoothstep
   scale = 1.0 + zoomAmount * eased
   ```

---

## Text-Overlay Safe Zone (During Motion)

Even while panning, text must stay within:
- **Upper 85%** of frame (bottom 15% reserved for lower-thirds)
- **10% safe margin** on all edges
- If Ken Burns moves the subject toward text zone, offset pan to keep text zone clear

---

## Common Failure Modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Camera feels robotic" | Linear interpolation on long scenes | Use smoothstep ease |
| "Too zoomed in, detail lost" | Scale > 1.15 | Clamp at 1.15 max |
| "Black bars appear" | Pan past image bounds | Clamp pan ≤ (scale-1)/2 |
| "Motion sickness" | Different pattern every short scene | Alternate only 3 patterns max |
| "Slideshow feel" | Static holds > 2s | Add motion or shorten scene |

---

## Implementation Notes (ffmpeg zoompan)

```bash
# Zoom-in example (26s scene, 650 frames @ 25fps)
# Input image 2000px wide, output 1280×720
ffmpeg -loop 1 -i image.png \
  -vf "scale=8000:-1,zoompan=z='1+0.12*on/650':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=650:s=1280x720:fps=25" \
  -frames:v 650 -c:v libx264 -crf 18 scene.mp4
```

```bash
# Pan-left + zoom example
ffmpeg -loop 1 -i image.png \
  -vf "scale=8000:-1,zoompan=z='1.05+0.10*on/650':x='iw/2-(iw/zoom/2)-(iw*0.06*on/650)':y='ih/2-(ih/zoom/2)':d=650:s=1280x720:fps=25" \
  -frames:v 650 -c:v libx264 -crf 18 scene.mp4
```

> **Note**: In Remotion, use `useCurrentFrame()` + `interpolate()` with smoothstep easing instead of zoompan — smoother and previewable.