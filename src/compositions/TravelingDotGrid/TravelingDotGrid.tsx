import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** 3840 × 2160 · 30 fps · 180 frames. All dots are visible from frame zero. */
const WIDTH = 3840;
const HEIGHT = 2160;
const COLUMNS = 7;
const ROWS = 5;
const GAP = 170;
const DISPLAY_SCALE = 1.35;
const MIN_RADIUS = 24;
const MAX_RADIUS = 50;
const COLOR = "#F4F0E8";
const PHASE_STEP = Math.PI / 4;

// Fixed positions: only the radii change. No per-frame allocation of the grid.
const DOTS = Array.from({ length: ROWS * COLUMNS }, (_, index) => {
  const row = Math.floor(index / COLUMNS);
  const column = index % COLUMNS;
  return {
    x: (column - (COLUMNS - 1) / 2) * GAP,
    y: (row - (ROWS - 1) / 2) * GAP,
    offset: (column + row) * PHASE_STEP,
  };
});

export const TravelingDotGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycleFrames = Math.max(1, Math.round(6 * fps));
  // Explicit wrapping gives exactly the same state at frame 0 and frame 180.
  const wrappedFrame = ((frame % cycleFrames) + cycleFrames) % cycleFrames;
  const phase = (2 * Math.PI * wrappedFrame) / cycleFrames;
  const midpoint = (MIN_RADIUS + MAX_RADIUS) / 2;
  const amplitude = (MAX_RADIUS - MIN_RADIUS) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width={WIDTH} height={HEIGHT} fill="#000000" />
        <g transform={`translate(${WIDTH / 2} ${HEIGHT / 2}) scale(${DISPLAY_SCALE})`}>
          {DOTS.map((dot, index) => (
            <circle
              key={index}
              cx={dot.x}
              cy={dot.y}
              r={midpoint + amplitude * Math.cos(phase - dot.offset)}
              fill={COLOR}
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
