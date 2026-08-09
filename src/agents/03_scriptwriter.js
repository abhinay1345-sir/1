import fs from 'fs';
import { loadState, saveJson, updateAgentStatus, getProjectPath } from '../lib/drive.js';
import { generateScript } from '../lib/llm.js';

/**
 * Agent 3: Scriptwriter
 *
 * Generates a 20-30 minute documentary script with visual prompts for each segment.
 * Uses Claude API to create engaging, educational narration.
 *
 * Input: 01_topic.json, 02_research.md
 * Output: 03_script.json
 *
 * CHECKPOINT: User must approve script before proceeding
 */

/**
 * Run the Scriptwriter agent
 * @param {string} projectId
 * @returns {Promise<{scriptPath: string, script: object}>}
 */
export async function run(projectId) {
  console.log(`\n✍️ Agent 3: Scriptwriter`);

  const state = loadState(projectId);
  const projectPath = getProjectPath(projectId);

  // Load topic data
  const topicPath = `${projectPath}/01_topic.json`;
  if (!fs.existsSync(topicPath)) {
    throw new Error('01_topic.json not found. Run Topic Hunter first.');
  }
  const topicData = JSON.parse(fs.readFileSync(topicPath, 'utf-8'));

  // Load research
  const researchPath = `${projectPath}/02_research.md`;
  if (!fs.existsSync(researchPath)) {
    throw new Error('02_research.md not found. Run Researcher first.');
  }
  const research = fs.readFileSync(researchPath, 'utf-8');

  console.log(`   Topic: ${topicData.topic}`);
  console.log(`   Target duration: ${topicData.target_duration_minutes} minutes`);

  updateAgentStatus(projectId, 'agent_03_scriptwriter', 'in_progress');

  // Generate script with Claude
  console.log(`   🤖 Generating script with Claude API...`);
  const script = await generateScript(
    topicData.topic,
    research,
    topicData.target_duration_minutes
  );

  // Calculate total duration
  const totalDuration = script.segments.reduce((sum, seg) => sum + (seg.duration_seconds || 0), 0);
  script.total_duration_seconds = totalDuration;
  script.target_duration_minutes = topicData.target_duration_minutes;

  // Save to Drive
  const savedPath = saveJson(projectId, '03_script.json', script);
  console.log(`   ✅ Saved: 03_script.json`);
  console.log(`   📊 Segments: ${script.segments.length}`);
  console.log(`   ⏱️ Total duration: ${Math.round(totalDuration / 60)} minutes`);

  updateAgentStatus(projectId, 'agent_03_scriptwriter', 'completed', {
    output_file: savedPath,
    segments: script.segments.length,
    total_duration_seconds: totalDuration,
    completed_at: new Date().toISOString(),
  });

  return { scriptPath: savedPath, script };
}

/**
 * Display script for user review
 * @param {object} script
 */
export function displayScript(script) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📜 SCRIPT: ${script.title}`);
  console.log(`${'='.repeat(60)}\n`);

  script.segments.forEach((segment, index) => {
    console.log(`\n--- Segment ${index + 1}: ${segment.title} (${segment.duration_seconds}s) ---`);
    console.log(segment.narration.substring(0, 200) + '...');
  });

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Total: ${script.segments.length} segments, ~${Math.round(script.total_duration_seconds / 60)} minutes`);
  console.log(`${'='.repeat(60)}\n`);
}

export default { run, displayScript };
