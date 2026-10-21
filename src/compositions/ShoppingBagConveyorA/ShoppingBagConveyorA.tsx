import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const theme = {
  colors: {
    background: "#000000",
    cream: "#F3E9D2",
    creamSide: "#D4C5A8",
    charcoal: "#292B2E",
    charcoalSide: "#17181A",
    red: "#EF4038",
    redSide: "#C7282D",
    redDark: "#A91D25",
    grommet: "#202225",
  },
} as const;

type BagTone = "cream" | "charcoal" | "red";

type BagSpec = {
  x: number;
  width: number;
  height: number;
  tone: BagTone;
};

const bags: BagSpec[] = [
  { x: 220, width: 270, height: 220, tone: "cream" },
  { x: 555, width: 310, height: 245, tone: "charcoal" },
  { x: 960, width: 430, height: 340, tone: "red" },
  { x: 1360, width: 300, height: 215, tone: "cream" },
  { x: 1680, width: 255, height: 245, tone: "charcoal" },
];

const smooth = (
  frame: number,
  start: number,
  end: number,
  easing = Easing.bezier(0.45, 0, 0.55, 1),
) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fillFor = (tone: BagTone) => {
  if (tone === "red") return theme.colors.red;
  if (tone === "charcoal") return theme.colors.charcoal;
  return theme.colors.cream;
};

const sideFor = (tone: BagTone) => {
  if (tone === "red") return theme.colors.redSide;
  if (tone === "charcoal") return theme.colors.charcoalSide;
  return theme.colors.creamSide;
};

