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
    cobalt: '#245BEA',
    lightGray: '#E4EAF0',
    charcoal: '#29333F',
  },
  backplate: {
    points: '450,1555 2850,1555 3130,1880 680,1880',
    left: 450, top: 1555, rightTop: 2850, bottom: 1880,
    diagonalRun: 280,
  },
  secondary: {
    points: '169,1787 1950,1787 2120,1950 290,1950',
    left: 169, top: 1787, rightTop: 1950, bottom: 1950,
    diagonalRun: 170,
  },
  main: {
    points: '169,1420 2545,1420 2896,1788 169,1788',
    left: 169, top: 1420, rightTop: 2545, bottom: 1788,
    diagonalRun: 351,
  },
  accent: {x: 190, y: 1445, width: 48, height: 318},
} as const;

const EASING = {
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  exit: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

const MASK_OVERSCAN = 2;

type DiagonalShape = {
  readonly left: number;
  readonly top: number;
  readonly rightTop: number;
  readonly bottom: number;
  readonly diagonalRun: number;
};

const diagonalMaskPoints = (shape: DiagonalShape, visibility: number) => {
  // Keep every mask polygon ordered, including at zero visibility.
  // Its fixed left boundary must be left of the starting diagonal front.
  const startFrontTop = shape.left - shape.diagonalRun - MASK_OVERSCAN;
  const endFrontTop = shape.rightTop + MASK_OVERSCAN;
  const frontTop =
    startFrontTop + (endFrontTop - startFrontTop) * visibility;
  const frontBottom = frontTop + shape.diagonalRun;
  const maskLeft = startFrontTop - MASK_OVERSCAN;

  return `${maskLeft},${shape.top} ${frontTop},${shape.top} ${frontBottom},${shape.bottom} ${maskLeft},${shape.bottom}`;
};

// Register at 3840x2160, 30 fps, durationInFrames: 360.
// Empty panels; no text, logos, gradients or glow.
export const LTCobaltCornerCut = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const time = frame / fps;
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
  const visibility = (
    enterStart: number,
    enterEnd: number,
    exitStart: number,
    exitEnd: number,
  ) =>
    enter(enterStart, enterEnd) *
    (1 - exit(exitStart, exitEnd));

  const backplateVisibility = visibility(0.1, 0.9, 10.85, 11.65);
  const mainVisibility = visibility(0.35, 1.25, 10.4, 11.15);
  const secondaryVisibility = visibility(0.75, 1.55, 10.1, 10.65);

  const secondaryEnter = enter(0.75, 1.55);
  const secondaryExit = exit(10.1, 10.65);
  const secondaryY = -60 * (1 - secondaryEnter) - 60 * secondaryExit;

  const backplateLock = enter(1.25, 1.9);
  const backplateX = -70 * (1 - backplateLock);
  const backplateY = -35 * (1 - backplateLock);

  const accentEnter = enter(1, 1.45);
  const accentExit = exit(10, 10.4);
  const accentHeight =
    DESIGN.accent.height * accentEnter * (1 - accentExit);

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
        shapeRendering="geometricPrecision"
      >
        <defs>
          <clipPath id={`${id}-backplate`} clipPathUnits="userSpaceOnUse">
            <polygon
              points={diagonalMaskPoints(
                DESIGN.backplate,
                backplateVisibility,
              )}
            />
          </clipPath>
          <clipPath id={`${id}-secondary`} clipPathUnits="userSpaceOnUse">
            <polygon
              points={diagonalMaskPoints(
                DESIGN.secondary,
                secondaryVisibility,
              )}
            />
          </clipPath>
          <clipPath id={`${id}-main`} clipPathUnits="userSpaceOnUse">
            <polygon
              points={diagonalMaskPoints(DESIGN.main, mainVisibility)}
            />
          </clipPath>
          <clipPath id={`${id}-accent`} clipPathUnits="userSpaceOnUse">
            <rect
              x={DESIGN.accent.x}
              y={DESIGN.accent.y}
              width={DESIGN.accent.width}
              height={accentHeight}
            />
          </clipPath>
        </defs>

        <g transform={`translate(${backplateX} ${backplateY})`}>
          <g clipPath={`url(#${id}-backplate)`}>
            <polygon
              points={DESIGN.backplate.points}
              fill={DESIGN.colors.cobalt}
            />
          </g>
        </g>

        <g transform={`translate(0 ${secondaryY})`}>
          <g clipPath={`url(#${id}-secondary)`}>
            <polygon
              points={DESIGN.secondary.points}
              fill={DESIGN.colors.charcoal}
            />
          </g>
        </g>

        <g clipPath={`url(#${id}-main)`}>
          <polygon
            points={DESIGN.main.points}
            fill={DESIGN.colors.lightGray}
          />
        </g>

        <g clipPath={`url(#${id}-accent)`}>
          <rect {...DESIGN.accent} fill={DESIGN.colors.cobalt} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
