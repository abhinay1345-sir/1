import React from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Composition,
  Sequence,
  useVideoConfig,
} from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { EndCardScene } from "./scenes/EndCardScene";
import { Timeline, buildTimeline } from "./components/Timeline";
import type { DocumentarySegment } from "./data/documentary";
import { normalizeManifest, resolveRenderAsset } from "./data/documentary";

export type RootProps = {
  title?: string;
  subtitle?: string;
  segments?: DocumentarySegment[];
  audioFile?: string;
};

const TITLE_FRAMES = 90;
const END_FRAMES = 90;

export const MyVideo: React.FC<RootProps> = ({
  title = "Documentary",
  subtitle = "A cinematic documentary",
  segments = [],
  audioFile,
}) => {
  const { fps } = useVideoConfig();
  const ranges = buildTimeline(segments, fps);
  const segmentFrames = ranges.reduce((sum, r) => sum + r.durationInFrames, 0);
  const contentFrom = TITLE_FRAMES;
  const endFrom = TITLE_FRAMES + segmentFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      <Sequence from={0} durationInFrames={TITLE_FRAMES}>
        <TitleScene title={title} subtitle={subtitle} />
      </Sequence>

      <Sequence from={contentFrom} durationInFrames={Math.max(1, segmentFrames)}>
        <Timeline segments={segments} />
      </Sequence>

      <Sequence from={endFrom} durationInFrames={END_FRAMES}>
        <EndCardScene title={title} callToAction="Thank you for watching" />
      </Sequence>

      {audioFile ? (
        <Sequence from={contentFrom}>
          <Audio src={resolveRenderAsset(audioFile)} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

export const calculateVideoMetadata: CalculateMetadataFunction<RootProps> = async ({
  props,
}) => {
  const fps = 30;
  const segments = props.segments || [];
  const segmentFrames = segments.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSeconds * fps)),
    0,
  );
  const totalFrames = Math.max(1, TITLE_FRAMES + segmentFrames + END_FRAMES);
  return {
    durationInFrames: totalFrames,
    fps,
    width: 1920,
    height: 1080,
  };
};

export const VideoComposition: React.FC = () => (
  <>
    <Composition
      id="main-video"
      component={MyVideo}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Documentary",
        subtitle: "A cinematic documentary",
        segments: [],
        audioFile: undefined,
      }}
      calculateMetadata={calculateVideoMetadata}
    />
    <Composition
      id="title-card"
      component={TitleScene}
      durationInFrames={TITLE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Documentary",
        subtitle: "A cinematic documentary",
      }}
    />
    <Composition
      id="end-card"
      component={EndCardScene}
      durationInFrames={END_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Documentary",
        callToAction: "Thank you for watching",
      }}
    />
  </>
);

export { normalizeManifest };
