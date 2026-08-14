// edison-types.ts — Type definitions for the Edison documentary
// Re-exported from edison-script.ts for consumers

export type EdisonSegment = {
  id: string;
  act: "title" | "act1" | "act2" | "act3a" | "act3b" | "act4" | "act5" | "act6";
  startSec: number;
  endSec: number;
  durationSec: number;
  narration: string;
  shots: EdisonShot[];
  // Runtime-added fields (populated in edison-script.ts)
  startFrame?: number;
  endFrame?: number;
};

export type EdisonShot = {
  id: string;
  type: "photo" | "animation" | "text" | "graphic_subview";
  src: string;
  startFrame: number;
  endFrame: number;
  layer: "hero" | "graphic" | "title" | "subtitle" | "lower_third" | "title_end";
  kenBurns?: { zoom: number; pan: number };
};

export type EdisonProps = {
  title?: string;
  subtitle?: string;
  audioFile?: string;
};

// Composition constants
export const FPS = 25;
export const WIDTH = 1280;
export const HEIGHT = 720;