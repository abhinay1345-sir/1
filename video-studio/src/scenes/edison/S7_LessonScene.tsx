import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";
import { KenBurnsImage } from "../../components/edison/KenBurnsImage";
import { TextReveal } from "../../components/edison/TextReveal";
import { CityNetwork } from "../../components/edison/CityNetwork";
import { ChapterTransition } from "../../components/edison/ChapterTransition";
import type { EdisonSegment } from "../../data/edison-types";

export const S7_LessonScene: React.FC<{ segment: EdisonSegment; scale: EdisonScale }> = ({
  segment,
  scale,
}) => {
  const startFrame = segment.startFrame!;
  const endFrame = segment.endFrame!;
  const totalFrames = endFrame - startFrame;

  return (
    <AbsoluteFill>
      <ChapterTransition chapterNumber={6} chapterTitle="The Lesson" delayFrames={0} scale={scale} />

      {/* Shot 1: Telephone exchange - 0-100 frames */}
      <KenBurnsImage
        src="telephone_exchange.jpg"
        zoom={1.08}
        pan={-20}
        layer="hero"
        delayFrames={0}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="The lesson isn't about Edison. It's about adoption."
        variant="lower_third"
        delayFrames={10}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 2: Early automobile gas station - 90-190 frames */}
      <KenBurnsImage
        src="early_automobile_gas_station.jpg"
        zoom={1.06}
        pan={25}
        layer="hero"
        delayFrames={90}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="The telephone needed exchanges. The automobile needed roads and gas stations."
        variant="lower_third"
        delayFrames={100}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 3: Early personal computer - 180-280 frames */}
      <KenBurnsImage
        src="early_personal_computer.jpg"
        zoom={1.07}
        pan={-15}
        layer="hero"
        delayFrames={180}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="The personal computer needed software and networks."
        variant="lower_third"
        delayFrames={190}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 4: EV charging station - 270-370 frames */}
      <KenBurnsImage
        src="ev_charging_station.jpg"
        zoom={1.08}
        pan={20}
        layer="hero"
        delayFrames={270}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="The electric car needed charging infrastructure."
        variant="lower_third"
        delayFrames={280}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 5: Modern data center - 360-460 frames */}
      <KenBurnsImage
        src="modern_data_center.jpg"
        zoom={1.05}
        pan={-10}
        layer="hero"
        delayFrames={360}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Edison understood: don't merely sell the invention. Build the environment that makes it useful."
        variant="lower_third"
        delayFrames={370}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 6: Smartphone ecosystem - 450-550 frames */}
      <KenBurnsImage
        src="smartphone_ecosystem.jpg"
        zoom={1.12}
        pan={5}
        layer="hero"
        delayFrames={450}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="The bulb was brilliant. But the system — generators, wires, meters, sockets, billing, service — that was the real invention."
        variant="lower_third"
        delayFrames={460}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 7: AI platform ecosystem - 540-640 frames */}
      <KenBurnsImage
        src="ai_platform_ecosystem.jpg"
        zoom={1.06}
        pan={-25}
        layer="hero"
        delayFrames={540}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Today, every platform company follows the same playbook. They don't just ship code. They build the ecosystem the code lives in."
        variant="lower_third"
        delayFrames={550}
        durationFrames={totalFrames - 550}
        scale={scale}
      />
    </AbsoluteFill>
  );
};