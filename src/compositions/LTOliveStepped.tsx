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
    olive: '#687A32',
    charcoal: '#303233',
  },
  main: {
    points: '380,1430 3140,1430 3140,1600 2750,1600 2750,1740 380,1740',
    x: 380,
    y: 1430,
    width: 2760,
    height: 310,
    stepWidth: 390,
  },
  secondary: {x: 380, y: 1740, width: 1990, height: 170},
  charcoalBlock: {x: 195, y: 1430, width: 165, height: 85},
  oliveBlock: {x: 195, y: 1535, width: 165, height: 85},
  accent: {x: 2750, y: 1355, width: 390, height: 55},
  secondaryStartY: 1570,
} as const;

const EASING = {
  enter: Easing.bezier(0.22, 1, 0.36, 1),
  exit: Easing.bezier(0.64, 0, 0.78, 0),
} as const;

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

// Register at 3840x2160, 30 fps, durationInFrames: 360.
// Reference geometry is retained; all panels intentionally contain no text.
export const LTOliveStepped = () => {
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
  ) => enter(enterStart, enterEnd) * (1 - exit(exitStart, exitEnd));

  const charcoalWidth =
    DESIGN.charcoalBlock.width * visibility(0.1, 0.4, 11.35, 11.7);
  const oliveBlockWidth =
    DESIGN.oliveBlock.width * visibility(0.25, 0.55, 11.2, 11.55);
  // Reveal the full-height body first, then extend only the upper ledge.
  // On exit the ledge retracts before the body closes toward the left blocks.
  const bodyWidth = DESIGN.main.width - DESIGN.main.stepWidth;
  const mainWidth =
    bodyWidth * enter(0.4, 1.05) * (1 - exit(10.65, 11.35)) +
    DESIGN.main.stepWidth * enter(1.05, 1.45) * (1 - exit(10.4, 10.65));
  const accentWidth =
    DESIGN.accent.width * visibility(1.35, 1.9, 10, 10.4);

  const secondaryEnter = enter(0.9, 1.65);
  const secondaryExit = exit(10.15, 10.75);
  // One pixel of overlap is hidden by the foreground ivory panel.
  const secondaryTravel = DESIGN.secondary.y - DESIGN.secondaryStartY;
  const secondaryVisibleHeight =
    DESIGN.secondary.height * secondaryEnter * (1 - secondaryExit);
  const secondaryY =
    DESIGN.secondaryStartY +
    secondaryTravel * secondaryEnter -
    secondaryTravel * secondaryExit;

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
          <clipPath id={`${id}-secondary`} clipPathUnits="userSpaceOnUse">
            <rect
              x={DESIGN.secondary.x}
              y={DESIGN.secondary.y - 1}
              width={DESIGN.secondary.width}
              height={secondaryVisibleHeight > 0 ? DESIGN.secondary.height + 1 : 0}
            />
          </clipPath>
          <clipPath id={`${id}-main`} clipPathUnits="userSpaceOnUse">
            <rect
              x={DESIGN.main.x}
              y={DESIGN.main.y}
              width={mainWidth}
              height={DESIGN.main.height}
            />
          </clipPath>
          <clipPath id={`${id}-charcoal-block`} clipPathUnits="userSpaceOnUse">
            <rect
              x={DESIGN.charcoalBlock.x}
              y={DESIGN.charcoalBlock.y}
              width={charcoalWidth}
              height={DESIGN.charcoalBlock.height}
            />
          </clipPath>
          <clipPath id={`${id}-olive-block`} clipPathUnits="userSpaceOnUse">
            <rect
              x={DESIGN.oliveBlock.x}
              y={DESIGN.oliveBlock.y}
              width={oliveBlockWidth}
              height={DESIGN.oliveBlock.height}
            />
          </clipPath>
          <clipPath id={`${id}-accent`} clipPathUnits="userSpaceOnUse">
            <rect
              x={DESIGN.accent.x}
              y={DESIGN.accent.y}
              width={accentWidth}
              height={DESIGN.accent.height}
            />
          </clipPath>
        </defs>

        <g clipPath={`url(#${id}-secondary)`}>
          <rect
            x={DESIGN.secondary.x}
            y={secondaryY - 1}
            width={DESIGN.secondary.width}
            height={DESIGN.secondary.height + 1}
            fill={DESIGN.colors.olive}
          />
        </g>

        <g clipPath={`url(#${id}-main)`}>
          <polygon points={DESIGN.main.points} fill={DESIGN.colors.ivory} />
        </g>

        <g clipPath={`url(#${id}-charcoal-block)`}>
          <rect {...DESIGN.charcoalBlock} fill={DESIGN.colors.charcoal} />
        </g>
        <g clipPath={`url(#${id}-olive-block)`}>
          <rect {...DESIGN.oliveBlock} fill={DESIGN.colors.olive} />
        </g>

        <g clipPath={`url(#${id}-accent)`}>
          <rect {...DESIGN.accent} fill={DESIGN.colors.olive} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
