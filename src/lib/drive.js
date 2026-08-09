import fs from 'fs';
import path from 'path';
import config from '../../config/index.js';

/**
 * Helper functions for Google Drive file operations
 * All project files are stored on Drive to preserve codespace disk space
 */

/**
 * Create a new project folder structure on Drive
 * @param {string} topicSlug - URL-friendly topic identifier
 * @returns {string} Project path on Drive
 */
export function createProject(topicSlug) {
  const timestamp = new Date().toISOString().split('T')[0];
  const projectId = `${timestamp}_${topicSlug}`;
  const projectPath = path.join(config.paths.projects, projectId);

  const folders = [
    projectPath,
    path.join(projectPath, '04_assets', 'images'),
    path.join(projectPath, '04_assets', 'clips'),
    path.join(projectPath, '04_assets', 'overlays'),
    path.join(projectPath, '05_audio', 'voiceover'),
    path.join(projectPath, '05_audio', 'music'),
    path.join(projectPath, '05_audio', 'sfx'),
    path.join(projectPath, '06_render'),
  ];

  folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });

  // Initialize state file
  const state = {
    project_id: projectId,
    topic_slug: topicSlug,
    status: 'created',
    created_at: new Date().toISOString(),
    current_agent: null,
    agents: {
      agent_01_topic_hunter: { status: 'pending' },
      agent_02_researcher: { status: 'pending' },
      agent_03_scriptwriter: { status: 'pending' },
      agent_04_asset_collector: { status: 'pending' },
      agent_05_audio_designer: { status: 'pending' },
      agent_06_editor: { status: 'pending' },
    },
    retries: 0,
    errors: [],
  };

  saveState(projectId, state);

  return projectId;
}

/**
 * Get project path on Drive
 * @param {string} projectId
 * @returns {string}
 */
export function getProjectPath(projectId) {
  return path.join(config.paths.projects, projectId);
}

/**
 * Save state file to Drive
 * @param {string} projectId
 * @param {object} state
 */
export function saveState(projectId, state) {
  const statePath = path.join(getProjectPath(projectId), 'state.json');
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

/**
 * Load state file from Drive
 * @param {string} projectId
 * @returns {object}
 */
export function loadState(projectId) {
  const statePath = path.join(getProjectPath(projectId), 'state.json');
  if (!fs.existsSync(statePath)) {
    throw new Error(`Project not found: ${projectId}`);
  }
  return JSON.parse(fs.readFileSync(statePath, 'utf-8'));
}

/**
 * Update agent status in state
 * @param {string} projectId
 * @param {string} agentName
 * @param {string} status
 * @param {object} metadata
 */
export function updateAgentStatus(projectId, agentName, status, metadata = {}) {
  const state = loadState(projectId);
  state.agents[agentName] = {
    ...state.agents[agentName],
    status,
    ...metadata,
    updated_at: new Date().toISOString(),
  };
  state.current_agent = agentName;
  saveState(projectId, state);
}

/**
 * Save JSON output to Drive
 * @param {string} projectId
 * @param {string} filename
 * @param {object} data
 */
export function saveJson(projectId, filename, data) {
  const filePath = path.join(getProjectPath(projectId), filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

/**
 * Save text/markdown output to Drive
 * @param {string} projectId
 * @param {string} filename
 * @param {string} content
 */
export function saveText(projectId, filename, content) {
  const filePath = path.join(getProjectPath(projectId), filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

/**
 * Save binary file to Drive (images, audio, video)
 * @param {string} projectId
 * @param {string} subfolder - e.g., '04_assets/images'
 * @param {string} filename
 * @param {Buffer} data
 */
export function saveBinary(projectId, subfolder, filename, data) {
  const filePath = path.join(getProjectPath(projectId), subfolder, filename);
  fs.writeFileSync(filePath, data);
  return filePath;
}

/**
 * Check if Drive is mounted
 * @returns {boolean}
 */
export function isDriveMounted() {
  return fs.existsSync(config.paths.driveMount);
}

/**
 * List all projects
 * @returns {string[]}
 */
export function listProjects() {
  if (!fs.existsSync(config.paths.projects)) {
    return [];
  }
  return fs.readdirSync(config.paths.projects).filter(name => {
    const projectPath = path.join(config.paths.projects, name);
    return fs.statSync(projectPath).isDirectory();
  });
}
