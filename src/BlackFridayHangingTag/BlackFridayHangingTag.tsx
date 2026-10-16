import {Easing, interpolate, useCurrentFrame} from "remotion";

export const BLACK_FRIDAY_HANGING_TAG_WIDTH = 3840;
export const BLACK_FRIDAY_HANGING_TAG_HEIGHT = 2160;
export const BLACK_FRIDAY_HANGING_TAG_FPS = 30;
export const BLACK_FRIDAY_HANGING_TAG_DURATION = 240;

const PALETTE = {
  background: "#000000",
  ivory: "#F4EBD8",
  brick: "#B92F2E",
  ink: "#000000",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const easeOut = Easing.bezier(0.18, 0.78, 0.24, 1);
const easeIn = Easing.bezier(0.58, 0, 0.82, 0.32);

const progress = (frame: number, start: number, end: number, easing = easeOut) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing});

const tagPath = "M -250 12 L -166 -76 L 172 -76 L 250 12 L 226 600 Q 222 630 190 638 L -200 638 Q -232 631 -236 598 Z";
const lowerPanelPath = "M -240 486 L 236 486 L 226 600 Q 222 630 190 638 L -200 638 Q -232 631 -236 598 Z";

const AccentLine = ({d, visible}: {d: string; visible: number}) => (
  <path
    d={d}
    fill="none"
    stroke={PALETTE.ivory}
    strokeLinecap="round"
    strokeWidth="15"
    pathLength={1}
    strokeDasharray="1"
    strokeDashoffset={1 - visible}
  />
);

export const BlackFridayHangingTag = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 29);
  const exit = progress(frame, 212, 233, easeIn);
  const entryX = interpolate(enter, [0, 1], [-42, 0]);
  const exitX = interpolate(exit, [0, 1], [0, 58], clamp);
  const x = 960 + entryX + exitX;
  const y = interpolate(enter, [0, 1], [-780, 160]) + interpolate(exit, [0, 1], [0, -860]);
  const swingProgress = progress(frame, 22, 59);
  const swing = frame < 60 ? 11 * Math.sin(swingProgress * Math.PI * 4) * Math.pow(1 - swingProgress, 0.55) : 0;
  const angle = 8 + swing;

  const leftTabAmount = progress(frame, 32, 45) * (1 - progress(frame, 202, 211, easeIn));
  const rightTabAmount = progress(frame, 36, 47) * (1 - progress(frame, 198, 207, easeIn));
  const accents = [
    "M 298 125 L 374 68",
    "M 310 188 L 405 164",
    "M 306 254 L 393 291",
  ];

  return (
    <svg
      width={BLACK_FRIDAY_HANGING_TAG_WIDTH}
      height={BLACK_FRIDAY_HANGING_TAG_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      {frame < 234 ? (
        <>
          <path d={`M 930 -40 L ${x - 9} ${y - 4}`} fill="none" stroke={PALETTE.ivory} strokeWidth="9" strokeLinecap="round" />
          <path d={`M 990 -40 L ${x + 9} ${y - 4}`} fill="none" stroke={PALETTE.ivory} strokeWidth="9" strokeLinecap="round" />
          <g transform={`translate(${x} ${y}) rotate(${angle})`}>
            <g transform={`translate(${150 * (1 - leftTabAmount)} 0)`}>
              <path d="M -326 92 L -240 38 L -240 138 L -342 108 Z" fill={PALETTE.brick} />
              <path d="M -332 174 L -238 152 L -238 246 L -346 214 Z" fill={PALETTE.brick} />
            </g>
            <g transform={`translate(${-150 * (1 - rightTabAmount)} 0)`}>
              <path d="M 220 334 L 332 398 L 296 463 L 220 408 Z" fill={PALETTE.brick} />
              <path d="M 220 428 L 318 495 L 282 556 L 220 510 Z" fill={PALETTE.brick} />
            </g>

            <path d={tagPath} fill={PALETTE.ivory} />
            <path d={lowerPanelPath} fill={PALETTE.brick} />
            <circle cx="0" cy="0" r="30" fill={PALETTE.brick} />
            <circle cx="0" cy="0" r="20" fill="none" stroke={PALETTE.ivory} strokeWidth="6" />
            <circle cx="0" cy="0" r="10" fill={PALETTE.ink} />
            <path d="M -12 -14 C -8 -34 8 -34 12 -14" fill="none" stroke={PALETTE.ivory} strokeWidth="6" strokeLinecap="round" />

            <g fill={PALETTE.ink} fontFamily="Impact, Arial Black, sans-serif" fontWeight="900" textAnchor="middle">
              <text x="0" y="132" fontSize="96" textLength="420" lengthAdjust="spacingAndGlyphs">BLACK</text>
              <text x="0" y="242" fontSize="96" textLength="425" lengthAdjust="spacingAndGlyphs">FRIDAY</text>
              <text x="-76" y="466" fill={PALETTE.brick} fontSize="200" textLength="252" lengthAdjust="spacingAndGlyphs">50</text>
              <text x="119" y="450" fill={PALETTE.brick} fontSize="134">%</text>
              <text x="148" y="476" fontSize="55">OFF</text>
            </g>
            <text
              x="0"
              y="585"
              fill={PALETTE.ivory}
              fontFamily="Impact, Arial Black, sans-serif"
              fontSize="45"
              fontWeight="900"
              textAnchor="middle"
              textLength="390"
              lengthAdjust="spacingAndGlyphs"
            >
              LIMITED OFFER
            </text>

            {accents.map((line, index) => {
              const inProgress = progress(frame, 44 + index * 4, 52 + index * 4);
              const outProgress = progress(frame, 192 + index * 3, 203 + index * 3, easeIn);
              return <AccentLine key={line} d={line} visible={inProgress * (1 - outProgress)} />;
            })}
          </g>
        </>
      ) : null}
    </svg>
  );
};
