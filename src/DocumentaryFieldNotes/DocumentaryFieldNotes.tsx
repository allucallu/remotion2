import {Easing, interpolate, useCurrentFrame} from "remotion";

export const DOCUMENTARY_FIELD_NOTES_WIDTH = 3840;
export const DOCUMENTARY_FIELD_NOTES_HEIGHT = 2160;
export const DOCUMENTARY_FIELD_NOTES_FPS = 30;
export const DOCUMENTARY_FIELD_NOTES_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F5EEDF",
  terracotta: "#C96442",
  blue: "#6687A1",
  slate: "#263A48",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ENTER_EASING = Easing.bezier(0.18, 0.82, 0.24, 1);
const EXIT_EASING = Easing.bezier(0.6, 0, 0.82, 0.28);

const progress = (frame: number, start: number, end: number, easing = ENTER_EASING) =>
  interpolate(frame, [start, end], [0, 1], {...CLAMP, easing});

const reveal = (frame: number, start: number, end: number, outStart: number, outEnd: number) =>
  progress(frame, start, end) * (1 - progress(frame, outStart, outEnd, EXIT_EASING));

const SpineDetail = ({y, visibility}: {y: number; visibility: number}) => (
  <rect x="101" y={y} width={17 * visibility} height="17" fill={PALETTE.ivory} />
);

export const DocumentaryFieldNotes = () => {
  const frame = useCurrentFrame();
  const spineIn = progress(frame, 0, 17);
  const spineOut = progress(frame, 288, 295, EXIT_EASING);
  const spine = spineIn * (1 - spineOut);
  const detailTop = reveal(frame, 10, 17, 284, 291);
  const detailMiddle = reveal(frame, 16, 23, 280, 287);
  const detailBottom = reveal(frame, 22, 29, 276, 283);
  const rail = reveal(frame, 20, 43, 268, 285);
  const card = reveal(frame, 28, 51, 262, 285);
  const slate = reveal(frame, 40, 63, 250, 271);
  const corner = reveal(frame, 54, 69, 240, 253);
  const smallBox = reveal(frame, 62, 77, 240, 253);
  const spineHeight = 152 * spine;
  const railWidth = 1060 * rail;
  const cardWidth = 1060 * card;
  const slateY = 785 - 78 * (1 - slate);
  const cornerWidth = 98 * corner;

  return (
    <svg
      width={DOCUMENTARY_FIELD_NOTES_WIDTH}
      height={DOCUMENTARY_FIELD_NOTES_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <defs>
        <clipPath id="field-rail-mask"><rect x="128" y="650" width={railWidth} height="20" /></clipPath>
        <clipPath id="field-card-mask"><rect x="128" y="670" width={cardWidth} height="115" /></clipPath>
        <clipPath id="field-slate-window"><rect x="128" y="785" width="920" height="75" /></clipPath>
        <clipPath id="field-corner-mask"><rect x={1090 + 98 - cornerWidth} y="646" width={cornerWidth} height="32" /></clipPath>
      </defs>

      <g clipPath="url(#field-slate-window)">
        <g transform={`translate(0 ${slateY - 785})`}>
          <rect x="128" y="785" width="920" height="65" fill={PALETTE.slate} stroke={PALETTE.ivory} strokeWidth="5" />
        </g>
      </g>

      <rect x="92" y={726 - spineHeight / 2} width="36" height={spineHeight} fill={PALETTE.terracotta} />
      <SpineDetail y={681} visibility={detailTop} />
      <SpineDetail y={721} visibility={detailMiddle} />
      <SpineDetail y={761} visibility={detailBottom} />

      <g clipPath="url(#field-rail-mask)">
        <rect x="128" y="650" width="1060" height="20" fill={PALETTE.blue} />
      </g>
      <g clipPath="url(#field-card-mask)">
        <rect x="128" y="670" width="1060" height="115" fill={PALETTE.ivory} />
      </g>

      <g clipPath="url(#field-corner-mask)">
        <path d="M 1090 646 H 1188 V 678 H 1120 Z" fill={PALETTE.terracotta} />
      </g>
      <path
        d="M 1185 632 H 1220 V 667 H 1185 Z"
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="5"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={1 - smallBox}
      />
    </svg>
  );
};
