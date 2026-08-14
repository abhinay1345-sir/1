import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";
import { KenBurnsImage } from "../../components/edison/KenBurnsImage";
import { TextReveal } from "../../components/edison/TextReveal";
import { ChapterTransition } from "../../components/edison/ChapterTransition";
import type { EdisonSegment } from "../../data/edison-types";

export const TitleScene: React.FC<{ segment: EdisonSegment; scale: EdisonScale }> = ({
  segment,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Filament drawing animation - procedural
  const filamentP = spring({ frame, fps: 25, config: { damping: 12, stiffness: 180, mass: 0.5 } });
  const drawProgress = spring({ frame: frame - 5, fps: 25, config: theme.spring.snappy });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
      {/* Procedural filament animation - always renders */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <svg
          width={scale.x(400)}
          height={scale.x(200)}
          viewBox="0 0 400 200"
          style={{
            opacity: interpolate(filamentP, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(filamentP, [0, 1], [0.8, 1])})`,
          }}
        >
          {/* Filament glow base */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Bulb outline */}
          <path
            d="M200 30 Q280 30 280 100 Q280 170 200 170 Q120 170 120 100 Q120 30 200 30"
            fill="none"
            stroke={theme.colors.parchment}
            strokeWidth={2}
            opacity={0.4}
          />
          {/* Filament - draws progressively */}
          <path
            d="M200 50 Q200 70 190 90 Q180 110 200 130 Q220 110 210 90 Q200 70 200 50"
            fill="none"
            stroke={theme.colors.filament}
            strokeWidth={3}
            strokeLinecap="round"
            filter="url(#glow)"
            strokeDasharray={120}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [120, 0])}
            opacity={interpolate(filamentP, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />
          {/* Inner filament glow */}
          <path
            d="M200 50 Q200 70 190 90 Q180 110 200 130 Q220 110 210 90 Q200 70 200 50"
            fill="none"
            stroke={theme.colors.filament}
            strokeWidth={1}
            strokeLinecap="round"
            opacity={interpolate(filamentP, [0, 1], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            strokeDasharray={120}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [120, 0])}
          />
        </svg>
      </div>

      {/* Title text */}
      <TextReveal
        text="The Bulb Wasn't Enough"
        variant="title"
        delayFrames={10}
        perWord={true}
        scale={scale}
      />

      {/* Subtitle */}
      <TextReveal
        text="Edison & the adoption of electric light"
        variant="subtitle"
        delayFrames={35}
        perWord={true}
        scale={scale}
      />

      {/* Optional: Ken Burns image if available */}
      <KenBurnsImage
        src="edison_menlo_park_portrait.jpg"
        zoom={1.05}
        pan={-15}
        layer="hero"
        delayFrames={0}
        durationFrames={durationInFrames}
        scale={scale}
      />
    </AbsoluteFill>
  );
};