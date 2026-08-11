# Phase 2 Remotion Visuals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Remotion visual studio that renders the existing documentary asset manifest with two-image Ken Burns segments, title/lower-third/end-card overlays, and reliable preview/render commands while leaving the FFmpeg production pipeline unchanged.

**Architecture:** The `video-studio` package is an isolated Remotion renderer. Its root composition loads a documentary project manifest through typed props, maps each segment to a reusable scene, and uses Remotion `Sequence`, `Img`, `Audio`, `spring`, and `interpolate` primitives for motion and timing. A small project adapter copies or references an existing Drive project into a renderer-safe local data directory; no changes are made to `src/agents/06_editor.js` in Phase 2.

**Tech Stack:** Remotion 4, React 19, TypeScript, Node.js 24, FFmpeg-generated JPG/PNG/WAV assets from the existing documentary pipeline.

## Global Constraints

- Keep the existing FFmpeg editor and root documentary pipeline behavior unchanged.
- Use the existing two-image asset contract: a `hero` image and a `support_01` image per segment when available.
- Prefer local files and only use Drive paths as fallback inputs.
- Preserve 1920x1080 output at 30 fps.
- Do not embed secrets or hard-code a user-specific project path into source files.
- A missing support image must fall back to the hero image; a missing image must render a dark placeholder instead of crashing.
- All preview and render commands must be reproducible from `/workspaces/1/video-studio`.

---

### Task 1: Establish a valid Remotion project entrypoint

**Files:**
- Modify: `video-studio/src/index.ts`
- Modify: `video-studio/src/MyVideo.tsx`
- Create: `video-studio/tsconfig.json`
- Create: `video-studio/remotion.config.ts`
- Modify: `video-studio/package.json`
- Create: `video-studio/.gitignore`

**Interfaces:**
- Produces a Remotion root registered by `src/index.ts` with composition ID `main-video`.
- `main-video` accepts `DocumentaryProps` with `projectTitle`, `segments`, and optional `audioFile`.

- [ ] **Step 1: Add project configuration**

Create `tsconfig.json` with ES module output, React JSX, strict checking, DOM libraries, and `noEmit: true`. Create `remotion.config.ts` that imports `Config` from `remotion` and sets the output codec to H.264, 30 fps, 1920x1080 dimensions, and `forbidConcurrency` only if required by the installed Remotion version. Add `node_modules/`, `output/`, `dist/`, and local data directories to `.gitignore`.

- [ ] **Step 2: Define the root composition contract**

Replace the current nested-composition implementation with a single valid root that calls `registerRoot` and renders `Composition id="main-video"`. Define exported TypeScript types for segment data and props. Keep the default demo composition usable when no project data is supplied.

- [ ] **Step 3: Verify the entrypoint**

Run:

```bash
cd /workspaces/1/video-studio
npm run check
```

Expected: Remotion discovers `main-video` without TypeScript or composition-registration errors.

- [ ] **Step 4: Commit**

```bash
git add video-studio/src/index.ts video-studio/src/MyVideo.tsx video-studio/tsconfig.json video-studio/remotion.config.ts video-studio/package.json video-studio/.gitignore
git commit -m "feat(video-studio): establish Remotion composition entrypoint"
```

---

### Task 2: Add the documentary manifest adapter

**Files:**
- Create: `video-studio/src/data/documentary.ts`
- Create: `video-studio/src/data/documentary.test.ts`
- Create: `video-studio/data/.gitkeep`
- Modify: `video-studio/package.json`

**Interfaces:**
- `loadDocumentaryManifest(manifestPath: string): DocumentaryProject` reads an asset manifest and normalizes segment paths.
- `DocumentaryProject` contains `title`, `segments`, and optional `audioFile`.
- Each normalized segment contains `id`, `title`, `durationSeconds`, `heroSrc`, `supportSrc`, and `overlaySrc`.

- [ ] **Step 1: Write normalization tests**

Add tests covering:

```ts
it("selects hero and support images from a manifest", () => {
  const result = normalizeManifest(sampleManifest, "/workspace/project");
  expect(result.segments[0].heroSrc).toContain("segment_01_hero.jpg");
  expect(result.segments[0].supportSrc).toContain("segment_01_support_01.jpg");
});

it("falls back to hero when support image is missing", () => {
  const result = normalizeManifest(manifestWithoutSupport, "/workspace/project");
  expect(result.segments[0].supportSrc).toBe(result.segments[0].heroSrc);
});

it("uses a deterministic duration fallback", () => {
  const result = normalizeManifest(manifestWithoutDuration, "/workspace/project");
  expect(result.segments[0].durationSeconds).toBe(10);
});
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run:

```bash
npm test -- --runInBand video-studio/src/data/documentary.test.ts
```

Expected: FAIL because the adapter and normalization functions do not exist yet.

- [ ] **Step 3: Implement the adapter**

Parse the existing `04_assets/manifest.json` shape, select the `hero` image first, select `support_01` second, normalize `local_path` before Drive `path`, and generate a placeholder source when no image exists. Convert segment duration fields to positive seconds and default missing values to 10 seconds. Resolve relative file paths from the manifest directory without reading environment variables in the renderer component.

- [ ] **Step 4: Add a manifest-loading command path**

Add a `--project`/`VIDEO_STUDIO_PROJECT` input mechanism to the render scripts so the project path is supplied at runtime. Do not commit a real documentary asset into `video-studio/data/`.

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- --runInBand video-studio/src/data/documentary.test.ts
```

