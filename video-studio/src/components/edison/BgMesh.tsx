import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";

export const BgMesh: React.FC<{ fps: number; scale: EdisonScale }> = ({
  fps,
  scale,
}) => {
  const frame = useCurrentFrame();
  // Slow breathing meshes at different frequencies
  const d1x = Math.sin(frame / (fps * 8)) * scale.size(120);
  const d1y = Math.cos(frame / (fps * 11)) * scale.size(80);
  const d2x = Math.sin(frame / (fps * 13) + 2) * scale.size(90);
  const d2y = Math.cos(frame / (fps * 17) + 1) * scale.size(60);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
      {/* Warm filament glow orb - top left */}
      <div
        style={{
          position: "absolute",
          width: scale.size(800),
          height: scale.size(800),
          borderRadius: "50%",
          top: scale.y(-300 + d1y),
          left: scale.x(-200 + d1x),
          filter: `blur(${scale.size(120)}px)`,
          background: `radial-gradient(circle, ${theme.colors.filament}33, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      {/* Brass accent orb - bottom right */}
      <div
        style={{
          position: "absolute",
          width: scale.size(600),
          height: scale.size(600),
          borderRadius: "50%",
          bottom: scale.y(-250 + d2y),
          right: scale.x(-150 - d2x),
          filter: `blur(${scale.size(100)}px)`,
          background: `radial-gradient(circle, ${theme.colors.brass}22, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      {/* Subtle parchment center glow */}
      <div
        style={{
          position: "absolute",
          width: scale.size(1000),
          height: scale.size(600),
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: `blur(${scale.size(200)}px)`,
          background: `radial-gradient(ellipse, ${theme.colors.parchment}11, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};