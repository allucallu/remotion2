import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useRemotionEnvironment,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const captionCenterUnfoldSchema = z.object({
  transparentBackground: z.boolean().default(false),
});
type Props = z.input<typeof captionCenterUnfoldSchema>;
const DESIGN = { panel: "#E7ECEF", accent: "#7E949E", background: "#000000" };
const closeEase = Easing.bezier(0.65, 0, 0.35, 1);
const openEase = Easing.bezier(0.33, 0, 0.2, 1);
const progress = (
  frame: number,
  start: number,
  end: number,
  closing: boolean,
) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: closing ? closeEase : openEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
// Entrance first, a static hold, then an exit. No reopening at the end.
const amount = (
  frame: number, enterStart: number, enterEnd: number,
  exitStart: number, exitEnd: number,
) => progress(frame, enterStart, enterEnd, false)
  * (1 - progress(frame, exitStart, exitEnd, true));
const captionState = (frame: number) => {
  const width = 140 + 2120 * amount(frame, 7, 26, 261, 287);
  const accentWidth = 1800 * amount(frame, 18, 30, 255, 268);
  return {
    // The closed capsule grows from the central anchor before unfolding;
    // it retracts only once both caps have returned to the centre.
    height: 280 * amount(frame, 0, 7, 287, 299),
    left: 1920 - width / 2,
    width,
    accentX: 1920 - accentWidth / 2,
    accentWidth,
  };
};

// One continuous outline describes both fixed-width end caps and their
// changing bridge. Separate overlapping fills can flatten the last 2px of
// a curved corner and create AA joins, especially in an alpha export.
const panelOutline = (left: number, width: number, height: number) => {
  const right = left + width;
  const top = 1720 - height / 2;
  const bottom = 1720 + height / 2;
  const r = Math.min(70, width / 2, height / 2);
  return [
    `M ${left + r} ${top}`,
    `H ${right - r}`,
    `A ${r} ${r} 0 0 1 ${right} ${top + r}`,
    `V ${bottom - r}`,
    `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `H ${left + r}`,
    `A ${r} ${r} 0 0 1 ${left} ${bottom - r}`,
    `V ${top + r}`,
    `A ${r} ${r} 0 0 1 ${left + r} ${top}`,
    "Z",
  ].join(" ");
};

export const CaptionCenterUnfold = ({
  transparentBackground = false,
}: Props) => {
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig();
  const state = captionState((frame * 30) / fps),
    { isRendering } = useRemotionEnvironment();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: transparentBackground
          ? "transparent"
          : DESIGN.background,
      }}
    >
      {transparentBackground && isRendering && (
        <style>{"html,body{background:transparent!important}"}</style>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
      >
        {state.height > 0 && (
          <path
            d={panelOutline(state.left, state.width, state.height)}
            fill={DESIGN.panel}
          />
        )}
        {state.accentWidth > 0 && (
          <rect
            x={state.accentX}
            y="1878"
            width={state.accentWidth}
            height="8"
            fill={DESIGN.accent}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
