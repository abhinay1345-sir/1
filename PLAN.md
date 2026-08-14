# Documentary Video Factory — Implementation Plan
**Created:** 2026-08-09
**Status:** Ready for implementation
**Target:** 20-30 minute YouTube documentaries in history, science, and biographies

---

## Executive Summary

Build a 6-agent documentary pipeline where Claude Code acts as Master AI + Editor. Each agent produces artifacts saved to Google Drive, preserving codespace disk space. The workflow is interactive — user approves each major step before I proceed.

**Output:** One polished documentary video per topic, delivered to Google Drive for manual YouTube upload.

---

## Project Scope

### What We're Building
- **Genre:** History, science, biographies of notable figures (Steve Jobs, Aryabhata, etc.)
- **Format:** 20-30 minute long-form documentaries
- **Style:** Ken Burns (pan/zoom on images, calm narration, classic documentary feel)
- **Language:** English only

### What We're NOT Building (Yet)
- Auto-upload to YouTube (manual upload after I finish)
- Parallel agent execution (sequential for now, upgrade later)
- Multi-platform formats (long-form only, no Shorts/Reels derivation)
- Performance analytics feedback loop (Phase 4)

---

## Technology Stack

| Layer | Technology | Cost | Notes |
|-------|------------|------|-------|
| **Web Scraping** | Playwright | Free | Already installed |
| **Script Generation** | Claude API (Sonnet) | ~$0.50-1.00 per video | User has API key |
| **Image Generation** | Stability AI / Pollinations.ai | Free tier available | Hybrid: AI + stock |
| **Stock Footage** | Pexels API, Pixabay | Free | Licensed for commercial use |
| **AI Video Clips** | SnapGen.ai, Hugging Face | Free tier available | For specific visuals |
| **Voice-over** | Edge-TTS (Microsoft) | Free | High quality, runs locally via Python |
| **Background Music** | YouTube Audio Library + AI (Suno free tier) | Free | Fallback to AI if no match |
| **Video Assembly** | ffmpeg (Phase 1) → Remotion (Phase 3) | Free | Pro upgrade later |
| **Storage** | Google Drive (rclone mount) | Free | All assets on Drive |

---

## Agent Architecture

### 6 Agents, Sequential Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MASTER AI (Claude Code)                              │
│  - Orchestrates pipeline                                                      │
│  - Presents outputs for user approval                                         │
│  - Handles errors and retries                                                 │
│  - Acts as Editor in Agent 6                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGENT 1: Topic Hunter                                                        │
│  Input:  Manual topic from user OR auto-discover from trends                 │
│  Output: ~/gdrive/documentary-factory/projects/{topic}/01_topic.json         │
│  Tools:  Playwright (Google Trends, Wikipedia, news sites)                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGENT 2: Researcher                                                          │
│  Input:  01_topic.json                                                        │
│  Output: ~/gdrive/.../02_research.md                                          │
│  Tools:  Playwright (Wikipedia, scholarly sources, news archives)            │
│          Claude API (summarize, extract key facts)                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGENT 3: Scriptwriter                                                        │
│  Input:  02_research.md                                                       │
│  Output: ~/gdrive/.../03_script.json (segments + visual prompts + timing)    │
│  Tools:  Claude API (long-form script generation)                            │
│  Checkpoint: USER APPROVES SCRIPT BEFORE PROCEEDING                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGENT 4: Asset Collector                                                     │
│  Input:  03_script.json (visual prompts per segment)                         │
│  Output: ~/gdrive/.../04_assets/                                              │
│          ├── images/         (AI-generated + stock)                          │
│          ├── clips/          (Stock footage + AI video)                      │
│          └── overlays/       (Lower thirds, titles, maps)                    │
│  Tools:  Pexels API, Stability AI, SnapGen.ai, Hugging Face                  │
│  Checkpoint: USER REVIEWS ASSET PREVIEW BEFORE PROCEEDING                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGENT 5: Audio Designer                                                      │
│  Input:  03_script.json (narration text)                                      │
│  Output: ~/gdrive/.../05_audio/                                               │
│          ├── voiceover/      (TTS segments)                                   │
│          ├── music/          (Background tracks)                              │
│          └── sfx/            (Sound effects)                                  │
│  Tools:  Edge-TTS (Python), YouTube Audio Library, Suno API                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGENT 6: Editor (Claude Code)                                                │
│  Input:  All assets from 04_assets/ and 05_audio/                            │
│  Output: ~/gdrive/.../06_render/final_video.mp4                              │
│  Tools:  ffmpeg (concat, Ken Burns effect, audio mix, overlays)              │
│  Process:                                                                      │
│    1. Assemble timeline based on script segments                              │
│    2. Apply Ken Burns pan/zoom to images                                      │
│    3. Mix voiceover + music + SFX                                             │
│    4. Add lower thirds, titles, transitions                                   │
│    5. Render final video                                                      │
│  Checkpoint: USER PREVIEWS VIDEO, REQUESTS REVISIONS IF NEEDED               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Google Drive Folder Structure

