import {useId} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const DESIGN = {
  colors: {
    background: '#000000',
    ivory: '#F1EDE4',
    lightGray: '#CDD0D4',
    terracotta: '#BB684E',
  },
  main: {x: 200, y: 1250, width: 2680, height: 440},
  mainBackplateOffset: {x: 75, y: 70},
  secondary: {x: 270, y: 1720, width: 1700, height: 170},
  secondaryBackplateOffset: {x: 70, y: 50},
  accent: {x: 200, y: 1160, width: 360, height: 55},
} as const;

const EASING = {
  enter: Easing.bezier(0.25, 1, 0.5, 1),
  exit: Easing.bezier(0.55, 0, 0.8, 0.3),
} as const;

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

// Register at 3840 x 2160, 30 fps, durationInFrames: 360.
// Empty panels intentionally contain no text, logos or placeholders.
export const LTTerracottaOffset = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const time = frame / fps;
  // Preserve the intended two-second exit when composition duration changes.
  const exitShift = Math.max(4, durationInFrames / fps) - 12;

  const enter = (start: number, end: number) =>
    interpolate(time, [start, end], [0, 1], {
      ...clamp,
      easing: EASING.enter,
    });
  const exit = (start: number, end: number) =>
    interpolate(time, [start + exitShift, end + exitShift], [0, 1], {
      ...clamp,
      easing: EASING.exit,
    });
  const visibleWidth = (
    width: number,
    enterStart: number,
    enterEnd: number,
    exitStart: number,
    exitEnd: number,
  ) =>
    width *
    enter(enterStart, enterEnd) *
    (1 - exit(exitStart, exitEnd));

  const accentWidth = visibleWidth(
    DESIGN.accent.width,
    0.1,
    0.5,
    11.35,
    11.8,
  );
  const mainBackplateWidth = visibleWidth(
    DESIGN.main.width,
    0.3,
    1.15,
    10.85,
    11.45,
  );
  const mainWidth = visibleWidth(
    DESIGN.main.width,
    0.55,
    1.45,
    10.75,
    11.35,
  );
  const secondaryBackplateWidth = visibleWidth(
    DESIGN.secondary.width,
    0.95,
    1.6,
    10.3,
    10.85,
  );
  const secondaryWidth = visibleWidth(
    DESIGN.secondary.width,
    1.1,
    1.85,
    10.3,
    10.85,
  );

  const mainOffsetIn = enter(0.55, 1.55);
  const mainOffsetOut = exit(10.35, 10.75);
  const mainOffsetX =
    DESIGN.mainBackplateOffset.x * mainOffsetIn * (1 - mainOffsetOut);
  const mainOffsetY =
    DESIGN.mainBackplateOffset.y * mainOffsetIn * (1 - mainOffsetOut);

  const secondaryOffsetIn = enter(1.1, 2);
  const secondaryOffsetOut = exit(10, 10.30);
  const secondaryOffsetX =
    DESIGN.secondaryBackplateOffset.x *
    secondaryOffsetIn *
    (1 - secondaryOffsetOut);
  const secondaryOffsetY =
    DESIGN.secondaryBackplateOffset.y *
    secondaryOffsetIn *
    (1 - secondaryOffsetOut);

  return (
    <AbsoluteFill
      style={{backgroundColor: DESIGN.colors.background, overflow: 'hidden'}}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        preserveAspectRatio="xMidYMid meet"
        style={{display: 'block'}}
      >
        <defs>
          <clipPath
            id={`${id}-secondary-backplate`}
            clipPathUnits="userSpaceOnUse"
          >
            <rect
              x={DESIGN.secondary.x}
              y={DESIGN.secondary.y}
              width={secondaryBackplateWidth}
              height={DESIGN.secondary.height}
            />
          </clipPath>
          <clipPath
            id={`${id}-main-backplate`}
            clipPathUnits="userSpaceOnUse"
          >
            <rect
              x={DESIGN.main.x}
              y={DESIGN.main.y}
              width={mainBackplateWidth}
              height={DESIGN.main.height}
            />
          </clipPath>
          <clipPath
            id={`${id}-secondary-panel`}
            clipPathUnits="userSpaceOnUse"
          >
            <rect
              x={DESIGN.secondary.x}
              y={DESIGN.secondary.y}
              width={secondaryWidth}
              height={DESIGN.secondary.height}
            />
          </clipPath>
          <clipPath
            id={`${id}-main-panel`}
            clipPathUnits="userSpaceOnUse"
          >
            <rect
              x={DESIGN.main.x}
              y={DESIGN.main.y}
              width={mainWidth}
              height={DESIGN.main.height}
            />
          </clipPath>
        </defs>

        <g transform={`translate(${secondaryOffsetX} ${secondaryOffsetY})`}>
          <g clipPath={`url(#${id}-secondary-backplate)`}>
            <rect {...DESIGN.secondary} fill={DESIGN.colors.terracotta} />
          </g>
        </g>

        <g transform={`translate(${mainOffsetX} ${mainOffsetY})`}>
          <g clipPath={`url(#${id}-main-backplate)`}>
            <rect {...DESIGN.main} fill={DESIGN.colors.terracotta} />
          </g>
        </g>

        <g clipPath={`url(#${id}-secondary-panel)`}>
          <rect {...DESIGN.secondary} fill={DESIGN.colors.lightGray} />
        </g>

        <g clipPath={`url(#${id}-main-panel)`}>
          <rect {...DESIGN.main} fill={DESIGN.colors.ivory} />
        </g>

        <rect
          x={DESIGN.accent.x}
          y={DESIGN.accent.y}
          width={accentWidth}
          height={DESIGN.accent.height}
          fill={DESIGN.colors.terracotta}
        />
      </svg>
    </AbsoluteFill>
  );
};
