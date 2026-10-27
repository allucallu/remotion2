import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Composition: 3840 × 2160, 30 fps, 240 frames / 8 seconds. */
const WIDTH = 3840;
const HEIGHT = 2160;
const DISPLAY_SCALE = 1.2;
const HALF_LENGTH = 55;
const DASHES = Array.from({ length: 12 }, (_, index) => {
  const offset = index * 2 * Math.PI / 12;
  const angle = -Math.PI / 2 + offset;
  return { offset, x: Math.cos(angle), y: Math.sin(angle) };
});

export const OrbitingDashRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycleFrames = Math.max(1, Math.round(8 * fps));
  const wrappedFrame = ((frame % cycleFrames) + cycleFrames) % cycleFrames;
  const phase = 2 * Math.PI * wrappedFrame / cycleFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet">
        <rect width={WIDTH} height={HEIGHT} fill="#000000" />
        <g transform={`translate(${WIDTH / 2} ${HEIGHT / 2}) scale(${DISPLAY_SCALE})`}>
          {DASHES.map((dash, index) => {
            // A raised cosine cubed creates one smooth, localized crest.
            // The crest travels clockwise; every dash keeps its fixed angle.
            const pulse = ((1 + Math.cos(phase - dash.offset)) / 2) ** 3;
            const radius = 370 + 85 * pulse;
            const inner = radius - HALF_LENGTH;
            const outer = radius + HALF_LENGTH;
            return (
              <line
                key={index}
                x1={inner * dash.x}
                y1={inner * dash.y}
                x2={outer * dash.x}
                y2={outer * dash.y}
                stroke="#F4F0E8"
                strokeWidth={28}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