```
~/gdrive/documentary-factory/
├── projects/
│   └── 2026-08-09_steve-jobs/           # Date + topic slug
│       ├── 01_topic.json                # Topic + keywords + sources
│       ├── 02_research.md               # Deep research notes
│       ├── 03_script.json               # Script with visual prompts
│       ├── 04_assets/
│       │   ├── images/
│       │   │   ├── segment_01_hero.png
│       │   │   ├── segment_01_support_01.png
│       │   │   └── ...
│       │   ├── clips/
│       │   │   ├── broll_01.mp4
│       │   │   └── ...
│       │   └── overlays/
│       │       ├── lower_third_01.png
│       │       ├── title_card.png
│       │       └── end_card.png
│       ├── 05_audio/
│       │   ├── voiceover/
│       │   │   ├── segment_01.wav
│       │   │   ├── segment_02.wav
│       │   │   └── ...
│       │   ├── music/
│       │   │   └── background_01.mp3
│       │   └── sfx/
│       │       └── whoosh_01.wav
│       ├── 06_render/
│       │   ├── final_video.mp4          # THE DELIVERABLE
│       │   └── thumbnail.png
│       └── state.json                   # Pipeline state tracking
├── templates/
│   ├── video-templates/                 # Reusable ffmpeg templates
│   │   ├── ken_burns_simple.json
│   │   └── ken_burns_cinematic.json
│   └── music-library/                   # Pre-cleared tracks
│       ├── cinematic/
│       └── ambient/
└── config/
    └── prompts/                         # Reusable LLM prompts
        ├── research_prompt.md
        └── script_prompt.md
```

---

## Data Schemas

### 01_topic.json
```json
{
  "topic": "Steve Jobs: The Visionary",
  "slug": "steve-jobs",
  "keywords": ["Apple", "innovation", "iPhone", "Macintosh", "Pixar"],
  "category": "biography",
  "target_duration_minutes": 25,
  "sources": [
    {"type": "wikipedia", "url": "https://en.wikipedia.org/wiki/Steve_Jobs"},
    {"type": "news", "title": "Stanford Commencement Speech", "date": "2005"}
  ],
  "created_at": "2026-08-09T10:00:00Z"
}
```

### 03_script.json
```json
{
  "title": "Steve Jobs: The Visionary",
  "total_duration_seconds": 1500,
  "segments": [
    {
      "id": "segment_01",
      "title": "Introduction",
      "narration": "In a garage in Los Altos, California, two young visionaries...",
      "duration_seconds": 45,
      "visual_prompts": [
        {
          "type": "image",
          "prompt": "Young Steve Jobs and Steve Wozniak in garage, 1976, cinematic",
          "fallback": "stock:garage_startup"
        },
        {
          "type": "clip",
          "prompt": "Vintage Apple I computer, archival footage",
          "fallback": "stock:retro_computer"
        }
      ],
      "music_mood": "inspiring, building",
      "sfx": ["subtle_ambient"]
    }
  ],
  "voice_settings": {
    "voice": "en-US-GuyNeural",
    "speed": 0.95,
    "pitch": "medium"
  }
}
```

### state.json
```json
{
  "project_id": "2026-08-09_steve-jobs",
  "status": "in_progress",
  "current_agent": "agent_04_asset_collector",
  "agents": {
    "agent_01_topic_hunter": {"status": "completed", "completed_at": "..."},
    "agent_02_researcher": {"status": "completed", "completed_at": "..."},
    "agent_03_scriptwriter": {"status": "approved", "approved_by": "user", "approved_at": "..."},
    "agent_04_asset_collector": {"status": "in_progress", "started_at": "..."},
    "agent_05_audio_designer": {"status": "pending"},
    "agent_06_editor": {"status": "pending"}
  },
  "retries": 0,
  "errors": []
}
```

---

## Implementation Phases

### Phase 1: Foundation (4 hours)
**Goal:** Topic → Script → Basic voiceover video

| Task | Details |
|------|---------|
| Project setup | Create folder structure, install dependencies (ffmpeg, edge-tts, fluent-ffmpeg, axios, dotenv) |
| Agent 1: Topic Hunter | Accept manual topic, save to Drive |
| Agent 2: Researcher | Use Playwright + Claude API to gather facts |
| Agent 3: Scriptwriter | Claude API generates script with visual prompts |
| Agent 5: Audio (TTS only) | Edge-TTS generates voiceover |
| Agent 6: Editor (MVP) | ffmpeg concatenates audio over black screen with text overlay |
| CLI commands | `npm run create -- --topic "Steve Jobs"` |

**Deliverable:** A video with narration and text, no visuals yet

---

### Phase 2: Visuals (3 hours)
**Goal:** Add images and stock footage

| Task | Details |
|------|---------|
| Agent 4: Asset Collector | Pexels API for stock, Stability AI for custom images |
| Image selection logic | Match visual prompts from script to available assets |
| Agent 6: Editor upgrade | Ken Burns pan/zoom on images, crossfade transitions |
| Asset preview | Generate preview grid for user approval before rendering |

**Deliverable:** A documentary with images and narration, Ken Burns style

---

