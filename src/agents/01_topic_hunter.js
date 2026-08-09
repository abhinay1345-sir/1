import { createProject, saveJson, updateAgentStatus } from '../lib/drive.js';

/**
 * Agent 1: Topic Hunter
 *
 * Accepts a manual topic from user and creates project structure on Drive.
 * In future versions, can auto-discover trending topics.
 *
 * Input: Topic string from user
 * Output: 01_topic.json saved to Drive
 */

/**
 * Create a slug from topic string
 * @param {string} topic
 * @returns {string}
 */
function createSlug(topic) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Run the Topic Hunter agent
 * @param {string} topic - The documentary topic
 * @param {object} options - Additional options
 * @returns {Promise<{projectId: string, topicData: object}>}
 */
export async function run(topic, options = {}) {
  console.log(`\n🎯 Agent 1: Topic Hunter`);
  console.log(`   Topic: ${topic}`);

  // Create slug and project
  const slug = createSlug(topic);
  const projectId = createProject(slug);

  console.log(`   Project ID: ${projectId}`);
  console.log(`   Project folder: ~/gdrive/documentary-factory/projects/${projectId}`);

  // Update agent status
  updateAgentStatus(projectId, 'agent_01_topic_hunter', 'in_progress');

  // Create topic data
  const topicData = {
    topic,
    slug,
    keywords: options.keywords || [],
    category: options.category || 'general',
    target_duration_minutes: options.targetDurationMinutes || 25,
    sources: options.sources || [],
    created_at: new Date().toISOString(),
  };

  // Save to Drive
  const savedPath = saveJson(projectId, '01_topic.json', topicData);
  console.log(`   ✅ Saved: 01_topic.json`);

  // Update status to completed
  updateAgentStatus(projectId, 'agent_01_topic_hunter', 'completed', {
    output_file: savedPath,
    completed_at: new Date().toISOString(),
  });

  return { projectId, topicData };
}

export default { run };
