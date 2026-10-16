import {Easing, interpolate, useCurrentFrame} from "remotion";

export const EDITORIAL_INTERVIEW_PLATE_WIDTH = 3840;
export const EDITORIAL_INTERVIEW_PLATE_HEIGHT = 2160;
export const EDITORIAL_INTERVIEW_PLATE_FPS = 30;
export const EDITORIAL_INTERVIEW_PLATE_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F5EEDF",
  terracotta: "#C96442",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const enterEase = Easing.bezier(0.18, 0.82, 0.24, 1);
const exitEase = Easing.bezier(0.6, 0, 0.82, 0.28);

const progress = (frame: number, start: number, end: number, easing = enterEase) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing});

export const EditorialInterviewPlate = () => {
  const frame = useCurrentFrame();

  const stripVisible = progress(frame, 0, 11) * (1 - progress(frame, 282, 293, exitEase));
  const lineVisible = progress(frame, 8, 31) * (1 - progress(frame, 258, 281, exitEase));
  const panelVisible = progress(frame, 14, 37) * (1 - progress(frame, 258, 281, exitEase));
  const tabVisible = progress(frame, 40, 59) * (1 - progress(frame, 240, 253, exitEase));

  const stripHeight = 180 * stripVisible;
  const panelWidth = 880 * panelVisible;
  const lineWidth = 1395 * lineVisible;
  const tabHeight = 60 * tabVisible;

  return (
    <svg
      width={EDITORIAL_INTERVIEW_PLATE_WIDTH}
      height={EDITORIAL_INTERVIEW_PLATE_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />

      <defs>
        <clipPath id="editorial-plate-line-mask">
          <rect x="115" y="890" width={lineWidth} height="22" />
        </clipPath>
        <clipPath id="editorial-plate-panel-mask">
          <rect x="155" y="760" width={panelWidth} height="180" />
        </clipPath>
        <clipPath id="editorial-plate-strip-mask">
          <rect x="107" y={940 - stripHeight} width="56" height={stripHeight} />
        </clipPath>
        <clipPath id="editorial-plate-tab-mask">
          <rect x="155" y={760 - tabHeight} width="302" height={tabHeight} />
        </clipPath>
      </defs>

      <g clipPath="url(#editorial-plate-line-mask)">
        <path d="M 115 901 H 1510" fill="none" stroke={PALETTE.ivory} strokeWidth="7" />
      </g>

      <g clipPath="url(#editorial-plate-strip-mask)">
        <rect x="107" y="760" width="56" height="180" fill={PALETTE.terracotta} />
        <rect x="107" y="760" width="8" height="180" fill={PALETTE.ivory} opacity="0.22" />
      </g>

      <g clipPath="url(#editorial-plate-tab-mask)">
        <path d="M 155 700 H 430 L 457 727 V 760 H 155 Z" fill={PALETTE.terracotta} />
        <path d="M 155 754 H 457" fill="none" stroke={PALETTE.ivory} strokeWidth="4" opacity="0.38" />
      </g>

      <g clipPath="url(#editorial-plate-panel-mask)">
        <path d="M 155 760 H 1035 V 940 H 155 Z" fill={PALETTE.ivory} />
        <path d="M 155 760 V 940" fill="none" stroke={PALETTE.terracotta} strokeWidth="7" />
        <path d="M 180 914 H 1005" fill="none" stroke={PALETTE.background} strokeWidth="3" opacity="0.13" />
      </g>
    </svg>
  );
};
