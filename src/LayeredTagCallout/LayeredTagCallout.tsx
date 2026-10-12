import { Easing, interpolate, useCurrentFrame } from "remotion";

export const LAYERED_TAG_CALLOUT_WIDTH = 3840;
export const LAYERED_TAG_CALLOUT_HEIGHT = 2160;
export const LAYERED_TAG_CALLOUT_FPS = 30;
export const LAYERED_TAG_CALLOUT_DURATION = 240;

const PALETTE = {
  background: "#000000",
  cream: "#F7F0E2",
  terracotta: "#D67A58",
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = Easing.bezier(0.25, 0.1, 0.25, 1);
const timing = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing: smooth });

const FRONT_LABEL = "M 360 300 H 1090 L 1160 370 V 500 H 430 L 360 430 Z";
const BACK_LABEL = "M 330 335 H 1088 L 1160 408 V 530 H 400 L 330 460 Z";
const CONNECTOR = "M 1510 790 L 1160 480";
const DIAMOND_CENTER = { x: 1510, y: 790 };
const DIAMOND = "M 1510 735 L 1565 790 L 1510 845 L 1455 790 Z";

const revealStart = (
  frame: number,
  entryStart: number,
  entryEnd: number,
  exitStart: number,
  exitEnd: number,
  left: number,
  right: number,
) => {
  if (frame < entryStart) return right;
  if (frame < entryEnd)
    return right - (right - left) * timing(frame, entryStart, entryEnd);
  if (frame < exitStart) return left;
  if (frame < exitEnd)
    return left + (right - left) * timing(frame, exitStart, exitEnd);
  return right;
};

export const LayeredTagCallout = () => {
  const frame = useCurrentFrame();
  const diamondEnter = timing(frame, 0, 11);
  const diamondExit = timing(frame, 232, 237);
  const diamondScale =
    frame < 232 ? 0.7 + diamondEnter * 0.3 : 1 - diamondExit * 0.3;
  const diamondOpacity = frame < 232 ? diamondEnter : 1 - diamondExit;
  const lineDraw =
    frame < 216 ? timing(frame, 12, 35) : 1 - timing(frame, 216, 231);
  const backMaskStart = revealStart(frame, 36, 47, 202, 215, 330, 1160);
  const frontMaskStart = revealStart(frame, 42, 59, 192, 207, 360, 1160);

  return (
    <svg
      width={LAYERED_TAG_CALLOUT_WIDTH}
      height={LAYERED_TAG_CALLOUT_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: PALETTE.background }}
      aria-hidden="true"
    >
      <defs>
        <mask id="layered-tag-back-mask">
          <rect width={1920} height={1080} fill={PALETTE.background} />
          <rect
            x={backMaskStart}
            y={280}
            width={1200}
            height={300}
            fill={PALETTE.cream}
          />
        </mask>
        <mask id="layered-tag-front-mask">
          <rect width={1920} height={1080} fill={PALETTE.background} />
          <rect
            x={frontMaskStart}
            y={280}
            width={1200}
            height={260}
            fill={PALETTE.cream}
          />
        </mask>
      </defs>

      <rect width={1920} height={1080} fill={PALETTE.background} />
      <path
        d={CONNECTOR}
        pathLength={100}
        stroke={PALETTE.terracotta}
        strokeWidth={12}
        strokeLinecap="butt"
        fill="none"
        strokeDasharray={100}
        strokeDashoffset={100 * (1 - lineDraw)}
      />
      <path
        d={BACK_LABEL}
        fill={PALETTE.terracotta}
        mask="url(#layered-tag-back-mask)"
      />
      <path
        d={FRONT_LABEL}
        fill={PALETTE.cream}
        mask="url(#layered-tag-front-mask)"
      />
      <g
        opacity={diamondOpacity}
        transform={`translate(${DIAMOND_CENTER.x} ${DIAMOND_CENTER.y}) scale(${diamondScale}) translate(${-DIAMOND_CENTER.x} ${-DIAMOND_CENTER.y})`}
      >
        <path d={DIAMOND} fill="none" stroke={PALETTE.cream} strokeWidth={12} />
      </g>
    </svg>
  );
};
