import { Easing, interpolate, useCurrentFrame } from "remotion";

export const PROGRESS_CAPSULE_WIDTH = 3840;
export const PROGRESS_CAPSULE_HEIGHT = 2160;
export const PROGRESS_CAPSULE_FPS = 30;
export const PROGRESS_CAPSULE_DURATION = 240;

const PALETTE = {
  background: "#000000",
  coral: "#FF7464",
  cream: "#F7F0E2",
} as const;

const GEOMETRY = {
  outerX: 550,
  outerY: 492,
  outerWidth: 820,
  outerHeight: 108,
  outline: 8,
  innerInset: 16,
  dotY: 438,
  dotRadius: 14,
  dotCenters: [905, 960, 1015],
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const segmentProgress = (
  frame: number,
  start: number,
  end: number,
  easing: (t: number) => number,
) => interpolate(frame, [start, end], [0, 1], { ...clamp, easing });

const getProgress = (frame: number) => {
  if (frame < 12) return 0;
  if (frame < 54) return 0.36 * segmentProgress(frame, 12, 54, easeOut);
  if (frame < 96)
    return 0.36 + 0.16 * segmentProgress(frame, 54, 96, easeInOut);
  if (frame < 140)
    return 0.52 + 0.29 * segmentProgress(frame, 96, 140, easeOut);
  if (frame < 180)
    return 0.81 + 0.19 * segmentProgress(frame, 140, 179, easeInOut);
  if (frame < 228) return 1;

  // The finished fill retracts quickly from its moving right edge.
  return 1 - segmentProgress(frame, 228, 236, easeOut);
};

const positiveModulo = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

export const ProgressCapsule = () => {
  const frame = useCurrentFrame();
  const innerX = GEOMETRY.outerX + GEOMETRY.innerInset;
  const innerY = GEOMETRY.outerY + GEOMETRY.innerInset;
  const innerWidth = GEOMETRY.outerWidth - GEOMETRY.innerInset * 2;
  const innerHeight = GEOMETRY.outerHeight - GEOMETRY.innerInset * 2;
  const completion = getProgress(frame);
  const fillWidth = innerWidth * completion;
  const designOpacity = interpolate(frame, [237, 239], [1, 0], {
    ...clamp,
    easing: easeInOut,
  });

  return (
    <svg
      width={PROGRESS_CAPSULE_WIDTH}
      height={PROGRESS_CAPSULE_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: PALETTE.background }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="progress-capsule-inner">
          <rect
            x={innerX}
            y={innerY}
            width={innerWidth}
            height={innerHeight}
            rx={innerHeight / 2}
          />
        </clipPath>
      </defs>

      <rect width={1920} height={1080} fill={PALETTE.background} />
      <g opacity={designOpacity}>
        {GEOMETRY.dotCenters.map((cx, index) => {
          const phase = positiveModulo(frame - 12 - index * 12, 36) / 36;
          const pulse = 0.5 + 0.5 * Math.sin(Math.PI * 2 * phase - Math.PI / 2);
          const opacity = frame >= 180 ? 1 : 0.4 + pulse * 0.6;

          return (
            <circle
              key={cx}
              cx={cx}
              cy={GEOMETRY.dotY}
              r={GEOMETRY.dotRadius}
              fill={PALETTE.cream}
              opacity={opacity}
            />
          );
        })}

        <g clipPath="url(#progress-capsule-inner)">
          {fillWidth > 0 ? (
            <rect
              x={innerX}
              y={innerY}
              width={fillWidth}
              height={innerHeight}
              rx={innerHeight / 2}
              fill={PALETTE.coral}
            />
          ) : null}
        </g>
        <rect
          x={GEOMETRY.outerX}
          y={GEOMETRY.outerY}
          width={GEOMETRY.outerWidth}
          height={GEOMETRY.outerHeight}
          rx={GEOMETRY.outerHeight / 2}
          fill="none"
          stroke={PALETTE.cream}
          strokeWidth={GEOMETRY.outline}
        />
      </g>
    </svg>
  );
};
