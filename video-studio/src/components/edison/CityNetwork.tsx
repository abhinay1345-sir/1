import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";

interface CityNetworkProps {
  phase: "bulb" | "building" | "street" | "city" | "all";
  delayFrames?: number;
  scale: EdisonScale;
}

export const CityNetwork: React.FC<CityNetworkProps> = ({
  phase,
  delayFrames = 0,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Base city grid
  const gridSize = 8;
  const cellW = width / gridSize;
  const cellH = height / gridSize;

  const phases = ["bulb", "building", "street", "city", "all"] as const;
  const phaseIndex = phases.indexOf(phase);
  const activePhase = Math.min(phaseIndex, 4);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Background city blocks */}
      {Array.from({ length: gridSize * gridSize }).map((_, i) => {
        const col = i % gridSize;
        const row = Math.floor(i / gridSize);
        const x = col * cellW + cellW / 2;
        const y = row * cellH + cellH / 2;
        const distFromCenter = Math.hypot(col - gridSize / 2, row - gridSize / 2);
        const maxDist = Math.hypot(gridSize / 2, gridSize / 2);
        const normDist = distFromCenter / maxDist;

        // Delay based on distance from center (electrification spreads outward)
        const blockDelay = delayFrames + normDist * 30 + col * 2 + row * 2;

        const p = spring({
          frame: frame - blockDelay,
          fps: 25,
          config: theme.spring.smooth,
        });

        const isLit = normDist < 0.3 + (activePhase / 4) * 0.7;
        const glow = isLit
          ? interpolate(p, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: scale.x(x - cellW * 0.35),
              top: scale.y(y - cellH * 0.35),
              width: scale.size(cellW * 0.7),
              height: scale.size(cellH * 0.7),
              borderRadius: scale.size(4),
              background: isLit
                ? `radial-gradient(circle, ${theme.colors.filament}44, ${theme.colors.ink}88)`
                : theme.colors.ink,
              border: `1px solid ${isLit ? theme.colors.filament + "66" : theme.colors.parchment + "22"}`,
              boxShadow: isLit
                ? `0 0 ${scale.size(20)}px ${theme.colors.filament}44`
                : "none",
              opacity: interpolate(p, [0, 1], [0.15, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Central filament pulse - the "bulb" */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: scale.size(80),
          height: scale.size(80),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.filament}, ${theme.colors.filament}00 70%)`,
          opacity: 0.6,
          pointerEvents: "none",
          animation: `pulse 1.5s ease-in-out infinite`,
        }}
      />

      {/* Expanding ring waves for each phase transition */}
      {Array.from({ length: activePhase + 1 }).map((_, i) => {
        const ringDelay = delayFrames + i * 60;
        const ringP = spring({
          frame: frame - ringDelay,
          fps: 25,
          config: { damping: 18, stiffness: 60, mass: 1 },
        });
        return (
          <div
            key={`ring-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: scale.size(interpolate(ringP, [0, 1], [40, width * 1.5])),
              height: scale.size(interpolate(ringP, [0, 1], [40, width * 1.5])),
              borderRadius: "50%",
              border: `2px solid ${theme.colors.filament}`,
              opacity: interpolate(ringP, [0, 0.5, 1], [0.6, 0.3, 0]),
              pointerEvents: "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};