Expected: PASS for selection, fallback, and duration normalization.

- [ ] **Step 6: Commit**

```bash
git add video-studio/src/data video-studio/package.json video-studio/data/.gitkeep
git commit -m "feat(video-studio): normalize documentary asset manifests"
```

---

### Task 3: Implement reusable cinematic scenes

**Files:**
- Create: `video-studio/src/scenes/DocumentarySegment.tsx`
- Modify: `video-studio/src/scenes/TitleScene.tsx`
- Create: `video-studio/src/scenes/EndCardScene.tsx`
- Create: `video-studio/src/scenes/sceneStyles.ts`

**Interfaces:**
- `DocumentarySegment` accepts a normalized segment and renders hero/support imagery, narration timing metadata, and lower-third overlay.
- `TitleScene` accepts `title` and `subtitle`.
- `EndCardScene` accepts `title` and optional call-to-action.

- [ ] **Step 1: Add scene behavior tests**

Test pure helpers for frame ranges and Ken Burns transforms:

```ts
it("maps the first half of a segment to the hero image", () => {
  expect(imageForFrame(0, 300, "hero", "support")).toBe("hero");
  expect(imageForFrame(200, 300, "hero", "support")).toBe("support");
});

it("clamps scale interpolation to the segment bounds", () => {
  expect(kenBurnsScale(-1, 300)).toBeGreaterThanOrEqual(1);
  expect(kenBurnsScale(300, 300)).toBeLessThanOrEqual(1.16);
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run the focused scene test command. Expected: FAIL because the helpers do not exist.

- [ ] **Step 3: Implement Ken Burns segment motion**

Use `useCurrentFrame()` and `useVideoConfig()` to compute local frames. Display the hero image during the first half and the support image during the second half with a short crossfade around the midpoint. Apply a slow scale from 1.0 to approximately 1.12–1.16 and a directional translate based on the segment index. Add a dark gradient for text legibility. Render the segment title as a lower third near the bottom safe area and use a missing-image placeholder without throwing.

- [ ] **Step 4: Implement title and end-card scenes**

Keep the existing cinematic dark palette and cyan/purple accent treatment. Use deterministic frame-based opacity and translate values; do not rely on CSS keyframes because Remotion must render the same result frame-by-frame. The end card must fade to black over its last 20 frames.

- [ ] **Step 5: Run focused tests**

Run the scene test command and `npm run check`. Expected: PASS with no invalid Remotion hooks or JSX errors.

- [ ] **Step 6: Commit**

```bash
git add video-studio/src/scenes
git commit -m "feat(video-studio): add cinematic documentary scenes"
```

---

### Task 4: Compose segments, overlays, and audio

**Files:**
- Modify: `video-studio/src/MyVideo.tsx`
- Create: `video-studio/src/components/Timeline.tsx`
- Modify: `video-studio/src/player.tsx`

**Interfaces:**
- `Timeline` converts normalized segments into Remotion `Sequence` blocks.
- The root composition renders title → segment sequences → end card with no gaps or overlaps.

- [ ] **Step 1: Write timeline tests**

Add a pure timeline test:

```ts
it("creates contiguous frame ranges", () => {
  const ranges = buildTimeline([
    { durationSeconds: 4 },
    { durationSeconds: 6 },
  ], 30);
  expect(ranges).toEqual([
    { from: 0, durationInFrames: 120 },
    { from: 120, durationInFrames: 180 },
  ]);
});
```

- [ ] **Step 2: Implement timeline mapping**

Convert seconds to integer frames with `Math.max(1, Math.round(seconds * fps))`. Place title and end-card frames outside the segment ranges. Ensure total duration is derived from the normalized segments, not a hard-coded 420 frames.

- [ ] **Step 3: Wire overlays and optional audio**

Render each segment’s overlay if its path exists. Add a single optional voiceover `Audio` layer when `audioFile` is provided. Keep the audio layer non-blocking if absent. Do not add music or SFX in Phase2; those remain Phase3.

- [ ] **Step 4: Update the Player**

Make the Player use the same root composition props and set width/height styles so it is centered, responsive, and usable from the browser preview. Keep the timeline visible.

- [ ] **Step 5: Run checks**

Run:

```bash
npm run check
npm run still -- --project /home/codespace/gdrive/documentary-factory/projects/2026-08-09_steve-jobs
```

Expected: Remotion discovers the composition and writes a PNG still without crashing.

- [ ] **Step 6: Commit**

```bash
git add video-studio/src/MyVideo.tsx video-studio/src/components/Timeline.tsx video-studio/src/player.tsx

