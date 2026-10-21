import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** 3840 × 2160 · 30 fps · 180 frames. No entrance, exit or blank frames. */
const WIDTH = 3840;
const HEIGHT = 2160;
const DISPLAY_SCALE = 1.35;
const STROKE_WIDTH = 44;

// Local paths around (0, 0) keep every ring on precisely the same pivot.
const arcPath = (radius: number, sweep: number): string => {
  const angle = (sweep * Math.PI) / 180;
  return `M ${radius} 0 A ${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 1 ${radius * Math.cos(angle)} ${radius * Math.sin(angle)}`;
};
const ARCS = [
  { radius: 420, sweep: 110, color: "#EFE8DA", initialAngle: 20, turns: 1 },
  { radius: 310, sweep: 150, color: "#DC8267", initialAngle: 155, turns: -1 },
  { radius: 200, sweep: 90, color: "#EFE8DA", initialAngle: 270, turns: 2 },
].map((arc) => ({ ...arc, path: arcPath(arc.radius, arc.sweep) }));

export const CounterRotatingArcs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycleFrames = Math.max(1, Math.round(6 * fps));
  const wrappedFrame = ((frame % cycleFrames) + cycleFrames) % cycleFrames;
  const turn = (360 * wrappedFrame) / cycleFrames;

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
          {ARCS.map((arc) => (
            <g key={arc.radius} transform={`rotate(${arc.initialAngle + arc.turns * turn})`}>
              <path
                d={arc.path}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
