import { Easing, interpolate, useCurrentFrame } from "remotion";

export const ELASTIC_DOTS_WIDTH = 3840;
export const ELASTIC_DOTS_HEIGHT = 2160;
export const ELASTIC_DOTS_FPS = 30;
export const ELASTIC_DOTS_DURATION = 180;

const PALETTE = {
  background: "#000000",
  cream: "#F7F0E2",
  ochre: "#E8B43E",
} as const;

const LOOP_FRAMES = 60;
const smooth = Easing.bezier(0.45, 0, 0.2, 1);

type DotShape = { centerY: number; radiusX: number; radiusY: number };

const positiveModulo = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

const between = (
  frame: number,
  start: number,
  end: number,
  from: number,
  to: number,
) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smooth,
  });

const getDotShape = (localFrame: number): DotShape => {
  // Each active jump occupies 20 frames; the other two dots remain grounded.
  if (localFrame >= 20 || localFrame < 3) {
    return { centerY: 560, radiusX: 72, radiusY: 72 };
  }
  if (localFrame < 6) {
    return {
      centerY: between(localFrame, 3, 6, 560, 574),
      radiusX: between(localFrame, 3, 6, 72, 88),
      radiusY: between(localFrame, 3, 6, 72, 58),
    };
  }
  if (localFrame < 10) {
    return {
      centerY: between(localFrame, 6, 10, 574, 512),
      radiusX: between(localFrame, 6, 10, 88, 66),
      radiusY: between(localFrame, 6, 10, 58, 80),
    };
  }
  if (localFrame < 13) {
    return {
      centerY: between(localFrame, 10, 13, 512, 520),
      radiusX: between(localFrame, 10, 13, 66, 62),
      radiusY: between(localFrame, 10, 13, 80, 84),
    };
  }
  if (localFrame < 16) {
    return {
      centerY: between(localFrame, 13, 16, 520, 574),
      radiusX: between(localFrame, 13, 16, 62, 88),
      radiusY: between(localFrame, 13, 16, 84, 58),
    };
  }
  if (localFrame < 20) {
    return {
      centerY: between(localFrame, 16, 20, 574, 560),
      radiusX: between(localFrame, 16, 20, 88, 72),
      radiusY: between(localFrame, 16, 20, 58, 72),
    };
  }

  return { centerY: 560, radiusX: 72, radiusY: 72 };
};

const DOTS = [
  { centerX: 740, color: PALETTE.cream },
  { centerX: 960, color: PALETTE.ochre },
  { centerX: 1180, color: PALETTE.cream },
] as const;

export const ElasticDots = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      width={ELASTIC_DOTS_WIDTH}
      height={ELASTIC_DOTS_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: PALETTE.background }}
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={PALETTE.background} />
      {DOTS.map((dot, index) => {
        const localFrame = positiveModulo(frame - index * 20, LOOP_FRAMES);
        const { centerY, radiusX, radiusY } = getDotShape(localFrame);

        return (
          <rect
            key={dot.centerX}
            x={dot.centerX - radiusX}
            y={centerY - radiusY}
            width={radiusX * 2}
            height={radiusY * 2}
            rx={radiusX}
            ry={radiusY}
            fill={dot.color}
          />
        );
      })}
    </svg>
  );
};
