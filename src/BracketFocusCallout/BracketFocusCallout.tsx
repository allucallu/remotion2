import { Easing, interpolate, useCurrentFrame } from "remotion";

export const BRACKET_FOCUS_WIDTH = 3840;
export const BRACKET_FOCUS_HEIGHT = 2160;
export const BRACKET_FOCUS_FPS = 30;
export const BRACKET_FOCUS_DURATION = 240;

const PALETTE = {
  background: "#000000",
  ivory: "#F2EEE4",
  sage: "#435747",
  sageAccent: "#8C9B76",
  mask: "#FFFFFF",
} as const;

const GEOMETRY = {
  focusCenterX: 470,
  focusCenterY: 690,
  focusLeft: 380,
  focusRight: 560,
  focusTop: 606,
  focusBottom: 774,
  bracketArm: 42,
  bracketStroke: 7,
  bracketOffsetX: 18,
  bracketOffsetY: 14,
  labelX: 860,
  labelY: 255,
  labelWidth: 850,
  labelHeight: 198,
  labelStroke: 6,
  accentWidth: 60,
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.22, 0.72, 0.24, 1);
const easeIn = Easing.bezier(0.55, 0, 0.78, 0.28);

const progress = (
  frame: number,
  start: number,
  end: number,
  easing = easeOut,
) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing,
  });

const CONNECTOR_PATH = `M ${GEOMETRY.focusRight} ${GEOMETRY.focusTop} L 840 355 H ${GEOMETRY.labelX}`;

const BRACKETS = [
  {
    id: "top-left",
    path: `M ${GEOMETRY.focusLeft} ${GEOMETRY.focusTop + GEOMETRY.bracketArm} V ${GEOMETRY.focusTop} H ${GEOMETRY.focusLeft + GEOMETRY.bracketArm}`,
    outwardX: -GEOMETRY.bracketOffsetX,
    outwardY: -GEOMETRY.bracketOffsetY,
  },
  {
    id: "top-right",
    path: `M ${GEOMETRY.focusRight - GEOMETRY.bracketArm} ${GEOMETRY.focusTop} H ${GEOMETRY.focusRight} V ${GEOMETRY.focusTop + GEOMETRY.bracketArm}`,
    outwardX: GEOMETRY.bracketOffsetX,
    outwardY: -GEOMETRY.bracketOffsetY,
  },
  {
    id: "bottom-left",
    path: `M ${GEOMETRY.focusLeft} ${GEOMETRY.focusBottom - GEOMETRY.bracketArm} V ${GEOMETRY.focusBottom} H ${GEOMETRY.focusLeft + GEOMETRY.bracketArm}`,
    outwardX: -GEOMETRY.bracketOffsetX,
    outwardY: GEOMETRY.bracketOffsetY,
  },
  {
    id: "bottom-right",
    path: `M ${GEOMETRY.focusRight - GEOMETRY.bracketArm} ${GEOMETRY.focusBottom} H ${GEOMETRY.focusRight} V ${GEOMETRY.focusBottom - GEOMETRY.bracketArm}`,
    outwardX: GEOMETRY.bracketOffsetX,
    outwardY: GEOMETRY.bracketOffsetY,
  },
] as const;

export const BracketFocusCallout = () => {
  const frame = useCurrentFrame();

  const bracketEntry = progress(frame, 0, 15);
  const bracketExit = progress(frame, 230, 237, easeIn);
  const bracketPosition = frame < 230 ? 1 - bracketEntry : bracketExit;
  const bracketOpacity =
    frame < 230 ? bracketEntry : Math.max(0, 1 - bracketExit);

  const lineEntry = progress(frame, 16, 41);
  const lineExit = progress(frame, 212, 229, easeIn);
  const lineDraw = frame < 212 ? lineEntry : 1 - lineExit;

  const labelEntry = progress(frame, 42, 61);
  const labelExit = progress(frame, 192, 211, easeIn);
  const labelVisible = frame < 192 ? labelEntry : 1 - labelExit;
  const labelMaskWidth = GEOMETRY.labelWidth * labelVisible;
  const labelMaskPadding = labelVisible > 0 ? GEOMETRY.labelStroke : 0;

  const accentEntry = progress(frame, 56, 67);
  const accentMaskWidth = GEOMETRY.accentWidth * accentEntry;
  const accentX = GEOMETRY.labelX + GEOMETRY.labelWidth - GEOMETRY.accentWidth;

  return (
    <svg
      width={BRACKET_FOCUS_WIDTH}
      height={BRACKET_FOCUS_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: PALETTE.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <defs>
        <mask id="bracket-focus-label-mask">
          <rect width="1920" height="1080" fill={PALETTE.background} />
          <rect
            x={GEOMETRY.labelX - GEOMETRY.labelStroke}
            y={GEOMETRY.labelY - GEOMETRY.labelStroke}
            width={labelMaskWidth + labelMaskPadding}
            height={GEOMETRY.labelHeight + GEOMETRY.labelStroke * 2}
            fill={PALETTE.mask}
          />
        </mask>
        <mask id="bracket-focus-accent-mask">
          <rect width="1920" height="1080" fill={PALETTE.background} />
          <rect
            x={accentX}
            y={GEOMETRY.labelY}
            width={accentMaskWidth}
            height={GEOMETRY.labelHeight}
            fill={PALETTE.mask}
          />
        </mask>
      </defs>

      <rect width="1920" height="1080" fill={PALETTE.background} />

      {BRACKETS.map((bracket) => (
        <path
          key={bracket.id}
          d={bracket.path}
          fill="none"
          stroke={PALETTE.ivory}
          strokeWidth={GEOMETRY.bracketStroke}
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity={bracketOpacity}
          transform={`translate(${bracket.outwardX * bracketPosition} ${bracket.outwardY * bracketPosition})`}
        />
      ))}

      <path
        d={CONNECTOR_PATH}
        pathLength={100}
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth={GEOMETRY.bracketStroke}
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeDasharray={100}
        strokeDashoffset={100 * (1 - lineDraw)}
        opacity={lineDraw > 0 ? 1 : 0}
      />

      <g mask="url(#bracket-focus-label-mask)">
        <rect
          x={GEOMETRY.labelX}
          y={GEOMETRY.labelY}
          width={GEOMETRY.labelWidth}
          height={GEOMETRY.labelHeight}
          fill={PALETTE.sage}
          stroke={PALETTE.ivory}
          strokeWidth={GEOMETRY.labelStroke}
        />

        <g mask="url(#bracket-focus-accent-mask)">
          <rect
            x={accentX}
            y={GEOMETRY.labelY}
            width={GEOMETRY.accentWidth}
            height={GEOMETRY.labelHeight}
            fill={PALETTE.sageAccent}
          />
          <line
            x1={accentX}
            y1={GEOMETRY.labelY}
            x2={accentX}
            y2={GEOMETRY.labelY + GEOMETRY.labelHeight}
            stroke={PALETTE.ivory}
            strokeWidth={GEOMETRY.labelStroke}
          />
        </g>

        <rect
          x={GEOMETRY.labelX}
          y={GEOMETRY.labelY}
          width={GEOMETRY.labelWidth}
          height={GEOMETRY.labelHeight}
          fill="none"
          stroke={PALETTE.ivory}
          strokeWidth={GEOMETRY.labelStroke}
        />
      </g>
    </svg>
  );
};
