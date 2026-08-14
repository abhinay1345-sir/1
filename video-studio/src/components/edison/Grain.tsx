import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";

export const Grain: React.FC<{ fps: number; scale: EdisonScale }> = ({
  fps,
  scale,
}) => {
  const frame = useCurrentFrame();
  // Procedural film grain via animated SVG noise
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: `${scale.size(220)}px`,
        backgroundPosition: `${(frame * 7) % scale.size(220)}px ${(frame * 13) % scale.size(220)}px`,
        opacity: 0.06,
        mixBlendMode: "multiply",
      }}
    />
  );
};