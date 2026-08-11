export type DocumentaryImage = {
  file?: string;
  path?: string;
  local_path?: string;
  type?: string;
};

export type DocumentaryManifestSegment = {
  id?: string;
  title?: string;
  images?: DocumentaryImage[];
  overlays?: DocumentaryImage[];
};

export type DocumentaryManifest = {
  project_id?: string;
  title?: string;
  segments?: DocumentaryManifestSegment[];
};

export type DocumentarySegment = {
  id: string;
  title: string;
  durationSeconds: number;
  heroSrc: string;
  supportSrc: string;
  overlaySrc?: string;
  audioSrc?: string;
};

export type DocumentaryProject = {
  title: string;
  segments: DocumentarySegment[];
  audioFile?: string;
};

import { staticFile } from "remotion";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='100%25' height='100%25' fill='%230a0a0f'/%3E%3C/svg%3E";

/**
 * Resolve an asset URL for use in <Img>/<Audio> during render or studio.
 * Data/http(s) URLs pass through; public/ paths are resolved via staticFile().
 */
export const resolveRenderAsset = (source?: string): string => {
  if (!source) return PLACEHOLDER;
  if (source.startsWith("data:") || source.startsWith("http://") || source.startsWith("https://")) return source;
  if (source.startsWith("/runtime/")) return staticFile(source);
  if (source.startsWith("/")) return staticFile(source);
  return source;
};

/**
 * Resolve an asset reference to a URL Remotion can load.
 * Supports: data:/http(s) URLs passed through, `/runtime/...` static paths
 * (served from public/), `file://` URLs (stripped to their public-relative
 * path), and bare relative paths resolved against `baseDir`.
 */
export const resolveAsset = (source?: string, baseDir?: string): string => {
  if (!source) return PLACEHOLDER;
  if (source.startsWith("data:") || source.startsWith("http://") || source.startsWith("https://")) return source;
  if (source.startsWith("/runtime/")) return source;
  if (source.startsWith("file://")) {
    const p = source.replace(/^file:\/\//, "");
    const idx = p.indexOf("/public/");
    const rel = idx >= 0 ? p.slice(idx + "/public/".length) : p.replace(/^\/+/, "");
    return `/${rel}`;
  }
  if (source.startsWith("/")) return source;
  return baseDir ? `/${baseDir.replace(/^\/+|\/+$/g, "")}/${source.replace(/^\/+/, "")}` : source;
};

const sourceFor = (image?: DocumentaryImage): string | undefined =>
  image?.local_path || image?.path || image?.file;

export const normalizeManifest = (
  manifest: DocumentaryManifest,
  baseDir: string,
  durations: Record<string, number> = {},
): DocumentaryProject => ({
  title: manifest.title || manifest.project_id || "Documentary",
  segments: (manifest.segments || []).map((segment, index) => {
    const images = segment.images || [];
    const hero = sourceFor(images.find((image) => image.file?.includes("_hero")) || images[0]);
    const support = sourceFor(images.find((image) => image.file?.includes("_support_01")) || images[1]) || hero;
    const overlay = sourceFor((segment.overlays || []).find((image) => image.type === "lower_third") || segment.overlays?.[0]);
    const id = segment.id || `segment_${String(index + 1).padStart(2, "0")}`;
    return {
      id,
      title: segment.title || `Chapter ${index + 1}`,
      durationSeconds: Math.max(1, durations[id] || 10),
      heroSrc: resolveAsset(hero, baseDir),
      supportSrc: resolveAsset(support || hero, baseDir),
      overlaySrc: overlay ? resolveAsset(overlay, baseDir) : undefined,
    };
  }),
});

export { PLACEHOLDER };
