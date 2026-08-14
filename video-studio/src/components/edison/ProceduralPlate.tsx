import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import type { EdisonScale } from "../../hooks/useEdisonScale";

// Procedural archival plate — rendered in place of any missing public/edison image
// so the render never 404s. Deterministic per `src` (tint + light position + grain)
// so each shot has a stable identity while staying on the Edison-amber palette.
// Real photos remain swappable by filename: drop a file into public/edison, re-run
// `npm run edison:manifest`, and KenBurnsImage will load the real <Img> instead.

// Deterministic 0..1 hash of a string (FNV-1a, unsigned).
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

const TINTS: { a: string; b: string }[] = [
  { a: theme.colors.amber, b: theme.colors.ink },
  { a: theme.colors.brass, b: theme.colors.ink },
  { a: "#2A3B4A", b: theme.colors.ink }, // cool night
  { a: "#6B4A2B", b: "#120C06" }, // warm interior / gaslight
];

interface Props {
  src: string;
  scale: EdisonScale;
}

export const ProceduralPlate: React.FC<Props> = ({ src, scale }) => {
  const frame = useCurrentFrame();
  const hp = hash(src);
  const tint = TINTS[Math.floor(hp * TINTS.length) % TINTS.length];
  const shimmer = 0.5 + 0.5 * Math.sin(frame / 23); // slow breathing light pool
  const angle = 120 + hash(src.split("").reverse().join("")) * 70;
  const cx = 28 + hp * 44;
  const cy = 38 + shimmer * 14;

  return (
    <AbsoluteFill style={{ background: theme.colors.ink, overflow: "hidden" }}>
      {/* Sepia gradient base */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${angle}deg, ${tint.b}, ${tint.a}40 48%, ${tint.b})`,
        }}
      />
      {/* Breathing radial light pool */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${cx}% ${cy}%, ${theme.colors.filament}26, transparent 62%)`,
        }}
      />
      {/* Faint etched bulb motif */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.14,
        }}
      >
        <svg width={scale.size(280)} height={scale.size(150)} viewBox="0 0 280 150">
          <path
            d="M140 22 Q200 22 200 74 Q200 122 140 122 Q80 122 80 74 Q80 22 140 22"
            fill="none"
            stroke={theme.colors.parchment}
            strokeWidth={2}
          />
          <path
            d="M140 38 Q140 58 128 78 Q116 98 140 120 Q164 98 152 78 Q140 58 140 38"
            fill="none"
            stroke={theme.colors.filament}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <line x1="140" y1="122" x2="140" y2="140" stroke={theme.colors.brass} strokeWidth={3} />
        </svg>
      </div>
      {/* Etched scanlines for archival texture */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${theme.colors.ink}0A 0px, ${theme.colors.ink}0A 2px, transparent 2px, transparent 7px)`,
          opacity: 0.35,
        }}
      />
      {/* Filename caption (dev aid — small, dim) */}
      <div
        style={{
          position: "absolute",
          bottom: scale.size(12),
          left: scale.size(16),
          fontFamily: theme.fonts.mono,
          fontSize: scale.size(13),
          color: theme.colors.textDim,
          opacity: 0.45,
          letterSpacing: "0.05em",
        }}
      >
        ◇ {src}
      </div>
    </AbsoluteFill>
  );
};
