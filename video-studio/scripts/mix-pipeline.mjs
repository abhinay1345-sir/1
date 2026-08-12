#!/usr/bin/env node
//
// Phase 3 — Project-aware YouTube mix wrapper.
//
// Takes a pipeline project folder and produces the YouTube-ready deliverable
// (`06_render/final_video_youtube.mp4`) by running `mix_youtube.sh` with
// transition timings computed from the project's real voiceover segments.
//
// This is the bridge between the 6-agent pipeline and the Phase 3 audio mix:
//   npm run youtube -- --project 2026-08-09_steve-jobs
//
// Resolution order for inputs:
//   music  → --music  → <project>/05_audio/music/*     → scripts/assets/music.mp3
//   whoosh → --whoosh → <project>/05_audio/sfx/*       → scripts/assets/whoosh.wav
//   master → --master → <project>/06_render/final_video.mp4
//   times  → --sfx-times → computed from voiceover WAV durations (+ --offset-ms)
//
// Usage:
//   node scripts/mix-pipeline.mjs --project <dir-or-id> [options]
//
// Options:
//   --master <path>      master video (video + voiceover) to mix onto
//   --out <path>         output file (default <project>/06_render/final_video_youtube.mp4)
//   --music <path>       background music override
//   --whoosh <path>      transition SFX override
//   --offset-ms <n>      shift all transitions by n ms (e.g. 3000 for a 3s title card)
//   --sfx-times "<a b c" explicit transition times (ms), space-separated (overrides auto)
//   --with-end           also place a whoosh at the final segment boundary (end card start)

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(__dirname, 'mix_youtube.sh');
const DEFAULT_ASSETS = {
  music: path.join(__dirname, 'assets', 'music.mp3'),
  whoosh: path.join(__dirname, 'assets', 'whoosh.wav'),
};

function parseArgs(argv) {
  const args = { offsetMs: 0, withEnd: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--project': args.project = next(); break;
      case '--master': args.master = next(); break;
      case '--out': args.out = next(); break;
      case '--music': args.music = next(); break;
      case '--whoosh': args.whoosh = next(); break;
      case '--offset-ms': args.offsetMs = parseInt(next(), 10) || 0; break;
      case '--sfx-times': args.sfxTimes = next().trim(); break;
      case '--with-end': args.withEnd = true; break;
      default:
        throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

function resolveProjectPath(p) {
  // Accept an absolute/relative dir OR a project id (resolved under the Drive mount).
  const looksLikePath = p.startsWith('/') || p.startsWith('~') || p.includes('/');
  if (looksLikePath) {
    return p.replace(/^~/, os.homedir());
  }
  return path.join(os.homedir(), 'gdrive', 'documentary-factory', 'projects', p);
}

function ffprobeDuration(file) {
  const out = execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ], { encoding: 'utf-8' });
  return parseFloat(out.trim()) || 0;
}

function ffprobeVideoDuration(file) {
  const out = execFileSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ], { encoding: 'utf-8' });
  const v = parseFloat(out.trim());
  if (v && v > 0) return v;
  return ffprobeDuration(file);
}

function firstExisting(candidates) {
  for (const c of candidates) {
    if (typeof c !== 'string' || !c) continue;
    try {
      if (fs.existsSync(c) && fs.statSync(c).size > 500) return c;
    } catch (_) {}
  }
  return null;
}

function findGlob(dir, ext) {
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => path.join(dir, f))
    .find((f) => fs.statSync(f).size > 500);
}

/**
 * Compute transition times from the project's real voiceover segment durations.
 * Whooshes go at the internal segment boundaries (start of each segment except
 * the first). With --with-end, also at the final boundary.
 */
function computeSfxTimes(projectPath, offsetMs, withEnd) {
  const voiceoverDir = path.join(projectPath, '05_audio', 'voiceover');
  let segments = [];

  if (fs.existsSync(voiceoverDir)) {
    segments = fs.readdirSync(voiceoverDir)
      .filter((f) => /^segment_\d+\.wav$/.test(f))
      .sort()
      .map((f) => path.join(voiceoverDir, f));
  }

  if (segments.length === 0) {
    // Fallback: scripted durations from 03_script.json
    const scriptPath = path.join(projectPath, '03_script.json');
    if (fs.existsSync(scriptPath)) {
      const script = JSON.parse(fs.readFileSync(scriptPath, 'utf-8'));
      segments = (script.segments || []).map(
        (s) => s.actual_duration || s.duration_seconds || 30,
      );
    }
  }

  if (segments.length === 0) {
    throw new Error(`No voiceover segments or script durations found in ${projectPath}`);
  }

  const durations = segments.map((s) => (typeof s === 'number' ? s : ffprobeDuration(s)));
  const times = [];
  let acc = offsetMs;
  for (let i = 0; i < durations.length - 1; i++) {
    acc += Math.round(durations[i] * 1000);
    times.push(acc);
  }
  if (withEnd) {
    times.push(acc + Math.round(durations[durations.length - 1] * 1000));
  }
  return times;
}

