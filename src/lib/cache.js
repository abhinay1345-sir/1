import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

/**
 * Simple disk-backed cache for expensive, repeatable operations
 * (Wikipedia scrapes, stock photo lookups, image downloads).
 *
 * Stored under ${TMPDIR}/docfactory_cache/ so it never hits the rclone
 * mount and is auto-cleaned by the OS.
 */

const CACHE_DIR = process.env.DOCFACTORY_CACHE_DIR
  || path.join(os.tmpdir(), 'docfactory_cache');

function ensureDir() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Build a stable cache key from any serializable parts
 * @param  {...string|number} parts
 * @returns {string}
 */
export function cacheKey(...parts) {
  const raw = parts.map(p => String(p)).join('|');
  return crypto.createHash('md5').update(raw).digest('hex');
}

/**
 * Read a value from the cache. Returns null on miss or corruption.
 * @param {string} key
 * @returns {string|null}
 */
export function cacheGet(key) {
  const file = path.join(CACHE_DIR, `${key}.txt`);
  try {
    if (!fs.existsSync(file)) return null;
    const meta = JSON.parse(fs.readFileSync(`${file}.meta`, 'utf-8'));
    // Reject expired entries
    if (meta.expires && Date.now() > meta.expires) {
      fs.unlinkSync(file);
      return null;
    }
    return fs.readFileSync(file, 'utf-8');
  } catch (_) {
    return null;
  }
}

/**
 * Write a value to the cache.
 * @param {string} key
 * @param {string} value
 * @param {object} [opts] - { ttlSeconds }
 */
export function cacheSet(key, value, opts = {}) {
  try {
    ensureDir();
    const file = path.join(CACHE_DIR, `${key}.txt`);
    fs.writeFileSync(file, value);
    fs.writeFileSync(`${file}.meta`, JSON.stringify({
      createdAt: Date.now(),
      expires: opts.ttlSeconds
        ? Date.now() + opts.ttlSeconds * 1000
        : null,
    }));
  } catch (err) {
    console.warn(`      ⚠️ Cache write failed: ${err.message}`);
  }
}

/**
 * Cache the result of an async fn, keyed by a hash of the args.
 * @param {string} key
 * @param {() => Promise<any>} fn
 * @param {object} [opts] - { ttlSeconds, serialize, deserialize }
 * @returns {Promise<any>}
 */
export async function cacheAsync(key, fn, opts = {}) {
  const serialize = opts.serialize || ((v) => JSON.stringify(v));
  const deserialize = opts.deserialize || ((s) => JSON.parse(s));

  const hit = cacheGet(key);
  if (hit !== null) {
    try {
      return deserialize(hit);
    } catch (_) {
      // Corrupt payload — fall through and re-run
    }
  }

  const value = await fn();
  cacheSet(key, serialize(value), opts);
  return value;
}

export default { cacheKey, cacheGet, cacheSet, cacheAsync, CACHE_DIR };
