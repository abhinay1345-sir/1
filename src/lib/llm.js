import Anthropic from '@anthropic-ai/sdk';
import config from '../../config/index.js';

const client = new Anthropic({
  apiKey: config.anthropicApiKey,
  baseURL: 'http://localhost:20128/v1',
});

/**
 * Call Claude API with a prompt
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} options
 * @returns {Promise<string>}
 */
export async function callClaude(systemPrompt, userPrompt, options = {}) {
  const {
    model = 'auto/claude-sonnet',
    maxTokens = 4096,
    temperature = 0.7,
  } = options;

  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt },
    ],
  });

  return message.content[0].text;
}

/**
 * Generate documentary script from research
 * @param {string} topic
 * @param {string} research
 * @param {number} targetMinutes
 * @returns {Promise<object>}
 */
export async function generateScript(topic, research, targetMinutes = 25) {
  const systemPrompt = `You are an expert documentary scriptwriter. You write engaging, educational scripts for 20-30 minute YouTube documentaries in the style of Ken Burns documentaries.

Your scripts are:
- Educational but accessible
- Narratively structured with clear arcs
- Broken into segments with visual cues
- Designed for voice-over narration

You output JSON with this structure:
{
  "title": "Documentary Title",
  "total_duration_seconds": 1500,
  "segments": [
    {
      "id": "segment_01",
      "title": "Segment Title",
      "narration": "The narration text...",
      "duration_seconds": 45,
      "visual_prompts": [
        {"type": "image", "prompt": "Description for image generation"},
        {"type": "clip", "prompt": "Description for stock footage search"}
      ],
      "music_mood": "inspiring, building",
      "sfx": []
    }
  ],
  "voice_settings": {
    "voice": "en-US-GuyNeural",
    "speed": 0.95
  }
}`;

  const userPrompt = `Write a documentary script about: ${topic}

Target duration: ${targetMinutes} minutes (~${targetMinutes * 60} seconds)

Use this research as your source material:
${research}

Create a compelling narrative with clear segments. Each segment should be 30-90 seconds of narration. Include visual prompts for images and stock footage that match the narration.`;

  const response = await callClaude(systemPrompt, userPrompt, {
    maxTokens: 8192,
    temperature: 0.8,
  });

  console.log(`   [DEBUG] Raw response length: ${response.length}`);
  console.log(`   [DEBUG] First 500 chars: ${response.substring(0, 500)}`);

  // Parse JSON from response - try multiple patterns
  let jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // Try finding JSON in code blocks
    jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonMatch = [jsonMatch[1]];
    }
  }
  if (!jsonMatch) {
    // Try finding just the outermost braces
    const firstBrace = response.indexOf('{');
    const lastBrace = response.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonMatch = [response.substring(firstBrace, lastBrace + 1)];
    }
  }
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error(`   [DEBUG] JSON parse failed: ${e.message}`);
      console.error(`   [DEBUG] Attempted to parse: ${jsonMatch[0].substring(0, 200)}...`);
      throw new Error('Failed to parse script JSON from Claude response');
    }
  }

  throw new Error('Failed to parse script JSON from Claude response');
}

/**
 * Summarize and extract key facts from scraped content
 * @param {string} topic
 * @param {string} content
 * @returns {Promise<string>}
 */
export async function summarizeResearch(topic, content) {
  const systemPrompt = `You are a research assistant for documentary production. You extract key facts, dates, quotes, and narrative elements from source material.

Output well-organized markdown with:
- Key dates and timeline
- Important people and their roles
- Notable quotes
- Interesting facts and anecdotes
- Suggested narrative angles`;

  const userPrompt = `Topic: ${topic}

Source material:
${content}

Extract the most important and interesting information for a documentary about this topic.`;

  return callClaude(systemPrompt, userPrompt, {
    maxTokens: 4096,
    temperature: 0.5,
  });
}
