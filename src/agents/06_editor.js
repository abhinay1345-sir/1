import fs from 'fs';
import { spawn } from 'child_process';
import { loadState, updateAgentStatus, getProjectPath } from '../lib/drive.js';
import config from '../../config/index.js';
import path from 'path';

/**
 * Agent 6: Editor
 *
 * Assembles video from assets using ffmpeg.
 * Phase 2: Ken Burns pan/zoom on images + voiceover
 * Fallback: black background if no images available
 *
 * Input: 03_script.json, 04_assets/, 05_audio/voiceover/*.wav
 * Output: 06_render/final_video.mp4 (+ local copy in /tmp)
 */

const LOCAL_OUTPUT = '/tmp/docfactory_output';
const LOCAL_ASSETS = '/tmp/docfactory_assets';
const LOCAL_AUDIO = '/tmp/docfactory_audio';

function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args);
    let stderr = '';
    proc.stderr.on('data', (data) => { stderr += data.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-800)}`));
    });
    proc.on('error', reject);
  });
}

async function getAudioDuration(audioPath) {
  return new Promise((resolve) => {
    const proc = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      audioPath,
    ]);
    let stdout = '';
    proc.stdout.on('data', (data) => { stdout += data; });
    proc.on('close', () => resolve(parseFloat(stdout.trim()) || 0));
  });
}

async function getImageSize(imagePath) {
  return new Promise((resolve) => {
    const proc = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height',
      '-of', 'csv=p=0',
      imagePath,
    ]);
    let stdout = '';
    proc.stdout.on('data', (data) => { stdout += data; });
    proc.on('close', () => {
      const parts = stdout.trim().split(',');
      resolve({
        width: parseInt(parts[0], 10) || 1920,
        height: parseInt(parts[1], 10) || 1080,
      });
    });
  });
}

/**
 * Concatenate audio files → AAC in /tmp
 */
async function concatenateAudio(audioFiles, outputPath) {
  const listFile = `/tmp/audio_list_${Date.now()}.txt`;
  const content = audioFiles.map((f) => `file '${path.resolve(f)}'`).join('\n');
  fs.writeFileSync(listFile, content);

  await runFFmpeg([
    '-y',
    '-f', 'concat', '-safe', '0', '-i', listFile,
    '-c:a', 'aac', '-b:a', '192k',
    outputPath,
  ]);

  try { fs.unlinkSync(listFile); } catch (_) {}
}

/**
 * Ken Burns effect variants — alternate zoom directions
 */
function kenBurnsFilter(duration, variant = 0, fps = 30) {
  const frames = Math.max(1, Math.round(duration * fps));
  // Scale up then crop/pan — zoom from 1.0 → 1.15 or reverse
  const zooms = [
    // Zoom in, pan right
    `scale=8000:-1,zoompan=z='min(zoom+0.0008,1.15)':x='iw/2-(iw/zoom/2)+on*0.3':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${fps}`,
    // Zoom out, pan left
    `scale=8000:-1,zoompan=z='if(eq(on,1),1.15,max(zoom-0.0008,1.0))':x='iw/2-(iw/zoom/2)-on*0.2':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${fps}`,
    // Zoom in, pan up
    `scale=8000:-1,zoompan=z='min(zoom+0.0007,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)-on*0.25':d=${frames}:s=1920x1080:fps=${fps}`,
    // Slow zoom in center
    `scale=8000:-1,zoompan=z='min(zoom+0.0005,1.1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${fps}`,
  ];
  return zooms[variant % zooms.length];
}

/**
 * Create a Ken Burns clip from a still image
 */
async function createKenBurnsClip(imagePath, duration, outputPath, variant = 0) {
  const fps = config.defaults.videoFps || 30;
  const filter = kenBurnsFilter(duration, variant, fps);

  await runFFmpeg([
    '-y',
    '-loop', '1',
    '-i', imagePath,
    '-vf', filter,
    '-t', String(duration),
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-pix_fmt', 'yuv420p',
    '-an',
    outputPath,
  ]);
}

/**
 * Create black clip of given duration
 */
async function createBlackClip(duration, outputPath) {
  const fps = config.defaults.videoFps || 30;
  await runFFmpeg([
    '-y',
    '-f', 'lavfi',
    '-i', `color=c=black:s=1920x1080:d=${duration}:r=${fps}`,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-pix_fmt', 'yuv420p',
    '-t', String(duration),
    outputPath,
  ]);
}

/**
 * Load asset manifest (local preferred)
 */
function loadAssetManifest(projectPath) {
  const localManifest = path.join(LOCAL_ASSETS, 'manifest.json');
  const driveManifest = path.join(projectPath, '04_assets', 'manifest.json');

  for (const p of [localManifest, driveManifest]) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf-8'));
      } catch (_) {}
    }
  }
  return null;
}

/**
 * Resolve best path for an image (local first)
 */
