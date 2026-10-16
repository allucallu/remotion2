import { Easing, interpolate, useCurrentFrame } from "remotion";

export const HALLOWEEN_FLOATING_GHOSTS_WIDTH = 3840;
export const HALLOWEEN_FLOATING_GHOSTS_HEIGHT = 2160;
export const HALLOWEEN_FLOATING_GHOSTS_FPS = 30;
export const HALLOWEEN_FLOATING_GHOSTS_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F4E9D2",
  eye: "#000000",
  ochre: "#E9A12C",
} as const;

const VIEWBOX = {
  width: 1920,
  height: 1080,
} as const;

type GhostConfig = {
  id: string;
  x: number;
  y: number;
  scale: number;
  enterStart: number;
  floatPeriod: number;
  phase: number;
  amplitudeX: number;
  amplitudeY: number;
  rotation: number;
  exitStart: number;
  exitEnd: number;
  exitX: number;
  exitY: number;
};

const GHOSTS: readonly GhostConfig[] = [
  {
    id: "hero",
    x: 980,
    y: 535,
    scale: 1.38,
    enterStart: 0,
    floatPeriod: 112,
    phase: 0.45,
    amplitudeX: 10,
    amplitudeY: 22,
    rotation: 2.6,
    exitStart: 248,
    exitEnd: 280,
    exitX: 430,
    exitY: -245,
  },
  {
    id: "left",
    x: 405,
    y: 730,
    scale: 0.66,
    enterStart: 8,
    floatPeriod: 96,
    phase: 2.2,
    amplitudeX: 8,
    amplitudeY: 18,
    rotation: 2.2,
    exitStart: 256,
    exitEnd: 287,
    exitX: 390,
    exitY: -220,
  },
  {
    id: "right",
    x: 1510,
    y: 355,
    scale: 0.72,
    enterStart: 16,
    floatPeriod: 103,
    phase: 4.1,
    amplitudeX: 7,
    amplitudeY: 20,
    rotation: 2.8,
    exitStart: 240,
    exitEnd: 272,
    exitX: 410,
    exitY: -250,
  },
] as const;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const easeOut = Easing.bezier(0.18, 0.72, 0.24, 1);
const easeIn = Easing.bezier(0.55, 0, 0.78, 0.28);
const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);

const progress = (
  frame: number,
  start: number,
  end: number,
  easing = easeOut,
) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing,
  });

const Ghost = ({ config, frame }: { config: GhostConfig; frame: number }) => {
  const enter = progress(frame, config.enterStart, 47, easeOut);
  const exit = progress(frame, config.exitStart, config.exitEnd, easeIn);
  const floatRamp = progress(frame, 47, 62, easeInOut);
  const floatPhase =
    ((frame - 47) / config.floatPeriod) * Math.PI * 2 + config.phase;
  const floatX = Math.sin(floatPhase) * config.amplitudeX * floatRamp;
  const floatY = Math.cos(floatPhase) * config.amplitudeY * floatRamp;
  const floatRotation =
    Math.sin(floatPhase * 0.82) * config.rotation * floatRamp;

  const entryX = (1 - enter) * -VIEWBOX.width * 0.15;
  const entryY = (1 - enter) * VIEWBOX.height * 0.12;
  const exitX = exit * config.exitX;
  const exitY = exit * config.exitY;
  const opacity = enter * (1 - exit);

  const clothPhase = ((frame + config.phase * 17) / 46) * Math.PI * 2;
  const clothA = Math.sin(clothPhase) * 8;
  const clothB = Math.sin(clothPhase + 2.1) * 7;
  const clothC = Math.sin(clothPhase + 4.25) * 9;
  const clothSide = Math.sin(clothPhase * 0.72 + 1.2) * 5;

  const bodyPath = [
    "M -174 -12",
    "C -201 -27 -224 -15 -238 10",
    "C -206 -3 -188 26 -173 48",
    "C -154 76 -118 71 -94 49",
    "C -70 26 -62 -4 -60 -42",
    "L -60 -82",
    "C -60 -147 -20 -181 31 -171",
    "C 84 -161 98 -115 108 -67",
    "C 116 -27 130 -4 151 1",
    "C 171 6 188 -17 205 -28",
    "C 224 -40 241 -34 248 -20",
    "C 223 -9 213 15 202 41",
    "C 188 73 159 87 131 71",
    `C 128 ${112 + clothSide} 113 ${153 + clothA} 86 ${178 + clothA}`,
    `C 65 ${198 + clothA} 47 ${181 + clothA} 49 ${151 + clothA}`,
    `C 22 ${176 + clothB} -6 ${205 + clothB} -35 ${190 + clothB}`,
    `C -61 ${177 + clothB} -70 ${143 + clothB} -95 ${160 + clothB}`,
    `C -124 ${181 + clothC} -153 ${168 + clothC} -158 ${137 + clothC}`,
    `C -164 ${91 + clothSide} -154 ${54 + clothSide} -174 -12 Z`,
  ].join(" ");

  return (
    <g
      opacity={opacity}
      transform={`translate(${
        config.x + entryX + floatX + exitX
      } ${config.y + entryY + floatY + exitY}) rotate(${floatRotation}) scale(${
        config.scale
      })`}
    >
      <path d={bodyPath} fill={PALETTE.ivory} />
      <ellipse
        cx={-18}
        cy={-94}
        rx={12}
        ry={19}
        fill={PALETTE.eye}
        transform="rotate(-13 -18 -94)"
      />
      <ellipse
        cx={28}
        cy={-102}
        rx={12}
        ry={19}
        fill={PALETTE.eye}
        transform="rotate(-11 28 -102)"
      />
    </g>
  );
};

const Star = ({
  frame,
  x,
  y,
  size,
  phase,
}: {
  frame: number;
  x: number;
  y: number;
  size: number;
  phase: number;
}) => {
  const enter = progress(frame, 36 + phase, 51 + phase, easeOut);
  const exit = progress(frame, 264 + phase, 287, easeIn);
  const idle = Math.sin(((frame + phase * 7) / 108) * Math.PI * 2);
  const scale = (0.7 + enter * 0.3) * (1 + idle * 0.04) * (1 - exit * 0.45);
  const rotation = idle * 5;

  return (
    <path
      d="M 0 -50 C 7 -18 15 -9 48 0 C 15 9 7 18 0 50 C -7 18 -15 9 -48 0 C -15 -9 -7 -18 0 -50 Z"
      fill={PALETTE.ochre}
      opacity={enter * (1 - exit)}
      transform={`translate(${x} ${y}) rotate(${rotation}) scale(${
        (size / 100) * scale
      })`}
    />
  );
};

export const HalloweenFloatingGhosts = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      width={HALLOWEEN_FLOATING_GHOSTS_WIDTH}
      height={HALLOWEEN_FLOATING_GHOSTS_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{ display: "block", backgroundColor: PALETTE.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      {GHOSTS.map((ghost) => (
        <Ghost key={ghost.id} config={ghost} frame={frame} />
      ))}
      <Star frame={frame} x={235} y={570} size={76} phase={0} />
      <Star frame={frame} x={1700} y={175} size={70} phase={3} />
    </svg>
  );
};