### Phase 3: Polish (3 hours)
**Goal:** Professional audio and overlays

| Task | Details |
|------|---------|
| Agent 5: Audio upgrade | Background music selection, SFX library, audio mixing |
| Music fallback | Suno API for AI-generated music if no stock match |
| Overlays | Lower thirds, title cards, end cards (generated via ImageMagick or ffmpeg drawtext) |
| Audio mixing | Duck music under voiceover, fade in/out |

**Deliverable:** A polished, YouTube-ready documentary

---

### Phase 4: Scale (4 hours)
**Goal:** Parallel execution, Remotion, analytics

| Task | Details |
|------|---------|
| Parallel agents | Run Agent 4 and Agent 5 simultaneously |
| Remotion integration | React-based video composition for complex VFX |
| Batch processing | Queue multiple topics, process sequentially |
| Analytics (optional) | Track video performance after manual upload |

**Deliverable:** Production-ready system for multiple videos per week

---

## Dependencies

### System Packages (apt)
```bash
sudo apt-get install -y ffmpeg python3-pip imagemagick
```

### Python Packages
```bash
pip3 install edge-tts
```

### Node.js Packages
```json
{
  "dependencies": {
    "playwright": "^1.44.0",
    "fluent-ffmpeg": "^2.1.2",
    "@ffmpeg-installer/ffmpeg": "^1.1.0",
    "axios": "^1.7.0",
    "dotenv": "^16.4.0",
    "uuid": "^10.0.0",
    "pexels": "^1.0.2"
  }
}
```

### Environment Variables (.env)
```env
ANTHROPIC_API_KEY=sk-...
PEXELS_API_KEY=your-pexels-key
STABILITY_API_KEY=your-stability-key  # optional, has free tier
SUNO_API_KEY=your-suno-key             # optional, for AI music
```

---

## CLI Commands

```bash
# Start new documentary
npm run create -- --topic "Aryabhata: The Ancient Mathematician"

# Resume interrupted project
npm run resume -- --project 2026-08-09_steve-jobs

# Re-run specific agent (for revisions)
npm run agent -- --agent scriptwriter --project 2026-08-09_steve-jobs

# Preview assets before render
npm run preview -- --project 2026-08-09_steve-jobs

# Render final video
npm run render -- --project 2026-08-09_steve-jobs
```

---

## User Approval Checkpoints

The pipeline pauses at these points for your review:

1. **After Script (Agent 3):** Read full script, request changes to tone, length, or content
2. **After Asset Collection (Agent 4):** Preview image grid, swap specific images, add manual uploads
3. **After Render (Agent 6):** Watch final video, request edits to pacing, music, or overlays

Revisions loop back to the relevant agent and re-run downstream steps.

---

## Error Handling

| Error Type | Recovery |
|------------|----------|
| API rate limit | Exponential backoff, queue request for retry |
| Asset not found | Use fallback prompt or skip with placeholder |
| TTS failure | Retry with alternative voice |
| ffmpeg render error | Log error, preserve intermediate files, allow manual intervention |
| Drive mount failure | Remount via `bash ~/mount-drive.sh`, resume pipeline |

All errors logged to `state.json` with timestamps.

---

## File Size Estimates

For a 25-minute documentary:

| Asset Type | Count | Size Each | Total |
|------------|-------|-----------|-------|
| Images | ~100 | 500KB - 2MB | ~150MB |
| Video clips | ~20 | 5-20MB | ~200MB |
| Voiceover | ~15 segments | 1-2MB | ~25MB |
| Music | 2-3 tracks | 5-10MB | ~20MB |
| **Final video** | 1 | 500MB - 1GB | ~1GB |
| **Total per project** | | | **~1.5GB** |

With 32GB codespace and Drive offload, you can work on 5-10 projects simultaneously before needing cleanup.

---

## Next Steps

1. ✅ Plan approved by user
2. ⬜ Install system dependencies (ffmpeg, python3-pip)
3. ⬜ Create project folder structure in repo and on Drive
4. ⬜ Add Node.js dependencies to package.json
5. ⬜ Create .env template
6. ⬜ Build Agent 1: Topic Hunter
7. ⬜ Build Agent 2: Researcher
8. ⬜ Build Agent 3: Scriptwriter
9. ⬜ Build Agent 5: Audio Designer (TTS)
10. ⬜ Build Agent 6: Editor (MVP - audio over black)
11. ⬜ Test end-to-end with a real topic
12. ⬜ Phase 2: Add visuals

---

## Success Criteria

**Phase 1 Complete When:**
- User can run `npm run create -- --topic "X"` and get a narrated video
- All intermediate files saved to Drive
- Script approval checkpoint works

**Phase 2 Complete When:**
- Video includes Ken Burns-style image sequences
- Asset preview shows image grid before render

**Phase 3 Complete When:**
- Video has background music and SFX
- Lower thirds and title cards appear
- Final video is YouTube-ready

**Full System Complete When:**
- User produces 1-2 documentaries per week with <30 min manual effort each
- Videos consistently hit 20-30 min duration
- Quality matches "Ken Burns documentary" standard
