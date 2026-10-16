import { Easing, interpolate, useCurrentFrame } from "remotion";

export const HALLOWEEN_BAT_SWARM_WIDTH = 3840;
export const HALLOWEEN_BAT_SWARM_HEIGHT = 2160;
export const HALLOWEEN_BAT_SWARM_FPS = 30;
export const HALLOWEEN_BAT_SWARM_DURATION = 240;

const PALETTE = {
  background: "#000000",
  ivory: "#F3E8CF",
  orange: "#F27A24",
} as const;

const VIEWBOX = {
  width: 1920,
  height: 1080,
} as const;

type Point = { x: number; y: number };
type BatColor = keyof Pick<typeof PALETTE, "ivory" | "orange">;

type BatConfig = {
  id: string;
  start: number;
  end: number;
  scale: number;
  color: BatColor;
  period: number;
  wingPhase: number;
  offsetX: number;
  offsetY: number;
  drift: number;
  tilt: number;
};

const BATS: readonly BatConfig[] = [
  {
    id: "ivory-leader",
    start: 0,
    end: 184,
    scale: 0.52,
    color: "ivory",
    period: 13,
    wingPhase: 2,
    offsetX: 70,
    offsetY: -60,
    drift: 18,
    tilt: -2,
  },
  {
    id: "orange-leader",
    start: 6,
    end: 194,
    scale: 0.6,
    color: "orange",
    period: 15,
    wingPhase: 7,
    offsetX: -15,
    offsetY: 55,
    drift: 24,
    tilt: 2,
  },
  {
    id: "ivory-high",
    start: 13,
    end: 202,
    scale: 0.48,
    color: "ivory",
    period: 12,
    wingPhase: 5,
    offsetX: 120,
    offsetY: -115,
    drift: 15,
    tilt: -4,
  },
  {
    id: "orange-center",
    start: 20,
    end: 216,
    scale: 1.04,
    color: "orange",
    period: 18,
    wingPhase: 11,
    offsetX: 20,
    offsetY: -8,
    drift: 28,
    tilt: 1,
  },
  {
    id: "ivory-center",
    start: 28,
    end: 222,
    scale: 0.68,
    color: "ivory",
    period: 14,
    wingPhase: 9,
    offsetX: -65,
    offsetY: 15,
    drift: 20,
    tilt: 3,
  },
  {
    id: "orange-trailer",
    start: 36,
    end: 228,
    scale: 0.82,
    color: "orange",
    period: 16,
    wingPhase: 1,
    offsetX: -10,
    offsetY: 45,
    drift: 22,
    tilt: 2,
  },
  {
    id: "ivory-hero",
    start: 45,
    end: 233,
    scale: 1.72,
    color: "ivory",
    period: 17,
    wingPhase: 13,
    offsetX: -25,
    offsetY: 5,
    drift: 30,
    tilt: 4,
  },
] as const;

const ROUTE = {
  start: { x: -360, y: 1180 },
  controlA: { x: 470, y: 1070 },
  controlB: { x: 1300, y: 120 },
  end: { x: 2260, y: -170 },
} as const;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const travelEase = Easing.bezier(0.32, 0.03, 0.68, 0.97);

const cubicPoint = (
  start: Point,
  controlA: Point,
  controlB: Point,
  end: Point,
  t: number,
): Point => {
  const inverse = 1 - t;
  return {
    x:
      inverse ** 3 * start.x +
      3 * inverse ** 2 * t * controlA.x +
      3 * inverse * t ** 2 * controlB.x +
      t ** 3 * end.x,
    y:
      inverse ** 3 * start.y +
      3 * inverse ** 2 * t * controlA.y +
      3 * inverse * t ** 2 * controlB.y +
      t ** 3 * end.y,
  };
};

const cubicTangent = (
  start: Point,
  controlA: Point,
  controlB: Point,
  end: Point,
  t: number,
): Point => {
  const inverse = 1 - t;
  return {
    x:
      3 * inverse ** 2 * (controlA.x - start.x) +
      6 * inverse * t * (controlB.x - controlA.x) +
      3 * t ** 2 * (end.x - controlB.x),
    y:
      3 * inverse ** 2 * (controlA.y - start.y) +
      6 * inverse * t * (controlB.y - controlA.y) +
      3 * t ** 2 * (end.y - controlB.y),
  };
};

