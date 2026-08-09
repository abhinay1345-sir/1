#!/usr/bin/env node

/**
 * Documentary Factory - Main Pipeline Orchestrator
 *
 * This script runs the full documentary creation pipeline.
 * All generated files are saved to Google Drive.
 *
 * Usage:
 *   npm run create -- --topic "Steve Jobs"
 *   npm run resume -- --project 2026-08-09_steve-jobs
 */

import argparse from 'argparse';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

import { createProject, loadState, saveState, getProjectPath, listProjects } from './lib/drive.js';
import topicHunter from './agents/01_topic_hunter.js';
import researcher from './agents/02_researcher.js';
import scriptwriter from './agents/03_scriptwriter.js';
import audioDesigner from './agents/05_audio_designer.js';
import editor from './agents/06_editor.js';

// Parse command line arguments
const parser = new argparse.ArgumentParser({
  description: 'Documentary Factory Pipeline'
});

parser.add_argument('--mode', {
  choices: ['create', 'resume', 'agent', 'preview', 'render', 'list'],
  default: 'create',
  help: 'Pipeline mode'
});

parser.add_argument('--topic', {
  help: 'Documentary topic (for create mode)'
});

parser.add_argument('--project', {
  help: 'Project ID (for resume/agent mode)'
});

parser.add_argument('--agent', {
  help: 'Agent to run (for agent mode): 01, 02, 03, 05, 06'
});

parser.add_argument('--category', {
  default: 'biography',
  help: 'Content category: biography, history, science'
});

parser.add_argument('--duration', {
  type: 'int',
  default: 25,
  help: 'Target duration in minutes'
});

const args = parser.parse_args();

/**
 * Run the full pipeline for a new project
 */
async function runFullPipeline(topic, category, duration) {
  console.log('\n' + '='.repeat(70));
  console.log('🎬 DOCUMENTARY FACTORY - Starting New Project');
  console.log('='.repeat(70));
  console.log(`\n📝 Topic: ${topic}`);
  console.log(`📁 Category: ${category}`);
  console.log(`⏱️  Target Duration: ${duration} minutes`);
  console.log(`💾 Output: ~/gdrive/documentary-factory/projects/`);

  // Agent 1: Topic Hunter
  const { projectId, topicData } = await topicHunter.run(topic, {
    category,
    targetDurationMinutes: duration
  });

  // Agent 2: Researcher
  await researcher.run(projectId);

  // Agent 3: Scriptwriter
  const { script } = await scriptwriter.run(projectId);

  // CHECKPOINT: Show script for approval
  scriptwriter.displayScript(script);

  console.log('\n⏸️  CHECKPOINT: Review the script above.');
  console.log('   - If you approve, the pipeline will continue to audio generation.');
  console.log('   - Press Ctrl+C to stop and make changes.\n');

  // Wait 5 seconds for user to review
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Agent 5: Audio Designer
  await audioDesigner.run(projectId);

  // Agent 6: Editor (MVP)
  const { videoPath } = await editor.run(projectId);

  console.log('\n' + '='.repeat(70));
  console.log('✅ DOCUMENTARY COMPLETE');
  console.log('='.repeat(70));
  console.log(`\n📁 Project: ${projectId}`);
  console.log(`🎬 Video: ${videoPath}`);
  console.log(`📂 All files: ~/gdrive/documentary-factory/projects/${projectId}/`);
  console.log('\n💡 Next steps:');
  console.log('   1. Download the video from Drive');
  console.log('   2. Upload to YouTube manually');
  console.log('   3. Add thumbnails, tags, and description\n');

  return { projectId, videoPath };
}

/**
 * Resume an interrupted project
 */
async function resumeProject(projectId) {
  console.log(`\n🔄 Resuming project: ${projectId}`);

  const state = loadState(projectId);
  console.log(`   Current status: ${state.status}`);
  console.log(`   Current agent: ${state.current_agent || 'none'}`);

  // Find next pending agent
  const agents = [
    { name: 'agent_02_researcher', run: () => researcher.run(projectId) },
    { name: 'agent_03_scriptwriter', run: () => scriptwriter.run(projectId) },
    { name: 'agent_05_audio_designer', run: () => audioDesigner.run(projectId) },
    { name: 'agent_06_editor', run: () => editor.run(projectId) },
  ];

  for (const agent of agents) {
    if (state.agents[agent.name].status !== 'completed') {
      console.log(`\n▶️  Running: ${agent.name}`);
      await agent.run();
    }
  }

  console.log('\n✅ Pipeline resumed successfully');
}

/**
 * Run a specific agent
 */
async function runSpecificAgent(projectId, agentNum) {
  const agents = {
    '01': topicHunter,
    '02': researcher,
    '03': scriptwriter,
    '05': audioDesigner,
    '06': editor,
  };

  const agent = agents[agentNum];
  if (!agent) {
    console.error(`Unknown agent: ${agentNum}`);
    process.exit(1);
  }

  console.log(`\n🎯 Running Agent ${agentNum} on project: ${projectId}`);

  if (agentNum === '01') {
    await agent.run(projectId);
  } else {
    await agent.run(projectId);
  }
}

/**
 * List all projects
 */
function listAllProjects() {
  console.log('\n📁 All Projects:\n');

  const projects = listProjects();
  if (projects.length === 0) {
    console.log('   No projects found.');
    console.log('   Create one with: npm run create -- --topic "Your Topic"\n');
    return;
  }

  projects.forEach(projectId => {
    const state = loadState(projectId);
    const status = state.status || 'unknown';
    const created = state.created_at ? new Date(state.created_at).toLocaleDateString() : 'unknown';
    console.log(`   ${projectId}`);
    console.log(`      Status: ${status} | Created: ${created}\n`);
  });
}

/**
 * Main entry point
 */
async function main() {
  try {
    switch (args.mode) {
      case 'create':
        if (!args.topic) {
          console.error('❌ --topic is required for create mode');
          console.log('   Example: npm run create -- --topic "Steve Jobs"');
          process.exit(1);
        }
        await runFullPipeline(args.topic, args.category, args.duration);
        break;

      case 'resume':
        if (!args.project) {
          console.error('❌ --project is required for resume mode');
          process.exit(1);
        }
        await resumeProject(args.project);
        break;

      case 'agent':
        if (!args.project || !args.agent) {
          console.error('❌ --project and --agent are required for agent mode');
          process.exit(1);
        }
        await runSpecificAgent(args.project, args.agent);
        break;

      case 'list':
        listAllProjects();
        break;

      default:
        console.log(`Unknown mode: ${args.mode}`);
        parser.printHelp();
    }
  } catch (error) {
    console.error('\n❌ Pipeline error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
