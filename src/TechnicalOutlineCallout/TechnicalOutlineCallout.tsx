import { Easing, interpolate, useCurrentFrame } from "remotion";

export const TECHNICAL_OUTLINE_WIDTH = 3840;
export const TECHNICAL_OUTLINE_HEIGHT = 2160;
export const TECHNICAL_OUTLINE_FPS = 30;
export const TECHNICAL_OUTLINE_DURATION = 240;

const PALETTE = {
  background: "#000000",
  ivory: "#EEEAE1",
  blue: "#6F9BC1",
  mask: "#FFFFFF",
} as const;

const GEOMETRY = {
  targetX: 1495,
  targetY: 690,
  targetRadius: 40,
  pointRadius: 17,
  strokeWidth: 5,
  labelLeft: 340,
  labelTop: 280,
  labelRight: 1010,
  labelBottom: 430,
  connectorX: 955,
  stripInset: 5,
  stripHeight: 30,
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = Easing.bezier(0.25, 0.1, 0.25, 1);

const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: smooth,
  });

const TARGET_RING = `M ${GEOMETRY.targetX} ${GEOMETRY.targetY - GEOMETRY.targetRadius} A ${GEOMETRY.targetRadius} ${GEOMETRY.targetRadius} 0 1 1 ${GEOMETRY.targetX} ${GEOMETRY.targetY + GEOMETRY.targetRadius} A ${GEOMETRY.targetRadius} ${GEOMETRY.targetRadius} 0 1 1 ${GEOMETRY.targetX} ${GEOMETRY.targetY - GEOMETRY.targetRadius}`;
const CONNECTOR = `M ${GEOMETRY.targetX - 28} ${GEOMETRY.targetY - 28} L 1360 568 H ${GEOMETRY.connectorX} V ${GEOMETRY.labelBottom}`;
const LABEL_OUTLINE = `M ${GEOMETRY.connectorX} ${GEOMETRY.labelBottom} H ${GEOMETRY.labelLeft} V ${GEOMETRY.labelTop} H ${GEOMETRY.labelRight} V ${GEOMETRY.labelBottom} H ${GEOMETRY.connectorX}`;

const TICKS = [
  `M ${GEOMETRY.targetX} ${GEOMETRY.targetY - 52} V ${GEOMETRY.targetY - 72}`,
  `M ${GEOMETRY.targetX + 52} ${GEOMETRY.targetY} H ${GEOMETRY.targetX + 72}`,
  `M ${GEOMETRY.targetX} ${GEOMETRY.targetY + 52} V ${GEOMETRY.targetY + 72}`,
  `M ${GEOMETRY.targetX - 52} ${GEOMETRY.targetY} H ${GEOMETRY.targetX - 72}`,
] as const;

const RevealedPath = ({
  d,
  draw,
  strokeWidth = GEOMETRY.strokeWidth,
  linecap = "butt",
}: {
  d: string;
  draw: number;
  strokeWidth?: number;
  linecap?: "butt" | "round";
}) => (
  <path
    d={d}
    pathLength={100}
    fill="none"
    stroke={PALETTE.ivory}
    strokeWidth={strokeWidth}
    strokeLinecap={linecap}
    strokeLinejoin="miter"
    strokeDasharray={100}
    strokeDashoffset={100 * (1 - draw)}
  />
);

export const TechnicalOutlineCallout = () => {
  const frame = useCurrentFrame();
  const targetExit = progress(frame, 228, 237);
  const targetOpacity = 1 - targetExit;
  const pointOpacity = progress(frame, 0, 7) * targetOpacity;
  const ringDraw = progress(frame, 4, 17);
  const connectorEntry = progress(frame, 22, 47);
  const connectorExit = progress(frame, 216, 231);
  const connectorDraw = frame < 216 ? connectorEntry : 1 - connectorExit;
  const labelEntry = progress(frame, 48, 67);
  const labelExit = progress(frame, 198, 215);
  const labelDraw = frame < 198 ? labelEntry : 1 - labelExit;
  const stripEntry = progress(frame, 60, 71);
  const stripExit = progress(frame, 192, 203);
  const stripWidth =
    (GEOMETRY.labelRight - GEOMETRY.labelLeft - GEOMETRY.stripInset * 2) *
    (frame < 192 ? stripEntry : 1 - stripExit);

  return (
    <svg
      width={TECHNICAL_OUTLINE_WIDTH}
      height={TECHNICAL_OUTLINE_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: PALETTE.background }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="technical-label-interior">
          <rect
            x={GEOMETRY.labelLeft + GEOMETRY.stripInset}
            y={GEOMETRY.labelTop + GEOMETRY.stripInset}
            width={
              GEOMETRY.labelRight - GEOMETRY.labelLeft - GEOMETRY.stripInset * 2
            }
            height={
              GEOMETRY.labelBottom - GEOMETRY.labelTop - GEOMETRY.stripInset * 2
            }
          />
        </clipPath>
        <mask id="technical-strip-mask">
          <rect width={1920} height={1080} fill={PALETTE.background} />
          <rect
            x={GEOMETRY.labelLeft + GEOMETRY.stripInset}
            y={GEOMETRY.labelTop}
            width={stripWidth}
            height={GEOMETRY.stripHeight + GEOMETRY.stripInset * 2}
            fill={PALETTE.mask}
          />
        </mask>
      </defs>

      <rect width={1920} height={1080} fill={PALETTE.background} />

      <g opacity={targetOpacity}>
        <RevealedPath d={TARGET_RING} draw={ringDraw} linecap="round" />
        {TICKS.map((tick, index) => (
          <RevealedPath
            key={tick}
            d={tick}
            draw={progress(frame, 12 + index * 2, 16 + index * 2)}
            strokeWidth={4}
          />
        ))}
      </g>
      <circle
        cx={GEOMETRY.targetX}
        cy={GEOMETRY.targetY}
        r={GEOMETRY.pointRadius}
        fill={PALETTE.ivory}
        opacity={pointOpacity}
      />

      <RevealedPath d={CONNECTOR} draw={connectorDraw} />
      <RevealedPath d={LABEL_OUTLINE} draw={labelDraw} />

      <g
        clipPath="url(#technical-label-interior)"
        mask="url(#technical-strip-mask)"
      >
        <rect
          x={GEOMETRY.labelLeft + GEOMETRY.stripInset}
          y={GEOMETRY.labelTop + GEOMETRY.stripInset}
          width={
            GEOMETRY.labelRight - GEOMETRY.labelLeft - GEOMETRY.stripInset * 2
          }
          height={GEOMETRY.stripHeight}
          fill={PALETTE.blue}
        />
      </g>
    </svg>
  );
};
