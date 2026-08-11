# Documentary-Factory — Project Status & Progress

> **Updated:** 2026-08-11
> This document is a living overview of the entire project: what it is, what's been built, what's completed, what's in progress, what's next, and every file we've created. Keep it updated as work proceeds.
> **Phase 2 is now ✅ COMPLETE** — full Steve Jobs render verified with real assets + audio (see §5).

---

## 1. What This Project Is

**Documentary-Factory** is an automated documentary video creation pipeline. You give it a topic, and it produces a finished Ken Burns–style documentary video — from research through script, images, voiceover, and final render — with **zero manual editing**.

The full flow has two halves:

1. **The AI pipeline (Node.js)** — 6 agents that turn a topic into a structured project folder containing script, images, voiceover audio, and asset manifests.
2. **The Video Studio (Remotion / React)** — renders those assets into a cinematic video with Ken Burns motion, title cards, lower-thirds, and audio (Phase 2/3 work).

---

## 2. Architecture — The 6-Agent Pipeline

Each agent reads its input from the project folder and writes its output, updating `state.json`.

| # | Agent | Input → Output |
|---|-------|----------------|
| 01 | Topic Hunter | topic → `01_topic.json` |
| 02 | Researcher | `01_topic.json` → `02_research.md` (scrapes Wikipedia + Claude summary) |
| 03 | Scriptwriter | `02_research.md` → `03_script.json` (segments with narration + visual prompts) |
| 04 | Asset Collector | `03_script.json` → `04_assets/` (Pexels/Pollinations images, ffmpeg title cards) |
| 05 | Audio Designer | `03_script.json` → `05_audio/voiceover/*.wav` (edge-tts) |
| 06 | Editor | assets + audio → `06_render/final_video.mp4` (Ken Burns via ffmpeg) |

Projects live in the Google Drive mount: `~/gdrive/documentary-factory/projects/<project-id>/` (e.g. `2026-08-09_steve-jobs`).

---

## 3. Phase Progress Overview

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | FFmpeg MVP — full 6-agent pipeline produces a Ken Burns video | ✅ **COMPLETE** |
| **Phase 2** | Remotion visual studio — cinematic Ken Burns, title/lower-third/end-card overlays | ✅ **COMPLETE** — full Steve Jobs render verified with assets + audio |
| **Phase 3** | Audio polish — background music, SFX, ducking, YouTube-ready render | ⏸️ **NOT STARTED** |

---

## 4. Phase 1 — FFmpeg MVP (COMPLETE)

A working Node.js pipeline that goes from topic → finished video using ffmpeg for the Ken Burns effect.

### What was built
- `src/pipeline.js` — orchestrator that runs the 6 agents in sequence, supports checkpoints/resume.
- `src/agents/01_topic_hunter.js` → `06_editor.js` — the six agents.
- `src/lib/llm.js` — Claude API wrapper for research/script generation.
- `src/lib/cache.js` — disk cache (`/tmp/docfactory_cache`) for Wikipedia scrapes & scraper results (~50x faster re-runs).
- `config/index.js` — configuration (defaults like `audioConcurrency: 3`).
- `scraper.js` — standalone Playwright web scraper used for research.
- `.claude/hooks/validate-json.cjs` — PostToolUse hook that validates any `.json` written by Claude.
- `.claude/settings.json` — permission allowlist for pipeline runs, rclone, mount checks.

### Proven end-to-end
- **Steve Jobs** documentary (`2026-08-09_steve-jobs`) was fully generated through all 6 agents:
  - 7 segments with narration script
  - 14 images (hero + support per segment) + 7 lower-third overlays in `04_assets/`
  - 7 voiceover WAV files in `05_audio/voiceover/`
  - FFmpeg render to `06_render/final_video.mp4`

---

## 5. Phase 2 — Remotion Video Studio (COMPLETE)

A **standalone Remotion studio** (`video-studio/`) that renders the documentary assets with cinematic motion — separate from the FFmpeg pipeline.

### What was built — files we created