const Bat = ({ config, frame }: { config: BatConfig; frame: number }) => {
  const rawProgress = interpolate(
    frame,
    [config.start, config.end],
    [0, 1],
    {
      ...clamp,
      easing: travelEase,
    },
  );
  const point = cubicPoint(
    ROUTE.start,
    ROUTE.controlA,
    ROUTE.controlB,
    ROUTE.end,
    rawProgress,
  );
  const tangent = cubicTangent(
    ROUTE.start,
    ROUTE.controlA,
    ROUTE.controlB,
    ROUTE.end,
    rawProgress,
  );
  const flightAngle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;

  const wingCycle =
    ((frame - config.start + config.wingPhase) / config.period) * Math.PI * 2;
  const flap = (1 - Math.cos(wingCycle)) / 2;
  const bodyBob = Math.sin(wingCycle) * 1.2;
  const pathDrift =
    Math.sin(rawProgress * Math.PI * 2 + config.wingPhase * 0.31) *
    config.drift;

  const wingTipX = 112 - flap * 25;
  const wingTipY = -24 + flap * 54;
  const wingShoulderY = -6 + flap * 5;
  const lowerWingY = 18 + flap * 22;
  const color = PALETTE[config.color];

  const leftWing = [
    `M -8 ${wingShoulderY.toFixed(2)}`,
    `C -31 ${(-38 + flap * 9).toFixed(2)} -73 ${(-48 + flap * 21).toFixed(2)} -${wingTipX.toFixed(2)} ${wingTipY.toFixed(2)}`,
    `C -91 ${(wingTipY + 1).toFixed(2)} -78 ${(wingTipY + 13).toFixed(2)} -72 ${(wingTipY + 27).toFixed(2)}`,
    `Q -57 ${(lowerWingY - 10).toFixed(2)} -49 ${lowerWingY.toFixed(2)}`,
    `Q -35 ${(lowerWingY - 8).toFixed(2)} -28 ${(lowerWingY + 4).toFixed(2)}`,
    `Q -17 ${(lowerWingY - 6).toFixed(2)} -8 15 Z`,
  ].join(" ");

  const rightWing = [
    `M 8 ${wingShoulderY.toFixed(2)}`,
    `C 34 ${(-35 + flap * 8).toFixed(2)} 74 ${(-45 + flap * 20).toFixed(2)} ${(
      wingTipX * 0.98
    ).toFixed(2)} ${(wingTipY + 3).toFixed(2)}`,
    `C 92 ${(wingTipY + 4).toFixed(2)} 79 ${(wingTipY + 15).toFixed(2)} 72 ${(
      wingTipY + 29
    ).toFixed(2)}`,
    `Q 58 ${(lowerWingY - 8).toFixed(2)} 49 ${(lowerWingY + 2).toFixed(2)}`,
    `Q 36 ${(lowerWingY - 6).toFixed(2)} 28 ${(lowerWingY + 6).toFixed(2)}`,
    `Q 17 ${(lowerWingY - 4).toFixed(2)} 8 15 Z`,
  ].join(" ");

  return (
    <g
      transform={`translate(${point.x + config.offsetX} ${
        point.y + config.offsetY + pathDrift + bodyBob
      }) rotate(${flightAngle * 0.34 + config.tilt}) scale(${config.scale})`}
    >
      <path d={leftWing} fill={color} />
      <path d={rightWing} fill={color} />
      <path
        d="M -12 -10 L -9 -27 L -1 -18 L 6 -29 L 12 -9 C 15 3 12 18 0 30 C -12 18 -15 3 -12 -10 Z"
        fill={color}
      />
    </g>
  );
};

export const HalloweenBatSwarm = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      width={HALLOWEEN_BAT_SWARM_WIDTH}
      height={HALLOWEEN_BAT_SWARM_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{ display: "block", backgroundColor: PALETTE.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      {BATS.map((bat) => (
        <Bat key={bat.id} config={bat} frame={frame} />
      ))}
    </svg>
  );
};
