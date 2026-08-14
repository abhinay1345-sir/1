import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";

export const Grade: React.FC<{ fps: number; scale: EdisonScale }> = ({
  fps,
  scale,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {/* Filament warm overlay — soft-light unifies all assets */}
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.filament,
        mixBlendMode: "soft-light",
        opacity: 0.15,
        pointerEvents: "none",
      }}
    />
    {/* Vignette-style grade gradient — darker edges */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(0,0,0,0.12), transparent 30%, transparent 70%, rgba(0,0,0,0.18))`,
        pointerEvents: "none",
      }}
    />
    {/* Subtle horizontal warmth band through middle */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, transparent 40%, ${theme.colors.amber}08 50%, transparent 60%)`,
        pointerEvents: "none",
      }}
    />
  </AbsoluteFill>
);