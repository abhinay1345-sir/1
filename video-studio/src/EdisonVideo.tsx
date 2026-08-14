import React from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Composition,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { useEdisonScale } from "./hooks/useEdisonScale";
import { theme } from "./theme";
import { MusicLayer } from "./components/edison/MusicLayer";
import {
  EDISON_SEGMENTS,
  TOTAL_FRAMES,
  FPS,
  WIDTH,
  HEIGHT,
} from "./data/edison-script";
import type { EdisonSegment } from "./data/edison-types";

// Scene components
import { TitleScene } from "./scenes/edison/S1_TitleScene";
import { S2_ProblemScene } from "./scenes/edison/S2_ProblemScene";
import { S3_ChallengeScene } from "./scenes/edison/S3_ChallengeScene";
import { S4_DemoScene } from "./scenes/edison/S4_DemoScene";
import { S5_SystemScene } from "./scenes/edison/S5_SystemScene";
import { S6_PearlScene } from "./scenes/edison/S6_PearlScene";
import { S7_LessonScene } from "./scenes/edison/S7_LessonScene";
import { S8_EndingScene } from "./scenes/edison/S8_EndingScene";

// Shared base layer components
import { BgMesh } from "./components/edison/BgMesh";
import { Grade } from "./components/edison/Grade";
import { Grain } from "./components/edison/Grain";
import { Vignette } from "./components/edison/Vignette";

const TITLE_SEC = 4;
const GAP_SEC = 0.8;

function frames(seconds: number) {
  return Math.round(seconds * FPS);
}

import type { EdisonScale } from "./hooks/useEdisonScale";

const SCENES: Record<string, React.FC<{ segment: EdisonSegment; scale: EdisonScale }>> = {
  s1_title: TitleScene,
  s2_problem: S2_ProblemScene,
  s3_challenge: S3_ChallengeScene,
  s4_demo: S4_DemoScene,
  s5_system: S5_SystemScene,
  s6_pearl: S6_PearlScene,
  s7_lesson: S7_LessonScene,
  s8_ending: S8_EndingScene,
};

// Chapter boundary frames (after title card, at start of each act segment)
// startFrame/endFrame are always populated at runtime — using ! asserts this to TS
const CHAPTER_BOUNDARIES: number[] = [
  EDISON_SEGMENTS[0].endFrame!, // after title → act1
  EDISON_SEGMENTS[1].endFrame! + frames(GAP_SEC), // after act1 → act2
  EDISON_SEGMENTS[2].endFrame! + frames(GAP_SEC), // after act2 → act3a
  EDISON_SEGMENTS[3].endFrame! + frames(GAP_SEC), // after act3a → act3b
  EDISON_SEGMENTS[4].endFrame! + frames(GAP_SEC), // after act3b → act4
  EDISON_SEGMENTS[5].endFrame! + frames(GAP_SEC), // after act4 → act5
  EDISON_SEGMENTS[6].endFrame! + frames(GAP_SEC), // after act5 → act6
];

