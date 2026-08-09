import dotenv from 'dotenv';
import path from 'path';
import os from 'os';

dotenv.config();

const DRIVE_MOUNT = process.env.DRIVE_MOUNT || path.join(os.homedir(), 'gdrive');
const OUTPUT_BASE = process.env.OUTPUT_BASE || path.join(DRIVE_MOUNT, 'documentary-factory');

export default {
  // Paths on Google Drive
  paths: {
    driveMount: DRIVE_MOUNT,
    outputBase: OUTPUT_BASE,
    projects: path.join(OUTPUT_BASE, 'projects'),
    templates: path.join(OUTPUT_BASE, 'templates'),
    config: path.join(OUTPUT_BASE, 'config'),
  },

  // API Keys
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  pexelsApiKey: process.env.PEXELS_API_KEY,
  stabilityApiKey: process.env.STABILITY_API_KEY,
  sunoApiKey: process.env.SUNO_API_KEY,

  // Default settings
  defaults: {
    targetDurationMinutes: 25,
    voice: 'en-US-GuyNeural',
    voiceSpeed: 0.95,
    videoFps: 30,
    videoResolution: '1920x1080',
  },

  // Agent timeouts
  timeouts: {
    research: 120000,      // 2 minutes
    scriptGeneration: 180000, // 3 minutes
    imageGeneration: 60000,   // 1 minute per image
    tts: 30000,              // 30 seconds per segment
    render: 600000,          // 10 minutes for final render
  },
};
