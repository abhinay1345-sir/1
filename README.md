# 1

## Playwright web scraper

A small Playwright-based scraper is included: `scraper.js`.

Install dependencies and Playwright browsers:

```bash
npm install
npm run install-browsers
```

Run the scraper:

```bash
# basic: prints the page body text
npm run scrape -- https://example.com "body"

# pass a CSS selector to extract specific content
npm run scrape -- https://news.ycombinator.com ".storylink"
```

You can disable headless mode by setting `PW_HEADLESS=0` in the environment.
