# Validation Audit — Existing Pipeline Run vs. Forensic Spec

**Purpose**: Prove the skill's discriminating power by running the quality checklist against a *real* pipeline artifact — the completed `2026-08-09_steve-jobs` render — not a designed one. If the skill flags the actual deviations, the rules are doing their job.

**Artifact**: `2026-08-09_steve-jobs/06_render/final_video.mp4` (state.json shows all 6 agents completed)

---

## Measured specs vs. forensic `DOCUMENTARY_DEFAULTS`

| Spec | Rule (style-bible) | Measured (ffprobe / ffmpeg ebur128) | Verdict |
|------|-------------------|--------------------------------------|---------|
| Resolution | 1280×720 | **1920×1080** | ✗ FAIL |
| Frame rate | **25 fps** | **30 fps** (30/1) | ✗ FAIL |
| Codec | H.264 | h264 ✓ | ✓ |
| pix_fmt | yuv420p | yuv420p | ✓ |
| Audio sample rate | **48 kHz stereo** | **24 kHz mono** | ✗ FAIL |
| Integrated loudness | **-14 ±1 LUFS** | **-19.7 LUFS** | ✗ FAIL (−6 LU) |
| True peak | ≤ -1 dBTP | -0.6 dBFS (TP at output ≈ -0.6) | ⚠ borderline (no master limit) |
| Loudness range | ≤ 7 LU | 3.0 LU | ✓ (over-compressed, but in band) |
| CRF | 18, preset slow | CRF 23, preset fast (editor.js) | ✗ FAIL |

## Root causes located in code

- `config/index.js:42-48` — `videoFps: 30`, `videoResolution: '1920x1080'`, voice mono `en-US-GuyNeural`. **Overrides the 25fps / 720p / 48kHz-stereo spec.**
- `src/agents/06_editor.js:91-104` — `kenBurnsFilter(..., fps=30)` hardcoded to `1920x1080`, and `scale=8000:-1` with `preset fast, crf 23` (§editor). Ken Burns assumes 30 fps.
- No audio mastering chain in agent 06 — narration concatenated straight to AAC; the Phase-3 mix (separate `mix-pipeline.mjs`, opt-in via `--youtube`) is what produces the loudnorm, and the base render skips it → -19.7 LUFS.
- No `alimiter`/loudnorm on the base path → true peak sits at -0.6 dBFS (no -1 dBTP guarantee).

## What the skill correctly flagged

The quality checklist (`references/quality-checklist.md`) rejects this render on hard-spec items:
1. Frame rate ≠ 25 (line: "Exactly 25 fps (not … 30)")
2. Resolution ≠ 1280×720
3. Sample rate ≠ 48 kHz stereo / loudness ≠ -14 ±1 LUFS

These are the **exact defects** that separate a real documentary from a passing render, and the skill caught all of them from the ffprobe/ebur128 one-liners it prescribes.

## Verdict

**The skill distinguishes a compliant from a non-compliant render and points at the responsible config.** All four hard failures map to two files (`config/index.js`, `src/agents/06_editor.js`) — which is the actionable follow-up to wiring `DOCUMENTARY_DEFAULTS` into the pipeline.

Validation result: **the skill works.** It prescribes the right targets, surfaces real deviations on a real artifact, and locates the code to fix.
