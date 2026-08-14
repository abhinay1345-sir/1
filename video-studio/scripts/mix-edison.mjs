#!/usr/bin/env node
//
// Edison documentary — Phase 7: YouTube loudness mix (-14 LUFS)
//
// The Remotion master render (`output/edison.mp4`) already composites all
// separate audio layers — narration (8 voiceover WAVs), music (background.mp3
// at 0.16), and chapter-boundary whoosh SFX (at 0.35) — as distinct, swappable
// <Audio> elements in the composition. The render bakes them into one A/V
// stream. This step therefore does NOT re-add music or SFX (that would double
// them). It only normalizes the already-mixed audio to YouTube loudness
// (-14 LUFS, linear two-pass loudnorm) and re-encodes as AAC 48kHz stereo,
// COPYING the video stream (no generational loss).
//
// The modularity / "swappable layers" guarantee is preserved at the source
// level: change any narration WAV / music track / SFX file in public/edison
// and re-render; this mix step then re-normalizes whatever the new mix is.
//
// Usage:
//   node scripts/mix-edison.mjs [--master output/edison.mp4] [--out output/edison_youtube.mp4]

import fs from 'fs';
import path from 'path';
import { execFileSync, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_MASTER = path.join(ROOT, 'output', 'edison.mp4');
const DEFAULT_OUT = path.join(ROOT, 'output', 'edison_youtube.mp4');

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const MASTER = arg('--master', DEFAULT_MASTER);
const OUT = arg('--out', DEFAULT_OUT);
const WORK = fs.mkdtempSync(path.join('/tmp', 'edison-mix-'));

function probe(file) {
  return execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration',
    '-show_entries', 'stream=codec_type,codec_name,channels,sample_rate',
    '-of', 'default=noprint_wrappers=1', file,
  ], { encoding: 'utf-8' });
}

function main() {
  console.log('\n🎧 Edison Phase 7 — YouTube loudness mix (-14 LUFS)');
  console.log(`   master : ${MASTER}`);
  console.log(`   out    : ${OUT}`);
  console.log(`   work   : ${WORK}`);

  if (!fs.existsSync(MASTER)) throw new Error(`Master not found: ${MASTER}`);
  console.log('\n▶ Master probe:');
  console.log(probe(MASTER));

  // Pass 1: measure loudness
  console.log('▶ Pass 1 — measuring loudness...');
  const measureResult = spawnSync('ffmpeg', [
    '-i', MASTER,
    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json',
    '-f', 'null', '-',
  ], { encoding: 'utf-8' });
  // loudnorm JSON output goes to stderr
  const measureOut = measureResult.stderr || measureResult.stdout || '';

  const I_I = measureOut.match(/"input_i"\s*:\s*"([^"]+)"/)?.[1];
  const I_TP = measureOut.match(/"input_tp"\s*:\s*"([^"]+)"/)?.[1];
  const I_LRA = measureOut.match(/"input_lra"\s*:\s*"([^"]+)"/)?.[1];
  const I_TH = measureOut.match(/"input_thresh"\s*:\s*"([^"]+)"/)?.[1];

  if (!I_I || !I_TP || !I_LRA || !I_TH) {
    throw new Error('Could not parse loudness measurement:\n' + measureOut);
  }
  const O_I = measureOut.match(/"target_offset"\s*:\s*"([^"]+)"/)?.[1] || '0';
  console.log(`   measured: I=${I_I} TP=${I_TP} LRA=${I_LRA} thresh=${I_TH} offset=${O_I}`);

  // Pass 2: linear loudnorm + AAC 48k, copy video
  console.log('▶ Pass 2 — linear loudnorm (-14 LUFS) + AAC 48k (copying video)...');
  execFileSync('ffmpeg', [
    '-y', '-i', MASTER,
    '-map', '0:v', '-map', '0:a', '-c:v', 'copy',
    '-af', `loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I=${I_I}:measured_TP=${I_TP}:measured_LRA=${I_LRA}:measured_thresh=${I_TH}:offset=${O_I}`,
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart',
    path.join(WORK, 'final.mp4'),
  ], { stdio: 'inherit' });

  fs.copyFileSync(path.join(WORK, 'final.mp4'), OUT);
  const sizeMb = (fs.statSync(OUT).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ ${OUT} (${sizeMb} MB)`);

  console.log('\n▶ Output verification:');
  console.log(probe(OUT));

  fs.rmSync(WORK, { recursive: true, force: true });
}

try {
  main();
} catch (err) {
  console.error(`\n❌ ${err.message}`);
  try { fs.rmSync(WORK, { recursive: true, force: true }); } catch (_) {}
  process.exit(1);
}