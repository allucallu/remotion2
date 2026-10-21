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
    red: "#ED2E31",
    redTop: "#FF4340",
    redSide: "#9F2027",
    cream: "#F3E5C7",
    creamTop: "#FFF4DC",
    creamSide: "#CBB78E",
    charcoal: "#222326",
    opening: "#0B0B0C",
    edge: "#151517",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
  },
} as const;

type Palette = "red" | "cream";

const progress = (
  frame: number,
  start: number,
  end: number,
  easing: (value: number) => number = theme.ease.out,
) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const ParcelBox: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  depthX: number;
  depthY: number;
  palette: Palette;
  tapeX: number;
  tapeWidth: number;
}> = ({ x, y, width, height, depthX, depthY, palette, tapeX, tapeWidth }) => {
  const face = palette === "red" ? theme.colors.red : theme.colors.cream;
  const top = palette === "red" ? theme.colors.redTop : theme.colors.creamTop;
  const side = palette === "red" ? theme.colors.redSide : theme.colors.charcoal;
  const tape = palette === "red" ? theme.colors.cream : theme.colors.red;

  return (
    <g>
      <path
        d={`M ${x} ${y} L ${x + depthX} ${y - depthY} L ${x + width + depthX} ${y - depthY} L ${x + width} ${y} Z`}
        fill={top}
        stroke={theme.colors.edge}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d={`M ${x + width} ${y} L ${x + width + depthX} ${y - depthY} L ${x + width + depthX} ${y + height - depthY} L ${x + width} ${y + height} Z`}
        fill={side}
        stroke={theme.colors.edge}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={face}
        stroke={theme.colors.edge}
        strokeWidth={2.5}
      />
      <path
        d={`M ${x + tapeX} ${y} H ${x + tapeX + tapeWidth} V ${y + height} H ${x + tapeX} Z`}
        fill={tape}
      />
      <path
        d={`M ${x + tapeX} ${y} L ${x + tapeX + depthX} ${y - depthY} H ${x + tapeX + depthX + tapeWidth} L ${x + tapeX + tapeWidth} ${y} Z`}
        fill={tape}
      />
    </g>
  );
};

const ReceiverSleeveBack: React.FC = () => (
  <g aria-label="receiver sleeve back">
    <path
      d="M 1260 510 L 1335 476 L 1660 476 L 1585 510 Z"
      fill={theme.colors.creamTop}
    />
    <path
      d="M 1585 510 L 1660 476 L 1660 646 L 1585 680 Z"
      fill={theme.colors.creamSide}
    />
    <rect x={1260} y={510} width={325} height={170} fill={theme.colors.cream} />
    <path
      d="M 1288 536 L 1545 536 L 1545 649 L 1288 649 Z"
      fill={theme.colors.opening}
    />
  </g>
);

const ReceiverSleeveRim: React.FC = () => (
  <g aria-label="fixed receiver sleeve front lip">
    <path
      d="M 1260 510 H 1585 V 680 H 1260 Z M 1288 536 H 1545 V 649 H 1288 Z"
      fill={theme.colors.cream}
      fillRule="evenodd"
    />
    <path
      d="M 1288 649 H 1545 M 1288 536 V 649 M 1288 536 H 1545"
      fill="none"
      stroke={theme.colors.charcoal}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  </g>
);

const LongParcel: React.FC<{ x: number; y: number; opacity: number }> = ({
  x,
  y,
  opacity,
}) => (
  <g
    opacity={opacity}
    clipPath="url(#long-parcel-occlusion)"
    aria-label="long cream parcel"
  >
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M 0 0 L 365 -36 L 365 61 L 0 98 Z"
        fill={theme.colors.cream}
        stroke={theme.colors.edge}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 L 36 -24 L 401 -60 L 365 -36 Z"
        fill={theme.colors.creamTop}
        stroke={theme.colors.edge}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M 365 -36 L 401 -60 L 401 36 L 365 61 Z"
        fill={theme.colors.creamSide}
        stroke={theme.colors.edge}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 L 36 -24 L 36 73 L 0 98 Z"
        fill={theme.colors.creamTop}
        stroke={theme.colors.edge}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path d="M 28 -3 L 62 -6 L 62 91 L 28 94 Z" fill={theme.colors.red} />
      <path
        d="M 28 -3 L 64 -27 L 98 -30 L 62 -6 Z"
        fill={theme.colors.redTop}
      />
    </g>
  </g>
);

