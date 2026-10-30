import {useId} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Box = {x: number; y: number; width: number; height: number};

const COLOR = {
  background: '#000000',
  ivory: '#F1EDE4',
  burgundy: '#7F1738',
} as const;

const MAIN: Box = {x: 390, y: 1375, width: 2600, height: 375};
const RAIL: Box = {x: 250, y: 1360, width: 115, height: 500};
const LEDGE: Box = {x: 250, y: 1750, width: 1570, height: 110};
const ACCENT: Box = {x: 3040, y: 1375, width: 115, height: 375};
// Reference detail: the left ledge ends at the subtitle plate. The subtitle
// begins 12px below the ivory, leaving a short black slit above its right side.
// A 1px horizontal overlap behind the ledge prevents a joining seam.
const SECONDARY: Box = {x: 1819, y: 1762, width: 1171, height: 168};
const ENTER = Easing.bezier(0.22, 1, 0.36, 1);
const EXIT = Easing.bezier(0.64, 0, 0.78, 0);

const ClippedRect = ({id, box, mask, fill}: {
  id: string;
  box: Box;
  mask: Box;
  fill: string;
}) => (
  <g>
    <defs>
      <clipPath id={id} clipPathUnits="userSpaceOnUse">
        <rect {...mask} />
      </clipPath>
    </defs>
    <rect {...box} fill={fill} clipPath={`url(#${id})`} />
  </g>
);

// Register at 3840x2160, 30 fps, durationInFrames: 360.
// No text, logo, placeholder, gradients, glow, or external assets.
export const LTBurgundyInset = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const time = frame / fps;
  const exitShift = Math.max(4, durationInFrames / fps) - 12;

  const progress = (start: number, end: number, closing = false) =>
    interpolate(
      time,
      [start + (closing ? exitShift : 0), end + (closing ? exitShift : 0)],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: closing ? EXIT : ENTER,
      },
    );
  const visible = (start: number, end: number, outStart: number, outEnd: number) =>
    progress(start, end) * (1 - progress(outStart, outEnd, true));

  const railHeight = RAIL.height * visible(0.10, 0.55, 11.50, 11.85);
  const ledgeWidth = LEDGE.width * visible(0.50, 1.15, 11.05, 11.60);
  const mainWidth = MAIN.width * visible(0.65, 1.50, 10.35, 11.05);
  const secondaryHeight = SECONDARY.height * visible(1.15, 1.80, 10.10, 10.60);
  const accentHeight = ACCENT.height * visible(1.35, 1.90, 10.00, 10.40);

  return (
    <AbsoluteFill style={{backgroundColor: COLOR.background, overflow: 'hidden'}}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        preserveAspectRatio="xMidYMid meet"
        style={{display: 'block'}}
        shapeRendering="geometricPrecision"
      >
        <ClippedRect id={`${id}-rail`} box={RAIL} fill={COLOR.burgundy}
          mask={{...RAIL, height: railHeight}} />
        <ClippedRect id={`${id}-secondary`} box={SECONDARY} fill={COLOR.burgundy}
          mask={{...SECONDARY, height: secondaryHeight}} />
        {/* Keep the left ledge in front of the 1px joining overlap. */}
        <ClippedRect id={`${id}-ledge`} box={LEDGE} fill={COLOR.burgundy}
          mask={{...LEDGE, width: ledgeWidth}} />
        <ClippedRect id={`${id}-main`} box={MAIN} fill={COLOR.ivory}
          mask={{...MAIN, width: mainWidth}} />
        <ClippedRect id={`${id}-accent`} box={ACCENT} fill={COLOR.burgundy}
          mask={{...ACCENT, y: ACCENT.y + ACCENT.height - accentHeight, height: accentHeight}} />
      </svg>
    </AbsoluteFill>
  );
};