git commit -m "feat(video-studio): compose documentary timeline"
```

---

### Task 5: Add preview and render commands

**Files:**
- Modify: `video-studio/package.json`
- Create: `video-studio/scripts/prepare-project.mjs`
- Create: `video-studio/scripts/render-project.mjs`
- Modify: `video-studio/README.md`

**Interfaces:**
- `prepare-project.mjs` accepts a project directory and writes a normalized renderer data file under an ignored directory.
- `render-project.mjs` accepts a project directory and output path, prepares data, then invokes Remotion’s renderer.

- [ ] **Step 1: Add the project preparation script**

Validate that `<project>/03_script.json` and `<project>/04_assets/manifest.json` exist. Copy only the required asset files into `video-studio/.runtime/<project-id>/` or emit a normalized JSON file containing absolute local paths. Fail with a clear message naming the missing input file. Never copy `.env` or unrelated project files.

- [ ] **Step 2: Add render scripts**

Add scripts:

```json
{
  "studio": "remotion studio src/index.ts",
  "preview": "node scripts/render-project.mjs --project ... --output output/phase2-preview.mp4 --scale 0.5",
  "render": "node scripts/render-project.mjs --project ... --output output/phase2-final.mp4",
  "still": "node scripts/render-project.mjs --project ... --output output/phase2-still.png --still --frame 30"
}
```

Use Remotion’s current programmatic bundling/renderer APIs or the installed CLI, whichever is supported by `npm run check`; preserve argument quoting for paths with spaces.

- [ ] **Step 3: Document commands and inputs**

Document:

```bash
cd /workspaces/1/video-studio
npm run studio
npm run preview -- --project /home/codespace/gdrive/documentary-factory/projects/2026-08-09_steve-jobs
npm run render -- --project /home/codespace/gdrive/documentary-factory/projects/2026-08-09_steve-jobs
```

Explain that Phase2 is a standalone Remotion preview/render path and the existing root `npm run render` remains FFmpeg-backed until the integration phase.

- [ ] **Step 4: Verify output**

Run the preview command for the Steve Jobs project. Verify with `ffprobe` that the output is readable, 1920x1080, 30 fps, and contains a nonzero duration. Verify a still image is produced at a segment frame.

- [ ] **Step 5: Commit**

```bash
git add video-studio/package.json video-studio/scripts video-studio/README.md
git commit -m "feat(video-studio): add documentary preview and render commands"
```

---

### Task 6: Phase2 verification and handoff

**Files:**
- Modify: `PLAN.md`
- Modify: `CLAUDE.md`
- Create: `video-studio/README.md` if not created in Task 5

- [ ] **Step 1: Run automated checks**

Run from `video-studio`:

```bash
npm run check
npm test -- --runInBand
```

Expected: all adapter, scene-helper, and timeline tests pass.

- [ ] **Step 2: Run the real project preview**

Render the Steve Jobs project preview and still. Confirm the output files exist and inspect duration and dimensions with `ffprobe`.

- [ ] **Step 3: Confirm the legacy pipeline remains unchanged**

Run `git diff -- src/agents/06_editor.js src/pipeline.js`. Expected: no Phase2 Remotion changes in those files.

- [ ] **Step 4: Update project documentation**

Mark Phase2 as implemented only for the standalone Remotion visual studio, record the exact commands, and explicitly leave Phase3 audio polish and production-editor integration as pending.

- [ ] **Step 5: Commit**

```bash
git add PLAN.md CLAUDE.md video-studio/README.md
git commit -m "docs: mark standalone Remotion visuals phase complete"
```

---

## Verification Checklist

- [ ] `npm run check` passes in `video-studio`.
- [ ] Adapter tests pass for hero/support selection and fallbacks.
- [ ] Timeline tests prove contiguous frame ranges.
- [ ] A Steve Jobs still renders successfully.
- [ ] A Steve Jobs preview MP4 renders successfully.
- [ ] `ffprobe` reports 1920x1080 output at 30 fps with nonzero duration.
- [ ] Existing FFmpeg editor files are unchanged.
- [ ] Phase2 documentation distinguishes standalone Remotion preview from the future production integration.
