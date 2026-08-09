import fs from 'fs';
import { spawn } from 'child_process';
import { loadState, updateAgentStatus, getProjectPath, saveBinary } from '../lib/drive.js';
import config from '../../config/index.js';

/**
 * Agent 5: Audio Designer
 *
 * Generates voice-over using Edge-TTS (free, high quality)
 * Organizes audio files on Drive for the editor
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

  return new Promise((resolve, reject) => {
    const args = [
      '--voice', voice,
      '--rate', String(speed),
      '--text', text,
      '--write-media', outputPath,
    ];

    const proc = spawn('edge-tts', args);
    let stderr = '';

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
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
  return new Promise((resolve, reject) => {
    const proc = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      audioPath
    ]);

    let stdout = '';
    proc.stdout.on('data', (data) => stdout += data);
    proc.on('close', (code) => {
      if (code === 0) {
        resolve(parseFloat(stdout.trim()));
      } else {
        resolve(0);
      }
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

  const audioFiles = [];
  const voiceSettings = script.voice_settings || {};

  for (let i = 0; i < script.segments.length; i++) {
    const segment = script.segments[i];
    const segmentNum = String(i + 1).padStart(2, '0');
    const audioPath = `${projectPath}/05_audio/voiceover/segment_${segmentNum}.wav`;

    console.log(`   🎤 Segment ${segmentNum}: ${segment.title.substring(0, 40)}...`);

    try {
      await generateTTS(segment.narration, audioPath, voiceSettings);

      // Get actual duration
      const duration = await getAudioDuration(audioPath);
      segment.actual_duration = duration;

      audioFiles.push(audioPath);
      console.log(`      ✅ ${duration.toFixed(1)}s`);
    } catch (error) {
      console.error(`      ⚠️ Failed: ${error.message}`);
      segment.actual_duration = 0;
    }
  }

  // Update script with actual durations
  fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));

  console.log(`   ✅ Generated ${audioFiles.length} audio files`);

  updateAgentStatus(projectId, 'agent_05_audio_designer', 'completed', {
    audio_files: audioFiles.length,
    completed_at: new Date().toISOString(),
  });

  return { audioFiles };
}

export default { run };
