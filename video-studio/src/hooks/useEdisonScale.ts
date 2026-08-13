import { useVideoConfig } from "remotion";

/**
 * Edison documentary scale hook.
 * Design space: 1280×720 (25fps). Maps logical coordinates to render resolution.
 * Currently 1:1 since composition IS 1280×720, but provides future-proofing
 * and single point of truth for all coordinate math.
 */
export const useEdisonScale = () => {
  const { width, height, fps } = useVideoConfig();
  const scaleX = width / 1280;
  const scaleY = height / 720;

  return {
    width,
    height,
    fps,
    scaleX,
    scaleY,
    // Map a design-space value to render-space
    x: (val: number) => val * scaleX,
    y: (val: number) => val * scaleY,
    // Map a design-space size (font, width, height)
    size: (val: number) => val * Math.min(scaleX, scaleY),
    // Convenience: common design-space constants
    safeMargin: 128 * Math.min(scaleX, scaleY), // 10% of 1280
    titleSize: 96 * Math.min(scaleX, scaleY),
    subtitleSize: 32 * Math.min(scaleX, scaleY),
    bodySize: 24 * Math.min(scaleX, scaleY),
    monoSize: 18 * Math.min(scaleX, scaleY),
  };
};

export type EdisonScale = ReturnType<typeof useEdisonScale>;