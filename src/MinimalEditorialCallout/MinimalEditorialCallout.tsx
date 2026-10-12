import { Easing, interpolate, useCurrentFrame } from "remotion";

export const MINIMAL_EDITORIAL_WIDTH = 3840;
export const MINIMAL_EDITORIAL_HEIGHT = 2160;
export const MINIMAL_EDITORIAL_FPS = 30;
export const MINIMAL_EDITORIAL_DURATION = 240;

const PALETTE = {
  background: "#000000",
  ivory: "#F7F0E2",
  terracotta: "#D67A58",
  mask: "#FFFFFF",
} as const;

const GEOMETRY = {
  targetX: 343,
  targetY: 712,
  targetRadius: 33,
  targetDotRadius: 13,
  lineWidth: 7,
  labelX: 980,
  labelY: 320,
  labelWidth: 685,
  labelHeight: 180,
  labelRadius: 25,
  tabX: 948,
  tabY: 347,
  tabWidth: 40,
  tabHeight: 126,
  tabRadius: 12,
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = Easing.bezier(0.22, 0.74, 0.24, 1);
const retract = Easing.bezier(0.55, 0, 0.78, 0.26);

const progress = (frame: number, start: number, end: number, easing = smooth) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing,
  });

const CONNECTOR_PATH = "M 370 690 L 668 410 H 950";

export const MinimalEditorialCallout = () => {
  const frame = useCurrentFrame();

  const targetExit = progress(frame, 232, 237, retract);
  const targetOpacity = 1 - targetExit;
  const targetExitScale = 1 - targetExit * 0.2;
  const dotOpacity = progress(frame, 0, 7) * targetOpacity;
  const ringEntry = progress(frame, 4, 15);
  const ringScale = (0.75 + ringEntry * 0.25) * targetExitScale;

  const lineEntry = progress(frame, 16, 39);
  const lineExit = progress(frame, 218, 231, retract);
  const lineDraw = frame < 218 ? lineEntry : 1 - lineExit;

  const labelEntry = progress(frame, 46, 65);
  const labelExit = progress(frame, 192, 211, retract);
  const labelVisible = frame < 192 ? labelEntry : 1 - labelExit;
  const labelMaskWidth = GEOMETRY.labelWidth * labelVisible;

  const tabEntry = progress(frame, 40, 49);
  const tabExit = progress(frame, 208, 217, retract);
  const tabVisible = frame < 208 ? tabEntry : 1 - tabExit;
  const tabMaskHeight = GEOMETRY.tabHeight * tabVisible;
  const tabMaskY = GEOMETRY.tabY + (GEOMETRY.tabHeight - tabMaskHeight) / 2;

  return (
    <svg
      width={MINIMAL_EDITORIAL_WIDTH}
      height={MINIMAL_EDITORIAL_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: PALETTE.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <defs>
        <mask id="minimal-editorial-label-mask">
          <rect width="1920" height="1080" fill={PALETTE.background} />
          <rect
            x={GEOMETRY.labelX}
            y={GEOMETRY.labelY - 2}
            width={labelMaskWidth}
            height={GEOMETRY.labelHeight + 4}
            fill={PALETTE.mask}
          />
        </mask>
        <mask id="minimal-editorial-tab-mask">
          <rect width="1920" height="1080" fill={PALETTE.background} />
          <rect
            x={GEOMETRY.tabX - 2}
            y={tabMaskY}
            width={GEOMETRY.tabWidth + 4}
            height={tabMaskHeight}
            fill={PALETTE.mask}
          />
        </mask>
      </defs>

      <rect width="1920" height="1080" fill={PALETTE.background} />

      <g
        opacity={targetOpacity}
        transform={`translate(${GEOMETRY.targetX} ${GEOMETRY.targetY}) scale(${targetExitScale}) translate(${-GEOMETRY.targetX} ${-GEOMETRY.targetY})`}
      >
        <circle
          cx={GEOMETRY.targetX}
          cy={GEOMETRY.targetY}
          r={GEOMETRY.targetRadius}
          fill="none"
          stroke={PALETTE.ivory}
          strokeWidth={7}
          opacity={ringEntry}
          transform={`translate(${GEOMETRY.targetX} ${GEOMETRY.targetY}) scale(${ringScale / targetExitScale}) translate(${-GEOMETRY.targetX} ${-GEOMETRY.targetY})`}
        />
        <circle
          cx={GEOMETRY.targetX}
          cy={GEOMETRY.targetY}
          r={GEOMETRY.targetDotRadius}
          fill={PALETTE.ivory}
          opacity={dotOpacity / Math.max(targetOpacity, 0.0001)}
        />
      </g>

      <path
        d={CONNECTOR_PATH}
        pathLength={100}
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth={GEOMETRY.lineWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={100}
        strokeDashoffset={100 * (1 - lineDraw)}
      />

      <rect
        x={GEOMETRY.labelX}
        y={GEOMETRY.labelY}
        width={GEOMETRY.labelWidth}
        height={GEOMETRY.labelHeight}
        rx={GEOMETRY.labelRadius}
        fill={PALETTE.ivory}
        mask="url(#minimal-editorial-label-mask)"
      />

      <rect
        x={GEOMETRY.tabX}
        y={GEOMETRY.tabY}
        width={GEOMETRY.tabWidth}
        height={GEOMETRY.tabHeight}
        rx={GEOMETRY.tabRadius}
        fill={PALETTE.terracotta}
        mask="url(#minimal-editorial-tab-mask)"
      />
    </svg>
  );
};
