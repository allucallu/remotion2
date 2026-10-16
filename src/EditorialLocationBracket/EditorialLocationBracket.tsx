import {Easing, interpolate, useCurrentFrame} from "remotion";

export const EDITORIAL_LOCATION_BRACKET_WIDTH = 3840;
export const EDITORIAL_LOCATION_BRACKET_HEIGHT = 2160;
export const EDITORIAL_LOCATION_BRACKET_FPS = 30;
export const EDITORIAL_LOCATION_BRACKET_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F5EEDF",
  slate: "#2E3940",
  terracotta: "#C96442",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const enterEase = Easing.bezier(0.18, 0.82, 0.24, 1);
const exitEase = Easing.bezier(0.6, 0, 0.82, 0.28);

const progress = (frame: number, start: number, end: number, easing = enterEase) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing});

export const EditorialLocationBracket = () => {
  const frame = useCurrentFrame();
  const bracketVisible = progress(frame, 0, 23) * (1 - progress(frame, 280, 293, exitEase));
  const topBranch = progress(frame, 9, 16) * (1 - progress(frame, 280, 288, exitEase));
  const middleBranch = progress(frame, 12, 19) * (1 - progress(frame, 283, 291, exitEase));
  const bottomBranch = progress(frame, 15, 23) * (1 - progress(frame, 286, 293, exitEase));
  const panelVisible = progress(frame, 18, 39) * (1 - progress(frame, 260, 281, exitEase));
  const stripVisible = progress(frame, 30, 49) * (1 - progress(frame, 250, 267, exitEase));
  const tabVisible = progress(frame, 42, 59) * (1 - progress(frame, 240, 255, exitEase));

  const bracketHalf = 108 * bracketVisible;
  const panelWidth = 940 * panelVisible;
  const stripWidth = 650 * stripVisible;
  const tabWidth = 312 * tabVisible;

  return (
    <svg
      width={EDITORIAL_LOCATION_BRACKET_WIDTH}
      height={EDITORIAL_LOCATION_BRACKET_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <defs>
        <clipPath id="location-panel-mask"><rect x="165" y="760" width={panelWidth} height="130" /></clipPath>
        <clipPath id="location-strip-mask"><rect x="165" y="890" width={stripWidth} height="76" /></clipPath>
        <clipPath id="location-tab-mask"><rect x="165" y="690" width={tabWidth} height="70" /></clipPath>
      </defs>

      <path d={`M 140 ${830 - bracketHalf} V ${830 + bracketHalf}`} fill="none" stroke={PALETTE.ivory} strokeWidth="7" />
      <path d={`M 140 722 H ${140 + 25 * topBranch}`} fill="none" stroke={PALETTE.ivory} strokeWidth="7" />
      <path d={`M 140 830 H ${140 + 25 * middleBranch}`} fill="none" stroke={PALETTE.ivory} strokeWidth="7" />
      <path d={`M 140 900 H ${140 + 25 * bottomBranch}`} fill="none" stroke={PALETTE.ivory} strokeWidth="7" />

      <g clipPath="url(#location-tab-mask)">
        <rect x="165" y="690" width="312" height="70" fill={PALETTE.terracotta} />
        <path d="M 165 754 H 477" stroke={PALETTE.ivory} strokeWidth="4" opacity="0.3" />
      </g>
      <g clipPath="url(#location-panel-mask)">
        <path d="M 165 760 H 1105 V 890 H 165 Z" fill={PALETTE.slate} />
        <path d="M 165 760 V 890" stroke={PALETTE.ivory} strokeWidth="4" opacity="0.16" />
      </g>
      <g clipPath="url(#location-strip-mask)">
        <rect x="165" y="890" width="650" height="76" fill={PALETTE.ivory} />
      </g>
    </svg>
  );
};