```
video-studio/
├── package.json                  # Remotion 4, React 19, TypeScript
├── src/
│   ├── index.ts                  # Entry: registerRoot(VideoComposition)
│   ├── MyVideo.tsx               # Root composition: Title → Timeline → EndCard + audio
│   ├── player.tsx                # (Player-based preview entry)
│   ├── data/
│   │   └── documentary.ts        # Types + normalizeManifest() adapter
│   ├── components/
│   │   └── Timeline.tsx          # Sequence composition + per-segment Audio
│   └── scenes/
│       ├── TitleScene.tsx        # Cinematic title card (spring + line animation)
│       ├── DocumentarySegment.tsx# Ken Burns: hero/support crossfade, scale 1→1.12, pan
│       └── EndCardScene.tsx      # Fade in/out end card
├── scripts/
│   └── prepare-project.mjs       # Copies Drive assets → public/runtime/, writes props.json
├── public/runtime/               # Generated asset store (git-ignored per-project)
└── output/                       # Rendered previews (still.png, video.mp4, preview.mp4)
```

### How it works
1. `prepare-project.mjs` reads a project's `04_assets/manifest.json` + `03_script.json`.
2. It copies hero/support/overlay images and voiceover WAVs into `public/runtime/<projectId>/`.
3. It writes `props.json` with normalized segments (title, durationSeconds, `file://` asset URLs, audioSrc).
4. Remotion renders via `calculateMetadata` → dynamic duration from segment TTS durations.
5. `MyVideo` composes: **TitleScene → Timeline (Ken Burns segments) → EndCardScene**, with per-segment audio in `Timeline.tsx`.

### Verified working
- ✅ Compositions register & list correctly (`remotion compositions`): `main-video`, `title-card`, `end-card`
- ✅ Still render: `output/still.png` — 1920×1080
- ✅ Full render: `output/video.mp4` — **1920×1080, 30fps, 6.0s** (default empty props)
- ✅ Preview render: `output/preview.mp4` — 960×540 (0.5 scale)
- ✅ Steve Jobs props generated: 7 segments, ~159s content duration, per-segment audioSrc wired
- ✅ 7 voiceover WAVs copied to `public/runtime/2026-08-09_steve-jobs/audio/`
- ✅ **Full Steve Jobs render**: `output/steve-jobs-1080p.mp4` — **1920×1080, 30fps, 165s, 15 MB**, H.264 video + **AAC stereo audio**
- ✅ **Audio verified mixed & audible**: `ffprobe` shows AAC 48kHz stereo track; `volumedetect` → mean −23.4 dB, max −3.6 dB (no clipping, no silence)
- ✅ `video-studio/` committed to git (`ef4d59b`)

---

## 6. Current State (Where We Are Now)

**Phase 2 is complete.** The Remotion studio renders correctly and the full Steve Jobs documentary — all 7 segments, real images, overlays, and voiceover audio — renders end-to-end at 1080p with audio mixed in. The video is committed and reproducible with the commands in §8.

### Issues fixed along the way
| Issue | Fix |
|-------|-----|
| TypeScript 7 incompatible with Remotion bundler | Downgraded to `typescript ^5.5.0` |
| `remotion check` command doesn't exist | Replaced with `remotion compositions` |
| `calculateMetadata` import broken | Now uses `CalculateMetadataFunction<RootProps>` (async) |
| `registerRoot()` called twice | Moved to `index.ts` only |
| Nested `<Composition>` inside component (invalid) | MyVideo now uses `<Sequence>` for title/content/end + root registers 3 compositions |
| Asset URLs `runtime/...` returned 404 (no leading `/`) | Now resolved to absolute `file://` URLs so Remotion loads local files directly |

### Files modified in this effort (Phase 2)
- `video-studio/package.json` — scripts (`start`, `build`, `still`, `compositions`, `prepare:project`)
- `video-studio/src/index.ts` — registerRoot entry
- `video-studio/src/MyVideo.tsx` — root composition with Sequences
- `video-studio/src/components/Timeline.tsx` — Sequence timeline + per-segment `<Audio>`
- `video-studio/src/scenes/DocumentarySegment.tsx` — Ken Burns scene
- `video-studio/src/data/documentary.ts` — added `audioSrc` to `DocumentarySegment` type
- `video-studio/scripts/prepare-project.mjs` — copies assets, writes props, `file://` URLs, audioSrc

