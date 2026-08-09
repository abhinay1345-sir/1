import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { loadState, updateAgentStatus, getProjectPath, saveBinary, saveJson } from '../lib/drive.js';
import config from '../../config/index.js';

/**
 * Agent 4: Asset Collector
 *
 * Collects visual assets for each script segment:
 * 1. Pexels stock photos (if API key set)
 * 2. Pollinations.ai free image generation (always available)
 * 3. Simple SVG title cards as overlays
 *
 * Input:  03_script.json (visual_prompts per segment)
 * Output: 04_assets/images/, clips/, overlays/
 *         04_assets/manifest.json
 */

const LOCAL_ASSETS = '/tmp/docfactory_assets';

/**
 * Download a URL to a local file
 */
async function downloadFile(url, destPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const curlArgs = ['-fsSL', '--max-time', '90', '-o', destPath];
    for (const [k, v] of Object.entries(headers)) {
      curlArgs.push('-H', `${k}: ${v}`);
    }
    curlArgs.push(url);

    const proc = spawn('curl', curlArgs);
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
        resolve(destPath);
      } else {
        reject(new Error(`Download failed (code ${code}): ${stderr || url}`));
      }
    });
    proc.on('error', reject);
  });
}

/**
 * Search Pexels for photos
 */
async function searchPexels(query, perPage = 3) {
  const key = config.pexelsApiKey;
  if (!key || key.includes('your_') || key.includes('placeholder') || key.length < 10) {
    return [];
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: key },
    });
    if (!res.ok) {
      console.warn(`      Pexels HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    return (data.photos || []).map((p) => ({
      url: p.src?.large2x || p.src?.large || p.src?.original,
      photographer: p.photographer,
      source: 'pexels',
      id: p.id,
    })).filter((p) => p.url);
  } catch (err) {
    console.warn(`      Pexels error: ${err.message}`);
    return [];
  }
}

/**
 * Generate image via Pollinations.ai (free, no key)
 * https://image.pollinations.ai/prompt/{prompt}
 */
async function generatePollinations(prompt, destPath, width = 1920, height = 1080) {
  // Clean prompt for URL
  const clean = prompt
    .replace(/[^\w\s,.-]/g, '')
    .substring(0, 200)
    .trim();
  const encoded = encodeURIComponent(clean);
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

  await downloadFile(url, destPath);
  return destPath;
}

/**
 * Create a simple title-card PNG via ffmpeg (lavfi)
 */
async function createTitleCard(title, subtitle, destPath) {
  const safeTitle = title.replace(/'/g, '').replace(/:/g, ' -').substring(0, 60);
  const safeSub = (subtitle || '').replace(/'/g, '').replace(/:/g, ' -').substring(0, 80);

  return new Promise((resolve, reject) => {
    const vf = [
      `drawtext=text='${safeTitle}':fontsize=64:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-40:font=Sans`,
      `drawtext=text='${safeSub}':fontsize=32:fontcolor=#cccccc:x=(w-text_w)/2:y=(h-text_h)/2+40:font=Sans`,
    ].join(',');

    const args = [
      '-y',
      '-f', 'lavfi', '-i', 'color=c=#0a0a0a:s=1920x1080:d=1',
      '-vf', vf,
      '-frames:v', '1',
      destPath,
    ];

    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(destPath)) resolve(destPath);
      else reject(new Error(`Title card failed: ${stderr.slice(-200)}`));
    });
    proc.on('error', reject);
  });
}

/**
 * Safe copy to Drive with local fallback
 */
function saveAsset(localPath, drivePath) {
  fs.mkdirSync(path.dirname(drivePath), { recursive: true });
  try {
    fs.copyFileSync(localPath, drivePath);
    return drivePath;
  } catch (err) {
    console.warn(`      ⚠️ Drive copy failed for ${path.basename(drivePath)}: ${err.message}`);
    return localPath;
  }
}

/**
 * Build search query from segment
 */
function buildQuery(topic, segment, promptObj) {
  if (promptObj?.prompt) {
    // Take first few meaningful words, strip style keywords for stock search
    return promptObj.prompt
      .split(',')[0]
      .replace(/documentary|cinematic|historical|photograph|aesthetic|vintage|archival|sepia|Ken Burns/gi, '')
      .trim()
      .substring(0, 80) || topic;
  }
  return `${topic} ${segment.title}`.substring(0, 80);
}

