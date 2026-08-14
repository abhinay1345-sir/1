#!/usr/bin/env node
/**
 * generate-narration.mjs — Generate narration WAVs for Edison documentary
 * Uses edge-tts (en-US-ChristopherNeural at rate -8%) per segment.
 * Outputs per-segment WAVs to the project folder for deterministic renders.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';

const PROJECT_ID = "2026-08-13_edison-light-bulb";
const PROJECT_DIR = path.join(os.homedir(), 'gdrive', 'documentary-factory', 'projects', PROJECT_ID);
const AUDIO_DIR = path.join(PROJECT_DIR, '05_audio', 'voiceover');

const NARRATION_SEGMENTS = [
  { id: "s1_title", text: "" }, // Title card - no narration
  {
    id: "s2_problem",
    text: "For most of human history, night was a barrier. After sunset, the world ran on fire — candles, oil lamps, gas jets. They flickered. They smoked. They burned the air you breathed. In London, Paris, New York, the streets after dark were pools of shadow, lit only by hissing gas mantles that stained the walls and poisoned the lungs. Factories stopped. Streets emptied. The productive day ended when the sun went down. The question wasn't whether electric light could work — it was whether anyone would trust it enough to let it into their homes."
  },
  {
    id: "s3_challenge",
    text: "By 1878, electric light wasn't new. Arc lamps blasted public squares with harsh, buzzing light. But for homes and offices, you needed something gentler — a filament that glowed without burning up in minutes. Dozens of inventors had tried. Swan in England. Maxim in America. Their lamps worked — briefly. The real problem wasn't the bulb. It was everything around it. A lamp needs current. Current needs a generator. A generator needs fuel. The current must travel through wires — safely, reliably — to a meter, to a socket, to the lamp. And the customer must pay for it. Edison realized: he wasn't inventing a light bulb. He was inventing an entire electrical system. Generator. Wires. Meters. Sockets. Lamps. All of it. Or none of it worked."
  },
  {
    id: "s4_demo",
    text: "People don't adopt what they can't see. So Edison made them see it. December 1879. Menlo Park. He strung lamps along the laboratory grounds — a street of electric light in the middle of a New Jersey winter. Three thousand people came. They walked the paths under steady, smokeless glow. No hiss of gas. No smell of oil. Just light, clean and constant. Newspapers called it 'a fairyland of light.' The demonstration wasn't a stunt. It was the core strategy: make the abstract tangible. Let people stand in the future you're selling. Once they've seen it, they can't unsee it. The orders started coming before the wires were even laid."
  },
  {
    id: "s5_system",
    text: "You couldn't just sell a bulb. The customer had no wires, no current, no meter. So Edison sold the whole thing. The Edison Electric Light Company didn't market lamps — it marketed light as a service. One bulb. Then one building — the Merchant's Safe Deposit Company, 1881. Then one street. Then a district. The system diagram wasn't a slide. It was the business model. Generator in the basement. Wires in the walls. Meters at the panel. Lamps in the sockets. You paid for light, not hardware. This was the shift: from product to infrastructure. From invention to utility. The bulb was the visible tip. The system was the iceberg underneath."
  },
  {
    id: "s6_pearl",
    text: "September 4, 1882. Pearl Street, Lower Manhattan. Six Jumbo generators — each the size of a locomotive — spun up. Steam hissed. Copper conductors ran through brick tunnels beneath the streets. When the switch closed, fifty-nine customers in a quarter-square-mile district saw their lamps glow. The New York Times building. The Drexel, Morgan & Co. offices. The New York Stock Exchange. It wasn't a demonstration anymore. It was a service. You flipped a switch. Light appeared. You paid a bill. The system worked. Pearl Street proved the model: central generation, underground distribution, metered delivery. Within a year, the district expanded. Within a decade, the model spread to every major city. The invention had become a utility."
  },
  {
    id: "s7_lesson",
    text: "The lesson isn't about Edison. It's about adoption. A revolutionary invention fails if nobody understands how to use it. The telephone needed exchanges. The automobile needed roads and gas stations. The personal computer needed software and networks. The electric car needed charging infrastructure. Edison understood: don't merely sell the invention. Build the environment that makes the invention useful. The bulb was brilliant. But the system — generators, wires, meters, sockets, billing, service — that was the real invention. Today, every platform company follows the same playbook. They don't just ship code. They build the ecosystem the code lives in."
  },
  {
    id: "s8_ending",
    text: "So. Was Edison simply selling a light bulb? Not really. He was helping build a system in which electric light could become a normal part of everyday life. The most powerful inventions don't always win because they're the most impressive. They win when someone figures out how to make people adopt them."
  },
];

const VOICE = "en-US-ChristopherNeural";
const RATE = "-8%";

async function main() {
  // Ensure directories exist
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  console.log(`Generating narration for ${PROJECT_ID}...`);
  console.log(`Voice: ${VOICE} at rate ${RATE}`);
  console.log(`Output: ${AUDIO_DIR}\n`);

  // Write the full narration script for reference
  const scriptPath = path.join(PROJECT_DIR, 'narration-script.txt');
  let fullScript = `EDISON DOCUMENTARY — NARRATION SCRIPT\n`;
  fullScript += `Project: ${PROJECT_ID}\n`;
  fullScript += `Voice: ${VOICE} at rate ${RATE}\n`;
  fullScript += `Generated: ${new Date().toISOString()}\n\n`;

  for (const seg of NARRATION_SEGMENTS) {
    fullScript += `=== ${seg.id.toUpperCase()} ===\n${seg.text}\n\n`;
  }
  fs.writeFileSync(scriptPath, fullScript);
  console.log(`Full script written to: ${scriptPath}`);

  // Generate per-segment WAVs
  for (const seg of NARRATION_SEGMENTS) {
    if (!seg.text.trim()) {
      console.log(`${seg.id}: (silent - title card)`);
      continue;
    }

    const outPath = path.join(AUDIO_DIR, `${seg.id}.wav`);
    const tempTextPath = path.join(os.tmpdir(), `${seg.id}.txt`);

    // Skip if already generated AND FORCE flag not set (resumable)
    if (!process.env.FORCE_REGEN && fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
      console.log(`${seg.id}: already exists, skipping`);
      continue;
    }

    fs.writeFileSync(tempTextPath, seg.text);

    console.log(`Generating ${seg.id}...`);

    try {
      // edge-tts --voice VOICE --rate=RATE --text "..." --write-media OUT.wav
      execSync(
        `edge-tts --voice "${VOICE}" --rate="${RATE}" --file "${tempTextPath}" --write-media "${outPath}"`,
        { stdio: 'pipe', timeout: 180000 }
      );

      const stats = fs.statSync(outPath);
      console.log(`  ✓ ${outPath} (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      process.exit(1);
    } finally {
      try { fs.unlinkSync(tempTextPath); } catch (_) {}
    }
  }

  // NO concatenation needed — we use per-segment audio (separate swappable layers per C3)
  // Just create a segments manifest for the mix pipeline & timeline
  const segmentDurations = {};
  for (const seg of NARRATION_SEGMENTS) {
    if (!seg.text.trim()) continue;
    const outPath = path.join(AUDIO_DIR, `${seg.id}.wav`);
    const durOut = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outPath}"`,
      { encoding: 'utf-8' }
    );
    segmentDurations[seg.id] = parseFloat(durOut.trim());
  }

  const manifestPath = path.join(PROJECT_DIR, 'narration-manifest.json');
  const totalDur = Object.values(segmentDurations).reduce((a, b) => a + b, 0) + 0.8 * (Object.keys(segmentDurations).length - 1);
  fs.writeFileSync(manifestPath, JSON.stringify({
    projectId: PROJECT_ID,
    voice: VOICE,
    rate: RATE,
    segments: NARRATION_SEGMENTS.filter(s => s.text.trim()).map(s => ({
      id: s.id,
      duration: segmentDurations[s.id],
    })),
    totalDuration: totalDur,
  }, null, 2));
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Total narration duration (with 0.8s gaps): ${totalDur.toFixed(1)}s = ${(totalDur/60).toFixed(1)}min`);

  console.log('\n✅ Narration generation complete.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});