---

## 7. What's Next (Remaining Work)

### Phase 2 — ✅ COMPLETE
- [x] **Full Steve Jobs render with real props + audio** — `output/steve-jobs.mp4` (0.5 scale, 960×540) — 164.99s, 4948 frames. Verified with ffprobe.
- [x] **Verify per-segment audio actually mixes into the render** — AAC 48kHz stereo track present; `volumedetect` → mean −23.4 dB, max −3.6 dB.
- [x] **Full 1080p render** — `output/steve-jobs-1080p.mp4` — 1920×1080, 30fps, 164.99s, 15 MB.
- [x] **Commit `video-studio/` to git** — commit `ef4d59b` (15 files; `node_modules/`, `output/`, `public/runtime/` git-ignored).

### Phase 3 — Audio polish (NOT STARTED)
- [ ] Background music track (the `05_audio/music/` and `05_audio/sfx/` folders exist but are **empty** for the Steve Jobs project).
- [ ] SFX / whooshes on transitions.
- [ ] Audio ducking (voiceover ducks under music).
- [ ] Loudness normalization + YouTube-ready render settings (sample rate, audio codec AAC).
- [ ] Possibly mix with ffmpeg (Phase 1 editor) or inside Remotion.

### Future / Integration
- [ ] Wire `prepare-project.mjs` + Remotion render into the pipeline (e.g. as an alternative to the FFmpeg `06_editor.js`).

---

## 8. Commands

### Pipeline (repo root `/workspaces/1`)
```bash
npm run create -- --topic "Steve Jobs" [--category biography] [--duration 25]
npm run resume -- --project 2026-08-09_steve-jobs
npm run agent -- --project 2026-08-09_steve-jobs --agent 05
npm run list
```

### Video Studio (in `video-studio/`)
```bash
npm install                        # install deps
node scripts/prepare-project.mjs --project /home/codespace/gdrive/documentary-factory/projects/2026-08-09_steve-jobs
npm run compositions               # verify compositions register
npm run still                      # render still.png (default props)
npx remotion still src/index.ts main-video output/still-steve.png --props=public/runtime/2026-08-09_steve-jobs/props.json
npx remotion render src/index.ts main-video output/steve-jobs.mp4 --props=public/runtime/2026-08-09_steve-jobs/props.json --scale=0.5
npx remotion render src/index.ts main-video output/steve-jobs-1080p.mp4 --props=public/runtime/2026-08-09_steve-jobs/props.json --scale=1
npx remotion studio src/index.ts   # live preview (browser)
```

### Verify output
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of csv=p=0 output/video.mp4
```

---

## 9. Steve Jobs Project Assets (source of truth)

Located at: `~/gdrive/documentary-factory/projects/2026-08-09_steve-jobs/`

| Path | Contents |
|------|----------|
| `01_topic.json` | Topic: Steve Jobs |
| `02_research.md` | Wikipedia research + Claude summary |
| `03_script.json` | 7 segments, narration, visual prompts, durations |
| `04_assets/manifest.json` | 14 images + 7 lower-third overlays |
| `04_assets/images/` | hero + support JPGs per segment |
| `04_assets/overlays/` | lower-third PNGs per segment |
| `05_audio/voiceover/*.wav` | 7 TTS narration clips (segment_01..07) |
| `05_audio/music/`, `05_audio/sfx/` | **Empty** — Phase 3 targets |
| `06_render/` | FFmpeg-rendered `final_video.mp4` |
| `state.json` | Pipeline agent state |

---

## 10. Key File Index (this repo)

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Claude Code project instructions (agents, commands, optimizations) |
| `PLAN.md` | The 4-phase implementation plan |
| `PROJECT_STATUS.md` | **This document** — live status & progress |
| `README.md` | Getting-started readme |
| `config/index.js` | Pipeline config (defaults) |
| `src/pipeline.js` | 6-agent orchestrator |
| `src/agents/01..06_*.js` | The six pipeline agents |
| `src/lib/llm.js` | Claude API wrapper |
| `src/lib/cache.js` | Disk cache for scrapes |
| `scraper.js` | Standalone Playwright scraper |
| `video-studio/` | Remotion studio (Phase 2/3) |
