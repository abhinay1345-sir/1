import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { loadState, updateAgentStatus, getProjectPath } from '../lib/drive.js';
import config from '../../config/index.js';

/**
 * Minimal concurrency limiter (avoids adding a p-limit dependency).
 * @param {number} concurrency - Max parallel tasks
 * @param {Array<T>} items
 * @param {(item: T, index: number) => Promise<R>} fn
 * @returns {Promise<Array<R>>} Results in input order (holes preserved)
 */
async function mapWithConcurrency(concurrency, items, fn) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next++;
      try {
        results[index] = await fn(items[index], index);
      } catch (err) {
        results[index] = undefined;
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

/**
 * Agent 5: Audio Designer
 *
 * Generates voice-over using Edge-TTS (free, high quality)
 * Writes to /tmp first then copies to Drive (avoids rclone I/O errors)
 *
 * Input: 03_script.json
 * Output: 05_audio/voiceover/*.wav files
 */

/**
 * Generate TTS audio for a text segment
 * @param {string} text - Text to convert to speech
 * @param {string} outputPath - Where to save the audio file
 * @param {object} voiceSettings - Voice configuration
 * @returns {Promise<string>} - Path to generated audio
 */
async function generateTTS(text, outputPath, voiceSettings = {}) {
  const voice = voiceSettings.voice || config.defaults.voice;
  const speed = voiceSettings.speed || config.defaults.voiceSpeed;

  // edge-tts expects rate as percentage like "+50%" or "-20%"
  // Convert speed (0.95 = 95% = -5%, 1.0 = 0%, 1.2 = +20%)
  const ratePercent = Math.round((speed - 1) * 100);
  const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;

  // Always write to /tmp first — edge-tts + rclone mount is unreliable
  const tempPath = `/tmp/tts_${Date.now()}_${Math.random().toString(36).slice(2)}.wav`;

  return new Promise((resolve, reject) => {
    const args = [
      '--voice', voice,
      '--rate=' + rateStr,
      '--text', text,
      '--write-media', tempPath,
    ];

    const proc = spawn('edge-tts', args);
    let stderr = '';

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        try {
          // Ensure destination dir exists
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.copyFileSync(tempPath, outputPath);
          // Also keep a local mirror for reliable editor access
          const localMirror = path.join('/tmp/docfactory_audio', path.basename(outputPath));
          fs.mkdirSync(path.dirname(localMirror), { recursive: true });
          fs.copyFileSync(tempPath, localMirror);
          fs.unlinkSync(tempPath);
          resolve(outputPath);
        } catch (err) {
          // If Drive copy fails, still keep local mirror and use that
          try {
            const localMirror = path.join('/tmp/docfactory_audio', path.basename(outputPath));
            fs.mkdirSync(path.dirname(localMirror), { recursive: true });
            if (fs.existsSync(tempPath)) {
              fs.copyFileSync(tempPath, localMirror);
              fs.unlinkSync(tempPath);
            }
            console.warn(`      ⚠️ Drive write failed, using local: ${localMirror}`);
            resolve(localMirror);
          } catch (err2) {
            reject(err2);
          }
        }
      } else {
        if (fs.existsSync(tempPath)) {
          try { fs.unlinkSync(tempPath); } catch (_) {}
        }
        reject(new Error(`edge-tts failed: ${stderr}`));
      }
    });

    proc.on('error', reject);
  });
}

/**
 * Get audio duration in seconds
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
 * Run the Audio Designer agent
 * @param {string} projectId
 * @returns {Promise<{audioFiles: string[]}>}
 */
export async function run(projectId) {
  console.log(`\n🎙️ Agent 5: Audio Designer`);

  const state = loadState(projectId);
  const projectPath = getProjectPath(projectId);

  // Load script
  const scriptPath = `${projectPath}/03_script.json`;
  if (!fs.existsSync(scriptPath)) {
    throw new Error('03_script.json not found. Run Scriptwriter first.');
  }
  const script = JSON.parse(fs.readFileSync(scriptPath, 'utf-8'));

  console.log(`   Generating voice-over for ${script.segments.length} segments...`);

  updateAgentStatus(projectId, 'agent_05_audio_designer', 'in_progress');

  // Clear local audio mirror for this run
  const localAudioDir = '/tmp/docfactory_audio';
  fs.mkdirSync(localAudioDir, { recursive: true });

  const audioFiles = [];
  const voiceSettings = script.voice_settings || {};
  const concurrency = config.defaults.audioConcurrency || 3;

  const results = await mapWithConcurrency(concurrency, script.segments, async (segment, i) => {
    const segmentNum = String(i + 1).padStart(2, '0');
    const audioPath = `${projectPath}/05_audio/voiceover/segment_${segmentNum}.wav`;
    const localPath = path.join(localAudioDir, `segment_${segmentNum}.wav`);

    // Skip if already generated and valid
    if (fs.existsSync(audioPath)) {
      try {
        const dur = await getAudioDuration(audioPath);
        if (dur > 0.5) {
          console.log(`   🎤 Segment ${segmentNum}: already exists (${dur.toFixed(1)}s), skipping`);
          fs.copyFileSync(audioPath, localPath);
          segment.actual_duration = dur;
          return { segmentNum, localPath };
        }
      } catch (_) {}
    }

    console.log(`   🎤 Segment ${segmentNum}: ${segment.title.substring(0, 40)}...`);

    try {
      const resultPath = await generateTTS(segment.narration, audioPath, voiceSettings);
      const duration = await getAudioDuration(resultPath);
      segment.actual_duration = duration;

      // Prefer local path for downstream reliability
      const finalLocal = fs.existsSync(localPath) ? localPath : resultPath;
      console.log(`      ✅ ${duration.toFixed(1)}s`);
      return { segmentNum, localPath: finalLocal };
    } catch (error) {
      console.error(`      ⚠️ Failed: ${error.message}`);
      segment.actual_duration = 0;
      return null;
    }
  });

  // Preserve segment order for the editor's manifest (skip failed/null)
  for (const r of results) {
    if (r) audioFiles.push(r.localPath);
  }

  // Update script with actual durations
  try {
    fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));
  } catch (e) {
    console.warn(`   ⚠️ Could not update script on Drive: ${e.message}`);
  }

  // Save manifest of local audio paths for editor
  const manifest = { projectId, audioFiles, generated_at: new Date().toISOString() };
  fs.writeFileSync('/tmp/docfactory_audio/manifest.json', JSON.stringify(manifest, null, 2));

  console.log(`   ✅ Generated ${audioFiles.length} audio files`);

  updateAgentStatus(projectId, 'agent_05_audio_designer', 'completed', {
    audio_files: audioFiles.length,
    completed_at: new Date().toISOString(),
  });

  return { audioFiles };
}

export default { run };
