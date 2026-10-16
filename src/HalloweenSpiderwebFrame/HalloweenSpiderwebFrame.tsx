import { Easing, interpolate, useCurrentFrame } from "remotion";

export const HALLOWEEN_SPIDERWEB_WIDTH = 3840;
export const HALLOWEEN_SPIDERWEB_HEIGHT = 2160;
export const HALLOWEEN_SPIDERWEB_FPS = 30;
export const HALLOWEEN_SPIDERWEB_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F3E8CF",
  orange: "#E87822",
} as const;

const GEOMETRY = {
  viewWidth: 1920,
  viewHeight: 1080,
  radialStroke: 4.5,
  connectorStroke: 4,
  spiderAnchorX: 170,
  spiderAnchorY: 180,
  spiderDrop: 220,
  spiderBodyGap: 28,
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.2, 0.72, 0.24, 1);
const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);
const easeIn = Easing.bezier(0.55, 0, 0.78, 0.28);

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

const WEB_ANGLES = [0, 10, 21, 33, 46, 59, 71, 81, 90] as const;
const WEB_RING_SCALES = [0.13, 0.22, 0.33, 0.45, 0.58, 0.72, 0.88] as const;
const WEB_RADIUS_X = 530;
const WEB_RADIUS_Y = 460;

const webPoint = (scale: number, angle: number) => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: WEB_RADIUS_X * scale * Math.cos(radians),
    y: WEB_RADIUS_Y * scale * Math.sin(radians),
  };
};

const pointText = ({ x, y }: { x: number; y: number }) =>
  `${x.toFixed(2)} ${y.toFixed(2)}`;

const RADIAL_PATHS = WEB_ANGLES.map((angle) => {
  const endpoint = webPoint(1, angle);
  return {
    d: `M 0 0 L ${pointText(endpoint)}`,
    length: Math.hypot(endpoint.x, endpoint.y),
  };
});

const quadraticLength = (
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
) => {
  let length = 0;
  let previous = start;
  const samples = 24;

  for (let index = 1; index <= samples; index++) {
    const t = index / samples;
    const inverse = 1 - t;
    const point = {
      x:
        inverse * inverse * start.x +
        2 * inverse * t * control.x +
        t * t * end.x,
      y:
        inverse * inverse * start.y +
        2 * inverse * t * control.y +
        t * t * end.y,
    };
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }

  return length;
};

const CONNECTOR_LAYERS = WEB_RING_SCALES.map((scale, ringIndex) => {
  const segments = WEB_ANGLES.slice(0, -1).map((angle, segmentIndex) => {
    const nextAngle = WEB_ANGLES[segmentIndex + 1];
    const start = webPoint(scale, angle);
    const end = webPoint(scale, nextAngle);
    const middleAngle = (angle + nextAngle) / 2;
    const sag = 0.76 + ((ringIndex + segmentIndex) % 3) * 0.025;
    const control = webPoint(scale * sag, middleAngle);
    const isAccent = (ringIndex * 3 + segmentIndex * 2) % 11 < 2;

    return {
      d: `M ${pointText(start)} Q ${pointText(control)} ${pointText(end)}`,
      command: `Q ${pointText(control)} ${pointText(end)}`,
      length: quadraticLength(start, control, end),
      isAccent,
      segmentIndex,
    };
  });
  const start = webPoint(scale, WEB_ANGLES[0]);

  return {
    d: `M ${pointText(start)} ${segments.map((segment) => segment.command).join(" ")}`,
    length: segments.reduce((sum, segment) => sum + segment.length, 0),
    accents: segments.filter((segment) => segment.isAccent),
    ringIndex,
  };
});

const LEG_PATHS = [
  "M -6 5 Q -18 2 -25 -7 Q -31 -16 -29 -25",
  "M -8 10 Q -23 8 -32 2 Q -40 -4 -43 -13",
  "M -8 16 Q -24 18 -34 25 Q -41 31 -45 39",
  "M -6 21 Q -19 28 -24 37 Q -27 46 -23 54",
  "M 6 5 Q 18 1 26 -7 Q 32 -14 30 -24",
  "M 8 10 Q 23 8 33 2 Q 41 -4 44 -12",
  "M 8 16 Q 24 18 35 24 Q 43 30 47 38",
  "M 6 21 Q 19 28 25 37 Q 29 46 25 53",
] as const;

const AnimatedStroke = ({
  d,
  draw,
  color,
  strokeWidth,
  pathLength,
}: {
  d: string;
  draw: number;
  color: string;
  strokeWidth: number;
  pathLength: number;
}) => {
  const isFullyVisible = draw >= 0.9999;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={
        isFullyVisible ? undefined : `${draw * pathLength} ${pathLength * 4}`
      }
      strokeDashoffset={0}
      opacity={draw > 0 ? 1 : 0}
      vectorEffect="non-scaling-stroke"
    />
  );
};

const radialDraw = (frame: number, index: number) => {
  const entryStart = index * 2;
  const entry = progress(frame, entryStart, entryStart + 9);
  const exitStart = 282 + (RADIAL_PATHS.length - 1 - index);
  const exit = progress(frame, exitStart, 296, easeIn);
  return frame < 282 ? entry : 1 - exit;
};