function resolveImagePath(img, projectPath) {
  const candidates = [
    img.local_path,
    path.join(LOCAL_ASSETS, 'images', img.file),
    img.path,
    path.join(projectPath, '04_assets', 'images', img.file),
  ].filter(Boolean);

  for (const c of candidates) {
    try {
      if (fs.existsSync(c) && fs.statSync(c).size > 500) return c;
    } catch (_) {}
  }
  return null;
}

/**
 * Collect audio files (local mirror preferred)
 */
function collectAudioFiles(projectPath) {
  // Prefer local mirror from Audio Designer
  if (fs.existsSync(path.join(LOCAL_AUDIO, 'manifest.json'))) {
    try {
      const m = JSON.parse(fs.readFileSync(path.join(LOCAL_AUDIO, 'manifest.json'), 'utf-8'));
      const files = (m.audioFiles || []).filter((f) => fs.existsSync(f));
      if (files.length > 0) return files.sort();
    } catch (_) {}
  }

  // Local dir scan
  if (fs.existsSync(LOCAL_AUDIO)) {
    const local = fs.readdirSync(LOCAL_AUDIO)
      .filter((f) => f.endsWith('.wav'))
      .sort()
      .map((f) => path.join(LOCAL_AUDIO, f))
      .filter((f) => {
        try { return fs.statSync(f).size > 1000; } catch { return false; }
      });
    if (local.length > 0) return local;
  }

  // Drive fallback
  const voiceoverDir = path.join(projectPath, '05_audio', 'voiceover');
  if (fs.existsSync(voiceoverDir)) {
    return fs.readdirSync(voiceoverDir)
      .filter((f) => f.endsWith('.wav'))
      .sort()
      .map((f) => path.join(voiceoverDir, f));
  }

  return [];
}

/**
 * Run the Editor agent
 */