const ShoppingBag: React.FC<{
  bag: BagSpec;
  index: number;
  queueOffset: number;
  tilt: number;
  morphProgress: number;
  leftContentProgress: number;
  rightContentProgress: number;
}> = ({
  bag,
  index,
  queueOffset,
  tilt,
  morphProgress,
  leftContentProgress,
  rightContentProgress,
}) => {
  const { width, height, tone } = bag;
  const top = -height;
  const topHalfWidth = width * 0.43;
  const bottomHalfWidth = width * 0.5;
  const attachX = width * 0.27;
  const attachY = top + 55;
  const handleRise = tone === "red" ? 108 + 24 * morphProgress : 103;
  const handleColor = tone === "red" ? theme.colors.cream : theme.colors.red;
  const clipId = `bag-mouth-${index}`;
  const scaleX = tone === "red" ? 1 + 0.03 * morphProgress : 1;
  const scaleY = tone === "red" ? 1 - 0.015 * morphProgress : 1;

  const handlePath = `M ${-attachX} ${attachY} C ${-attachX + 8} ${
    attachY - handleRise
  }, ${attachX - 8} ${attachY - handleRise}, ${attachX} ${attachY}`;

  return (
    <g
      transform={`translate(${bag.x + queueOffset} 880) rotate(${tilt}) scale(${scaleX} ${scaleY})`}
    >
      <defs>
        <clipPath id={clipId}>
          <path
            d={`M ${-topHalfWidth + 10} ${top - 165} H ${
              topHalfWidth - 10
            } V ${top + 5} H ${-topHalfWidth + 10} Z`}
          />
        </clipPath>
      </defs>

      <g aria-label="rear handle">
        <path
          d={handlePath}
          fill="none"
          stroke={
            tone === "red" ? theme.colors.creamSide : theme.colors.redDark
          }
          strokeWidth={17}
          strokeLinecap="round"
          transform="translate(8 0)"
        />
      </g>

      {tone === "red" ? (
        <g clipPath={`url(#${clipId})`} aria-label="bag contents">
          <path
            d={`M -158 ${top + 30} L -174 ${top - 104} L -33 ${
              top - 142
            } L 0 ${top + 35} Z`}
            fill={theme.colors.cream}
            transform={`translate(0 ${18 * (1 - leftContentProgress)})`}
          />
          <path
            d={`M 18 ${top + 34} L 10 ${top - 76} L 150 ${
              top - 42
            } L 132 ${top + 35} Z`}
            fill={theme.colors.cream}
            transform={`translate(0 ${12 * (1 - rightContentProgress)})`}
          />
        </g>
      ) : null}

      <g aria-label="bag body">
        <path
          d={`M ${-topHalfWidth} ${top} L ${topHalfWidth} ${top} L ${
            bottomHalfWidth
          } 10 H ${-bottomHalfWidth} Z`}
          fill={fillFor(tone)}
        />
        <path
          d={`M ${topHalfWidth * 0.76} ${top} H ${topHalfWidth} L ${
            bottomHalfWidth
          } 10 H ${bottomHalfWidth * 0.77} Z`}
          fill={sideFor(tone)}
        />
      </g>

      <g aria-label="front handle">
        <circle cx={-attachX} cy={attachY} r={13} fill={theme.colors.grommet} />
        <circle cx={attachX} cy={attachY} r={13} fill={theme.colors.grommet} />
        <path
          d={handlePath}
          fill="none"
          stroke={handleColor}
          strokeWidth={12}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
};

const Roller: React.FC<{ x: number; rotation: number }> = ({ x, rotation }) => (
  <g transform={`translate(${x} 935) rotate(${rotation})`} aria-label="roller">
    <circle r={39} fill={theme.colors.cream} />
    <circle r={16} fill={theme.colors.background} />
    <circle cx={25} cy={0} r={5} fill={theme.colors.charcoal} />
  </g>
);

const Conveyor: React.FC<{ rollerRotation: number }> = ({ rollerRotation }) => (
  <g aria-label="conveyor">
    <rect
      x={12}
      y={880}
      width={1896}
      height={110}
      rx={54}
      fill={theme.colors.cream}
    />
    <rect
      x={27}
      y={895}
      width={1866}
      height={80}
      rx={39}
      fill={theme.colors.background}
    />
    <Roller x={150} rotation={rollerRotation} />
    <Roller x={960} rotation={rollerRotation} />
    <Roller x={1770} rotation={rollerRotation} />
  </g>
);

export const ShoppingBagConveyorA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at30 = (frameAt30Fps: number) => (frameAt30Fps / 30) * fps;

  let queueOffset: number;
  if (frame <= at30(15)) {
    queueOffset = interpolate(frame, [0, at30(15)], [-140, -125], {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame <= at30(60)) {
    queueOffset = interpolate(frame, [at30(15), at30(60)], [-125, -25], {
      easing: Easing.bezier(0.35, 0.1, 0.65, 0.9),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < at30(90)) {
    queueOffset = interpolate(frame, [at30(60), at30(90)], [-25, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < at30(180)) {
    queueOffset = 0;
  } else if (frame < at30(195)) {
    queueOffset = interpolate(frame, [at30(180), at30(195)], [0, 12], {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < at30(210)) {
    queueOffset = interpolate(frame, [at30(195), at30(210)], [12, 75], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    queueOffset = 75 + ((frame - at30(210)) / at30(89)) * (620 - 75);
  }

  const initialTilt =
    -2 *
    smooth(frame, at30(0), at30(6)) *
    (1 - smooth(frame, at30(6), at30(24)));
  const restartTilt =
    -2 *
    smooth(frame, at30(180), at30(186)) *
    (1 - smooth(frame, at30(186), at30(204)));
  const tilt = initialTilt + restartTilt;

  const openingMorph = smooth(frame, at30(60), at30(90));
  const closingMorph = smooth(frame, at30(180), at30(210));
  const morphProgress = frame < at30(180) ? openingMorph : 1 - closingMorph;

  const openingLeftContent = smooth(frame, at30(63), at30(82));
  const openingRightContent = smooth(frame, at30(69), at30(88));
  const closingLeftContent = smooth(frame, at30(180), at30(198));
  const closingRightContent = smooth(frame, at30(186), at30(204));
  const leftContentProgress =
    frame < at30(180) ? openingLeftContent : 1 - closingLeftContent;
  const rightContentProgress =
    frame < at30(180) ? openingRightContent : 1 - closingRightContent;

  const beltTravel = queueOffset + 140;
  const rollerRotation = (beltTravel / (2 * Math.PI * 39)) * 360;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Shopping bags on a conveyor"
      >
        <defs>
          <clipPath id="queue-mask">
            <rect x={26} y={250} width={1868} height={638} />
          </clipPath>
        </defs>
        <g clipPath="url(#queue-mask)">
          {bags.map((bag, index) => (
            <ShoppingBag
              key={index}
              bag={bag}
              index={index}
              queueOffset={queueOffset}
              tilt={tilt}
              morphProgress={morphProgress}
              leftContentProgress={leftContentProgress}
              rightContentProgress={rightContentProgress}
            />
          ))}
        </g>
        <Conveyor rollerRotation={rollerRotation} />
      </svg>
    </AbsoluteFill>
  );
};
