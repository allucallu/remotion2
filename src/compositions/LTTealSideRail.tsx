import {useId} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// Register at 3840x2160, 30 fps, durationInFrames: 360.
// The SVG viewBox also keeps the artwork proportional in smaller previews.
export const LTTealSideRail = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const enterEase = Easing.bezier(0.22, 1, 0.36, 1);
  const exitEase = Easing.bezier(0.64, 0, 0.78, 0);
  const time = frame / fps;
  // For a 12-second composition, exit begins at 10 seconds.
  const exitStart = Math.max(2, durationInFrames / fps - 2);
  const progress = (start: number, end: number, closing = false) =>
    interpolate(time, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: closing ? exitEase : enterEase,
    });
  const visible = (start: number, end: number, outStart: number, outEnd: number) =>
    progress(start, end) * (1 - progress(exitStart + outStart, exitStart + outEnd, true));

  // Proportions sampled from the concept: substantial ivory plate, narrow
  // teal side rail and baseline, shorter slate strip aligned to the ivory.
  const main = {x: 304, y: 1380, width: 2480, height: 384};
  const rail = {x: 176, y: 1380, width: 128, height: 410};
  const line = {x: 176, y: 1764, width: 2850, height: 26};
  const secondary = {x: 304, y: 1790, width: 1820, height: 174};

  const railHeight = rail.height * visible(0.10, 0.45, 1.25, 1.70);
  const lineWidth = (
    (line.width - 100) * progress(0.30, 0.95) + 100 * progress(1.35, 1.80)
  ) * (1 - progress(exitStart + 0.75, exitStart + 1.35, true));
  const mainWidth = main.width * visible(0.45, 1.35, 0.25, 1.00);
  const secondaryWidth = secondary.width * visible(0.90, 1.65, 0, 0.50);
  const secondaryOffset = -45 * (1 - progress(0.90, 1.65));

  return (
    <AbsoluteFill style={{backgroundColor: '#000000', overflow: 'hidden'}}>
      <svg width="100%" height="100%" viewBox="0 0 3840 2160"
        preserveAspectRatio="xMidYMid meet" style={{display: 'block'}}>
        <defs>
          <clipPath id={`${id}-main`} clipPathUnits="userSpaceOnUse">
            <rect x={main.x} y={main.y} width={mainWidth} height={main.height} />
          </clipPath>
          <clipPath id={`${id}-secondary`} clipPathUnits="userSpaceOnUse">
            <rect x={secondary.x} y={secondary.y} width={secondaryWidth} height={secondary.height} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-secondary)`}>
          {/* Extra width compensates the negative translation inside the mask,
              preventing an exposed black sliver at the moving right edge. */}
          <rect x={secondary.x + secondaryOffset} y={secondary.y}
            width={secondary.width + 45} height={secondary.height} fill="#354E60" />
        </g>
        <g clipPath={`url(#${id}-main)`}>
          <rect {...main} fill="#F1EDE4" />
        </g>
        <rect x={rail.x} y={rail.y + rail.height - railHeight}
          width={rail.width} height={railHeight} fill="#178E91" />
        <rect x={line.x} y={line.y} width={lineWidth} height={line.height} fill="#178E91" />
      </svg>
    </AbsoluteFill>
  );
};
