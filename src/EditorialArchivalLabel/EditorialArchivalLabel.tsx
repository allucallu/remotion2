import {Easing, interpolate, useCurrentFrame} from "remotion";

export const EDITORIAL_ARCHIVAL_LABEL_WIDTH = 3840;
export const EDITORIAL_ARCHIVAL_LABEL_HEIGHT = 2160;
export const EDITORIAL_ARCHIVAL_LABEL_FPS = 30;
export const EDITORIAL_ARCHIVAL_LABEL_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F5EEDF",
  terracotta: "#C96442",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ENTER_EASING = Easing.bezier(0.18, 0.82, 0.24, 1);
const EXIT_EASING = Easing.bezier(0.6, 0, 0.82, 0.28);

const timelineProgress = (
  frame: number,
  start: number,
  end: number,
  easing = ENTER_EASING,
) => interpolate(frame, [start, end], [0, 1], {...CLAMP, easing});

export const EditorialArchivalLabel = () => {
  const frame = useCurrentFrame();
  const spine = timelineProgress(frame, 0, 13) * (1 - timelineProgress(frame, 286, 295, EXIT_EASING));
  const panel = timelineProgress(frame, 10, 35) * (1 - timelineProgress(frame, 270, 289, EXIT_EASING));
  const catalogueLine = timelineProgress(frame, 28, 47) * (1 - timelineProgress(frame, 260, 273, EXIT_EASING));

  const panelWidth = 1001 * panel;
  const lineWidth = 748 * catalogueLine;
  const spineHeight = 230 * spine;
  const spineY = 720 + (230 - spineHeight);

  return (
    <svg
      width={EDITORIAL_ARCHIVAL_LABEL_WIDTH}
      height={EDITORIAL_ARCHIVAL_LABEL_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <defs>
        <clipPath id="archival-panel-mask">
          <rect x="164" y="720" width={panelWidth} height="230" />
        </clipPath>
        <clipPath id="archival-line-mask">
          <rect x="208" y="757" width={lineWidth} height="8" />
        </clipPath>
      </defs>

      <rect x="120" y={spineY} width="44" height={spineHeight} fill={PALETTE.terracotta} />

      <g clipPath="url(#archival-panel-mask)">
        <path d="M 164 720 H 1120 L 1165 765 V 950 H 164 Z" fill={PALETTE.ivory} />
      </g>

      <g clipPath="url(#archival-line-mask)">
        <path d="M 208 761 H 956" fill="none" stroke={PALETTE.terracotta} strokeWidth="5" />
      </g>
    </svg>
  );
};
