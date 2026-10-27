import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** 3840 × 2160 · 30 fps · 240 frames. Four seamless two-second cycles. */
const WIDTH = 3840;
const HEIGHT = 2160;
const HALF_WIDTH = 840;
const EXTREMA = Array.from({ length: 12 }, (_, index) => ({
  x: -770 + index * 140,
  sign: index % 2 === 0 ? -1 : 1,
  phaseOffset: index * 0.4,
}));

export const ElasticZigzag: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycleFrames = Math.max(1, Math.round(2 * fps));
  const wrappedFrame = ((frame % cycleFrames) + cycleFrames) % cycleFrames;
  const phase = 2 * Math.PI * wrappedFrame / cycleFrames;

  // Connect extrema directly: no fixed baseline vertices or mid-segment kinks.
  const points = [
    `${-HALF_WIDTH},0`,
    ...EXTREMA.map((point) => {
      const amplitude = 108 + 22 * Math.sin(phase - point.phaseOffset);
      return `${point.x},${(point.sign * amplitude).toFixed(4)}`;
    }),
    `${HALF_WIDTH},0`,
  ].join(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet">
        <rect width={WIDTH} height={HEIGHT} fill="#000000" />
        <g transform={`translate(${WIDTH / 2} ${HEIGHT / 2})`}>
          <polyline
            points={points}
            fill="none"
            stroke="#8BCBDF"
            strokeWidth={26}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
