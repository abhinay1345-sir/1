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

interface Node {
  id: string;
  label: string;
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
  delay: number;
}

interface SystemDiagramProps {
  nodes: Node[];
  connections: [string, string][];
  delayFrames?: number;
  scale: EdisonScale;
}

export const SystemDiagram: React.FC<SystemDiagramProps> = ({
  nodes,
  connections,
  delayFrames = 0,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Connections - draw first so they're behind nodes */}
      {connections.map(([fromId, toId], i) => {
        const from = nodes.find((n) => n.id === fromId);
        const to = nodes.find((n) => n.id === toId);
        if (!from || !to) return null;

        const p = spring({
          frame: frame - delayFrames - i * 6 - from.delay - to.delay,
          fps: 25,
          config: theme.spring.smooth,
        });

        const x1 = scale.x(from.x * width);
        const y1 = scale.y(from.y * height);
        const x2 = scale.x(to.x * width);
        const y2 = scale.y(to.y * height);

        return (
          <svg key={`conn-${i}`} style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none" }}>
            <line
              x1={x1}
              y1={y1}
              x2={interpolate(p, [0, 1], [x1, x2])}
              y2={interpolate(p, [0, 1], [y1, y2])}
              stroke={theme.colors.brass}
              strokeWidth={scale.size(2)}
              strokeLinecap="round"
              opacity={interpolate(p, [0, 0.3, 1], [0, 0.6, 0.4])}
            />
          </svg>
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const p = spring({
          frame: frame - delayFrames - node.delay,
          fps: 25,
          config: theme.spring.snappy,
        });

        const entrance = interpolate(p, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: scale.x(node.x * width - 60),
              top: scale.y(node.y * height - 30),
              opacity: entrance,
              transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px) scale(${interpolate(entrance, [0, 1], [0.8, 1])})`,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: scale.size(120),
                height: scale.size(60),
                borderRadius: scale.size(12),
                background: `linear-gradient(135deg, ${theme.colors.ink}, ${theme.colors.parchment}33)`,
                border: `1px solid ${theme.colors.brass}66`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 ${scale.size(8)}px ${scale.size(24)}px rgba(0,0,0,0.5)`,
              }}
            >
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: scale.size(11),
                  color: theme.colors.filament,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textAlign: "center",
                }}
              >
                {node.label}
              </span>
            </div>
            {/* Pulse ring on the hero node (generator/bulb) */}
            {node.id === "generator" || node.id === "bulb" ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: scale.size(140),
                  height: scale.size(80),
                  borderRadius: scale.size(16),
                  border: `2px solid ${theme.colors.filament}`,
                  opacity: interpolate(p, [0, 1], [0.8, 0]),
                  pointerEvents: "none",
                  animation: `pulse 2s ease-out infinite`,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Preset configurations for each act
export const SYSTEM_DIAGRAM_PRESETS = {
  act2: {
    nodes: [
      { id: "generator", label: "Generator", x: 0.15, y: 0.5, delay: 0 },
      { id: "wires", label: "Wires", x: 0.35, y: 0.5, delay: 8 },
      { id: "meter", label: "Meter", x: 0.55, y: 0.5, delay: 16 },
      { id: "socket", label: "Socket", x: 0.75, y: 0.5, delay: 24 },
      { id: "bulb", label: "Lamp", x: 0.9, y: 0.5, delay: 32 },
    ],
    connections: [
      ["generator", "wires"],
      ["wires", "meter"],
      ["meter", "socket"],
      ["socket", "bulb"],
    ] as [string, string][],
  },
  act3b: {
    nodes: [
      { id: "bulb", label: "One bulb", x: 0.15, y: 0.5, delay: 0 },
      { id: "building", label: "One building", x: 0.35, y: 0.5, delay: 12 },
      { id: "street", label: "One street", x: 0.55, y: 0.5, delay: 24 },
      { id: "district", label: "One district", x: 0.75, y: 0.5, delay: 36 },
      { id: "city", label: "Entire city", x: 0.9, y: 0.5, delay: 48 },
    ],
    connections: [
      ["bulb", "building"],
      ["building", "street"],
      ["street", "district"],
      ["district", "city"],
    ] as [string, string][],
  },
  act4: {
    nodes: [
      { id: "generator", label: "Jumbo Gen.", x: 0.12, y: 0.35, delay: 0 },
      { id: "wires", label: "Underground", x: 0.35, y: 0.55, delay: 10 },
      { id: "nyt", label: "NY Times", x: 0.6, y: 0.25, delay: 20 },
      { id: "drexel", label: "Drexel Morgan", x: 0.6, y: 0.5, delay: 28 },
      { id: "nyse", label: "NYSE", x: 0.6, y: 0.75, delay: 36 },
      { id: "district", label: "Pearl St. District", x: 0.88, y: 0.5, delay: 44 },
    ],
    connections: [
      ["generator", "wires"],
      ["wires", "nyt"],
      ["wires", "drexel"],
      ["wires", "nyse"],
      ["wires", "district"],
    ] as [string, string][],
  },
};