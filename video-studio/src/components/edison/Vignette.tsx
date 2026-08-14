import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";

export const Vignette: React.FC<{ fps: number; scale: EdisonScale }> = ({
  fps,
  scale,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 55%, ${theme.colors.ink}EE 100%)`,
    }}
  />
);