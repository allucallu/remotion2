import {Easing, interpolate, useCurrentFrame} from "remotion";

export const DOCUMENTARY_CHAPTER_FRAMEWORK_WIDTH = 3840;
export const DOCUMENTARY_CHAPTER_FRAMEWORK_HEIGHT = 2160;
export const DOCUMENTARY_CHAPTER_FRAMEWORK_FPS = 30;
export const DOCUMENTARY_CHAPTER_FRAMEWORK_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F5EEDF",
  slate: "#263A48",
  sage: "#819684",
  terracotta: "#C96A49",
  blue: "#63849D",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ENTER_EASING = Easing.bezier(0.18, 0.82, 0.24, 1);
const EXIT_EASING = Easing.bezier(0.6, 0, 0.82, 0.28);

const progress = (frame: number, start: number, end: number, easing = ENTER_EASING) =>
  interpolate(frame, [start, end], [0, 1], {...CLAMP, easing});

const reveal = (frame: number, start: number, end: number, outStart: number, outEnd: number) =>
  progress(frame, start, end) * (1 - progress(frame, outStart, outEnd, EXIT_EASING));

const Module = ({
  y,
  fill,
  outline,
  content,
}: {
  y: number;
  fill: string;
  outline: number;
  content: number;
}) => {
  const height = 64;
  const fillHeight = (height - 12) * content;
  const fillY = y + height - 6 - fillHeight;
  return (
    <>
      <rect
        x="130"
        y={y}
        width="100"
        height={height}
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="5"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={1 - outline}
      />
      <rect
        x="136"
        y={fillY}
        width="88"
        height={fillHeight}
        fill={fill}
      />
    </>
  );
};

export const DocumentaryChapterFramework = () => {
  const frame = useCurrentFrame();
  const bracket = reveal(frame, 0, 19, 284, 295);
  const topModuleOutline = reveal(frame, 10, 20, 270, 279);
  const topModuleFill = reveal(frame, 16, 27, 270, 279);
  const middleModuleOutline = reveal(frame, 16, 26, 276, 285);
  const middleModuleFill = reveal(frame, 22, 33, 276, 285);
  const bottomModuleOutline = reveal(frame, 22, 32, 282, 289);
  const bottomModuleFill = reveal(frame, 28, 39, 282, 289);
  const outline = reveal(frame, 20, 47, 258, 279);
  const slate = reveal(frame, 30, 55, 258, 269);
  const lowerStrip = reveal(frame, 42, 65, 246, 265);
  const upperLine = reveal(frame, 56, 64, 240, 251);
  const lowerLine = reveal(frame, 60, 71, 240, 251);
  const slateWidth = 1030 * slate;
  const stripWidth = 955 * lowerStrip;

  return (
    <svg
      width={DOCUMENTARY_CHAPTER_FRAMEWORK_WIDTH}
      height={DOCUMENTARY_CHAPTER_FRAMEWORK_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <defs>
        <clipPath id="chapter-slate-mask">
          <rect x="240" y="620" width={slateWidth} height="150" />
        </clipPath>
        <clipPath id="chapter-strip-mask">
          <rect x="270" y="780" width={stripWidth} height="62" />
        </clipPath>
      </defs>

      <path
        d="M 122 610 H 100 V 830 H 122"
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="6"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={1 - bracket}
      />

      <Module y={620} fill={PALETTE.sage} outline={topModuleOutline} content={topModuleFill} />
      <Module y={692} fill={PALETTE.terracotta} outline={middleModuleOutline} content={middleModuleFill} />
      <Module y={764} fill={PALETTE.blue} outline={bottomModuleOutline} content={bottomModuleFill} />

      <g clipPath="url(#chapter-slate-mask)">
        <rect x="240" y="620" width="1030" height="150" fill={PALETTE.slate} />
      </g>
      <path
        d="M 240 620 H 1270 V 770"
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="5"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={1 - outline}
      />
      <path
        d="M 240 620 V 770 H 1270"
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="5"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={1 - outline}
      />

      <g clipPath="url(#chapter-strip-mask)">
        <rect x="270" y="780" width="955" height="62" fill={PALETTE.ivory} />
      </g>
      <path
        d="M 1270 652 H 1330"
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="6"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={1 - upperLine}
      />
      <path
        d="M 1270 680 H 1330"
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="6"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={1 - lowerLine}
      />
    </svg>
  );
};
