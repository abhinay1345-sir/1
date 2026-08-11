#!/usr/bin/env node
/**
 * PostToolUse hook — validates any .json file written by Write/Edit/NotebookEdit.
 *
 * Catches schema corruption at write time instead of letting it cascade
 * through the pipeline (e.g. a broken 03_script.json silently failing
 * the Audio Designer or Editor).
 *
 * Behavior: logs a ✅ per valid file. If any written .json is unparseable,
 * exits 2, which blocks the tool and forces the writer to fix it.
 */
const fs = require('fs');

const filePaths = (process.env.CLAUDE_FILE_PATHS || '')
  .split('\n')
  .filter(Boolean);

let failed = false;
let checked = 0;

for (const fp of filePaths) {
  // Skip non-JSON and dotfiles that aren't config
  if (!fp.endsWith('.json')) continue;
  // Ignore lockfiles/package metadata edge cases we don't want to block on
  if (fp.includes('node_modules')) continue;

  let raw;
  try {
    raw = fs.readFileSync(fp, 'utf-8');
  } catch (err) {
    console.error(`❌ Cannot read: ${fp} — ${err.message}`);
    failed = true;
    continue;
  }

  checked++;
  try {
    JSON.parse(raw);
    console.log(`✅ Valid JSON: ${fp}`);
  } catch (err) {
    console.error(`❌ INVALID JSON: ${fp} — ${err.message}`);
    failed = true;
  }
}

if (checked === 0) process.exit(0);

if (failed) {
  console.error('JSON validation hook: fix the invalid JSON above before proceeding.');
  process.exit(2);
}
process.exit(0);