export async function run(projectId) {
  console.log(`\n🎬 Agent 6: Editor (Ken Burns)`);

  const state = loadState(projectId);
  const projectPath = getProjectPath(projectId);

  const scriptPath = path.join(projectPath, '03_script.json');
  if (!fs.existsSync(scriptPath)) {
    throw new Error('03_script.json not found. Run Scriptwriter first.');
  }
  const script = JSON.parse(fs.readFileSync(scriptPath, 'utf-8'));

  console.log(`   Title: ${script.title}`);
  console.log(`   Segments: ${script.segments.length}`);

  updateAgentStatus(projectId, 'agent_06_editor', 'in_progress');

  fs.mkdirSync(LOCAL_OUTPUT, { recursive: true });
  const workDir = path.join(LOCAL_OUTPUT, 'clips');
  fs.mkdirSync(workDir, { recursive: true });

  // Audio
  const audioFiles = collectAudioFiles(projectPath);
  if (audioFiles.length === 0) {
    throw new Error('No voiceover files found. Run Audio Designer first.');
  }
  console.log(`   Found ${audioFiles.length} audio segments`);

  console.log(`   🎵 Combining audio segments...`);
  const combinedAudioPath = path.join(LOCAL_OUTPUT, 'combined_audio.aac');
  await concatenateAudio(audioFiles, combinedAudioPath);

  const totalDuration = await getAudioDuration(combinedAudioPath);
  console.log(`   📊 Total duration: ${Math.round(totalDuration)}s (~${(totalDuration / 60).toFixed(1)} min)`);

  // Assets
  const manifest = loadAssetManifest(projectPath);
  const hasAssets = manifest && manifest.segments && manifest.segments.some(
    (s) => s.images && s.images.length > 0
  );

  const segmentClips = [];
  let useKenBurns = false;

  if (hasAssets) {
    console.log(`   🎥 Building Ken Burns clips from assets...`);
    useKenBurns = true;

    // Compute per-segment durations from audio if available
    const segDurations = [];
    for (let i = 0; i < script.segments.length; i++) {
      const segNum = String(i + 1).padStart(2, '0');
      const audioMatch = audioFiles.find((f) => f.includes(`segment_${segNum}`));
      if (audioMatch) {
        segDurations.push(await getAudioDuration(audioMatch));
      } else {
        segDurations.push(script.segments[i].actual_duration || script.segments[i].duration_seconds || 30);
      }
    }

    // Scale durations to match total audio length
    const sumDur = segDurations.reduce((a, b) => a + b, 0) || 1;
    const scale = totalDuration / sumDur;
    for (let i = 0; i < segDurations.length; i++) {
      segDurations[i] = Math.max(2, segDurations[i] * scale);
    }

    for (let i = 0; i < script.segments.length; i++) {
      const seg = script.segments[i];
      const segNum = String(i + 1).padStart(2, '0');
      const duration = segDurations[i] || 10;
      const clipPath = path.join(workDir, `seg_${segNum}.mp4`);

      const segManifest = (manifest.segments || []).find(
        (s) => s.id === seg.id || s.id === `segment_${segNum}` || s.title === seg.title
      ) || manifest.segments[i];

      let imagePath = null;
      if (segManifest && segManifest.images && segManifest.images.length > 0) {
        // Prefer hero, else first
        const hero = segManifest.images.find((im) => im.file.includes('hero')) || segManifest.images[0];
        imagePath = resolveImagePath(hero, projectPath);

        // If multiple images, we could split duration — for now use hero for full segment
      }

      try {
        if (imagePath) {
          console.log(`      🎞️  Segment ${segNum}: Ken Burns (${duration.toFixed(1)}s) ← ${path.basename(imagePath)}`);
          await createKenBurnsClip(imagePath, duration, clipPath, i);
        } else {
          console.log(`      ⬛ Segment ${segNum}: black fallback (${duration.toFixed(1)}s)`);
          await createBlackClip(duration, clipPath);
        }
        segmentClips.push(clipPath);
      } catch (err) {
        console.warn(`      ⚠️ Segment ${segNum} clip failed: ${err.message}`);
        try {
          await createBlackClip(duration, clipPath);
          segmentClips.push(clipPath);
        } catch (e2) {
          console.warn(`      ⚠️ Black clip also failed: ${e2.message}`);
        }
      }
    }
  }

  const tempVideoPath = path.join(LOCAL_OUTPUT, `final_video_${Date.now()}.mp4`);
  const localFinalPath = path.join(LOCAL_OUTPUT, 'final_video.mp4');
  const driveVideoPath = path.join(projectPath, '06_render', 'final_video.mp4');

  if (useKenBurns && segmentClips.length > 0) {
    // Concat video clips then mux audio
    console.log(`   🔗 Concatenating ${segmentClips.length} clips...`);
    const concatList = path.join(LOCAL_OUTPUT, 'video_list.txt');
    fs.writeFileSync(
      concatList,
      segmentClips.map((f) => `file '${path.resolve(f)}'`).join('\n')
    );

    const silentVideo = path.join(LOCAL_OUTPUT, 'silent_video.mp4');
    await runFFmpeg([
      '-y',
      '-f', 'concat', '-safe', '0', '-i', concatList,
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      silentVideo,
    ]);

    console.log(`   🔊 Muxing audio...`);
    await runFFmpeg([
      '-y',
      '-i', silentVideo,
      '-i', combinedAudioPath,
      '-c:v', 'copy',
      '-c:a', 'aac', '-b:a', '192k',
      '-shortest',
      '-movflags', '+faststart',
      tempVideoPath,
    ]);

    try { fs.unlinkSync(concatList); } catch (_) {}
    try { fs.unlinkSync(silentVideo); } catch (_) {}
  } else {
    // MVP fallback: black + audio
    console.log(`   🎥 Creating video (black background + audio)...`);
    await runFFmpeg([
      '-y',
      '-f', 'lavfi', '-i', `color=c=black:s=1920x1080:d=${totalDuration}:r=30`,
      '-i', combinedAudioPath,
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
      '-c:a', 'aac', '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      '-movflags', '+faststart',
      tempVideoPath,
    ]);
  }

  // Keep reliable local copy
  fs.copyFileSync(tempVideoPath, localFinalPath);
  console.log(`   💾 Local copy: ${localFinalPath}`);

  // Try Drive copy
  let videoPath = localFinalPath;
  try {
    fs.mkdirSync(path.dirname(driveVideoPath), { recursive: true });
    fs.copyFileSync(tempVideoPath, driveVideoPath);
    videoPath = driveVideoPath;
    console.log(`   ✅ Rendered to Drive: final_video.mp4`);
  } catch (err) {
    console.warn(`   ⚠️ Drive copy failed (${err.message}) — local copy is valid`);
    videoPath = localFinalPath;
  }

  // Cleanup temp (keep localFinalPath)
  try {
    if (tempVideoPath !== localFinalPath && fs.existsSync(tempVideoPath)) {
      fs.unlinkSync(tempVideoPath);
    }
  } catch (_) {}

  const stats = fs.statSync(localFinalPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`   📦 Size: ${sizeMB} MB`);
  console.log(`   📁 Reliable path: ${localFinalPath}`);

  // Verify with ffprobe
  try {
    const dur = await getAudioDuration(localFinalPath);
    console.log(`   ⏱️  Verified duration: ${Math.round(dur)}s`);
  } catch (_) {}

  updateAgentStatus(projectId, 'agent_06_editor', 'completed', {
    output_file: videoPath,
    local_file: localFinalPath,
    duration_seconds: Math.round(totalDuration),
    file_size_mb: sizeMB,
    ken_burns: useKenBurns,
    completed_at: new Date().toISOString(),
  });

  return { videoPath, localPath: localFinalPath };
}

export default { run };
