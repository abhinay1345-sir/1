import config from '../../config/index.js';

/**
 * Local LLM replacement - generates content using templates and logic
 * No external API calls needed
 */

/**
 * Generate documentary script from research (local implementation)
 * @param {string} topic
 * @param {string} research
 * @param {number} targetMinutes
 * @returns {Promise<object>}
 */
export async function generateScript(topic, research, targetMinutes = 25) {
  console.log(`   📝 Generating script locally for: ${topic}`);

  const targetSeconds = targetMinutes * 60;
  const segmentDuration = Math.min(90, Math.max(45, targetSeconds / 10));
  const numSegments = Math.ceil(targetSeconds / segmentDuration);

  // Extract key info from research
  const researchLines = research.split('\n').filter(l => l.trim().length > 20);
  const keyFacts = researchLines.slice(0, 15);

  const segments = [];
  const segmentTemplates = [
    { title: 'Introduction', focus: 'Opening hook and overview' },
    { title: 'Early Life & Background', focus: 'Origins and formative years' },
    { title: 'Key Turning Point', focus: 'Pivotal moment or discovery' },
    { title: 'Major Achievements', focus: 'Primary accomplishments' },
    { title: 'Challenges Overcome', focus: 'Struggles and obstacles' },
    { title: 'Impact & Legacy', focus: 'Lasting influence on the world' },
    { title: 'Later Years', focus: 'Final chapter and reflection' },
    { title: 'Conclusion', focus: 'Summary and lasting significance' },
  ];

  for (let i = 0; i < numSegments && i < segmentTemplates.length; i++) {
    const template = segmentTemplates[i];
    const fact = keyFacts[i] || `Key details about ${topic}`;

    const narration = generateNarration(topic, template.title, template.focus, fact, i, numSegments);
    const duration = Math.floor(segmentDuration + (Math.random() - 0.5) * 10);

    segments.push({
      id: `segment_${String(i + 1).padStart(2, '0')}`,
      title: template.title,
      narration,
      duration_seconds: duration,
      visual_prompts: generateVisualPrompts(topic, template.title, template.focus),
      music_mood: getMusicMood(i, numSegments),
      sfx: getSFX(template.title),
    });
  }

  // Ensure we hit target duration
  const totalDuration = segments.reduce((sum, s) => sum + s.duration_seconds, 0);
  const scaleFactor = targetSeconds / totalDuration;
  segments.forEach(s => {
    s.duration_seconds = Math.round(s.duration_seconds * scaleFactor);
  });

  const script = {
    title: `${topic}: A Documentary`,
    total_duration_seconds: targetSeconds,
    target_duration_minutes: targetMinutes,
    segments,
    voice_settings: {
      voice: 'en-US-GuyNeural',
      speed: 0.95,
    },
  };

  console.log(`   ✅ Generated ${segments.length} segments, ~${Math.round(targetSeconds / 60)} minutes`);
  return script;
}

function generateNarration(topic, segmentTitle, focus, fact, index, total) {
  const openers = [
    `In the story of ${topic}, ${focus.toLowerCase()} stands as a defining chapter.`,
    `When we examine ${topic}, we find that ${focus.toLowerCase()} reveals the true character of this remarkable journey.`,
    `${focus} shaped ${topic} in ways that still resonate today.`,
  ];

  const closers = [
    `This was only the beginning of what would become an extraordinary legacy.`,
    `But the story doesn't end here — greater challenges and triumphs lay ahead.`,
    `The impact of these moments would echo through generations to come.`,
  ];

  const opener = openers[index % openers.length];
  const closer = closers[index % closers.length];

  const middle = fact.length > 100 ? fact.substring(0, 200) + '...' : fact;

  if (index === 0) {
    return `${opener} ${middle} ${closer}`;
  } else if (index === total - 1) {
    return `${opener} ${middle} In the end, ${topic.toLowerCase()} reminds us that one person's vision can change the world.`;
  }

  return `${opener} ${middle} ${closer}`;
}

