const { chromium } = require('playwright');

async function run() {
  const url = process.argv[2] || 'https://example.com';
  const selector = process.argv[3] || 'body';
  const headless = process.env.PW_HEADLESS !== '0';

  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const exists = await page.$(selector);
    if (!exists) {
      console.error(`Selector not found: ${selector}`);
      process.exitCode = 2;
      await browser.close();
      return;
    }
    const content = await page.$eval(selector, el => el.innerText.trim());
    console.log(content);
  } catch (err) {
    console.error('Error during scrape:', err.message || err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
