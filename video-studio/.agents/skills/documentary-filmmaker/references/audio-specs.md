# Audio Specifications — Documentary Mix

**Source**: Forensic audio analysis of 3 reference documentaries (ffmpeg EBU R128 + volumedetect).

---

## Measured Loudness Targets (Ground Truth)

| Metric | V1: 1914 | V2: Constitution | V3: France-America | **Unified Target** |
|--------|----------|------------------|--------------------|--------------------|
| Integrated (LUFS) | -14.2 | -14.1 | -14.4 | **-14 ±1 LUFS** |
| Mean volume (dB) | -17.7 | -16.9 | -17.6 | **~-17 dB** |
| True peak (dB) | -0.6 | -0.5 | -0.6 | **≤ -1 dBTP** |

All three videos land within 0.3 LU of each other — this is a deliberate, consistent mastering target.

---

## Audio Track Architecture

```
|------------------ NARRATION (continuous, ~-17 dB mean) ----------------|
    |--- music bed ----|---- music bed (crossfaded) ----|---- bed ----|
                                   ↑ ducking
   [ SFX ]              [ SFX ]          [ SFX ]
   0:00                0:10             0:20                 0:30
```

### Layer Levels (Relative to -14 LUFS master)

| Layer | Level | Notes |
|-------|-------|-------|
| **Narration** | -14 LUFS (primary) | Drives the master; everything sits under it |
| **Music bed** | -28 dB under narration | Continuous, never competes |
| **Music during text cards** | -18 dB under narration | Swells slightly when narration pauses |
| **Music during pauses/anchors** | -12 dB under narration | Emotional lift on long scenes |
| **SFX** | -20 to -25 dB | Subtle; occasional (paper rustle, quill, map unfold) |
| **Room tone** | -50 to -55 dB | Consistent floor, no digital silence |

---

## Narration Spec

| Property | Value |
|----------|-------|
| Voice | Mid-40s–50s male (or female equivalent), authoritative, warm |
| Pace | ~150 wpm (±10) |
| Sentence length | 12–20 words, varied rhythm |
| Dynamic range | Compressed (narration rides consistent level) |
| Compression | 2:1 ratio, -20 dB threshold, 10ms attack, 150ms release |
| De-ess | 6 kHz, moderate |
| High-pass | 80 Hz (remove rumble/pops) |

### Narration Writing Rules
- **3 words per second** of screen time (60s video → 180 words)
- Continuous — no gaps between scenes (reference videos never drop to silence mid-video)
- **Anchor scene** gets the longest uninterrupted passage (25–40s → 75–120 words)
- **Text cards** pause narration 1–2s (let the visual breathe)
- **Micro-cuts**: narration keeps flowing THROUGH the flash — never stops for a 1-frame cut

---

## Music Spec

| Property | Value |
|----------|-------|
| Source | Royalty-free (Pixabay/CC0), orchestral or chamber for Sepia; strings for Parchment; ambient for Sage |
| Structure | Continuous bed, no beats-per-minute lock to video (documentary, not music video) |
| Crossfade | 2–3s overlap at every scene boundary |
| Entry | 2s fade-in at video start |
| Exit | 3s fade-out into end card, cut at end |
| Ducking | Sidechain to narration; 3dB reduction during speech |

### Music Mood by Style
| Style | Mood | Instruments |
|-------|------|-------------|
| Sepia/1914 | Somber, historical, string-dominant | Strings, solo piano, soft brass |
| Parchment | Formal, chamber, restrained | Chamber strings, harpsichord, woodwinds |
| Sage-Map | Ambient, expansive, geographic | Drones, pads, minimal percussion |

---

## SFX Palette (Optional, Sparse)

| Style | SFX | Level | Where |
|-------|-----|-------|-------|
| All | Paper rustle | -22 dB | Scene open/close over documents |
| Parchment | Quill scratch | -25 dB | Signing scenes, title cards |
| Sepia | Train whistle (distant) | -24 dB | Industrial transitions |
| Sage-Map | Map unfold | -20 dB | Map animations |
| All | Room tone | -50 dB | Continuous underlay |

> **Rule**: Max 2 SFX per 60s. Sparse is premium; every SFX must earn its place.

---

## Mastering Chain (ffmpeg)

```bash
# Build the master mix
ffmpeg -i narration.wav -i music.wav -filter_complex "
  [1:a]volume=0.15[m0];
  [0:a]asplit=2[narr][duck];
  [duck]highpass=f=80,compand=attacks=10:releases=150:threshold=-20dB:ratio=2:decay=200:points=-90/-90|-35/-20|-20/-9|-5/0|0/0:soft-knee=6[mk];
  [m0][mk]sidechaincompress=threshold=0.02:ratio=3:attack=5:release=300[ducked];
  [narr][ducked]amix=inputs=2:normalize=0:weights=1 0.6[premix];
  [premix]alimiter=limit=0.89,ebur128[out]
" -map "[out]" -ar 48000 -ac 2 master.wav
```

### Final Loudness Check
```bash
ffmpeg -i master.wav -af ebur128 -f null - 2>&1 | grep -E "I:|True peak|LRA:"
# Expect: I: -14.x LUFS, True peak < -1.0, LRA ≤ 7
```

---

## Common Failure Modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Clipping | Narration + music + SFX sum > 0 dB | Pre-mix at -6 dB, master limiter -1 dBTP |
| Music overpowers narration | Bed above -28 dB | Drop music 3–6 dB |
| "Radio silence" gaps | Missing room tone between scenes | Add -50 dB bed underlay |
| Harsh voice | No de-ess / no high-pass | Add de-ess at 6k, HP at 80 Hz |
| LRA > 7 LU | Narration pauses too loud-music swells | Duck music during speech, cap swells |
| Mono narration | Single-channel narration track | Upmix to stereo (duplicate + 3ms delay on right) |

---

## Verification One-Liner

```bash
ffmpeg -i final.mp4 -af ebur128 -f null - 2>&1 | grep -E "I:|True peak|LRA:" && \
ffprobe -v error -select_streams a -show_entries stream=sample_rate,channels,codec_name -of csv=p=0 final.mp4
# Expect: -14.x LUFS, <-1.0 peak, ≤7 LRA, 48000 Hz, 2 ch, aac
```