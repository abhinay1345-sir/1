import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";
import { KenBurnsImage } from "../../components/edison/KenBurnsImage";
import { TextReveal } from "../../components/edison/TextReveal";
import type { EdisonSegment } from "../../data/edison-types";

export const S8_EndingScene: React.FC<{ segment: EdisonSegment; scale: EdisonScale }> = ({
  segment,
  scale,
}) => {
  const frame = useCurrentFrame();
  const startFrame = segment.startFrame!;
  const endFrame = segment.endFrame!;
  const totalFrames = endFrame - startFrame;

  // Final bulb glow pulse
  const pulseP = spring({ frame, fps: 25, config: { damping: 14, stiffness: 100, mass: 0.8 } });

  return (
    <AbsoluteFill>
      {/* Shot 1: Historical city night lit - 0-100 frames */}
      <KenBurnsImage
        src="historical_city_night_lit.jpg"
        zoom={1.05}
        pan={-15}
        layer="hero"
        delayFrames={0}
        durationFrames={totalFrames}
        scale={scale}
      />

      {/* Final title - large, glowing filament */}
      <TextReveal
        text="Was Edison simply selling a light bulb?"
        variant="title_end"
        delayFrames={10}
        perWord={true}
        scale={scale}
      />

      {/* Filament pulse overlay at center */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: scale.size(160),
          height: scale.size(160),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.filament}, ${theme.colors.filament}00 70%)`,
          opacity: interpolate(pulseP, [0, 1], [0.3, 0.7]),
          pointerEvents: "none",
          animation: `pulse 2s ease-in-out infinite`,
        }}
      />

      {/* Second question */}
      <TextReveal
        text="Not really."
        variant="title_end"
        delayFrames={totalFrames * 0.3}
        perWord={true}
        scale={scale}
      />

      {/* Final answer */}
      <TextReveal
        text="He was helping build a system in which electric light could become a normal part of everyday life."
        variant="body"
        delayFrames={totalFrames * 0.45}
        durationFrames={totalFrames * 0.5}
        scale={scale}
      />

      {/* Final thought */}
      <TextReveal
        text="The most powerful inventions don't always win because they're the most impressive."
        variant="body"
        delayFrames={totalFrames * 0.65}
        durationFrames={totalFrames * 0.35}
        scale={scale}
      />

      <TextReveal
        text="They win when someone figures out how to make people adopt them."
        variant="title_end"
        delayFrames={totalFrames * 0.75}
        perWord={true}
        scale={scale}
      />
    </AbsoluteFill>
  );
};