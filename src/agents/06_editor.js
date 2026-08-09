import fs from 'fs';
import { spawn } from 'child_process';
import { loadState, updateAgentStatus, getProjectPath } from '../lib/drive.js';
import config from '../../config/index.js';
import path from 'path';

/**
 * Agent 6: Editor (Claude Code)
 *
 * Assembles video from assets using ffmpeg.
 * Phase 1 MVP: Audio over black background with text overlays
 *
 * Input: 03_script.json, 05_audio/voiceover/*.wav
 * Output: 06_render/final_video.mp4
 */

/**
 * Run ffmpeg command
 * @param {string[]} args
 * @returns {Promise<void>}
 */
function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args);
    let stderr = '';

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
      }
    });

    proc.on('error', reject);
  });
}

/**
 * Get audio duration
 * @param {string} audioPath
 * @returns {Promise<number>}
 */
async function getAudioDuration(audioPath) {
  return new Promise((resolve) => {
    const proc = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      audioPath
    ]);

    let stdout = '';
    proc.stdout.on('data', (data) => stdout += data);
    proc.on('close', () => {
      resolve(parseFloat(stdout.trim()) || 0);
    });
  });
}

/**
 * Create text overlay video for a segment
 * @param {string} text
 * @param {number} duration
 * @param {string} outputPath
 */
async function createTextVideo(text, duration, outputPath) {
  // Escape special characters for ffmpeg drawtext
  const escapedText = text
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .substring(0, 100); // Limit text length

  const args = [
    '-f', 'lavfi', '-i', `color=c=black:s=1920x1080:d=${duration}`,
    '-vf',
    `drawtext=text='${escapedText}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2`,
    '-c:v', 'libx264', '-preset', 'fast',
    '-t', String(duration),
    outputPath
  ];

  await runFFmpeg(args);
}

/**
 * Concatenate audio files
 * @param {string[]} audioFiles
 * @param {string} outputPath
 */
async function concatenateAudio(audioFiles, outputPath) {
  const listFile = '/tmp/audio_list.txt';
  const content = audioFiles.map(f => `file '${f}'`).join('\n');
  fs.writeFileSync(listFile, content);

  await runFFmpeg([
    '-f', 'concat', '-safe', '0', '-i', listFile,
    '-c:a', 'aac', '-b:a', '192k',
    outputPath
  ]);

  fs.unlinkSync(listFile);
}

/**
 * Run the Editor agent (MVP version - audio with text)
 * @param {string} projectId
 * @returns {Promise<{videoPath: string}>}
 */
export async function run(projectId) {
  console.log(`\n🎬 Agent 6: Editor (MVP)`);

  const state = loadState(projectId);
  const projectPath = getProjectPath(projectId);

  // Load script
  const scriptPath = `${projectPath}/03_script.json`;
  if (!fs.existsSync(scriptPath)) {
    throw new Error('03_script.json not found. Run Scriptwriter first.');
  }
  const script = JSON.parse(fs.readFileSync(scriptPath, 'utf-8'));

  console.log(`   Title: ${script.title}`);
  console.log(`   Segments: ${script.segments.length}`);

  updateAgentStatus(projectId, 'agent_06_editor', 'in_progress');

  // Find all voiceover files
  const voiceoverDir = `${projectPath}/05_audio/voiceover`;
  const audioFiles = fs.readdirSync(voiceoverDir)
    .filter(f => f.endsWith('.wav'))
    .sort()
    .map(f => `${voiceoverDir}/${f}`);

  if (audioFiles.length === 0) {
    throw new Error('No voiceover files found. Run Audio Designer first.');
  }

  console.log(`   Found ${audioFiles.length} audio segments`);

  // Concatenate all audio
  console.log(`   🎵 Combining audio segments...`);
  const combinedAudioPath = '/tmp/combined_audio.aac';
  await concatenateAudio(audioFiles, combinedAudioPath);

  const totalDuration = await getAudioDuration(combinedAudioPath);
  console.log(`   📊 Total duration: ${Math.round(totalDuration)}s (~${Math.round(totalDuration / 60)} min)`);

  // Create simple video with audio over black
  console.log(`   🎥 Creating video...`);
  const videoPath = `${projectPath}/06_render/final_video.mp4`;

  // MVP: Simple black background with audio
  await runFFmpeg([
    '-f', 'lavfi', '-i', `color=c=black:s=1920x1080:d=${totalDuration}:r=30`,
    '-i', combinedAudioPath,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
    '-c:a', 'aac', '-b:a', '192k',
    '-pix_fmt', 'yuv420p',
    '-shortest',
    videoPath
  ]);

  // Cleanup temp file
  if (fs.existsSync(combinedAudioPath)) {
    fs.unlinkSync(combinedAudioPath);
  }

  console.log(`   ✅ Rendered: final_video.mp4`);
  console.log(`   📁 Path: ${videoPath}`);

  // Get file size
  const stats = fs.statSync(videoPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`   📦 Size: ${sizeMB} MB`);

  updateAgentStatus(projectId, 'agent_06_editor', 'completed', {
    output_file: videoPath,
    duration_seconds: Math.round(totalDuration),
    file_size_mb: sizeMB,
    completed_at: new Date().toISOString(),
  });

  return { videoPath };
}

export default { run };
