import React from "react";
import {
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";

interface MusicLayerProps {
  src: string;          // e.g. "edison/music/background.mp3"
  baseVolume?: number;  // default 0.16
  fadeInFrames?: number; // default 2.5s @ 25fps = 63
  fadeOutFrames?: number; // default 3s @ 25fps = 75
  delayFrames?: number; // start delay
}

/**
 * Background music with smooth fade-in/out.
 * Renders as a separate swappable <Audio> layer so any track can be swapped
 * by replacing the file in public/ and re-rendering.
 */
export const MusicLayer: React.FC<MusicLayerProps> = ({
  src,
  baseVolume = 0.16,
  fadeInFrames = 63,  // 2.5s at 25fps
  fadeOutFrames = 75, // 3.0s at 25fps
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Normalized envelopes (0..1), multiplied for the combined curve
  const fadeIn = interpolate(
    frame,
    [delayFrames, delayFrames + fadeInFrames],
    [0, 1],
    { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeOutFrames, durationInFrames],
    [1, 0],
    { easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const volume = fadeIn * fadeOut * baseVolume;

  return <Audio src={staticFile(src)} volume={volume} />;
};