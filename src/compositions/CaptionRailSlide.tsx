import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useRemotionEnvironment,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const captionRailSlideSchema = z.object({
  transparentBackground: z.boolean().default(false),
});
type Props = z.input<typeof captionRailSlideSchema>;
const DESIGN = {
  front: "#F2EFE8",
  rail: "#ADB8BC",
  back: "#525D64",
  background: "#000000",
};
const closeEase = Easing.bezier(0.65, 0, 0.35, 1);
const openEase = Easing.bezier(0.33, 0, 0.2, 1);
const transition = (
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
) => transition(frame, enterStart, enterEnd, false)
  * (1 - transition(frame, exitStart, exitEnd, true));
// The clipping aperture starts at the rail's right edge (716 + 28).
// Keep a 2px bleed behind it so a fully closed panel leaves no AA sliver.
const SLOT_X = 744;
const PANEL_WIDTH = 2320;
const CLOSED_X = SLOT_X - PANEL_WIDTH - 2;
const captionState = (frame: number) => {
  const front = amount(frame, 9, 30, 255, 281);
  const back = amount(frame, 4, 26, 261, 287);
  const railHeight = 288 * amount(frame, 0, 8, 281, 299);
  return {
    frontX: CLOSED_X + (760 - CLOSED_X) * front,
    backX: CLOSED_X + (778 - CLOSED_X) * back,
    railY: 1720 - railHeight / 2,
    railHeight,
  };
};

export const CaptionRailSlide = ({ transparentBackground = false }: Props) => {
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig();
  const state = captionState((frame * 30) / fps),
    id = useId().replace(/[^a-zA-Z0-9_-]/g, "") + "-caption-rail";
  const { isRendering } = useRemotionEnvironment();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: transparentBackground
          ? "transparent"
          : DESIGN.background,
      }}
    >
      {/* The project body is black; alpha exports clear that canvas background only. */}
      {transparentBackground && isRendering && (
        <style>{"html,body{background:transparent!important}"}</style>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
      >
        <defs>
          <clipPath id={id} clipPathUnits="userSpaceOnUse">
            {/* Full-open pose retains its 16px gap; moving panels reach
                the rail itself instead of disappearing across that gap. */}
            <rect x={SLOT_X} y="1574" width="2356" height="294" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id})`}>
          <rect
            x={state.backX}
            y="1606"
            width={PANEL_WIDTH}
            height="260"
            rx="18"
            fill={DESIGN.back}
          />
          <rect
            x={state.frontX}
            y="1590"
            width={PANEL_WIDTH}
            height="260"
            rx="18"
            fill={DESIGN.front}
          />
        </g>
        <rect
          x="716"
          y={state.railY}
          width="28"
          height={state.railHeight}
          fill={DESIGN.rail}
        />
      </svg>
    </AbsoluteFill>
  );
};
