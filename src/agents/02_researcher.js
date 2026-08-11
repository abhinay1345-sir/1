import { chromium } from 'playwright';
import { loadState, saveText, updateAgentStatus, getProjectPath } from '../lib/drive.js';
import { summarizeResearch } from '../lib/llm.js';
import { cacheGet, cacheSet, cacheKey } from '../lib/cache.js';
import fs from 'fs';

/**
 * Agent 2: Researcher
 *
 * Scrapes Wikipedia, news sites, and other sources for information about the topic.
 * Uses Claude API to summarize and extract key facts.
 *
 * Input: 01_topic.json
 * Output: 02_research.md
 */

/**
 * Scrape Wikipedia for topic
 * @param {string} topic
 * @returns {Promise<string>}
 */
async function scrapeWikipedia(topic) {
  const cacheKeyStr = cacheKey('wikipedia', topic.toLowerCase());
  const cached = cacheGet(cacheKeyStr);
  if (cached !== null) {
    console.log(`   ⚡ Wikipedia: cache hit for "${topic}"`);
    return cached;
  }

  const searchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(topic)}`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let content = '';
  try {
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Check if we're on a search results page or direct article
    const isSearchPage = await page.$('#mw-search-top-table');

    if (isSearchPage) {
      // Click first result
      const firstResult = await page.$('.mw-search-result-heading a');
      if (firstResult) {
        await firstResult.click();
        await page.waitForLoadState('domcontentloaded');
      }
    }

    // Extract main content
    content = await page.evaluate(() => {
      const title = document.querySelector('#firstHeading')?.textContent || '';
      const paragraphs = Array.from(document.querySelectorAll('#mw-content-text p'))
        .map(p => p.textContent.trim())
        .filter(text => text.length > 50)
        .join('\n\n');
      return `# ${title}\n\n${paragraphs}`;
    });

    // Cache only non-empty scrapes (7-day TTL)
    if (content.trim()) {
      cacheSet(cacheKeyStr, content, { ttlSeconds: 7 * 24 * 3600 });
    }
    return content;
  } catch (error) {
    console.error(`   ⚠️ Wikipedia scrape error: ${error.message}`);
    return content;
  } finally {
    await browser.close();
  }
}

/**
 * Run the Researcher agent
 * @param {string} projectId
 * @returns {Promise<{researchPath: string}>}
 */
export async function run(projectId) {
  console.log(`\n📚 Agent 2: Researcher`);

  const state = loadState(projectId);
  const projectPath = getProjectPath(projectId);

  // Load topic data
  const topicPath = `${projectPath}/01_topic.json`;
  if (!fs.existsSync(topicPath)) {
    throw new Error('01_topic.json not found. Run Topic Hunter first.');
  }

  const topicData = JSON.parse(fs.readFileSync(topicPath, 'utf-8'));
  const topic = topicData.topic;

  console.log(`   Researching: ${topic}`);

  updateAgentStatus(projectId, 'agent_02_researcher', 'in_progress');

  // Scrape sources
  console.log(`   🌐 Scraping Wikipedia...`);
  let researchContent = '';

  try {
    const wikiContent = await scrapeWikipedia(topic);
    researchContent += `## Wikipedia\n\n${wikiContent}\n\n`;
  } catch (error) {
    console.error(`   ⚠️ Wikipedia error: ${error.message}`);
  }

  // Summarize with Claude
  console.log(`   🤖 Summarizing research with Claude...`);
  const summarizedResearch = await summarizeResearch(topic, researchContent);

  // Save to Drive
  const savedPath = saveText(projectId, '02_research.md', summarizedResearch);
  console.log(`   ✅ Saved: 02_research.md`);

  updateAgentStatus(projectId, 'agent_02_researcher', 'completed', {
    output_file: savedPath,
    completed_at: new Date().toISOString(),
  });

  return { researchPath: savedPath };
}

export default { run };
