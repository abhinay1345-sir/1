import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type EndCardSceneProps = { title: string; callToAction?: string };

export const EndCardScene: React.FC<EndCardSceneProps> = ({ title, callToAction = "Thank you for watching" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [0, 18, Math.max(19, durationInFrames - 20), durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: "#08080d", color: "white", fontFamily: "Inter, Segoe UI, sans-serif", opacity }}>
    <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#00d4ff" }}>{callToAction}</div>
    <div style={{ fontSize: 54, fontWeight: 800, marginTop: 24, textAlign: "center", maxWidth: 1450 }}>{title}</div>
    <div style={{ marginTop: 32, width: 180, height: 3, background: "linear-gradient(90deg, #00d4ff, #7c3aed)" }} />
  </AbsoluteFill>;
};
