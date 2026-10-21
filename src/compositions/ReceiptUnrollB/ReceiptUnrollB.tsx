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
    paper: "#F5E8CE",
    charcoal: "#252628",
    charcoalDark: "#17181A",
    red: "#EF2D31",
    redTop: "#FF3C38",
    redSide: "#A61E25",
  },
  ease: {
    feed: Easing.bezier(0.2, 0.72, 0.25, 1),
    reverse: Easing.bezier(0.65, 0, 0.35, 1),
  },
} as const;

type Point = { x: number; y: number };

const BASE: Point = { x: 1305, y: 760 };
const PAPER_WIDTH = 320;
const HALF_WIDTH = PAPER_WIDTH / 2;
const MIN_LENGTH = 62;
const MAX_LENGTH = 700;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const progress = (
  frame: number,
  start: number,
  end: number,
  easing: (value: number) => number,
) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const centerPoint = (
  material: number,
  length: number,
  bend: number,
  tipSwing: number,
): Point => {
  const u = length === 0 ? 0 : material / length;
  // A continuous broad S keeps the inner offset radius larger than half the
  // paper width, preventing the right edge from pinching into a sharp cusp.
  const sCurve =
    -120 * Math.sin(Math.PI * u) ** 2 + 105 * smoothstep(u) + 25 * u * u * u;
  const horizontalBend = bend * sCurve;
  return {
    x: BASE.x + horizontalBend + tipSwing * u * u * u,
    y: BASE.y - material,
  };
};

const frameAt = (
  material: number,
  length: number,
  bend: number,
  tipSwing: number,
) => {
  const delta = Math.max(0.8, length / 900);
  const before = centerPoint(
    Math.max(0, material - delta),
    length,
    bend,
    tipSwing,
  );
  const after = centerPoint(
    Math.min(length, material + delta),
    length,
    bend,
    tipSwing,
  );
  const magnitude = Math.hypot(after.x - before.x, after.y - before.y) || 1;
  const tangent = {
    x: (after.x - before.x) / magnitude,
    y: (after.y - before.y) / magnitude,
  };
  return {
    point: centerPoint(material, length, bend, tipSwing),
    tangent,
    normal: { x: -tangent.y, y: tangent.x },
  };
};

const pointString = (point: Point) =>
  `${point.x.toFixed(2)},${point.y.toFixed(2)}`;

const paperGeometry = (length: number, bend: number, tipSwing: number) => {
  const samples = 72;
  const frames = Array.from({ length: samples + 1 }, (_, index) =>
    frameAt((length * index) / samples, length, bend, tipSwing),
  );
  const left = frames.map(({ point, normal }) => ({
    x: point.x + normal.x * HALF_WIDTH,
    y: point.y + normal.y * HALF_WIDTH,
  }));
  const right = frames.map(({ point, normal }) => ({
    x: point.x - normal.x * HALF_WIDTH,
    y: point.y - normal.y * HALF_WIDTH,
  }));

  const tipFrame = frames[frames.length - 1];
  const teeth = 24;
  const jagged = Array.from({ length: teeth + 1 }, (_, index) => {
    const t = index / teeth;
    const across = PAPER_WIDTH * t;
    const tooth = index > 0 && index < teeth && index % 2 === 1 ? 9 : 0;
    return {
      x:
        left[left.length - 1].x -
        tipFrame.normal.x * across +
        tipFrame.tangent.x * tooth,
      y:
        left[left.length - 1].y -
        tipFrame.normal.y * across +
        tipFrame.tangent.y * tooth,
    };
  });

  const path = `M ${pointString(left[0])} ${left
    .slice(1)
    .map((point) => `L ${pointString(point)}`)
    .join(" ")} ${jagged
    .slice(1)
    .map((point) => `L ${pointString(point)}`)
    .join(" ")} ${right
    .slice(0, -1)
    .reverse()
    .map((point) => `L ${pointString(point)}`)
    .join(" ")} Z`;

  return { path, frames };
};

