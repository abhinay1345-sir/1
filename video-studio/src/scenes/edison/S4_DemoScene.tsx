import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";
import { KenBurnsImage } from "../../components/edison/KenBurnsImage";
import { TextReveal } from "../../components/edison/TextReveal";
import { ChapterTransition } from "../../components/edison/ChapterTransition";
import type { EdisonSegment } from "../../data/edison-types";

export const S4_DemoScene: React.FC<{ segment: EdisonSegment; scale: EdisonScale }> = ({
  segment,
  scale,
}) => {
  const startFrame = segment.startFrame!;
  const endFrame = segment.endFrame!;
  const totalFrames = endFrame - startFrame;

  return (
    <AbsoluteFill>
      <ChapterTransition chapterNumber={3} chapterTitle="The Demonstration" delayFrames={0} scale={scale} />

      {/* Shot 1: Crowd at Menlo Park - 0-100 frames */}
      <KenBurnsImage
        src="crowd_at_menlo_park.jpg"
        zoom={1.06}
        pan={-20}
        layer="hero"
        delayFrames={0}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="December 1879. Menlo Park. Three thousand people came."
        variant="lower_third"
        delayFrames={10}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 2: Menlo Park lamps path - 90-190 frames */}
      <KenBurnsImage
        src="menlo_park_lamps_path.jpg"
        zoom={1.08}
        pan={25}
        layer="hero"
        delayFrames={90}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="They walked paths under steady, smokeless glow. No hiss of gas. No smell of oil."
        variant="lower_third"
        delayFrames={100}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 3: Edison at demo - 180-280 frames */}
      <KenBurnsImage
        src="edison_at_demo.jpg"
        zoom={1.05}
        pan={-10}
        layer="hero"
        delayFrames={180}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Newspapers called it 'a fairyland of light.'"
        variant="lower_third"
        delayFrames={190}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 4: Lamp closeup glowing - 270-370 frames */}
      <KenBurnsImage
        src="lamp_closeup_glowing.jpg"
        zoom={1.12}
        pan={0}
        layer="hero"
        delayFrames={270}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="The demonstration wasn't a stunt. It was the core strategy."
        variant="lower_third"
        delayFrames={280}
        durationFrames={90}
        scale={scale}
      />
      <TextReveal
        text="Make the abstract tangible. Let people stand in the future you're selling."
        variant="lower_third"
        delayFrames={370}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 5: Menlo Park exterior night - 460-560 frames */}
      <KenBurnsImage
        src="menlo_park_exterior_night.jpg"
        zoom={1.07}
        pan={20}
        layer="hero"
        delayFrames={460}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Once they've seen it, they can't unsee it."
        variant="lower_third"
        delayFrames={470}
        durationFrames={90}
        scale={scale}
      />
      <TextReveal
        text="The orders started coming before the wires were even laid."
        variant="lower_third"
        delayFrames={560}
        durationFrames={totalFrames - 560}
        scale={scale}
      />
    </AbsoluteFill>
  );
};