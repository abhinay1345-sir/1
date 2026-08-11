import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

// Disk cache for repeat scrapes — keyed by URL + selector.
// Set DOCFACTORY_NO_CACHE=1 to bypass (e.g. for fresh data).
const CACHE_DIR = path.join(os.tmpdir(), 'docfactory_cache');
const TTL_SECONDS = 7 * 24 * 3600; // 7 days

function cacheKey(url, selector) {
  return crypto.createHash('md5').update(`${url}|${selector}`).digest('hex');
}

function cacheGet(key) {
  if (process.env.DOCFACTORY_NO_CACHE === '1') return null;
  const file = path.join(CACHE_DIR, `${key}.json`);
  try {
    if (!fs.existsSync(file)) return null;
    const entry = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (Date.now() > entry.expires) {
      fs.unlinkSync(file);
      return null;
    }
    return entry;
  } catch (_) {
    return null;
  }
}

function cacheSet(key, exitCode, content) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    const file = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(file, JSON.stringify({
      exitCode,
      content,
      expires: Date.now() + TTL_SECONDS * 1000,
    }));
  } catch (err) {
    console.error('Cache write failed:', err.message);
  }
}

async function run() {
  const url = process.argv[2] || 'https://example.com';
  const selector = process.argv[3] || 'body';
  const headless = process.env.PW_HEADLESS !== '0';

  // Serve from cache when possible (selector-not-found is cached as code 2 too)
  const key = cacheKey(url, selector);
  const cached = cacheGet(key);
  if (cached !== null) {
    if (cached.exitCode === 0) {
      console.log(cached.content);
      process.exit(0);
    }
    if (cached.exitCode === 2) {
      console.error('Selector not found: ' + selector);
      process.exit(2);
    }
  }

  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const exists = await page.$(selector);
    if (!exists) {
      cacheSet(key, 2, '');
      console.error(`Selector not found: ${selector}`);
      process.exitCode = 2;
      await browser.close();
      return;
    }
    const content = await page.$eval(selector, el => el.innerText.trim());
    cacheSet(key, 0, content);
    console.log(content);
  } catch (err) {
    console.error('Error during scrape:', err.message || err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
