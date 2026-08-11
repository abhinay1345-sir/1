import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type TitleSceneProps = {
  title: string;
  subtitle?: string;
};

export const TitleScene: React.FC<TitleSceneProps> = ({ title, subtitle = "A cinematic documentary" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 20, stiffness: 120 } });
  const lineWidth = interpolate(frame, [0, 30], [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: "radial-gradient(circle at 50% 40%, #15152a 0%, #0a0a0f 65%)", color: "white", fontFamily: "Inter, Segoe UI, sans-serif" }}>
      <div style={{ width: lineWidth, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #00d4ff, #7c3aed)", marginBottom: 34 }} />
      <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2, textAlign: "center", maxWidth: 1500, opacity: progress, transform: `translateY(${(1 - progress) * 35}px)` }}>{title}</div>
      <div style={{ fontSize: 28, letterSpacing: 5, textTransform: "uppercase", color: "rgba(255,255,255,.68)", marginTop: 26, opacity: Math.max(0, progress - 0.25) }}>{subtitle}</div>
    </AbsoluteFill>
  );
};