const connectorDraw = (frame: number, index: number) => {
  const entryStart = 18 + index * 3;
  const entry = progress(frame, entryStart, entryStart + 17);
  const exitStart = 270 + (WEB_RING_SCALES.length - 1 - index) * 2;
  const exitEnd = Math.min(287, exitStart + 7);
  const exit = progress(frame, exitStart, exitEnd, easeIn);
  return frame < 270 ? entry : 1 - exit;
};

const Web = ({ transform, frame }: { transform?: string; frame: number }) => (
  <g transform={transform}>
    {RADIAL_PATHS.map((path, index) => (
      <AnimatedStroke
        key={`radial-${path.d}`}
        d={path.d}
        draw={radialDraw(frame, index)}
        color={PALETTE.ivory}
        strokeWidth={GEOMETRY.radialStroke}
        pathLength={path.length}
      />
    ))}
    {CONNECTOR_LAYERS.map((layer) => {
      const layerDraw = connectorDraw(frame, layer.ringIndex);
      return (
        <g key={`connector-layer-${layer.ringIndex}`}>
          <AnimatedStroke
            d={layer.d}
            draw={layerDraw}
            color={PALETTE.ivory}
            strokeWidth={GEOMETRY.connectorStroke}
            pathLength={layer.length}
          />
          {layer.accents.map((accent) => {
            const accentDraw = Math.max(
              0,
              Math.min(
                1,
                layerDraw * (WEB_ANGLES.length - 1) - accent.segmentIndex,
              ),
            );
            return (
              <AnimatedStroke
                key={`accent-${layer.ringIndex}-${accent.segmentIndex}`}
                d={accent.d}
                draw={accentDraw}
                color={PALETTE.orange}
                strokeWidth={GEOMETRY.connectorStroke}
                pathLength={accent.length}
              />
            );
          })}
        </g>
      );
    })}
  </g>
);

const Spider = ({ frame }: { frame: number }) => {
  const descent = progress(frame, 54, 83, easeInOut);
  const ascent = progress(frame, 252, 275, easeInOut);
  const visible =
    progress(frame, 54, 59) * (1 - progress(frame, 272, 275, easeIn));
  const travel = frame < 252 ? descent : 1 - ascent;
  const distance = GEOMETRY.spiderBodyGap + GEOMETRY.spiderDrop * travel;

  const swingStrength =
    frame < 84 ? 0 : frame < 252 ? 1 : Math.max(0, 1 - ascent);
  const swingAngle =
    Math.sin(((frame - 84) / 90) * Math.PI * 2) * 3 * swingStrength;
  const swingRadians = (swingAngle * Math.PI) / 180;
  const bodyX = GEOMETRY.spiderAnchorX + Math.sin(swingRadians) * distance;
  const bodyY = GEOMETRY.spiderAnchorY + Math.cos(swingRadians) * distance;

  const descentLegMotion = Math.sin((frame - 54) * 0.52) * 2.4 * (1 - descent);
  const holdLegMotion =
    Math.sin(((frame - 84) / 45) * Math.PI * 2) * 0.75 * swingStrength;
  const legMotion = frame < 84 ? descentLegMotion : holdLegMotion;

  return (
    <g opacity={visible}>
      <line
        x1={GEOMETRY.spiderAnchorX}
        y1={GEOMETRY.spiderAnchorY}
        x2={bodyX}
        y2={bodyY - 29}
        stroke={PALETTE.ivory}
        strokeWidth={3.5}
        strokeLinecap="round"
      />

      <g
        transform={`translate(${bodyX} ${bodyY}) rotate(${swingAngle * 0.65})`}
      >
        {LEG_PATHS.map((path, index) => {
          const direction = index < 4 ? -1 : 1;
          const phaseWeight = 0.65 + (index % 4) * 0.16;
          return (
            <path
              key={path}
              d={path}
              fill="none"
              stroke={PALETTE.ivory}
              strokeWidth={3.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`rotate(${direction * legMotion * phaseWeight})`}
            />
          );
        })}

        <ellipse cx={0} cy={-7} rx={14} ry={20} fill={PALETTE.ivory} />
        <ellipse cx={0} cy={0} rx={13} ry={4} fill={PALETTE.orange} />
        <circle cx={0} cy={18} r={8.5} fill={PALETTE.ivory} />
      </g>
    </g>
  );
};

export const HalloweenSpiderwebFrame = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      width={HALLOWEEN_SPIDERWEB_WIDTH}
      height={HALLOWEEN_SPIDERWEB_HEIGHT}
      viewBox={`0 0 ${GEOMETRY.viewWidth} ${GEOMETRY.viewHeight}`}
      style={{ display: "block", backgroundColor: PALETTE.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect
        width={GEOMETRY.viewWidth}
        height={GEOMETRY.viewHeight}
        fill={PALETTE.background}
      />

      <Web frame={frame} />
      <Web
        frame={frame}
        transform={`translate(${GEOMETRY.viewWidth} ${GEOMETRY.viewHeight}) scale(-1.5 -1.35)`}
      />
      <Spider frame={frame} />
    </svg>
  );
};
