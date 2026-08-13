# Quality Checklist — Per-Render Verification

Run this checklist on EVERY rendered documentary before declaring done.

---

## Video Technical

- [ ] **Frame rate**: Exactly 25 fps (not 24, 23.976, 30, 29.97) — verify with `ffprobe -v error -select_streams v -show_entries stream=r_frame_rate -of csv=p=0 output.mp4`
- [ ] **Resolution**: 1280×720 (16:9) — verify with `ffprobe`
- [ ] **Codec**: H.264 High Profile, CRF 18, preset slow
- [ ] **Duration**: Matches creative brief ±2 seconds
- [ ] **No dropped/duplicated frames**: `ffprobe -show_frames` shows consistent 40ms frame intervals

---

## Audio Technical

- [ ] **Sample rate**: 48 kHz stereo — verify with `ffprobe`
- [ ] **Integrated loudness**: -14 ±1 LUFS (EBU R128) — verify: `ffmpeg -i output.mp4 -af ebur128 -f null - 2>&1 | grep "I:"`
- [ ] **True peak**: ≤ -1 dBTP — verify: `ffmpeg -i output.mp4 -af "ebur128=peak=true" -f null - 2>&1 | grep "True peak"`
- [ ] **Loudness range (LRA)**: ≤ 7 LU (consistent dynamics)
- [ ] **No clipping**: Max amplitude < -0.5 dB

---

## Visual Grammar

- [ ] **No pure black (#000000)**: Sample 10 random frames — darkest pixel > #0A0A0A
- [ ] **No pure white (#FFFFFF)**: Sample 10 random frames — brightest pixel < #F5F5F5
- [ ] **Ken Burns on EVERY image**: No static hold > 2 seconds on any archival asset
- [ ] **Ken Burns params**: Scale 1.0→1.08–1.15, pan ≤ 3%/sec, direction alternates
- [ ] **Cross-dissolve between ALL narrative scenes**: 16–24 frames (0.64–0.96s)
- [ ] **Micro-cuts**: Max 2 per video, exactly 1 frame (0.04s) each
- [ ] **Chapter transitions**: 30–40 frame dissolve OR 2s fade to palette color

---

## Pacing & Structure

- [ ] **Cuts/minute**: In target range for chosen style (8–12 typical, 3–5 slow, 20+ fast)
- [ ] **Anchor scene**: Exactly ONE scene 20–40 seconds (500–1000 frames)
- [ ] **Beat scenes**: All others 2–6 seconds (50–150 frames)
- [ ] **Three-act structure**: Hook (0–15%), Body (15–85%), Payoff (85–100%)
- [ ] **Scene functions present**: Establishing, Anchor, Evidence(2+), Text Card, Portrait, Legacy, End

---

## Typography & Layout

- [ ] **Font variety**: Heading font ≠ Body font ≠ Mono font (3 distinct families)
- [ ] **Min font size**: 24px at 720p (scales to 48px at 1440p)
- [ ] **Safe margins**: All text/graphics within 90% central rectangle (10% edge padding)
- [ ] **Lower third zone**: Bottom 15% reserved for captions — no critical visual content there
- [ ] **Line length**: ≤ 60 characters per line for body text
- [ ] **Line height**: ≥ 1.5× font size
- [ ] **Contrast ratio**: Text vs background ≥ 4.5:1 (WCAG AA)

---

## Color Palette Consistency

- [ ] **Single accent family**: All frames use colors from ONE palette (Sepia / Parchment / Sage-Map / Custom)
- [ ] **Background texture**: Parchment/paper/sepia-grain visible, not flat color
- [ ] **Text on dark**: Warm off-white (#F5F0E8 or palette equivalent)
- [ ] **Text on light**: Dark ink (#281C12 or palette equivalent)
- [ ] **No rogue colors**: Spot-check 20 frames — all hues within palette ±15°

---

## Audio-Visual Sync

- [ ] **Narration continuous**: No gaps > 500ms between scenes
- [ ] **Music bed continuous**: Crossfaded at scene boundaries (not hard cuts)
- [ ] **Music level**: -28 dB under narration, -18 dB during text cards, -12 dB during pauses
- [ ] **Music mood matches style**: Sepia=somber orchestral, Parchment=chamber strings, Sage=ambient drones
- [ ] **Voice clarity**: Narration intelligible at -20 dB playback (test on phone speaker)

---

## Content Accuracy

- [ ] **Dates/names spelled correctly**: Cross-reference with research doc
- [ ] **Images match narration**: No "talking about Paris while showing London"
- [ ] **Licensing**: All assets cleared (public domain, CC0, licensed, or generated)
- [ ] **Attributions**: Credits frame includes sources for archives, music, narration

---

## Render Artifacts

- [ ] **No encoding artifacts**: Spot-check at 2× speed — no macroblocking, banding, mosquito noise
- [ ] **Color space**: BT.709 (standard for web) — verify `ffprobe` shows `color_space=bt709`
- [ ] **Pixel format**: yuv420p (compatibility) — verify `ffprobe` shows `pix_fmt=yuv420p`
- [ ] **File size reasonable**: ~1–2 MB/min at 720p CRF 18

---

## Quick Verification Commands

```bash
# One-liner health check
ffprobe -v error -select_streams v -show_entries stream=width,height,r_frame_rate,codec_name,pix_fmt,color_space -of csv=p=0 output.mp4
ffprobe -v error -select_streams a -show_entries stream=sample_rate,channels,codec_name -of csv=p=0 output.mp4
ffmpeg -i output.mp4 -af ebur128 -f null - 2>&1 | grep -E "I:|True peak|LRA:"
ffmpeg -i output.mp4 -vf "signalstats=stat=tout+vrep+brng" -f null - 2>&1 | tail -5
```

---

## Scoring (Expert Review)

| Dimension | Weight | Pass Threshold |
|-----------|--------|----------------|
| Technical spec compliance | 25% | 100% (hard requirements) |
| Audio loudness/spec | 20% | 100% (hard requirements) |
| Visual grammar adherence | 20% | ≥ 90% |
| Pacing/structure | 15% | ≥ 80% |
| Typography/layout | 10% | ≥ 90% |
| Content accuracy | 10% | 100% (hard requirement) |

**Overall**: ≥ 90% = Ship | 80–89% = One more pass | < 80% = Significant rework