import {Easing, interpolate, useCurrentFrame} from "remotion";

export const DOCUMENTARY_ARCHIVE_SLEEVE_WIDTH = 3840;
export const DOCUMENTARY_ARCHIVE_SLEEVE_HEIGHT = 2160;
export const DOCUMENTARY_ARCHIVE_SLEEVE_FPS = 30;
export const DOCUMENTARY_ARCHIVE_SLEEVE_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F5EEDF",
  terracotta: "#C96442",
  blue: "#6687A1",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ENTER_EASING = Easing.bezier(0.18, 0.82, 0.24, 1);
const EXIT_EASING = Easing.bezier(0.6, 0, 0.82, 0.28);

const progress = (
  frame: number,
  start: number,
  end: number,
  easing = ENTER_EASING,
) => interpolate(frame, [start, end], [0, 1], {...CLAMP, easing});

export const DocumentaryArchiveSleeve = () => {
  const frame = useCurrentFrame();
  const spine = progress(frame, 0, 19) * (1 - progress(frame, 282, 293, EXIT_EASING));
  const rail = progress(frame, 12, 29) * (1 - progress(frame, 282, 293, EXIT_EASING));
  const backing = progress(frame, 20, 43) * (1 - progress(frame, 266, 286, EXIT_EASING));
  const cardIn = progress(frame, 28, 57);
  const cardOut = progress(frame, 260, 283, EXIT_EASING);
  const lowerStrip = progress(frame, 46, 63) * (1 - progress(frame, 250, 265, EXIT_EASING));
  const tab = progress(frame, 50, 69) * (1 - progress(frame, 240, 255, EXIT_EASING));
  const headerLine = progress(frame, 55, 72) * (1 - progress(frame, 240, 255, EXIT_EASING));

  const spineHeight = 215 * spine;
  const railHeight = 270 * rail;
  const backingWidth = 1159 * backing;
  const cardX = -1200 * (1 - cardIn) - 1200 * cardOut;
  const stripHeight = 55 * lowerStrip;
  const tabHeight = 48 * tab;
  const lineWidth = 1002 * headerLine;

  return (
    <svg
      width={DOCUMENTARY_ARCHIVE_SLEEVE_WIDTH}
      height={DOCUMENTARY_ARCHIVE_SLEEVE_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <defs>
        <clipPath id="archive-backing-mask"><rect x="75" y="690" width={backingWidth} height="205" /></clipPath>
        <clipPath id="archive-card-window"><rect x="112" y="690" width="1110" height="245" /></clipPath>
        <clipPath id="archive-strip-mask"><rect x="55" y="930" width="1160" height={stripHeight} /></clipPath>
        <clipPath id="archive-tab-mask"><rect x="112" y={710 - tabHeight} width="340" height={tabHeight} /></clipPath>
        <clipPath id="archive-line-mask"><rect x="148" y="736" width={lineWidth} height="8" /></clipPath>
      </defs>

      <g clipPath="url(#archive-backing-mask)">
        <path d="M 75 690 H 1190 L 1234 734 V 895 H 75 Z" fill={PALETTE.terracotta} />
      </g>
      <g clipPath="url(#archive-strip-mask)">
        <rect x="55" y="930" width="1160" height="55" fill={PALETTE.blue} />
      </g>
      <g clipPath="url(#archive-tab-mask)">
        <path d="M 112 662 H 425 L 451 688 V 710 H 112 Z" fill={PALETTE.blue} />
        <path d="M 122 670 H 416 L 438 692 V 700 H 122 Z" fill={PALETTE.ivory} />
      </g>

      <g clipPath="url(#archive-card-window)">
        <g transform={`translate(${cardX} 0)`}>
          <path d="M 130 710 H 1158 L 1215 767 V 930 H 130 Z" fill={PALETTE.ivory} />
          <g clipPath="url(#archive-line-mask)">
            <path d="M 148 740 H 1150" fill="none" stroke={PALETTE.terracotta} strokeWidth="5" />
          </g>
        </g>
      </g>

      <rect x="112" y={960 - railHeight} width="18" height={railHeight} fill={PALETTE.blue} />
      <g transform={`translate(0 ${215 - spineHeight})`}>
        <rect x="55" y="715" width="57" height={spineHeight} fill={PALETTE.ivory} />
        <circle cx="83.5" cy="775" r="12" fill={PALETTE.background} />
        <circle cx="83.5" cy="855" r="12" fill={PALETTE.background} />
      </g>
      <rect x="130" y="925" width="1085" height="5" fill={PALETTE.background} />
    </svg>
  );
};
