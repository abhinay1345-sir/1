import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";
import { KenBurnsImage } from "../../components/edison/KenBurnsImage";
import { TextReveal } from "../../components/edison/TextReveal";
import { SystemDiagram, SYSTEM_DIAGRAM_PRESETS } from "../../components/edison/SystemDiagram";
import { ChapterTransition } from "../../components/edison/ChapterTransition";
import type { EdisonSegment } from "../../data/edison-types";

export const S5_SystemScene: React.FC<{ segment: EdisonSegment; scale: EdisonScale }> = ({
  segment,
  scale,
}) => {
  const startFrame = segment.startFrame!;
  const endFrame = segment.endFrame!;
  const totalFrames = endFrame - startFrame;

  return (
    <AbsoluteFill>
      <ChapterTransition chapterNumber={4} chapterTitle="The System" delayFrames={0} scale={scale} />

      {/* Shot 1: Electric lamp vs gas lamp - 0-100 frames */}
      <KenBurnsImage
        src="electric_lamp_vs_gas_lamp.jpg"
        zoom={1.06}
        pan={-15}
        layer="hero"
        delayFrames={0}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="You couldn't just sell a bulb. The customer had no wires, no current, no meter."
        variant="lower_third"
        delayFrames={10}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 2: Edison socket - 90-190 frames */}
      <KenBurnsImage
        src="edison_socket.jpg"
        zoom={1.15}
        pan={0}
        layer="hero"
        delayFrames={90}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="So Edison sold the whole thing. Light as a service."
        variant="lower_third"
        delayFrames={100}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 3: Early electric wiring - 180-280 frames */}
      <KenBurnsImage
        src="early_electric_wiring.jpg"
        zoom={1.07}
        pan={20}
        layer="hero"
        delayFrames={180}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="One bulb. Then one building — the Merchant's Safe Deposit Company, 1881."
        variant="lower_third"
        delayFrames={190}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 4: Merchants safe deposit - 270-370 frames */}
      <KenBurnsImage
        src="merchants_safe_deposit.jpg"
        zoom={1.06}
        pan={-10}
        layer="hero"
        delayFrames={270}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Then one street. Then a district."
        variant="lower_third"
        delayFrames={280}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 5: System diagram act3b - 360-550 frames */}
      <SystemDiagram
        {...SYSTEM_DIAGRAM_PRESETS.act3b}
        delayFrames={360}
        scale={scale}
      />
      <TextReveal
        text="The system diagram wasn't a slide. It was the business model."
        variant="lower_third"
        delayFrames={370}
        durationFrames={90}
        scale={scale}
      />
      <TextReveal
        text="Generator in the basement. Wires in the walls. Meters at the panel. Lamps in the sockets."
        variant="lower_third"
        delayFrames={460}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 6: Electric meter early - 550-650 frames */}
      <KenBurnsImage
        src="electric_meter_early.jpg"
        zoom={1.12}
        pan={5}
        layer="hero"
        delayFrames={550}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="You paid for light, not hardware. From product to infrastructure. From invention to utility."
        variant="lower_third"
        delayFrames={560}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 7: Underground conduits - 640-end */}
      <KenBurnsImage
        src="underground_conduits.jpg"
        zoom={1.08}
        pan={-25}
        layer="hero"
        delayFrames={640}
        durationFrames={totalFrames - 640}
        scale={scale}
      />
      <TextReveal
        text="The bulb was the visible tip. The system was the iceberg underneath."
        variant="lower_third"
        delayFrames={650}
        durationFrames={totalFrames - 650}
        scale={scale}
      />
    </AbsoluteFill>
  );
};