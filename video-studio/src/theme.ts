// theme.ts — Edison documentary single source of truth
// NEVER inline colors, easings, or spring configs in components.
// Palette: "Edison-amber" — custom warm historical palette per spec
import { Easing } from "remotion";

export const theme = {
  colors: {
    // 60/30/10: base / secondary / hero
    ink: "#1A130B",            // deep shadow / background base (60%)
    parchment: "#F5E6CC",      // secondary surfaces (30%)
    filament: "#FFB347",       // THE hero color — electricity, the "light" (10%)
    brass: "#B8860B",          // diagram lines, technical accents
    amber: "#8B5E3C",          // warm transitions, accents
    text: "#F5F0E8",           // warm white text on dark (per STYLE_BIBLE textOnDark)
    textDim: "#C9B896",        // dimmed body text
    grainDark: "rgba(0,0,0,0.15)",
  },
  fonts: {
    display: "Playfair Display",  // serif headings — premium historical
    body: "Inter",                // clean sans for body
    mono: "JetBrains Mono",       // technical/diagram
  },
  // Easing curves — NO LINEAR anywhere
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),      // easeOutExpo — entrances
    inOut: Easing.bezier(0.83, 0, 0.17, 1),   // easeInOutQuint — moves, Ken Burns
    in: Easing.bezier(0.7, 0, 0.84, 0),       // exits only
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // UI pops, words
    smooth: { damping: 20, stiffness: 90, mass: 1 },    // big elements
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, // playful accents
  },
} as const;

// fps-aware helpers (all timing derives from fps via useVideoConfig)
export const frames = (seconds: number, fps: number) => Math.round(seconds * fps);
export const seconds = (frames: number, fps: number) => frames / fps;