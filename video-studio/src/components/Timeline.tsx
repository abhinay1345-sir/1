import React from "react";
import { Sequence, useVideoConfig, Audio } from "remotion";
import type { DocumentarySegment } from "../data/documentary";
import { resolveRenderAsset } from "../data/documentary";
import { DocumentarySegment as DocumentarySegmentView } from "../scenes/DocumentarySegment";

export type TimelineRange = { from: number; durationInFrames: number };

export const buildTimeline = (
  segments: Pick<DocumentarySegment, "durationSeconds">[],
  fps: number,
): TimelineRange[] => {
  let from = 0;
  return segments.map((segment) => {
    const range = {
      from,
      durationInFrames: Math.max(1, Math.round(segment.durationSeconds * fps)),
    };
    from += range.durationInFrames;
    return range;
  });
};

export const Timeline: React.FC<{ segments: DocumentarySegment[] }> = ({
  segments,
}) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {buildTimeline(segments, fps).map((range, index) => (
        <Sequence
          key={segments[index].id}
          from={range.from}
          durationInFrames={range.durationInFrames}
        >
          <DocumentarySegmentView segment={segments[index]} index={index} />
          {segments[index].audioSrc && (
            <Audio src={resolveRenderAsset(segments[index].audioSrc)} />
          )}
        </Sequence>
      ))}
    </>
  );
};