export const EdisonVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const scale = useEdisonScale();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
      {/* LAYER 0: Background mesh — always present */}
      <BgMesh fps={fps} scale={scale} />

      {/* LAYER 1: Assets (scenes) */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        {EDISON_SEGMENTS.map((segment) => {
          const SceneComponent = SCENES[segment.id];
          if (!SceneComponent) return null;
          return (
            <Sequence
              key={segment.id}
              from={segment.startFrame!}
              durationInFrames={segment.endFrame! - segment.startFrame!}
            >
              <SceneComponent segment={segment} scale={scale} />
            </Sequence>
          );
        })}
      </Sequence>

      {/* LAYER 3: Color grade — unifies all assets */}
      <Grade fps={fps} scale={scale} />

      {/* LAYER 4: Grain + Vignette — topmost */}
      <Grain fps={fps} scale={scale} />
      <Vignette fps={fps} scale={scale} />

      {/* PER-SEGMENT AUDIO — separate swappable layers */}
      {EDISON_SEGMENTS.map((segment) => {
        if (segment.id === "s1_title") return null; // no narration
        const audioPath = `edison/voiceover/${segment.id}.wav`;
        return (
          <Sequence key={`audio-${segment.id}`} from={segment.startFrame}>
            <Audio
              src={staticFile(audioPath)}
              volume={1.0}
            />
          </Sequence>
        );
      })}

      {/* MUSIC LAYER — separate swappable background track w/ fade-in/out */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <MusicLayer src="edison/music/background.mp3" baseVolume={0.16} />
      </Sequence>

      {/* SFX LAYER — whoosh at each chapter boundary */}
      {CHAPTER_BOUNDARIES.map((boundary, i) => (
        <Sequence key={`whoosh-${i}`} from={boundary}>
          <Audio
            src={staticFile("edison/sfx/whoosh.wav")}
            volume={0.35}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const calculateVideoMetadata: CalculateMetadataFunction<{}> = () => ({
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
});

export const EdisonVideoComposition: React.FC = () => (
  <Composition
    id="edison-video"
    component={EdisonVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{}}
    calculateMetadata={calculateVideoMetadata}
  />
);

// Also register the individual scene compositions for manual preview/iteration
export const SceneCompositions: React.FC = () => (
  <>
    <Composition
      id="edison-s1-title"
      component={() => (
        <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
          <BgMesh fps={FPS} scale={useEdisonScale()} />
          <TitleScene segment={EDISON_SEGMENTS[0]} scale={useEdisonScale()} />
          <Grade fps={FPS} scale={useEdisonScale()} />
          <Grain fps={FPS} scale={useEdisonScale()} />
          <Vignette fps={FPS} scale={useEdisonScale()} />
        </AbsoluteFill>
      )}
      durationInFrames={frames(TITLE_SEC)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="edison-s2-problem"
      component={() => (
        <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
          <BgMesh fps={FPS} scale={useEdisonScale()} />
          <S2_ProblemScene segment={EDISON_SEGMENTS[1]} scale={useEdisonScale()} />
          <Grade fps={FPS} scale={useEdisonScale()} />
          <Grain fps={FPS} scale={useEdisonScale()} />
          <Vignette fps={FPS} scale={useEdisonScale()} />
        </AbsoluteFill>
      )}
      durationInFrames={frames(EDISON_SEGMENTS[1].durationSec)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="edison-s3-challenge"
      component={() => (
        <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
          <BgMesh fps={FPS} scale={useEdisonScale()} />
          <S3_ChallengeScene segment={EDISON_SEGMENTS[2]} scale={useEdisonScale()} />
          <Grade fps={FPS} scale={useEdisonScale()} />
          <Grain fps={FPS} scale={useEdisonScale()} />
          <Vignette fps={FPS} scale={useEdisonScale()} />
        </AbsoluteFill>
      )}
      durationInFrames={frames(EDISON_SEGMENTS[2].durationSec)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="edison-s4-demo"
      component={() => (
        <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
          <BgMesh fps={FPS} scale={useEdisonScale()} />
          <S4_DemoScene segment={EDISON_SEGMENTS[3]} scale={useEdisonScale()} />
          <Grade fps={FPS} scale={useEdisonScale()} />
          <Grain fps={FPS} scale={useEdisonScale()} />
          <Vignette fps={FPS} scale={useEdisonScale()} />
        </AbsoluteFill>
      )}
      durationInFrames={frames(EDISON_SEGMENTS[3].durationSec)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="edison-s5-system"
      component={() => (
        <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
          <BgMesh fps={FPS} scale={useEdisonScale()} />
          <S5_SystemScene segment={EDISON_SEGMENTS[4]} scale={useEdisonScale()} />
          <Grade fps={FPS} scale={useEdisonScale()} />
          <Grain fps={FPS} scale={useEdisonScale()} />
          <Vignette fps={FPS} scale={useEdisonScale()} />
        </AbsoluteFill>
      )}
      durationInFrames={frames(EDISON_SEGMENTS[4].durationSec)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="edison-s6-pearl"
      component={() => (
        <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
          <BgMesh fps={FPS} scale={useEdisonScale()} />
          <S6_PearlScene segment={EDISON_SEGMENTS[5]} scale={useEdisonScale()} />
          <Grade fps={FPS} scale={useEdisonScale()} />
          <Grain fps={FPS} scale={useEdisonScale()} />
          <Vignette fps={FPS} scale={useEdisonScale()} />
        </AbsoluteFill>
      )}
      durationInFrames={frames(EDISON_SEGMENTS[5].durationSec)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="edison-s7-lesson"
      component={() => (
        <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
          <BgMesh fps={FPS} scale={useEdisonScale()} />
          <S7_LessonScene segment={EDISON_SEGMENTS[6]} scale={useEdisonScale()} />
          <Grade fps={FPS} scale={useEdisonScale()} />
          <Grain fps={FPS} scale={useEdisonScale()} />
          <Vignette fps={FPS} scale={useEdisonScale()} />
        </AbsoluteFill>
      )}
      durationInFrames={frames(EDISON_SEGMENTS[6].durationSec)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="edison-s8-ending"
      component={() => (
        <AbsoluteFill style={{ backgroundColor: theme.colors.ink }}>
          <BgMesh fps={FPS} scale={useEdisonScale()} />
          <S8_EndingScene segment={EDISON_SEGMENTS[7]} scale={useEdisonScale()} />
          <Grade fps={FPS} scale={useEdisonScale()} />
          <Grain fps={FPS} scale={useEdisonScale()} />
          <Vignette fps={FPS} scale={useEdisonScale()} />
        </AbsoluteFill>
      )}
      durationInFrames={frames(EDISON_SEGMENTS[7].durationSec)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);