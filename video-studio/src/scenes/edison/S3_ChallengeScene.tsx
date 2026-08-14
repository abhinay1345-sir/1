import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";
import { KenBurnsImage } from "../../components/edison/KenBurnsImage";
import { TextReveal } from "../../components/edison/TextReveal";
import { SystemDiagram, SYSTEM_DIAGRAM_PRESETS } from "../../components/edison/SystemDiagram";
import { ChapterTransition } from "../../components/edison/ChapterTransition";
import type { EdisonSegment } from "../../data/edison-types";

export const S3_ChallengeScene: React.FC<{ segment: EdisonSegment; scale: EdisonScale }> = ({
  segment,
  scale,
}) => {
  const startFrame = segment.startFrame!;
  const endFrame = segment.endFrame!;
  const totalFrames = endFrame - startFrame;

  return (
    <AbsoluteFill>
      {/* Chapter transition */}
      <ChapterTransition chapterNumber={2} chapterTitle="The Challenge" delayFrames={0} scale={scale} />

      {/* Shot 1: Arc lamp street - 0-100 frames */}
      <KenBurnsImage
        src="arc_lamp_street.jpg"
        zoom={1.08}
        pan={-25}
        layer="hero"
        delayFrames={0}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="By 1878, electric light wasn't new. Arc lamps blasted public squares."
        variant="lower_third"
        delayFrames={10}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 2: Swan lamp - 90-190 frames */}
      <KenBurnsImage
        src="swan_lamp.jpg"
        zoom={1.06}
        pan={20}
        layer="hero"
        delayFrames={90}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Swan in England. Maxim in America. Their lamps worked — briefly."
        variant="lower_third"
        delayFrames={100}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 3: Menlo Park lab interior - 180-280 frames */}
      <KenBurnsImage
        src="menlo_park_lab_interior.jpg"
        zoom={1.07}
        pan={-15}
        layer="hero"
        delayFrames={180}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="The real problem wasn't the bulb. It was everything around it."
        variant="lower_third"
        delayFrames={190}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 4: System diagram - 270-500 frames */}
      <SystemDiagram
        {...SYSTEM_DIAGRAM_PRESETS.act2}
        delayFrames={270}
        scale={scale}
      />
      <TextReveal
        text="A lamp needs current. Current needs a generator. A generator needs fuel."
        variant="lower_third"
        delayFrames={280}
        durationFrames={90}
        scale={scale}
      />
      <TextReveal
        text="Current must travel through wires — safely, reliably — to a meter, to a socket, to the lamp."
        variant="lower_third"
        delayFrames={370}
        durationFrames={120}
        scale={scale}
      />
      <TextReveal
        text="And the customer must pay for it."
        variant="lower_third"
        delayFrames={490}
        durationFrames={80}
        scale={scale}
      />

      {/* Shot 5: Edison portrait - 500-620 frames */}
      <KenBurnsImage
        src="edison_menlo_park_portrait.jpg"
        zoom={1.05}
        pan={10}
        layer="hero"
        delayFrames={500}
        durationFrames={120}
        scale={scale}
      />
      <TextReveal
        text="Edison realized: he wasn't inventing a light bulb."
        variant="lower_third"
        delayFrames={510}
        durationFrames={90}
        scale={scale}
      />
      <TextReveal
        text="He was inventing an entire electrical system."
        variant="lower_third"
        delayFrames={600}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 6: System diagram repeat/expand - 620-end */}
      <SystemDiagram
        {...SYSTEM_DIAGRAM_PRESETS.act2}
        delayFrames={620}
        scale={scale}
      />
      <TextReveal
        text="Generator. Wires. Meters. Sockets. Lamps. All of it. Or none of it worked."
        variant="lower_third"
        delayFrames={630}
        durationFrames={totalFrames - 630}
        scale={scale}
      />
    </AbsoluteFill>
  );
};