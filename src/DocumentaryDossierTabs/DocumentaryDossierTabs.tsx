import {Easing, interpolate, useCurrentFrame} from "remotion";

export const DOCUMENTARY_DOSSIER_TABS_WIDTH = 3840;
export const DOCUMENTARY_DOSSIER_TABS_HEIGHT = 2160;
export const DOCUMENTARY_DOSSIER_TABS_FPS = 30;
export const DOCUMENTARY_DOSSIER_TABS_DURATION = 300;

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

export const DocumentaryDossierTabs = () => {
  const frame = useCurrentFrame();
  const boxIn = progress(frame, 0, 15);
  const boxOut = progress(frame, 282, 293, EXIT_EASING);
  const spine = progress(frame, 8, 23) * (1 - progress(frame, 282, 293, EXIT_EASING));
  const lines = progress(frame, 18, 43) * (1 - progress(frame, 260, 283, EXIT_EASING));
  const lowerLine = progress(frame, 21, 46) * (1 - progress(frame, 260, 283, EXIT_EASING));
  const panel = progress(frame, 26, 49) * (1 - progress(frame, 260, 283, EXIT_EASING));
  const lowerStrip = progress(frame, 36, 57) * (1 - progress(frame, 250, 267, EXIT_EASING));
  const blueTab = progress(frame, 46, 65) * (1 - progress(frame, 246, 261, EXIT_EASING));
  const ivoryTab = progress(frame, 52, 71) * (1 - progress(frame, 240, 255, EXIT_EASING));

  const panelWidth = 1035 * panel;
  const lineWidth = 1080 * lines;
  const lowerLineWidth = 1080 * lowerLine;
  const spineHeight = 177 * spine;
  const lowerStripHeight = 55 * lowerStrip;
  const blueTabHeight = 60 * blueTab;
  const ivoryTabHeight = 38 * ivoryTab;
  const markerX = 205 + Math.max(0, lineWidth - 21);

  return (
    <svg
      width={DOCUMENTARY_DOSSIER_TABS_WIDTH}
      height={DOCUMENTARY_DOSSIER_TABS_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <defs>
        <clipPath id="dossier-panel-mask"><rect x="205" y="820" width={panelWidth} height="85" /></clipPath>
        <clipPath id="dossier-lines-mask"><rect x="205" y="797" width={lineWidth} height="25" /></clipPath>
        <clipPath id="dossier-lower-line-mask"><rect x="205" y="809" width={lowerLineWidth} height="14" /></clipPath>
        <clipPath id="dossier-lower-strip-mask"><rect x="205" y={960 - lowerStripHeight} width="980" height={lowerStripHeight} /></clipPath>
        <clipPath id="dossier-blue-tab-mask"><rect x="205" y={820 - blueTabHeight} width="185" height={blueTabHeight} /></clipPath>
        <clipPath id="dossier-ivory-tab-mask"><rect x="327" y={820 - ivoryTabHeight} width="238" height={ivoryTabHeight} /></clipPath>
      </defs>

      <path
        d="M 150 900 V 815 H 65 V 900 H 150"
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="6"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={1 - boxIn + boxOut}
      />

      <rect x="160" y={972 - spineHeight} width="44" height={spineHeight} fill={PALETTE.terracotta} />

      <g clipPath="url(#dossier-blue-tab-mask)">
        <path d="M 205 760 H 370 L 390 782 V 820 H 205 Z" fill={PALETTE.blue} />
      </g>
      <g clipPath="url(#dossier-ivory-tab-mask)">
        <path d="M 327 782 H 535 L 565 812 V 820 H 327 Z" fill={PALETTE.ivory} />
      </g>
      <g clipPath="url(#dossier-lower-strip-mask)">
        <rect x="205" y="905" width="980" height="55" fill={PALETTE.blue} />
      </g>

      <g clipPath="url(#dossier-panel-mask)">
        <rect x="205" y="820" width="1035" height="85" fill={PALETTE.ivory} />
      </g>
      <rect x="205" y="900" width="1035" height="5" fill={PALETTE.background} />
      <g clipPath="url(#dossier-lines-mask)">
        <path d="M 205 803 H 1285" fill="none" stroke={PALETTE.ivory} strokeWidth="5" />
      </g>
      <rect x={markerX} y="791" width="21" height="25" fill={PALETTE.terracotta} opacity={lines} />
      <g clipPath="url(#dossier-lower-line-mask)">
        <path d="M 205 814 H 1285" fill="none" stroke={PALETTE.ivory} strokeWidth="5" />
      </g>
    </svg>
  );
};