const backFoldPath = (length: number, bend: number, tipSwing: number) => {
  const foldLength = Math.min(length, 390);
  const samples = 40;
  const frames = Array.from({ length: samples + 1 }, (_, index) =>
    frameAt((foldLength * index) / samples, length, bend, tipSwing),
  );
  const inner = frames.map(({ point, normal }) => ({
    x: point.x + normal.x * HALF_WIDTH,
    y: point.y + normal.y * HALF_WIDTH,
  }));
  const outer = frames.map(({ point, normal }, index) => {
    const u = index / samples;
    const depth = 92 * Math.sin(Math.PI * u) ** 1.25;
    return {
      x: point.x + normal.x * (HALF_WIDTH + depth),
      y: point.y + normal.y * (HALF_WIDTH + depth),
    };
  });
  return `M ${pointString(inner[0])} ${inner
    .slice(1)
    .map((point) => `L ${pointString(point)}`)
    .join(" ")} ${outer
    .reverse()
    .map((point) => `L ${pointString(point)}`)
    .join(" ")} Z`;
};

const barLine = (
  material: number,
  width: number,
  length: number,
  bend: number,
  tipSwing: number,
) => {
  const { point, normal } = frameAt(material, length, bend, tipSwing);
  const halfW = width / 2;
  return {
    x1: point.x + normal.x * halfW,
    y1: point.y + normal.y * halfW,
    x2: point.x - normal.x * halfW,
    y2: point.y - normal.y * halfW,
  };
};

const DispenserBack: React.FC = () => (
  <g aria-label="red receipt dispenser top and slot">
    <path
      d="M 1046 706 Q 1045 690 1063 681 L 1134 654 L 1608 698 Q 1634 701 1627 724 L 1530 782 Z"
      fill={theme.colors.redTop}
    />
    <path
      d="M 1093 697 L 1138 676 L 1581 717 L 1510 762 Z"
      fill={theme.colors.charcoalDark}
    />
    <path
      d="M 1110 699 L 1146 684 L 1558 722 L 1497 752 Z"
      fill={theme.colors.charcoal}
    />
  </g>
);

const DispenserFront: React.FC = () => (
  <g aria-label="front lip and body of receipt dispenser">
    <path
      d="M 1046 706 L 1530 782 V 900 L 1054 808 Q 1040 805 1040 790 V 724 Q 1040 711 1046 706 Z"
      fill={theme.colors.red}
    />
    <path
      d="M 1530 782 L 1627 724 V 838 Q 1627 849 1615 856 L 1548 896 Q 1530 907 1530 888 Z"
      fill={theme.colors.redSide}
    />
  </g>
);

const PaperRibbon: React.FC<{
  length: number;
  bend: number;
  tipSwing: number;
}> = ({ length, bend, tipSwing }) => {
  const { path } = paperGeometry(length, bend, tipSwing);
  const bars = [
    { offsetFromTip: 100, width: 240 },
    { offsetFromTip: 142, width: 254 },
    { offsetFromTip: 184, width: 246 },
    { offsetFromTip: 226, width: 230 },
  ];

  return (
    <g aria-label="curved cream receipt ribbon">
      <path
        d={backFoldPath(length, bend, tipSwing)}
        fill={theme.colors.charcoal}
      />
      <path d={path} fill={theme.colors.paper} />
      {bars.map((bar) => {
        const material = length - bar.offsetFromTip;
        return material >= 76 ? (
          <line
            key={bar.offsetFromTip}
            {...barLine(material, bar.width, length, bend, tipSwing)}
            stroke={theme.colors.charcoal}
            strokeWidth={16}
            strokeLinecap="round"
          />
        ) : null;
      })}
    </g>
  );
};

export const ReceiptUnrollB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at30 = (value: number) => (value / 30) * fps;

  let length = MIN_LENGTH;
  if (frame >= at30(15) && frame < at30(105)) {
    const feed = progress(frame, at30(15), at30(105), theme.ease.feed);
    length = MIN_LENGTH + (MAX_LENGTH - MIN_LENGTH) * feed;
  } else if (frame >= at30(105)) {
    length = MAX_LENGTH;
  }
  if (frame >= at30(240)) {
    const retract = progress(frame, at30(240), at30(299), theme.ease.reverse);
    length = MAX_LENGTH - (MAX_LENGTH - MIN_LENGTH) * retract;
  }

  const bend = smoothstep((length - 175) / (MAX_LENGTH - 175));
  const swingOut = progress(
    frame,
    at30(105),
    at30(116),
    Easing.out(Easing.cubic),
  );
  const swingBack = progress(
    frame,
    at30(116),
    at30(134),
    Easing.inOut(Easing.cubic),
  );
  const tipSwing = 10 * swingOut * (1 - swingBack);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Curved receipt emerging from a red dispenser"
      >
        <DispenserBack />
        <PaperRibbon length={length} bend={bend} tipSwing={tipSwing} />
        <DispenserFront />
      </svg>
    </AbsoluteFill>
  );
};