const AnimatedGroup: React.FC<{
  children: React.ReactNode;
  opacity: number;
  x?: number;
  y?: number;
}> = ({ children, opacity, x = 0, y = 0 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    {children}
  </g>
);

export const StackingPurchasesB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at30 = (value: number) => (value / 30) * fps;

  const baseCreamIn = progress(frame, at30(0), at30(18));
  const baseRedIn = progress(frame, at30(6), at30(24));
  const sleeveIn = progress(frame, at30(18), at30(36));
  const middleRedIn = progress(frame, at30(29), at30(47));
  const topCreamIn = progress(frame, at30(41), at30(59));

  const longEnter = progress(frame, at30(60), at30(89), theme.ease.inOut);
  const longPush = progress(frame, at30(90), at30(132), theme.ease.out);
  const pullBack = progress(frame, at30(220), at30(269), theme.ease.inOut);

  let longX = 740 + 270 * longEnter;
  if (frame >= at30(90)) {
    longX = 1010 + 230 * longPush;
  }
  if (frame >= at30(132) && frame < at30(140)) {
    const lockIn = progress(
      frame,
      at30(132),
      at30(135),
      Easing.out(Easing.cubic),
    );
    const lockSettle = progress(
      frame,
      at30(135),
      at30(140),
      Easing.inOut(Easing.cubic),
    );
    longX = 1240 + 9 * lockIn - 9 * lockSettle;
  }
  if (frame >= at30(140)) {
    longX = 1240;
  }
  if (frame >= at30(220)) {
    longX = 1240 - 230 * pullBack;
  }

  const longY = 555 - (longX - 1010) * 0.08;
  const longOpacity = progress(frame, at30(60), at30(67));

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Staircase of parcels with a receiving sleeve"
      >
        <defs>
          <clipPath id="long-parcel-occlusion" clipPathUnits="userSpaceOnUse">
            <rect x={0} y={0} width={1320} height={1080} />
          </clipPath>
        </defs>

        <AnimatedGroup
          opacity={baseRedIn}
          x={120 * (1 - baseRedIn)}
          y={10 * (1 - baseRedIn)}
        >
          <ParcelBox
            x={1210}
            y={690}
            width={320}
            height={170}
            depthX={90}
            depthY={42}
            palette="red"
            tapeX={132}
            tapeWidth={48}
          />
        </AnimatedGroup>

        <AnimatedGroup
          opacity={baseCreamIn}
          x={-170 * (1 - baseCreamIn)}
          y={8 * (1 - baseCreamIn)}
        >
          <ParcelBox
            x={735}
            y={735}
            width={430}
            height={145}
            depthX={70}
            depthY={38}
            palette="cream"
            tapeX={152}
            tapeWidth={48}
          />
        </AnimatedGroup>

        <AnimatedGroup
          opacity={sleeveIn}
          x={105 * (1 - sleeveIn)}
          y={10 * (1 - sleeveIn)}
        >
          <ReceiverSleeveBack />
        </AnimatedGroup>

        <LongParcel x={longX} y={longY} opacity={longOpacity} />

        <AnimatedGroup
          opacity={sleeveIn}
          x={105 * (1 - sleeveIn)}
          y={10 * (1 - sleeveIn)}
        >
          <ReceiverSleeveRim />
        </AnimatedGroup>

        <AnimatedGroup
          opacity={middleRedIn}
          x={12 * (1 - middleRedIn)}
          y={-145 * (1 - middleRedIn)}
        >
          <ParcelBox
            x={1235}
            y={340}
            width={345}
            height={170}
            depthX={80}
            depthY={36}
            palette="red"
            tapeX={145}
            tapeWidth={48}
          />
        </AnimatedGroup>

        <AnimatedGroup
          opacity={topCreamIn}
          x={10 * (1 - topCreamIn)}
          y={-150 * (1 - topCreamIn)}
        >
          <ParcelBox
            x={1330}
            y={205}
            width={270}
            height={135}
            depthX={60}
            depthY={28}
            palette="cream"
            tapeX={102}
            tapeWidth={42}
          />
        </AnimatedGroup>
      </svg>
    </AbsoluteFill>
  );
};