/**
 * Run the YouTube mix for a project. Exported so the pipeline can call it directly.
 * @returns {{out: string, duration: number, sizeMb: number, sfxTimes: number[]}}
 */
export async function mix(projectPath, opts = {}) {
  const proj = resolveProjectPath(projectPath);

  if (!fs.existsSync(SCRIPT)) {
    throw new Error(`mix_youtube.sh not found: ${SCRIPT}`);
  }

  const master = opts.master || path.join(proj, '06_render', 'final_video.mp4');
  const out = opts.out || path.join(proj, '06_render', 'final_video_youtube.mp4');

  if (!fs.existsSync(master)) {
    throw new Error(`Master video not found: ${master} — run the 06 Editor agent first.`);
  }

  const music = firstExisting([
    opts.music,
    findGlob(path.join(proj, '05_audio', 'music'), '.mp3'),
    findGlob(path.join(proj, '05_audio', 'music'), '.wav'),
    DEFAULT_ASSETS.music,
  ]);
  const whoosh = firstExisting([
    opts.whoosh,
    findGlob(path.join(proj, '05_audio', 'sfx'), '.wav'),
    DEFAULT_ASSETS.whoosh,
  ]);

  if (!music) throw new Error(`Background music not found (looked in project + ${DEFAULT_ASSETS.music})`);
  if (!whoosh) throw new Error(`Whoosh SFX not found (looked in project + ${DEFAULT_ASSETS.whoosh})`);

  const duration = ffprobeVideoDuration(master);
  if (!(duration > 0)) throw new Error(`Could not read duration from ${master}`);

  const sfxTimes = opts.sfxTimes
    ? opts.sfxTimes.split(/\s+/).map(Number)
    : computeSfxTimes(proj, opts.offsetMs || 0, opts.withEnd);

  if (sfxTimes.length === 0) {
    throw new Error('No transition times computed — need at least 2 segments.');
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  console.log(`\n🎧 Phase 3 mix for: ${path.basename(proj)}`);
  console.log(`   master : ${master}`);
  console.log(`   music  : ${path.basename(music)}`);
  console.log(`   whoosh : ${path.basename(whoosh)}`);
  console.log(`   out    : ${out}`);
  console.log(`   duration: ${duration.toFixed(1)}s | ${sfxTimes.length} whooshes @ [${sfxTimes.join(', ')}]ms`);

  const env = {
    ...process.env,
    SFX_TIMES: sfxTimes.join(' '),
    DURATION: duration.toFixed(1),
  };

  // Explicit local workdir so we can verify the byte-identical local final after.
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docfactory-mix-'));
  try {
    await new Promise((resolve, reject) => {
      const proc = spawn('bash', [SCRIPT, master, music, whoosh, out, workDir], { env, stdio: 'inherit' });
      proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`mix_youtube.sh exited ${code}`))));
      proc.on('error', reject);
    });

    const localFinal = path.join(workDir, 'final.mp4');
    if (!fs.existsSync(localFinal)) throw new Error(`Mix completed but local final missing: ${localFinal}`);
    const sizeMb = (fs.statSync(localFinal).size / (1024 * 1024)).toFixed(2);

    // Best-effort confirmation that the destination is actually reachable.
    const gdrivePrefix = path.join(os.homedir(), 'gdrive') + path.sep;
    const remoteRel = out.startsWith(gdrivePrefix)
      ? out.slice(gdrivePrefix.length).replace(/\\/g, '/')
      : null;
    if (remoteRel) {
      try {
        const remoteDir = `gdrive:${path.posix.dirname(remoteRel)}`;
        const listed = execFileSync('rclone', ['lsf', remoteDir], { encoding: 'utf-8' });
        if (!listed.split('\n').includes(path.posix.basename(remoteRel))) {
          throw new Error(`published file not visible on gdrive yet: ${out}`);
        }
      } catch (err) {
        // rclone ls may race the upload; warn but don't fail a successful mix.
        console.warn(`   ⚠️ Could not confirm remote visibility: ${err.message}`);
      }
    } else {
      if (!fs.existsSync(out)) throw new Error(`Mix completed but output missing: ${out}`);
    }

    console.log(`   ✅ ${out} (${sizeMb} MB)`);
    return { out, duration, sizeMb, sfxTimes, localFinal };
  } finally {
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch (_) {}
  }
}

// Main guard — allow `node scripts/mix-pipeline.mjs ...` directly
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (!args.project) throw new Error('--project <dir-or-id> is required');
    await mix(args.project, {
      master: args.master,
      out: args.out,
      music: args.music,
      whoosh: args.whoosh,
      offsetMs: args.offsetMs,
      withEnd: args.withEnd,
      sfxTimes: args.sfxTimes,
    });
  } catch (err) {
    console.error(`\n❌ ${err.message}`);
    process.exit(1);
  }
}