/**
 * Run the Asset Collector agent
 * @param {string} projectId
 * @returns {Promise<{assets: object, manifest: object}>}
 */
export async function run(projectId) {
  console.log(`\n🖼️  Agent 4: Asset Collector`);

  const state = loadState(projectId);
  const projectPath = getProjectPath(projectId);

  const scriptPath = path.join(projectPath, '03_script.json');
  if (!fs.existsSync(scriptPath)) {
    throw new Error('03_script.json not found. Run Scriptwriter first.');
  }
  const script = JSON.parse(fs.readFileSync(scriptPath, 'utf-8'));

  // Topic for queries
  let topic = script.title || projectId;
  try {
    const topicData = JSON.parse(fs.readFileSync(path.join(projectPath, '01_topic.json'), 'utf-8'));
    topic = topicData.topic || topicData.slug || topic;
  } catch (_) {}

  console.log(`   Collecting assets for: ${script.title}`);
  console.log(`   Segments: ${script.segments.length}`);

  updateAgentStatus(projectId, 'agent_04_asset_collector', 'in_progress');

  // Local working dirs
  const localImages = path.join(LOCAL_ASSETS, 'images');
  const localOverlays = path.join(LOCAL_ASSETS, 'overlays');
  const localClips = path.join(LOCAL_ASSETS, 'clips');
  [localImages, localOverlays, localClips].forEach((d) => fs.mkdirSync(d, { recursive: true }));

  const driveImages = path.join(projectPath, '04_assets', 'images');
  const driveOverlays = path.join(projectPath, '04_assets', 'overlays');
  fs.mkdirSync(driveImages, { recursive: true });
  fs.mkdirSync(driveOverlays, { recursive: true });

  const manifest = {
    project_id: projectId,
    title: script.title,
    collected_at: new Date().toISOString(),
    segments: [],
  };

  let totalImages = 0;

  for (let i = 0; i < script.segments.length; i++) {
    const segment = script.segments[i];
    const segNum = String(i + 1).padStart(2, '0');
    const segAssets = {
      id: segment.id || `segment_${segNum}`,
      title: segment.title,
      images: [],
      overlays: [],
    };

    console.log(`   📸 Segment ${segNum}: ${segment.title}`);

    const prompts = segment.visual_prompts || [
      { type: 'image', prompt: `${topic}, ${segment.title}, documentary style` },
    ];

    // Collect up to 2 images per segment
    let imagesGot = 0;
    const targetImages = 2;

    // 1) Try Pexels for first prompt
    for (const p of prompts) {
      if (imagesGot >= targetImages) break;
      if (p.type === 'clip') continue;

      const query = buildQuery(topic, segment, p);
      const pexelsResults = await searchPexels(query, 2);

      for (const photo of pexelsResults) {
        if (imagesGot >= targetImages) break;
        const fname = `segment_${segNum}_${imagesGot === 0 ? 'hero' : `support_0${imagesGot}`}.jpg`;
        const localPath = path.join(localImages, fname);
        try {
          console.log(`      ↓ Pexels: ${query.substring(0, 40)}...`);
          await downloadFile(photo.url, localPath);
          const finalPath = saveAsset(localPath, path.join(driveImages, fname));
          segAssets.images.push({
            file: fname,
            path: finalPath,
            local_path: localPath,
            source: 'pexels',
            photographer: photo.photographer,
            prompt: query,
          });
          imagesGot++;
          totalImages++;
          console.log(`      ✅ ${fname} (pexels)`);
        } catch (err) {
          console.warn(`      ⚠️ Pexels download failed: ${err.message}`);
        }
      }
    }

    // 2) Fill remaining with Pollinations AI generation
    while (imagesGot < targetImages) {
      const promptObj = prompts[imagesGot] || prompts[0] || {
        prompt: `${topic}, ${segment.title}, cinematic documentary photograph, dramatic lighting`,
      };
      const genPrompt = (promptObj.prompt || `${topic} ${segment.title}`)
        + ', photorealistic, cinematic lighting, documentary still, high detail, 4k';
      const fname = `segment_${segNum}_${imagesGot === 0 ? 'hero' : `support_0${imagesGot}`}.jpg`;
      const localPath = path.join(localImages, fname);

      try {
        console.log(`      🎨 Pollinations: ${genPrompt.substring(0, 50)}...`);
        await generatePollinations(genPrompt, localPath);
        const finalPath = saveAsset(localPath, path.join(driveImages, fname));
        segAssets.images.push({
          file: fname,
          path: finalPath,
          local_path: localPath,
          source: 'pollinations',
          prompt: genPrompt,
        });
        imagesGot++;
        totalImages++;
        console.log(`      ✅ ${fname} (pollinations)`);
      } catch (err) {
        console.warn(`      ⚠️ Image gen failed: ${err.message}`);
        // Create a solid-color placeholder so editor still has something
        try {
          await createColorPlaceholder(localPath, '#1a1a2e');
          const finalPath = saveAsset(localPath, path.join(driveImages, fname));
          segAssets.images.push({
            file: fname,
            path: finalPath,
            local_path: localPath,
            source: 'placeholder',
            prompt: genPrompt,
          });
          imagesGot++;
          totalImages++;
          console.log(`      ✅ ${fname} (placeholder)`);
        } catch (e2) {
          console.warn(`      ⚠️ Placeholder also failed: ${e2.message}`);
          break;
        }
      }
    }

    // 3) Title overlay card for segment
    try {
      const overlayName = `lower_third_${segNum}.png`;
      const localOverlay = path.join(localOverlays, overlayName);
      await createTitleCard(segment.title, script.title, localOverlay);
      const finalOverlay = saveAsset(localOverlay, path.join(driveOverlays, overlayName));
      segAssets.overlays.push({
        file: overlayName,
        path: finalOverlay,
        local_path: localOverlay,
        type: 'lower_third',
      });
      console.log(`      ✅ ${overlayName}`);
    } catch (err) {
      console.warn(`      ⚠️ Overlay failed: ${err.message}`);
    }

    manifest.segments.push(segAssets);
  }

  // Title card + end card
  try {
    const titleCard = path.join(localOverlays, 'title_card.png');
    await createTitleCard(script.title, 'A Documentary', titleCard);
    saveAsset(titleCard, path.join(driveOverlays, 'title_card.png'));
    manifest.title_card = { file: 'title_card.png', local_path: titleCard };

    const endCard = path.join(localOverlays, 'end_card.png');
    await createTitleCard('Thank You for Watching', script.title, endCard);
    saveAsset(endCard, path.join(driveOverlays, 'end_card.png'));
    manifest.end_card = { file: 'end_card.png', local_path: endCard };
  } catch (err) {
    console.warn(`   ⚠️ Title/end cards failed: ${err.message}`);
  }

  // Save manifest locally and on Drive
  const localManifest = path.join(LOCAL_ASSETS, 'manifest.json');
  fs.writeFileSync(localManifest, JSON.stringify(manifest, null, 2));
  try {
    fs.writeFileSync(path.join(projectPath, '04_assets', 'manifest.json'), JSON.stringify(manifest, null, 2));
  } catch (err) {
    console.warn(`   ⚠️ Could not write manifest to Drive: ${err.message}`);
  }

  console.log(`   ✅ Collected ${totalImages} images across ${manifest.segments.length} segments`);

  updateAgentStatus(projectId, 'agent_04_asset_collector', 'completed', {
    images: totalImages,
    segments: manifest.segments.length,
    completed_at: new Date().toISOString(),
  });

  return { assets: manifest, manifest };
}

/**
 * Solid color JPEG placeholder via ffmpeg
 */
function createColorPlaceholder(destPath, color = '#1a1a2e') {
  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-f', 'lavfi', '-i', `color=c=${color}:s=1920x1080:d=1`,
      '-frames:v', '1',
      destPath,
    ];
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve(destPath);
      else reject(new Error(stderr.slice(-150)));
    });
    proc.on('error', reject);
  });
}

/**
 * Display asset preview summary
 */
export function displayAssets(manifest) {
  console.log('\n' + '─'.repeat(60));
  console.log('🖼️  ASSET PREVIEW');
  console.log('─'.repeat(60));
  for (const seg of manifest.segments || []) {
    console.log(`\n  ${seg.id}: ${seg.title}`);
    for (const img of seg.images || []) {
      console.log(`    📷 ${img.file} [${img.source}]`);
    }
    for (const ov of seg.overlays || []) {
      console.log(`    🏷️  ${ov.file}`);
    }
  }
  console.log('\n' + '─'.repeat(60));
}

export default { run, displayAssets };
