# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An automated documentary video creation pipeline ("documentary-factory"). A Node.js pipeline (`src/pipeline.js`) orchestrates six AI agents to go from a topic to a finished Ken Burns–style video, saving all project files to Google Drive (via rclone mount) with local `/tmp` mirrors for reliability.

The repo also contains a standalone Playwright web scraper (`scraper.js`) used for research.

## Pipeline Agents

Each agent reads `NN_*.json`/`*.md` from the project dir and writes its output, updating `state.json`:

| # | Agent | Input → Output |
|---|-------|----------------|
| 01 | Topic Hunter | topic → `01_topic.json` |
| 02 | Researcher | `01_topic.json` → `02_research.md` (scrapes Wikipedia + Claude summary) |
| 03 | Scriptwriter | `02_research.md` → `03_script.json` (segments with narration + visual prompts) |
| 04 | Asset Collector | `03_script.json` → `04_assets/` (Pexels/Pollinations images, ffmpeg title cards) |
| 05 | Audio Designer | `03_script.json` → `05_audio/voiceover/*.wav` (edge-tts) |
| 06 | Editor | assets + audio → `06_render/final_video.mp4` (Ken Burns via ffmpeg) |

## Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers (required after npm install)
npm run install-browsers

# Create a new documentary
npm run create -- --topic "Steve Jobs" [--category biography] [--duration 25]
#   Use --skip-checkpoint to skip the script/asset review pauses

# Resume an interrupted project
npm run resume -- --project 2026-08-09_steve-jobs

# Run a single agent
npm run agent -- --project 2026-08-09_steve-jobs --agent 05

# List projects
npm run list

# Standalone Playwright scraper (caches results to /tmp/docfactory_cache)
npm run scrape -- https://example.com "body"
#   PW_HEADLESS=0 → visible browser; DOCFACTORY_NO_CACHE=1 → bypass cache
```

## Optimizations (implemented)

- **Disk cache** (`src/lib/cache.js`): Wikipedia scrapes and standalone scraper results are cached under `/tmp/docfactory_cache` with TTL, so repeat research runs skip browser launch (~50x faster).
- **TTS concurrency**: `05_audio_designer.js` generates voice-over segments in parallel (`config.defaults.audioConcurrency`, default 3) while preserving segment order.
- **JSON validation hook** (`.claude/hooks/validate-json.cjs`): a `PostToolUse` hook validates any `.json` written by Claude, blocking writes that would corrupt a pipeline stage.
- **Permission allowlist** (`.claude/settings.json`): pipeline runs, rclone listings, and mount checks are pre-approved.

## Exit codes (scraper.js)

- 0: Success
- 1: Error during scrape
- 2: Selector not found on page
