import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";
import { EDISON_ASSETS } from "../../data/edison-asset-manifest";
import { ProceduralPlate } from "./ProceduralPlate";

interface KenBurnsImageProps {
  src: string; // relative to public/edison/
  zoom?: number; // default 1.08
  pan?: number; // default -25 (negative = left, positive = right)
  layer?: "hero" | "graphic";
  delayFrames?: number; // entrance delay
  durationFrames?: number; // override total duration
  scale: EdisonScale;
}

export const KenBurnsImage: React.FC<KenBurnsImageProps> = ({
  src,
  zoom = 1.08,
  pan = -25,
  layer = "hero",
  delayFrames = 0,
  durationFrames,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const totalFrames = durationFrames ?? durationInFrames;
  const localFrame = frame - delayFrames;

  const scaleAnim = interpolate(
    localFrame,
    [0, totalFrames],
    [1, zoom],
    { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const panAnim = interpolate(
    localFrame,
    [0, totalFrames],
    [0, pan],
    { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const entrance = interpolate(
    frame,
    [delayFrames, delayFrames + 20],
    [0, 1],
    { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Exit fade - last 12 frames
  const exit = interpolate(
    frame,
    [totalFrames - 12, totalFrames],
    [1, 0],
    { easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = entrance * exit;

  // Card styling per layer
  const isHero = layer === "hero";
  const cardStyle = isHero
    ? {
        borderRadius: scale.size(32),
        overflow: "hidden",
        border: `1px solid ${theme.colors.parchment}0A`,
        boxShadow: `0 ${scale.size(40)}px ${scale.size(80)}px -${scale.size(20)}px rgba(0,0,0,0.6)`,
      }
    : {};

  // Check manifest — if file missing, render procedural plate so render never 404s
  const hasRealAsset = EDISON_ASSETS.has(src);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scaleAnim}) translateX(${scale.x(panAnim)}px)`,
        ...cardStyle,
      }}
    >
      {hasRealAsset ? (
        <Img
          src={staticFile(`edison/${src}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <ProceduralPlate src={src} scale={scale} />
      )}
    </AbsoluteFill>
  );
};