import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** 3840 × 2160 · 30 fps · 180 frames. Every outline is visible from frame zero. */
const WIDTH = 3840;
const HEIGHT = 2160;
const SIZE = 460;
const STROKE = 12;
const DISPLAY_SCALE = 1.35;
const COLOR = "#F1EEE7";
const SQUARES = Array.from({ length: 4 }, (_, index) => ({
  x: (index - 1.5) * 130,
  y: (index - 1.5) * 130,
  offset: (index * Math.PI) / 2,
}));

export const OffsetOutlineSquares: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycleFrames = Math.max(1, Math.round(6 * fps));
  const wrappedFrame = ((frame % cycleFrames) + cycleFrames) % cycleFrames;
  const phase = (2 * Math.PI * wrappedFrame) / cycleFrames;

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
          {SQUARES.map((square, index) => (
            <g
              key={index}
              transform={`translate(${square.x + 55 * Math.cos(phase - square.offset)} ${square.y + 35 * Math.sin(phase - square.offset)})`}
            >
              <rect
                x={-SIZE / 2}
                y={-SIZE / 2}
                width={SIZE}
                height={SIZE}
                fill="none"
                stroke={COLOR}
                strokeWidth={STROKE}
                strokeLinejoin="miter"
                strokeMiterlimit={4}
              />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
