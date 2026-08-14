import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";
import { KenBurnsImage } from "../../components/edison/KenBurnsImage";
import { TextReveal } from "../../components/edison/TextReveal";
import { ChapterTransition } from "../../components/edison/ChapterTransition";
import type { EdisonSegment } from "../../data/edison-types";

export const S2_ProblemScene: React.FC<{ segment: EdisonSegment; scale: EdisonScale }> = ({
  segment,
  scale,
}) => {
  const startFrame = segment.startFrame!;
  const endFrame = segment.endFrame!;
  const frames = segment.shots.map((s) => s.startFrame - startFrame);
  const totalFrames = endFrame - startFrame;

  return (
    <AbsoluteFill>
      {/* Chapter transition */}
      <ChapterTransition chapterNumber={1} chapterTitle="The Problem" delayFrames={0} scale={scale} />

      {/* Shot 1: Gas lamps street - 0-100 frames */}
      <KenBurnsImage
        src="19thc_street_gaslamps.jpg"
        zoom={1.08}
        pan={-30}
        layer="hero"
        delayFrames={0}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="For most of human history, night was a barrier."
        variant="lower_third"
        delayFrames={10}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 2: Candlelit interior - 90-190 frames */}
      <KenBurnsImage
        src="candlelit_interior.jpg"
        zoom={1.06}
        pan={20}
        layer="hero"
        delayFrames={90}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Candles, oil lamps, gas jets — they flickered, smoked, poisoned the air."
        variant="lower_third"
        delayFrames={100}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 3: Gas mantle closeup - 180-280 frames */}
      <KenBurnsImage
        src="gas_mantle_closeup.jpg"
        zoom={1.12}
        pan={-10}
        layer="hero"
        delayFrames={180}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="London, Paris, New York — streets after dark were pools of shadow."
        variant="lower_third"
        delayFrames={190}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 4: Smoky victorian room - 270-370 frames */}
      <KenBurnsImage
        src="smoky_victorian_room.jpg"
        zoom={1.05}
        pan={25}
        layer="hero"
        delayFrames={270}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Factories stopped. Streets emptied. The productive day ended at sunset."
        variant="lower_third"
        delayFrames={280}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 5: Dark factory interior - 360-460 frames */}
      <KenBurnsImage
        src="dark_factory_interior.jpg"
        zoom={1.07}
        pan={-20}
        layer="hero"
        delayFrames={360}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="The question: would anyone trust electric light enough to let it into their homes?"
        variant="lower_third"
        delayFrames={370}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 6: Empty night street - 450-550 frames */}
      <KenBurnsImage
        src="empty_night_street.jpg"
        zoom={1.06}
        pan={15}
        layer="hero"
        delayFrames={450}
        durationFrames={100}
        scale={scale}
      />

      {/* Shot 7: Gas street lamps row - 540-640 frames */}
      <KenBurnsImage
        src="gas_street_lamps_row.jpg"
        zoom={1.08}
        pan={-35}
        layer="hero"
        delayFrames={540}
        durationFrames={100}
        scale={scale}
      />

      {/* Shot 8: Victorian home evening - 630-730 frames */}
      <KenBurnsImage
        src="victorian_home_evening.jpg"
        zoom={1.05}
        pan={10}
        layer="hero"
        delayFrames={630}
        durationFrames={100}
        scale={scale}
      />

      {/* Shot 9: Transition candle to darkness - 720-end frames */}
      <KenBurnsImage
        src="transition_candle_to_darkness.jpg"
        zoom={1.1}
        pan={0}
        layer="hero"
        delayFrames={720}
        durationFrames={totalFrames - 720}
        scale={scale}
      />
    </AbsoluteFill>
  );
};