import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { DocumentarySegment as Segment } from "../data/documentary";
import { resolveRenderAsset } from "../data/documentary";

export type DocumentarySegmentProps = {
  segment: Segment;
  index: number;
};

export const DocumentarySegment: React.FC<DocumentarySegmentProps> = ({
  segment,
  index,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const midpoint = durationInFrames / 2;
  const heroOpacity = interpolate(
    frame,
    [midpoint - 18, midpoint + 18],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const supportOpacity = 1 - heroOpacity;
  const heroScale = interpolate(frame, [0, durationInFrames], [1, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const supportScale = interpolate(
    frame,
    [0, durationInFrames],
    [1.12, 1.02],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const direction = index % 2 === 0 ? 1 : -1;
  const x = interpolate(
    frame,
    [0, durationInFrames],
    [-18 * direction, 18 * direction],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const titleOpacity = interpolate(frame, [0, 20, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const imageStyle = (opacity: number, scale: number): React.CSSProperties => ({
    position: "absolute",
    inset: -35,
    width: "calc(100% + 70px)",
    height: "calc(100% + 70px)",
    objectFit: "cover",
    opacity,
    transform: `translateX(${x}px) scale(${scale})`,
    filter: "saturate(.82) contrast(1.08)",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f", overflow: "hidden" }}>
      <Img src={resolveRenderAsset(segment.heroSrc)} style={imageStyle(heroOpacity, heroScale)} />
      <Img
        src={resolveRenderAsset(segment.supportSrc)}
        style={imageStyle(supportOpacity, supportScale)}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,5,12,.1) 35%, rgba(4,5,12,.92) 100%)",
        }}
      />
      {segment.overlaySrc ? (
        <Img
          src={resolveRenderAsset(segment.overlaySrc)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.92,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 78,
          color: "white",
          fontFamily: "Inter, Segoe UI, sans-serif",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            width: 90,
            height: 4,
            background: "#00d4ff",
            marginBottom: 20,
          }}
        />
        <div style={{ fontSize: 46, fontWeight: 750, letterSpacing: -1 }}>
          {segment.title}
        </div>
        <div
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,.65)",
            marginTop: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Chapter {String(index + 1).padStart(2, "0")}
        </div>
      </div>
    </AbsoluteFill>
  );
};
