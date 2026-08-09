# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimal Playwright-based web scraper. The project consists of a single Node.js script (`scraper.js`) that launches a headless Chromium browser, navigates to a URL, and extracts text content from a CSS selector.

## Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers (required after npm install)
npm run install-browsers

# Run the scraper
npm run scrape -- <url> [selector]

# Examples:
npm run scrape -- https://example.com "body"
npm run scrape -- https://news.ycombinator.com ".storylink"

# Run with visible browser (non-headless)
PW_HEADLESS=0 npm run scrape -- https://example.com "body"
```

## Architecture

Single-file architecture:
- `scraper.js` — Entry point and entire implementation. Uses Playwright's `chromium.launch()` to create a browser instance, navigates to the provided URL, waits for DOM content loaded, and extracts innerText from the first element matching the selector. Exits with code 2 if selector not found, code 1 on other errors.

Exit codes:
- 0: Success
- 1: Error during scrape
- 2: Selector not found on page
