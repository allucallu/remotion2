import {useId} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = {
  background: '#000000',
  navy: '#294968',
  ivory: '#F1EDE4',
} as const;

const MAIN = {
  x: 215,
  y: 1440,
  width: 2680,
  height: 330,
  radius: 165,
} as const;

const IVORY_START = 385;
const CAP_WIDTH = IVORY_START - MAIN.x;
const BODY_WIDTH = MAIN.width - CAP_WIDTH;

const SECONDARY = {
  x: 385,
  y: 1785,
  width: 1450,
  height: 175,
  radius: 87.5,
} as const;

const DASH = {
  x: 2955,
  y: 1570,
  width: 285,
  height: 70,
  radius: 35,
} as const;

const ENTER_EASING = Easing.bezier(0.22, 1, 0.36, 1);
const EXIT_EASING = Easing.bezier(0.64, 0, 0.78, 0);

const mainCapsulePath = [
  `M ${MAIN.x + MAIN.radius} ${MAIN.y}`,
  `H ${MAIN.x + MAIN.width - MAIN.radius}`,
  `A ${MAIN.radius} ${MAIN.radius} 0 0 1 ${MAIN.x + MAIN.width} ${MAIN.y + MAIN.radius}`,
  `A ${MAIN.radius} ${MAIN.radius} 0 0 1 ${MAIN.x + MAIN.width - MAIN.radius} ${MAIN.y + MAIN.height}`,
  `H ${MAIN.x + MAIN.radius}`,
  `A ${MAIN.radius} ${MAIN.radius} 0 0 1 ${MAIN.x} ${MAIN.y + MAIN.radius}`,
  `A ${MAIN.radius} ${MAIN.radius} 0 0 1 ${MAIN.x + MAIN.radius} ${MAIN.y}`,
  'Z',
].join(' ');

const clampInterpolation = (
  time: number,
  range: readonly [number, number],
  output: readonly [number, number],
  easing: (value: number) => number,
) =>
  interpolate(time, range, output, {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// Register at 3840x2160, 30 fps, durationInFrames: 360.
// Every shape remains at its final size; only clipping boundaries and the
// specified secondary-panel translation are animated.
export const LTMidnightCapsule = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const exitTime = time - (Math.max(4, durationInFrames / fps) - 12);
  const uid = useId().replace(/:/g, '');

  const capIn = clampInterpolation(time, [0.1, 0.55], [0, 1], ENTER_EASING);
  const bodyIn = clampInterpolation(time, [0.55, 1.45], [0, 1], ENTER_EASING);
  const secondaryIn = clampInterpolation(time, [0.85, 1.7], [0, 1], ENTER_EASING);
  const dashIn = clampInterpolation(time, [1.3, 1.85], [0, 1], ENTER_EASING);

  const dashOut = clampInterpolation(exitTime, [10, 10.4], [0, 1], EXIT_EASING);
  const secondaryOut = clampInterpolation(exitTime, [10.1, 10.7], [0, 1], EXIT_EASING);
  const bodyOut = clampInterpolation(exitTime, [10.4, 11.35], [0, 1], EXIT_EASING);
  const capOut = clampInterpolation(exitTime, [11.35, 11.8], [0, 1], EXIT_EASING);

  const capVisibleWidth = CAP_WIDTH * capIn * (1 - capOut);
  const bodyVisibleWidth = BODY_WIDTH * bodyIn * (1 - bodyOut);
  const secondaryVisibleWidth = SECONDARY.width * secondaryIn * (1 - secondaryOut);
  const secondaryTranslateX = -45 * (1 - secondaryIn) - 30 * secondaryOut;
  const dashVisibleWidth = DASH.width * dashIn * (1 - dashOut);

  const foundationClipId = `${uid}-midnight-foundation`;
  const bodyClipId = `${uid}-midnight-body`;
  const secondaryBoundsId = `${uid}-midnight-secondary-bounds`;
  const secondaryRevealId = `${uid}-midnight-secondary-reveal`;
  const dashClipId = `${uid}-midnight-dash`;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background, overflow: 'hidden'}}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
        style={{display: 'block'}}
      >
        <defs>
          {/* One continuous navy foundation prevents a transparent seam at the
              split. Ivory covers the body; the foundation shares its reveal. */}
          <clipPath id={foundationClipId} clipPathUnits="userSpaceOnUse">
            <rect x={MAIN.x} y={MAIN.y}
              width={capVisibleWidth + bodyVisibleWidth} height={MAIN.height} />
          </clipPath>
          <clipPath id={bodyClipId} clipPathUnits="userSpaceOnUse">
            <rect
              x={IVORY_START}
              y={MAIN.y}
              width={bodyVisibleWidth}
              height={MAIN.height}
            />
          </clipPath>
          <clipPath id={secondaryBoundsId} clipPathUnits="userSpaceOnUse">
            <rect
              x={SECONDARY.x}
              y={SECONDARY.y}
              width={SECONDARY.width}
              height={SECONDARY.height}
            />
          </clipPath>
          <clipPath id={secondaryRevealId} clipPathUnits="userSpaceOnUse">
            <rect
              x={SECONDARY.x}
              y={SECONDARY.y}
              width={secondaryVisibleWidth}
              height={SECONDARY.height}
            />
          </clipPath>
          <clipPath id={dashClipId} clipPathUnits="userSpaceOnUse">
            <rect
              x={DASH.x}
              y={DASH.y}
              width={dashVisibleWidth}
              height={DASH.height}
            />
          </clipPath>
        </defs>

        {/* Navy foundation: the cap and long body share the same capsule path. */}
        <path d={mainCapsulePath} fill={COLORS.navy} clipPath={`url(#${foundationClipId})`} />

        {/* The same capsule geometry is clipped at IVORY_START for a crisp vertical color split. */}
        <path d={mainCapsulePath} fill={COLORS.ivory} clipPath={`url(#${bodyClipId})`} />

        <g clipPath={`url(#${secondaryBoundsId})`}>
          <g clipPath={`url(#${secondaryRevealId})`}>
            <rect
              x={SECONDARY.x}
              y={SECONDARY.y}
              width={SECONDARY.width}
              height={SECONDARY.height}
              rx={SECONDARY.radius}
              fill={COLORS.navy}
              transform={`translate(${secondaryTranslateX} 0)`}
            />
          </g>
        </g>

        <rect
          x={DASH.x}
          y={DASH.y}
          width={DASH.width}
          height={DASH.height}
          rx={DASH.radius}
          fill={COLORS.ivory}
          clipPath={`url(#${dashClipId})`}
        />
      </svg>
    </AbsoluteFill>
  );
};
