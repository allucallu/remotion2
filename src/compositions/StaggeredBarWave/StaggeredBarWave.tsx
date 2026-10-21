import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

const BAR_CENTERS = [1540, 1730, 1920, 2110, 2300];
const BASE_Y = 1080;
const BAR_WIDTH = 100;
const BAR_HEIGHT = 480;
const WAVE_AMPLITUDE = 150;
const CYCLE = 180;

export const StaggeredBarWave: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = (2 * Math.PI * frame) / CYCLE;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <svg width="100%" height="100%" viewBox="0 0 3840 2160">
        {BAR_CENTERS.map((centerX, index) => {
          const centerY =
            BASE_Y + WAVE_AMPLITUDE * Math.sin(phase - index * 0.7);
          return (
            <g key={centerX} transform={`translate(0 ${centerY - BASE_Y})`}>
              <rect
                x={centerX - BAR_WIDTH / 2}
                y={BASE_Y - BAR_HEIGHT / 2}
                width={BAR_WIDTH}
                height={BAR_HEIGHT}
                rx="50"
                fill="#8BCBDF"
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
