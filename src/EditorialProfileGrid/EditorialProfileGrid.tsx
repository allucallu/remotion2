import {Easing, interpolate, useCurrentFrame} from "remotion";

export const EDITORIAL_PROFILE_GRID_WIDTH = 3840;
export const EDITORIAL_PROFILE_GRID_HEIGHT = 2160;
export const EDITORIAL_PROFILE_GRID_FPS = 30;
export const EDITORIAL_PROFILE_GRID_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F5EEDF",
  blue: "#7194AA",
  terracotta: "#C96442",
  divider: "#11100F",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const enterEase = Easing.bezier(0.18, 0.82, 0.24, 1);
const exitEase = Easing.bezier(0.6, 0, 0.82, 0.28);

const progress = (frame: number, start: number, end: number, easing = enterEase) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing});

export const EditorialProfileGrid = () => {
  const frame = useCurrentFrame();
  const blueVisible = progress(frame, 0, 15) * (1 - progress(frame, 278, 291, exitEase));
  const mainVisible = progress(frame, 18, 39) * (1 - progress(frame, 258, 277, exitEase));
  const bottomVisible = progress(frame, 30, 47) * (1 - progress(frame, 250, 265, exitEase));
  const accentVisible = progress(frame, 54, 65) * (1 - progress(frame, 240, 251, exitEase));

  const blueHeight = 200 * blueVisible;
  const mainWidth = 830 * mainVisible;
  const bottomHeight = 70 * bottomVisible;
  const accentWidth = 50 * accentVisible;

  return (
    <svg
      width={EDITORIAL_PROFILE_GRID_WIDTH}
      height={EDITORIAL_PROFILE_GRID_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <defs>
        <clipPath id="profile-blue-mask">
          <rect x="120" y={950 - blueHeight} width="240" height={blueHeight} />
        </clipPath>
        <clipPath id="profile-main-mask">
          <rect x="370" y="750" width={mainWidth} height="130" />
        </clipPath>
        <clipPath id="profile-bottom-mask">
          <rect x="370" y="880" width={mainWidth} height={bottomHeight} />
        </clipPath>
      </defs>

      <g clipPath="url(#profile-blue-mask)">
        <rect x="120" y="750" width="240" height="200" fill={PALETTE.blue} />
        <path d="M 120 750 H 360" stroke={PALETTE.ivory} strokeWidth="4" opacity="0.28" />
      </g>

      <g clipPath="url(#profile-main-mask)">
        <rect x="370" y="750" width="830" height="130" fill={PALETTE.ivory} />
      </g>
      <g clipPath="url(#profile-bottom-mask)">
        <rect x="370" y="880" width="830" height="70" fill={PALETTE.ivory} />
        <path d="M 370 880 H 1200" stroke={PALETTE.divider} strokeWidth="5" />
      </g>

      <rect x={1190 - accentWidth} y="895" width={accentWidth} height="45" fill={PALETTE.terracotta} />
    </svg>
  );
};
