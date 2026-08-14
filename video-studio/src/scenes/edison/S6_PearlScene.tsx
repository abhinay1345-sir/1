import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";
import { KenBurnsImage } from "../../components/edison/KenBurnsImage";
import { TextReveal } from "../../components/edison/TextReveal";
import { SystemDiagram, SYSTEM_DIAGRAM_PRESETS } from "../../components/edison/SystemDiagram";
import { CityNetwork } from "../../components/edison/CityNetwork";
import { NewspaperAnim } from "../../components/edison/NewspaperAnim";
import { ChapterTransition } from "../../components/edison/ChapterTransition";
import type { EdisonSegment } from "../../data/edison-types";

export const S6_PearlScene: React.FC<{ segment: EdisonSegment; scale: EdisonScale }> = ({
  segment,
  scale,
}) => {
  const startFrame = segment.startFrame!;
  const endFrame = segment.endFrame!;
  const totalFrames = endFrame - startFrame;

  return (
    <AbsoluteFill>
      <ChapterTransition chapterNumber={5} chapterTitle="Pearl Street" delayFrames={0} scale={scale} />

      {/* Shot 1: Jumbo generator - 0-100 frames */}
      <KenBurnsImage
        src="jumbo_generator.jpg"
        zoom={1.08}
        pan={-20}
        layer="hero"
        delayFrames={0}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="September 4, 1882. Pearl Street, Lower Manhattan."
        variant="lower_third"
        delayFrames={10}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 2: Pearl Street station exterior - 90-190 frames */}
      <KenBurnsImage
        src="pearl_street_station_exterior.jpg"
        zoom={1.06}
        pan={25}
        layer="hero"
        delayFrames={90}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Six Jumbo generators — each the size of a locomotive — spun up."
        variant="lower_third"
        delayFrames={100}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 3: Underground conduits - 180-280 frames */}
      <KenBurnsImage
        src="underground_conduits.jpg"
        zoom={1.07}
        pan={-15}
        layer="hero"
        delayFrames={180}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Steam hissed. Copper conductors ran through brick tunnels beneath the streets."
        variant="lower_third"
        delayFrames={190}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 4: System diagram act4 - 270-450 frames */}
      <SystemDiagram
        {...SYSTEM_DIAGRAM_PRESETS.act4}
        delayFrames={270}
        scale={scale}
      />
      <TextReveal
        text="When the switch closed, fifty-nine customers in a quarter-square-mile district saw their lamps glow."
        variant="lower_third"
        delayFrames={280}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 5: NYT building lit - 360-460 frames */}
      <KenBurnsImage
        src="nyt_building_lit.jpg"
        zoom={1.05}
        pan={20}
        layer="hero"
        delayFrames={360}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="The New York Times building. Drexel, Morgan & Co. The New York Stock Exchange."
        variant="lower_third"
        delayFrames={370}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 6: Pearl Street district - 450-550 frames */}
      <KenBurnsImage
        src="pearl_street_district.jpg"
        zoom={1.08}
        pan={-30}
        layer="hero"
        delayFrames={450}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="It wasn't a demonstration anymore. It was a service."
        variant="lower_third"
        delayFrames={460}
        durationFrames={90}
        scale={scale}
      />
      <TextReveal
        text="You flipped a switch. Light appeared. You paid a bill. The system worked."
        variant="lower_third"
        delayFrames={540}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 7: Manhattan electrified map - 540-640 frames */}
      <KenBurnsImage
        src="manhattan_electrified_map.jpg"
        zoom={1.06}
        pan={10}
        layer="hero"
        delayFrames={540}
        durationFrames={100}
        scale={scale}
      />
      <TextReveal
        text="Pearl Street proved the model: central generation, underground distribution, metered delivery."
        variant="lower_third"
        delayFrames={550}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 8: City network - 630-730 frames */}
      <CityNetwork phase="city" delayFrames={630} scale={scale} />
      <TextReveal
        text="Within a year, the district expanded. Within a decade, the model spread to every major city."
        variant="lower_third"
        delayFrames={640}
        durationFrames={90}
        scale={scale}
      />

      {/* Shot 9: Newspaper animation - 720-end frames */}
      <NewspaperAnim
        headlines={[
          "EDISON LIGHTS MANHATTAN",
          "GAS STOCKS PLUMMET",
          "WORLD ORDERS FLOOD MENLO PARK"
        ]}
        delayFrames={720}
        scale={scale}
      />
      <TextReveal
        text="The invention had become a utility."
        variant="lower_third"
        delayFrames={730}
        durationFrames={totalFrames - 730}
        scale={scale}
      />
    </AbsoluteFill>
  );
};