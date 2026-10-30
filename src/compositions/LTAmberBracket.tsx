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
    amber: '#EAAF26',
  },
  main: {
    points: '610,1310 3100,1310 3000,1710 510,1710',
    top: 1310, bottom: 1710,
    leftTop: 610, leftBottom: 510, rightTop: 3100, rightBottom: 3000,
  },
  secondary: {
    points: '610,1730 2280,1730 2225,1915 555,1915',
    top: 1730, bottom: 1915,
    leftTop: 610, leftBottom: 555, rightTop: 2280, rightBottom: 2225,
  },
  anchor: {
    points: '375,1310 565,1310 465,1750 275,1750',
    top: 1310, bottom: 1750,
  },
  accent: {
    points: '3130,1410 3160,1410 3100,1675 3070,1675',
    top: 1410, bottom: 1675,
  },
  frame: {
    left: 'M 230 1820 L 230 1240 L 2450 1240',
    leftBottom: 'M 230 1820 L 520 1820',
    right: 'M 3100 1240 L 3220 1240 L 3220 1790 L 2340 1790',
    strokeWidth: 10,
  },
} as const;

const EASING = {
  panelEnter: Easing.bezier(0.22, 1, 0.36, 1),
  frameEnter: Easing.bezier(0.42, 0, 0.58, 1),
  exit: Easing.bezier(0.64, 0, 0.78, 0),
} as const;

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

const MASK_OVERSCAN = 16;
const LEFT_FRAME_LENGTH = 580 + 2220;
const LEFT_BOTTOM_LENGTH = 290;
const RIGHT_FRAME_LENGTH = 120 + 550 + 880;

type SlantedPanel = {
  readonly top: number;
  readonly bottom: number;
  readonly leftTop: number;
  readonly leftBottom: number;
  readonly rightTop: number;
  readonly rightBottom: number;
};

const slantedMaskPoints = (panel: SlantedPanel, visibility: number) => {
  const frontTop =
    panel.leftTop -
    MASK_OVERSCAN +
    (panel.rightTop - panel.leftTop + MASK_OVERSCAN * 2) * visibility;
  const frontBottom =
    panel.leftBottom -
    MASK_OVERSCAN +
    (panel.rightBottom - panel.leftBottom + MASK_OVERSCAN * 2) * visibility;
  const maskLeft = Math.min(panel.leftTop, panel.leftBottom) - MASK_OVERSCAN * 2;

  return `${maskLeft},${panel.top} ${frontTop},${panel.top} ${frontBottom},${panel.bottom} ${maskLeft},${panel.bottom}`;
};

const dashOffset = (
  length: number,
  enterProgress: number,
  exitProgress: number,
) =>
  // Positive offset retracts the path from its end back to its origin.
  length * (1 - enterProgress * (1 - exitProgress));

// Register at 3840x2160, 30 fps, durationInFrames: 360.
// Flat-color empty panels, no text, logos, gradients or glow.
export const LTAmberBracket = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const time = frame / fps;
  const exitShift = Math.max(4, durationInFrames / fps) - 12;

  const progress = (
    start: number,
    end: number,
    easing: (value: number) => number,
  ) =>
    interpolate(time, [start, end], [0, 1], {
      ...clamp,
      easing,
    });
  const panelEnter = (start: number, end: number) =>
    progress(start, end, EASING.panelEnter);
  const frameEnter = (start: number, end: number) =>
    progress(start, end, EASING.frameEnter);
  const exit = (start: number, end: number) =>
    progress(start + exitShift, end + exitShift, EASING.exit);

  const leftFrameIn = frameEnter(0.3, 1.1);
  const leftFrameOut = exit(10.9, 11.6);
  const rightFrameIn = frameEnter(0.8, 1.55);
  const rightFrameOut = exit(10.65, 11.4);

  const anchorVisibility =
    panelEnter(0.1, 0.65) * (1 - exit(11.35, 11.75));
  const anchorHeight =
    (DESIGN.anchor.bottom - DESIGN.anchor.top) * anchorVisibility;

  const mainVisibility =
    panelEnter(0.55, 1.4) * (1 - exit(10.35, 11.15));
  const secondaryVisibility =
    panelEnter(1.05, 1.8) * (1 - exit(10.1, 10.65));

  const accentVisibility =
    panelEnter(1.45, 1.9) * (1 - exit(10, 10.3));
  const accentHeight =
    (DESIGN.accent.bottom - DESIGN.accent.top) * accentVisibility;

  const frameStyle = {
    fill: 'none',
    stroke: DESIGN.colors.ivory,
    strokeWidth: DESIGN.frame.strokeWidth,
    strokeLinecap: 'butt' as const,
    strokeLinejoin: 'miter' as const,
  };

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
          <clipPath id={`${id}-anchor`} clipPathUnits="userSpaceOnUse">
            <rect
              x={250}
              y={DESIGN.anchor.bottom - anchorHeight}
              width={340}
              height={anchorHeight}
            />
          </clipPath>
          <clipPath id={`${id}-main`} clipPathUnits="userSpaceOnUse">
            <polygon
              points={slantedMaskPoints(DESIGN.main, mainVisibility)}
            />
          </clipPath>
          <clipPath id={`${id}-secondary`} clipPathUnits="userSpaceOnUse">
            <polygon
              points={slantedMaskPoints(
                DESIGN.secondary,
                secondaryVisibility,
              )}
            />
          </clipPath>
          <clipPath id={`${id}-accent`} clipPathUnits="userSpaceOnUse">
            <rect
              x={3040}
              y={DESIGN.accent.bottom - accentHeight}
              width={150}
              height={accentHeight}
            />
          </clipPath>
        </defs>

        <path
          d={DESIGN.frame.left}
          {...frameStyle}
          strokeDasharray={LEFT_FRAME_LENGTH}
          strokeDashoffset={dashOffset(
            LEFT_FRAME_LENGTH,
            leftFrameIn,
            leftFrameOut,
          )}
        />
        <path
          d={DESIGN.frame.leftBottom}
          {...frameStyle}
          strokeDasharray={LEFT_BOTTOM_LENGTH}
          strokeDashoffset={dashOffset(
            LEFT_BOTTOM_LENGTH,
            leftFrameIn,
            leftFrameOut,
          )}
        />
        <path
          d={DESIGN.frame.right}
          {...frameStyle}
          strokeDasharray={RIGHT_FRAME_LENGTH}
          strokeDashoffset={dashOffset(
            RIGHT_FRAME_LENGTH,
            rightFrameIn,
            rightFrameOut,
          )}
        />

        <g clipPath={`url(#${id}-anchor)`}>
          <polygon points={DESIGN.anchor.points} fill={DESIGN.colors.amber} />
        </g>

        <g clipPath={`url(#${id}-main)`}>
          <polygon points={DESIGN.main.points} fill={DESIGN.colors.ivory} />
        </g>

        <g clipPath={`url(#${id}-secondary)`}>
          <polygon
            points={DESIGN.secondary.points}
            fill={DESIGN.colors.amber}
          />
        </g>

        <g clipPath={`url(#${id}-accent)`}>
          <polygon points={DESIGN.accent.points} fill={DESIGN.colors.amber} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
