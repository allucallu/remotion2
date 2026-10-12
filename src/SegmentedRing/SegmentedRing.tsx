import { interpolateColors, useCurrentFrame } from "remotion";

export const SEGMENTED_RING_WIDTH = 3840;
export const SEGMENTED_RING_HEIGHT = 2160;
export const SEGMENTED_RING_FPS = 30;
export const SEGMENTED_RING_DURATION = 240;

const PALETTE = {
  background: "#000000",
  cream: "#F4EDDD",
  warmGray: "#54514B",
  terracotta: "#D9815D",
} as const;

const GEOMETRY = {
  centerX: 960,
  centerY: 540,
  radius: 320,
  strokeWidth: 66,
  segmentCount: 12,
  gapDegrees: 7,
} as const;

const LOOP_FRAMES = 60;
const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
const positiveModulo = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

const pointOnRing = (degrees: number) => {
  const angle = degreesToRadians(degrees);
  return {
    x: GEOMETRY.centerX + Math.cos(angle) * GEOMETRY.radius,
    y: GEOMETRY.centerY + Math.sin(angle) * GEOMETRY.radius,
  };
};

const segmentPath = (index: number) => {
  const segmentDegrees = 360 / GEOMETRY.segmentCount;
  const startAngle = -90 + index * segmentDegrees + GEOMETRY.gapDegrees / 2;
  const endAngle = -90 + (index + 1) * segmentDegrees - GEOMETRY.gapDegrees / 2;
  const start = pointOnRing(startAngle);
  const end = pointOnRing(endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${GEOMETRY.radius} ${GEOMETRY.radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

const circularDistance = (first: number, second: number) => {
  const forward = positiveModulo(first - second, GEOMETRY.segmentCount);
  return Math.min(forward, GEOMETRY.segmentCount - forward);
};

const segmentColor = (index: number, head: number) => {
  const distanceBehindHead = positiveModulo(
    head - index,
    GEOMETRY.segmentCount,
  );
  const headDistance = circularDistance(index, head);
  const creamAmount = Math.max(0, 1 - Math.max(0, distanceBehindHead - 1) / 7);
  const terracottaAmount = Math.max(0, 1 - headDistance / 1.12);
  const trailColor = interpolateColors(
    creamAmount,
    [0, 1],
    [PALETTE.warmGray, PALETTE.cream],
  );

  return interpolateColors(
    terracottaAmount,
    [0, 1],
    [trailColor, PALETTE.terracotta],
  );
};

export const SegmentedRing = () => {
  const frame = useCurrentFrame();
  const head =
    (positiveModulo(frame, LOOP_FRAMES) / LOOP_FRAMES) * GEOMETRY.segmentCount;

  return (
    <svg
      width={SEGMENTED_RING_WIDTH}
      height={SEGMENTED_RING_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: PALETTE.background }}
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={PALETTE.background} />
      {Array.from({ length: GEOMETRY.segmentCount }, (_, index) => (
        <path
          key={index}
          d={segmentPath(index)}
          fill="none"
          stroke={segmentColor(index, head)}
          strokeWidth={GEOMETRY.strokeWidth}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};