function generateVisualPrompts(topic, segmentTitle, focus) {
  const prompts = [];

  // Main image prompt
  prompts.push({
    type: 'image',
    prompt: `${topic}, ${segmentTitle.toLowerCase()}, ${focus.toLowerCase()}, documentary style, cinematic lighting, historical photograph aesthetic`,
  });

  // Supporting image
  prompts.push({
    type: 'image',
    prompt: `${topic} ${focus.toLowerCase()}, vintage archival style, sepia tones, Ken Burns documentary aesthetic`,
  });

  // Clip prompt
  prompts.push({
    type: 'clip',
    prompt: `${topic} historical footage, ${segmentTitle.toLowerCase()}, archival film, documentary b-roll`,
  });

  return prompts;
}

function getMusicMood(index, total) {
  const moods = [
    'contemplative, building anticipation',
    'gentle, nostalgic',
    'dramatic, rising tension',
    'inspiring, triumphant',
    'somber, reflective',
    'hopeful, uplifting',
    'peaceful, resolved',
    'grand, cinematic finale',
  ];
  return moods[index % moods.length];
}

function getSFX(segmentTitle) {
  const sfxMap = {
    'Introduction': ['subtle_ambient', 'page_turn'],
    'Early Life & Background': ['fireplace_crackle', 'quill_writing'],
    'Key Turning Point': ['heartbeat', 'clock_tick'],
    'Major Achievements': ['crowd_applause', 'bell_chime'],
    'Challenges Overcome': ['storm_wind', 'distant_thunder'],
    'Impact & Legacy': ['orchestral_swell', 'choir_hum'],
    'Later Years': ['rain_gentle', 'wind_chimes'],
    'Conclusion': ['fade_out', 'final_chord'],
  };
  return sfxMap[segmentTitle] || ['ambient_room'];
}

/**
 * Summarize and extract key facts from scraped content (local implementation)
 * @param {string} topic
 * @param {string} content
 * @returns {Promise<string>}
 */
export async function summarizeResearch(topic, content) {
  console.log(`   📋 Summarizing research locally for: ${topic}`);

  // Extract key information from content
  const lines = content.split('\n').filter(l => l.trim().length > 30);
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);

  // Build structured research summary
  const summary = `# Research Summary: ${topic}

## Key Information Extracted

${paragraphs.slice(0, 8).map((p, i) => `### Source ${i + 1}\n${p.trim().substring(0, 500)}...`).join('\n\n')}

## Timeline & Key Dates
- ${extractDates(content).join('\n- ') || 'Dates to be determined from sources'}

## Important Figures
- ${extractNames(content).join('\n- ') || 'Key figures to be identified'}

## Notable Quotes
${extractQuotes(content).map(q => `- "${q}"`).join('\n') || '- Quotes to be extracted from primary sources'}

## Narrative Angles Suggested
1. **Chronological Journey** - Follow the timeline from beginning to present
2. **Challenge & Triumph** - Focus on obstacles overcome
3. **Innovation & Impact** - Highlight groundbreaking contributions
4. **Human Story** - Personal struggles and relationships

## Visual Opportunities
- Historical photographs and archival footage
- Location shots of significant places
- Document and artifact close-ups
- Maps showing geographic scope
- Timeline graphics for key dates

---
*Generated locally from scraped sources*
`;

  return summary;
}

function extractDates(text) {
  const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b|\b\d{4}\b/g;
  const matches = text.match(dateRegex) || [];
  return [...new Set(matches)].slice(0, 10);
}

function extractNames(text) {
  // Simple heuristic for capitalized names
  const nameRegex = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
  const matches = text.match(nameRegex) || [];
  const filtered = matches.filter(n =>
    !['The', 'This', 'That', 'These', 'Those', 'When', 'Where', 'What', 'Who', 'How'].includes(n.split(' ')[0])
  );
  return [...new Set(filtered)].slice(0, 10);
}

function extractQuotes(text) {
  const quoteRegex = /"([^"]{20,200})"/g;
  const matches = [];
  let match;
  while ((match = quoteRegex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches.slice(0, 5);
}

// Export for backwards compatibility
export async function callClaude(systemPrompt, userPrompt, options = {}) {
  console.log(`   [LOCAL] callClaude invoked - using local generation`);
  return 'Local generation - use generateScript or summarizeResearch directly';
}