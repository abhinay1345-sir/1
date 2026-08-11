import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  rmSync,
} from "fs";
import { join, dirname, basename, extname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
let projectDir = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--project" && args[i + 1]) {
    projectDir = args[i + 1];
    i++;
  } else if (args[i].startsWith("--project=")) {
    projectDir = args[i].slice("--project=".length);
  } else if (!args[i].startsWith("-") && !projectDir) {
    projectDir = args[i];
  }
}

if (!projectDir) {
  console.error("Usage: node prepare-project.mjs --project <project-path>");
  process.exit(1);
}

const manifestPath = join(projectDir, "04_assets", "manifest.json");
if (!existsSync(manifestPath)) {
  console.error("Missing manifest:", manifestPath);
  process.exit(1);
}

const scriptPath = join(projectDir, "03_script.json");
if (!existsSync(scriptPath)) {
  console.error("Missing script:", scriptPath);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
const script = JSON.parse(readFileSync(scriptPath, "utf-8"));

const projectId = basename(projectDir);
const runtimeDir = join(__dirname, "..", "public", "runtime", projectId);
const imagesDir = join(runtimeDir, "images");
const audioDir = join(runtimeDir, "audio");

rmSync(runtimeDir, { recursive: true, force: true });
mkdirSync(imagesDir, { recursive: true });
mkdirSync(audioDir, { recursive: true });

const durations = {};
for (const seg of script.segments || []) {
  if (seg.id && typeof seg.actual_duration === "number") {
    durations[seg.id] = seg.actual_duration;
  } else if (seg.id && typeof seg.duration_seconds === "number") {
    durations[seg.id] = seg.duration_seconds;
  }
}

const copyAsset = (sourcePath, destName) => {
  if (!sourcePath || !existsSync(sourcePath)) return null;
  const dest = join(imagesDir, destName);
  copyFileSync(sourcePath, dest);
  return `/runtime/${projectId}/images/${destName}`;
};

const resolveSource = (image) => {
  if (!image) return null;
  const candidates = [image.local_path, image.path, image.file].filter(Boolean);
  for (const c of candidates) {
    if (existsSync(c)) return c;
    const underAssets = join(projectDir, "04_assets", c);
    if (existsSync(underAssets)) return underAssets;
    const underImages = join(projectDir, "04_assets", "images", basename(c));
    if (existsSync(underImages)) return underImages;
  }
  return null;
};

const segments = (manifest.segments || []).map((seg, index) => {
  const images = seg.images || [];
  const heroImg =
    images.find((im) => im.file?.includes("_hero")) || images[0];
  const supportImg =
    images.find((im) => im.file?.includes("_support_01")) ||
    images[1] ||
    heroImg;
  const overlayImg =
    (seg.overlays || []).find((ov) => ov.type === "lower_third") ||
    seg.overlays?.[0];

  const id = seg.id || `segment_${String(index + 1).padStart(2, "0")}`;
  const heroSrc = copyAsset(
    resolveSource(heroImg),
    `${id}_hero${extname(heroImg?.file || heroImg?.path || ".jpg") || ".jpg"}`,
  );
  const supportSrc = copyAsset(
    resolveSource(supportImg),
    `${id}_support${extname(supportImg?.file || supportImg?.path || ".jpg") || ".jpg"}`,
  );
  const overlaySrc = overlayImg
    ? copyAsset(
        resolveSource(overlayImg),
        `${id}_overlay${extname(overlayImg?.file || overlayImg?.path || ".png") || ".png"}`,
      )
    : undefined;

  const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='100%25' height='100%25' fill='%230a0a0f'/%3E%3C/svg%3E";

  return {
    id,
    title: seg.title || `Chapter ${index + 1}`,
    durationSeconds: Math.max(1, durations[id] || 10),
    heroSrc: heroSrc || PLACEHOLDER,
    supportSrc: supportSrc || heroSrc || PLACEHOLDER,
    overlaySrc: overlaySrc || undefined,
  };
});

// Concatenate voiceover WAVs if present, or point to first segment audio
const voiceoverDir = join(projectDir, "05_audio", "voiceover");
let audioFile = undefined;
const wavFiles = [];
if (existsSync(voiceoverDir)) {
  const files = readdirSync(voiceoverDir)
    .filter((f) => f.endsWith(".wav") || f.endsWith(".mp3"))
    .sort();
  for (const f of files) {
    const src = join(voiceoverDir, f);
    const dest = join(audioDir, f);
    copyFileSync(src, dest);
    wavFiles.push(`/runtime/${projectId}/audio/${f}`);
  }
}

// Build a per-segment audio map; Remotion Timeline can use these later
const segmentAudio = {};
for (const f of wavFiles) {
  const name = basename(f);
  const match = name.match(/(segment_\d+)/);
  if (match) segmentAudio[match[1]] = f;
}

// Prefer a mixed full track if it exists
const mixedCandidates = [
  join(projectDir, "05_audio", "mixed.wav"),
  join(projectDir, "05_audio", "final_audio.wav"),
  join(projectDir, "05_audio", "voiceover.wav"),
];
for (const c of mixedCandidates) {
  if (existsSync(c)) {
    const destName = basename(c);
    copyFileSync(c, join(audioDir, destName));
    audioFile = `/runtime/${projectId}/audio/${destName}`;
    break;
  }
}

// Add per-segment audioSrc to segments
const segmentsWithAudio = segments.map((seg) => ({
  ...seg,
  audioSrc: segmentAudio[seg.id],
}));

const normalized = {
  title: manifest.title || script.title || projectId,
  subtitle: script.subtitle || "A cinematic documentary",
  segments: segmentsWithAudio,
  segmentAudio,
  audioFile,
  projectId,
};

const normalizedPath = join(runtimeDir, "normalized.json");
writeFileSync(normalizedPath, JSON.stringify(normalized, null, 2));

// Also write default props for remotion CLI convenience
const propsPath = join(runtimeDir, "props.json");
writeFileSync(
  propsPath,
  JSON.stringify(
    {
      title: normalized.title,
      subtitle: normalized.subtitle,
      segments: normalized.segments,
      audioFile: normalized.audioFile,
    },
    null,
    2,
  ),
);

const totalDuration = segments.reduce((s, seg) => s + seg.durationSeconds, 0);
console.log(`Prepared: ${runtimeDir}`);
console.log(`  title: ${normalized.title}`);
console.log(`  segments: ${segments.length}`);
console.log(`  duration: ${totalDuration.toFixed(1)}s (+ title/end cards)`);
console.log(`  audio: ${audioFile || "none (per-segment: " + Object.keys(segmentAudio).length + ")"}`);
console.log(`  props: ${propsPath}`);
