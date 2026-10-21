import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** 3840 × 2160 · 30 fps · 180 frames. All three chevrons are always visible. */
const WIDTH = 3840;
const HEIGHT = 2160;
const DISPLAY_SCALE = 1.35;
const COLOR = "#E8C66A";
const CHEVRONS = [-360, 0, 360].map((x, index) => ({
  x,
  phaseOffset: index * 0.85,
}));

const Chevron: React.FC = () => (
  <polyline
    points="-90,-180 90,0 -90,180"
    fill="none"
    stroke={COLOR}
    strokeWidth={54}
    strokeLinecap="square"
    strokeLinejoin="miter"
    strokeMiterlimit={4}
  />
);

export const AlternatingChevronDrift: React.FC = () => {
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
          {CHEVRONS.map((chevron, index) => (
            <g
              key={index}
              transform={`translate(${chevron.x + 65 * Math.sin(phase - chevron.phaseOffset)} 0)`}
            >
              <Chevron />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
