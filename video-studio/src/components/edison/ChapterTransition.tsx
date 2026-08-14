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

interface ChapterTransitionProps {
  chapterNumber: number;
  chapterTitle: string;
  delayFrames?: number;
  scale: EdisonScale;
}

export const ChapterTransition: React.FC<ChapterTransitionProps> = ({
  chapterNumber,
  chapterTitle,
  delayFrames = 0,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // Three-phase: line draw -> number reveal -> title reveal
  const lineP = spring({ frame: frame - delayFrames, fps: 25, config: theme.spring.smooth });
  const numP = spring({ frame: frame - delayFrames - 15, fps: 25, config: theme.spring.snappy });
  const titleP = spring({ frame: frame - delayFrames - 30, fps: 25, config: theme.spring.smooth });

  const lineWidth = interpolate(lineP, [0, 1], [0, scale.x(400)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numScale = interpolate(numP, [0, 1], [2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: scale.size(16) }}>
      {/* Chapter number - filament glow */}
      <div
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: scale.size(96),
          fontWeight: 700,
          color: theme.colors.filament,
          opacity: interpolate(numP, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${numScale})`,
          textShadow: `0 0 ${scale.size(40)}px ${theme.colors.filament}88`,
        }}
      >
        {chapterNumber.toString().padStart(2, "0")}
      </div>

      {/* Expanding line */}
      <div
        style={{
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${theme.colors.filament}, transparent)`,
          opacity: interpolate(lineP, [0, 0.5, 1], [0, 1, 0.4]),
        }}
      />

      {/* Chapter title */}
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: scale.subtitleSize * 1.5,
          fontWeight: 500,
          color: theme.colors.text,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: titleOpacity,
          transform: `translateY(${interpolate(titleOpacity, [0, 1], [20, 0])}px)`,
        }}
      >
        {chapterTitle}
      </div>
    </AbsoluteFill>
  );
};