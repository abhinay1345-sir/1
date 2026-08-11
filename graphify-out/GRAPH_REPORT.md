# Graph Report - /workspaces/1  (2026-08-10)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 126 nodes · 243 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8986ccab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- drive.js
- 02_researcher.js
- dependencies
- 06_editor.js
- 04_asset_collector.js
- pipeline.js
- scraper.js
- index.js
- validate-json.cjs

## God Nodes (most connected - your core abstractions)
1. `getProjectPath()` - 17 edges
2. `loadState()` - 16 edges
3. `updateAgentStatus()` - 15 edges
4. `run()` - 12 edges
5. `run()` - 11 edges
6. `scripts` - 8 edges
7. `run()` - 7 edges
8. `run()` - 7 edges
9. `saveJson()` - 7 edges
10. `generateScript()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `getProjectPath()`  [EXTRACTED]
  src/agents/02_researcher.js → src/lib/drive.js
- `run()` --calls--> `loadState()`  [EXTRACTED]
  src/agents/02_researcher.js → src/lib/drive.js
- `run()` --calls--> `saveText()`  [EXTRACTED]
  src/agents/02_researcher.js → src/lib/drive.js
- `run()` --calls--> `updateAgentStatus()`  [EXTRACTED]
  src/agents/02_researcher.js → src/lib/drive.js
- `run()` --calls--> `generateScript()`  [EXTRACTED]
  src/agents/03_scriptwriter.js → src/lib/llm.js

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.09
Nodes (22): author, description, engines, node, keywords, license, main, name (+14 more)

### Community 1 - "drive.js"
Cohesion: 0.25
Nodes (15): createSlug(), run(), run(), generateTTS(), getAudioDuration(), mapWithConcurrency(), run(), createProject() (+7 more)

### Community 2 - "02_researcher.js"
Cohesion: 0.20
Nodes (16): run(), scrapeWikipedia(), cacheAsync(), cacheGet(), cacheKey(), cacheSet(), ensureDir(), extractDates() (+8 more)

### Community 3 - "dependencies"
Cohesion: 0.12
Nodes (17): @anthropic-ai/sdk, argparse, axios, dotenv, fluent-ffmpeg, dependencies, @anthropic-ai/sdk, argparse (+9 more)

### Community 4 - "06_editor.js"
Cohesion: 0.35
Nodes (10): collectAudioFiles(), concatenateAudio(), createBlackClip(), createKenBurnsClip(), getAudioDuration(), kenBurnsFilter(), loadAssetManifest(), resolveImagePath() (+2 more)

### Community 5 - "04_asset_collector.js"
Cohesion: 0.38
Nodes (8): buildQuery(), createColorPlaceholder(), createTitleCard(), downloadFile(), generatePollinations(), run(), saveAsset(), searchPexels()

### Community 6 - "pipeline.js"
Cohesion: 0.36
Nodes (8): listProjects(), args, listAllProjects(), main(), parser, resumeProject(), runFullPipeline(), runSpecificAgent()

### Community 7 - "scraper.js"
Cohesion: 0.53
Nodes (5): CACHE_DIR, cacheGet(), cacheKey(), cacheSet(), run()

### Community 8 - "index.js"
Cohesion: 0.40
Nodes (3): DRIVE_MOUNT, homedir, OUTPUT_BASE

## Knowledge Gaps
- **35 isolated node(s):** `fs`, `filePaths`, `homedir`, `DRIVE_MOUNT`, `OUTPUT_BASE` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `updateAgentStatus()` connect `drive.js` to `02_researcher.js`, `06_editor.js`, `04_asset_collector.js`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `getProjectPath()` connect `drive.js` to `02_researcher.js`, `06_editor.js`, `04_asset_collector.js`, `pipeline.js`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `fs`, `filePaths`, `homedir` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._