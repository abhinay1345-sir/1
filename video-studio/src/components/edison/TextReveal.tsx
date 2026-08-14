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

interface TextRevealProps {
  text: string;
  variant?: "title" | "subtitle" | "lower_third" | "body" | "title_end";
  delayFrames?: number;
  durationFrames?: number;
  perWord?: boolean;
  scale: EdisonScale;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  variant = "body",
  delayFrames = 0,
  durationFrames,
  perWord = false,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const totalFrames = durationFrames ?? durationInFrames;

  const styles: Record<string, React.CSSProperties> = {
    title: {
      fontFamily: theme.fonts.display,
      fontSize: scale.titleSize,
      fontWeight: 700,
      color: theme.colors.text,
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
      textAlign: "center",
      textShadow: `0 0 ${scale.size(40)}px ${theme.colors.filament}66`,
    },
    subtitle: {
      fontFamily: theme.fonts.body,
      fontSize: scale.subtitleSize,
      fontWeight: 400,
      color: theme.colors.textDim,
      lineHeight: 1.3,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      textAlign: "center",
    },
    lower_third: {
      fontFamily: theme.fonts.body,
      fontSize: scale.bodySize,
      fontWeight: 400,
      color: theme.colors.filament,
      lineHeight: 1.5,
      textAlign: "center",
      maxWidth: scale.x(800),
    },
    body: {
      fontFamily: theme.fonts.body,
      fontSize: scale.bodySize,
      fontWeight: 400,
      color: theme.colors.text,
      lineHeight: 1.5,
      textAlign: "center",
      maxWidth: scale.x(900),
    },
    title_end: {
      fontFamily: theme.fonts.display,
      fontSize: scale.titleSize * 1.2,
      fontWeight: 700,
      color: theme.colors.filament,
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
      textAlign: "center",
      textShadow: `0 0 ${scale.size(60)}px ${theme.colors.filament}88, 0 0 ${scale.size(120)}px ${theme.colors.filament}44`,
    },
  };

  const baseStyle = styles[variant];
  const isLowerThird = variant === "lower_third";
  const isTitleEnd = variant === "title_end";

  // Position per variant
  const containerStyle: React.CSSProperties = isLowerThird
    ? { bottom: scale.safeMargin * 1.5, left: "50%", transform: "translateX(-50%)" }
    : isTitleEnd
    ? { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    : { top: "40%", left: "50%", transform: "translate(-50%, -50%)" };

  if (perWord && (variant === "title" || variant === "subtitle" || variant === "title_end")) {
    const words = text.split(" ");
    return (
      <AbsoluteFill style={{ pointerEvents: "none", ...containerStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: scale.size(8), ...baseStyle }}>
          {words.map((word, i) => {
            const wDelay = delayFrames + i * 4;
            const p = spring({ frame: frame - wDelay, fps: 25, config: theme.spring.snappy });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: interpolate(p, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    );
  }

  // Simple block entrance
  const p = spring({ frame: frame - delayFrames, fps: 25, config: theme.spring.smooth });
  const entrance = interpolate(p, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(frame, [totalFrames - 12, totalFrames], [1, 0], { easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = entrance * exit;

  // Split on \n for line breaks (whiteSpace: pre-line renders them correctly)
  const lines = text.split("\n");

  return (
    <AbsoluteFill style={{ pointerEvents: "none", ...containerStyle }}>
      <div
        style={{
          opacity,
          transform: `translateY(${interpolate(entrance, [0, 1], [40, 0])}px) scale(${interpolate(entrance, [0, 1], [0.94, 1])})`,
          whiteSpace: "pre-line",
          ...baseStyle,
        }}
      >
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};