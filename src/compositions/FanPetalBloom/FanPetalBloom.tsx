import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const palette = {
  background: "#000000",
  coral: ["#F05246", "#EB493F", "#F65B50", "#DF4038"],
  cream: ["#F5E8CB", "#EEDDBB", "#F8ECD2", "#E8D3AA"],
  burgundy: "#682321",
  burgundyStroke: "#421412",
  separator: "#7F342E",
  creamSeparator: "#9F8A6D",
  mustard: "#D8A43D",
  mustardLight: "#E7BA58",
  mustardDark: "#855E22",
  hub: "#F4E8CD",
} as const;

const bladePath =
  "M -8 8 C -12 -58 -37 -143 -53 -216 C -62 -255 -43 -292 -10 -301 C 17 -308 48 -285 53 -254 C 62 -206 39 -142 24 -86 C 16 -54 11 -20 8 8 C 3 13 -3 13 -8 8 Z";

const BLADE_ANGLES = [-18, -6, 6, 18] as const;
const MOTION_EASE = Easing.bezier(0.45, 0, 0.55, 1);

const easedProgress = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: MOTION_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Hinge: React.FC = () => (
  <g>
    <circle r={22} fill={palette.mustardDark} />
    <circle r={17} fill={palette.mustard} stroke="#9D7026" strokeWidth={2} />
    <circle
      r={12}
      fill={palette.mustardLight}
      stroke="#B47E29"
      strokeWidth={1.5}
    />
  </g>
);

const FanModule: React.FC<{
  index: number;
  frame: number;
  fps: number;
}> = ({ index, frame, fps }) => {
  const isCoral = index % 2 === 0;
  const fills = isCoral ? palette.coral : palette.cream;
  const stroke = isCoral ? palette.separator : palette.creamSeparator;
  const frames = (at30Fps: number) => (at30Fps / 30) * fps;

  const openingStart = frames(index * 4);
  const closingStart = frames(180 + (7 - index) * 4);
  const closedSwing = index % 2 === 0 ? 9 : -9;
  const openingSwing = easedProgress(frame, openingStart, frames(18));
  const closingSwing = easedProgress(
    frame,
    closingStart + frames(42),
    frames(16),
  );
  const swingProgress = frame < frames(180) ? openingSwing : 1 - closingSwing;
  const assemblyRotation = closedSwing * (1 - swingProgress);

  const bladeRotation = (bladeIndex: number) => {
    const open = easedProgress(
      frame,
      openingStart + frames(5 + bladeIndex * 3),
      frames(46),
    );
    const close = easedProgress(
      frame,
      closingStart + frames((3 - bladeIndex) * 3),
      frames(42),
    );
    const spreadProgress = frame < frames(180) ? open : 1 - close;

    return BLADE_ANGLES[bladeIndex] * spreadProgress;
  };

  return (
    <g transform={`rotate(${index * 45})`}>
      <path
        d="M -18 -6 C -18 -52 -14 -99 -8 -140 L 8 -140 C 14 -99 18 -52 18 -6 Z"
        fill={isCoral ? "#B73934" : "#D5BF98"}
        stroke={stroke}
        strokeWidth={1.5}
      />
      <g transform="translate(0 -140)">
        <g transform={`rotate(${assemblyRotation})`}>
          <g transform="translate(10 14)">
            {BLADE_ANGLES.map((angle, bladeIndex) => (
              <path
                key={`shadow-${angle}`}
                d={bladePath}
                fill={palette.burgundy}
                stroke={palette.burgundyStroke}
                strokeWidth={2}
                transform={`rotate(${bladeRotation(bladeIndex)})`}
              />
            ))}
          </g>
          {BLADE_ANGLES.map((angle, bladeIndex) => (
            <path
              key={angle}
              d={bladePath}
              fill={fills[bladeIndex]}
              stroke={stroke}
              strokeWidth={2}
              strokeLinejoin="round"
              transform={`rotate(${bladeRotation(bladeIndex)})`}
            />
          ))}
        </g>
        <Hinge />
      </g>
    </g>
  );
};

export const FanPetalBloom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Eight-petal mechanical flower"
      >
        <g transform="translate(960 540)">
          {Array.from({ length: 8 }, (_, index) => (
            <FanModule key={index} index={index} frame={frame} fps={fps} />
          ))}
          <circle r={66} fill={palette.hub} stroke="#CDBA94" strokeWidth={2} />
          <circle r={31} fill={palette.mustardDark} />
          <circle
            r={25}
            fill={palette.mustard}
            stroke="#9D7026"
            strokeWidth={2}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
