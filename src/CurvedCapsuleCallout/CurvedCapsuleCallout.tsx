import { Easing, interpolate, useCurrentFrame } from "remotion";

export const CURVED_CAPSULE_CALLOUT_WIDTH = 3840;
export const CURVED_CAPSULE_CALLOUT_HEIGHT = 2160;
export const CURVED_CAPSULE_CALLOUT_FPS = 30;
export const CURVED_CAPSULE_CALLOUT_DURATION = 240;

const PALETTE = {
  background: "#000000",
  cream: "#F7F0E2",
  ochre: "#E4AA31",
  mask: "#FFFFFF",
} as const;

const GEOMETRY = {
  dotX: 370,
  dotY: 700,
  dotRadius: 29,
  labelX: 950,
  labelY: 270,
  labelWidth: 650,
  labelHeight: 160,
  capWidth: 72,
  lineWidth: 7,
} as const;

const CURVE = "M 394 700 C 610 675 650 350 950 350";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = Easing.bezier(0.25, 0.1, 0.25, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const progress = (
  frame: number,
  start: number,
  end: number,
  easing: (value: number) => number = smooth,
) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing,
  });

export const CurvedCapsuleCallout = () => {
  const frame = useCurrentFrame();
  const dotEntry = progress(frame, 0, 11, easeOut);
  const dotExit = progress(frame, 230, 237, smooth);
  const dotScale = frame < 230 ? 0.6 + dotEntry * 0.4 : 1 - dotExit * 0.4;
  const dotOpacity = frame < 230 ? dotEntry : 1 - dotExit;

  const lineEntry = progress(frame, 12, 41, smooth);
  const lineExit = progress(frame, 208, 229, smooth);
  const visibleLine = frame < 208 ? lineEntry : 1 - lineExit;

  const labelEntry = progress(frame, 42, 59, smooth);
  const labelExit = progress(frame, 192, 207, smooth);
  const labelVisibleWidth =
    GEOMETRY.labelWidth * (frame < 192 ? labelEntry : 1 - labelExit);
  const capEntry = progress(frame, 54, 65, smooth);
  const capVisibleWidth = GEOMETRY.capWidth * capEntry;
  const capX = GEOMETRY.labelX + GEOMETRY.labelWidth - GEOMETRY.capWidth;

  return (
    <svg
      width={CURVED_CAPSULE_CALLOUT_WIDTH}
      height={CURVED_CAPSULE_CALLOUT_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: PALETTE.background }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="curved-capsule-shape">
          <rect
            x={GEOMETRY.labelX}
            y={GEOMETRY.labelY}
            width={GEOMETRY.labelWidth}
            height={GEOMETRY.labelHeight}
            rx={GEOMETRY.labelHeight / 2}
          />
        </clipPath>
        <mask id="curved-capsule-label-mask">
          <rect width={1920} height={1080} fill={PALETTE.background} />
          <rect
            x={GEOMETRY.labelX}
            y={GEOMETRY.labelY - 2}
            width={labelVisibleWidth}
            height={GEOMETRY.labelHeight + 4}
            fill={PALETTE.mask}
          />
        </mask>
        <mask id="curved-capsule-cap-mask">
          <rect width={1920} height={1080} fill={PALETTE.background} />
          <rect
            x={capX}
            y={GEOMETRY.labelY - 2}
            width={capVisibleWidth}
            height={GEOMETRY.labelHeight + 4}
            fill={PALETTE.mask}
          />
        </mask>
      </defs>

      <rect width={1920} height={1080} fill={PALETTE.background} />
      <path
        d={CURVE}
        pathLength={100}
        fill="none"
        stroke={PALETTE.cream}
        strokeWidth={GEOMETRY.lineWidth}
        strokeLinecap="round"
        strokeDasharray={100}
        strokeDashoffset={100 * (1 - visibleLine)}
      />

      <g
        clipPath="url(#curved-capsule-shape)"
        mask="url(#curved-capsule-label-mask)"
      >
        <rect
          x={GEOMETRY.labelX}
          y={GEOMETRY.labelY}
          width={GEOMETRY.labelWidth}
          height={GEOMETRY.labelHeight}
          fill={PALETTE.cream}
        />
        <rect
          x={capX}
          y={GEOMETRY.labelY}
          width={GEOMETRY.capWidth}
          height={GEOMETRY.labelHeight}
          fill={PALETTE.ochre}
          mask="url(#curved-capsule-cap-mask)"
        />
      </g>

      <g
        opacity={dotOpacity}
        transform={`translate(${GEOMETRY.dotX} ${GEOMETRY.dotY}) scale(${dotScale}) translate(${-GEOMETRY.dotX} ${-GEOMETRY.dotY})`}
      >
        <circle
          cx={GEOMETRY.dotX}
          cy={GEOMETRY.dotY}
          r={GEOMETRY.dotRadius}
          fill={PALETTE.ochre}
        />
      </g>
    </svg>
  );
};
