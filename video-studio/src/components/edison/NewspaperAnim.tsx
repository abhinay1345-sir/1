import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";

interface NewspaperAnimProps {
  headlines: string[];
  delayFrames?: number;
  scale: EdisonScale;
}

export const NewspaperAnim: React.FC<NewspaperAnimProps> = ({
  headlines,
  delayFrames = 0,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const paperW = scale.size(720);
  const paperH = scale.size(960);

  // Paper entrance
  const paperEntrance = spring({
    frame: frame - delayFrames,
    fps: 25,
    config: theme.spring.smooth,
  });

  const paperScale = interpolate(paperEntrance, [0, 1], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const paperRotate = interpolate(paperEntrance, [0, 1], [-8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const paperOpacity = interpolate(paperEntrance, [0, 0.3, 1], [0, 0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: paperOpacity,
        transform: `scale(${paperScale}) rotate(${paperRotate}deg)`,
      }}
    >
      {/* Paper background */}
      <div
        style={{
          position: "relative",
          width: paperW,
          height: paperH,
          background: `linear-gradient(180deg, ${theme.colors.parchment}, ${theme.colors.parchment}DD)`,
          borderRadius: scale.size(8),
          boxShadow: `0 ${scale.size(40)}px ${scale.size(80)}px -${scale.size(20)}px rgba(0,0,0,0.7), 0 0 0 1px ${theme.colors.brass}33`,
          overflow: "hidden",
        }}
      >
        {/* Paper texture lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: scale.size(40),
              right: scale.size(40),
              top: scale.y(80 + i * 40),
              height: 1,
              background: `${theme.colors.ink}11`,
            }}
          />
        ))}

        {/* Masthead */}
        <div
          style={{
            position: "absolute",
            top: scale.y(20),
            left: scale.x(40),
            right: scale.x(40),
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: scale.size(36),
              fontWeight: 700,
              color: theme.colors.ink,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            THE DAILY CURRENT
          </div>
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: scale.size(11),
              color: theme.colors.brass,
              letterSpacing: 3,
              marginTop: scale.size(4),
            }}
          >
            SEPTEMBER 4, 1882 — EDITION NO. 1
          </div>
        </div>

        {/* Headlines - staggered reveal */}
        {headlines.map((headline, i) => {
          const hDelay = delayFrames + 30 + i * 15;
          const hP = spring({
            frame: frame - hDelay,
            fps: 25,
            config: theme.spring.snappy,
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: scale.x(40),
                right: scale.x(40),
                top: scale.y(100 + i * 130),
                opacity: interpolate(hP, [0, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${interpolate(hP, [0, 1], [30, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: scale.size(22),
                  fontWeight: 700,
                  color: theme.colors.ink,
                  lineHeight: 1.1,
                  letterSpacing: -0.5,
                }}
              >
                {headline}
              </div>
              <div
                style={{
                  marginTop: scale.size(8),
                  fontFamily: theme.fonts.body,
                  fontSize: scale.size(14),
                  color: theme.colors.ink + "CC",
                  lineHeight: 1.5,
                }}
              >
                {[
                  "Edison's electric light illuminates Manhattan district. Fifty-nine customers connected to central station. Gas stocks tumble as investors recognize the shift.",
                  "Merchant's Safe Deposit Company first commercial installation. One thousand lamps burn without smoke or smell. Architects redesign buildings for electric age.",
                  "Orders flood Menlo Park before wires laid. European syndicates negotiate rights. The world watches Pearl Street.",
                ][i % 3]}
              </div>
            </div>
          );
        })}

        {/* Decorative rule line */}
        <div
          style={{
            position: "absolute",
            bottom: scale.y(60),
            left: "50%",
            transform: "translateX(-50%)",
            width: scale.size(200),
            height: 2,
            background: `linear-gradient(90deg, transparent, ${theme.colors.filament}, transparent)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};