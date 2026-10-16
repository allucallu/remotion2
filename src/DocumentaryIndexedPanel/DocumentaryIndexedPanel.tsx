import {Easing, interpolate, useCurrentFrame} from "remotion";

export const DOCUMENTARY_INDEXED_PANEL_WIDTH = 3840;
export const DOCUMENTARY_INDEXED_PANEL_HEIGHT = 2160;
export const DOCUMENTARY_INDEXED_PANEL_FPS = 30;
export const DOCUMENTARY_INDEXED_PANEL_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F5EEDF",
  terracotta: "#C96442",
  blue: "#6687A1",
  sage: "#95A999",
  divider: "#151515",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ENTER_EASING = Easing.bezier(0.18, 0.82, 0.24, 1);
const EXIT_EASING = Easing.bezier(0.6, 0, 0.82, 0.28);

const progress = (frame: number, start: number, end: number, easing = ENTER_EASING) =>
  interpolate(frame, [start, end], [0, 1], {...CLAMP, easing});

const reveal = (frame: number, start: number, end: number, outStart: number, outEnd: number) =>
  progress(frame, start, end) * (1 - progress(frame, outStart, outEnd, EXIT_EASING));

export const DocumentaryIndexedPanel = () => {
  const frame = useCurrentFrame();
  const terracottaPanel = reveal(frame, 0, 17, 288, 295);
  const circle = reveal(frame, 10, 29, 280, 291);
  const lowerPanel = reveal(frame, 22, 47, 266, 285);
  const upperPanel = reveal(frame, 26, 51, 262, 281);
  const divider = reveal(frame, 34, 55, 262, 281);
  const tab = reveal(frame, 40, 59, 254, 269);
  const lines = reveal(frame, 52, 69, 248, 261);
  const sage = reveal(frame, 64, 75, 240, 251);

  const terracottaHeight = 200 * terracottaPanel;
  const circleRadius = 80 * circle;
  const lowerWidth = 1090 * lowerPanel;
  const upperWidth = 1090 * upperPanel;
  const dividerWidth = 1090 * Math.min(lowerPanel, divider);
  const tabY = 738 + 46 * (1 - tab);
  const lineWidth = 82 * lines;
  const sageWidth = 55 * sage;

  return (
    <svg
      width={DOCUMENTARY_INDEXED_PANEL_WIDTH}
      height={DOCUMENTARY_INDEXED_PANEL_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <defs>
        <clipPath id="indexed-upper-mask">
          <rect x="285" y="780" width={upperWidth} height="120" />
        </clipPath>
        <clipPath id="indexed-lower-mask">
          <rect x="285" y="900" width={lowerWidth} height="70" />
        </clipPath>
        <clipPath id="indexed-tab-mask">
          <rect x="285" y="730" width="390" height="50" />
        </clipPath>
        <clipPath id="indexed-lines-mask">
          <rect x="1375" y="855" width={lineWidth} height="52" />
        </clipPath>
        <clipPath id="indexed-sage-mask">
          <rect x="1466" y="850" width={sageWidth} height="55" />
        </clipPath>
      </defs>

      <rect
        x="90"
        y={960 - terracottaHeight}
        width="195"
        height={terracottaHeight}
        fill={PALETTE.terracotta}
      />

      <circle cx="187" cy="860" r={circleRadius} fill={PALETTE.ivory} stroke={PALETTE.divider} strokeWidth="5" />

      <g clipPath="url(#indexed-tab-mask)">
        <rect x="285" y={tabY} width="390" height="46" fill={PALETTE.blue} />
      </g>

      <g clipPath="url(#indexed-lower-mask)">
        <rect x="285" y="900" width="1090" height="70" fill={PALETTE.ivory} />
      </g>
      <g clipPath="url(#indexed-upper-mask)">
        <path d="M 285 780 H 1335 V 810 H 1375 V 900 H 285 Z" fill={PALETTE.ivory} />
      </g>
      <g clipPath="url(#indexed-upper-mask)">
        <rect x="285" y="897.5" width={dividerWidth} height="5" fill={PALETTE.divider} />
      </g>

      <g clipPath="url(#indexed-lines-mask)">
        <rect x="1375" y="860" width="82" height="12" fill={PALETTE.ivory} />
        <rect x="1375" y="891" width="82" height="12" fill={PALETTE.ivory} />
      </g>
      <g clipPath="url(#indexed-sage-mask)">
        <rect x="1466" y="850" width="55" height="55" fill={PALETTE.sage} />
      </g>
    </svg>
  );
};
