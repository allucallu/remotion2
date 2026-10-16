import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_PERFORATED_RAIL_WIDTH = 3840;
export const NEO_BRUTALISM_PERFORATED_RAIL_HEIGHT = 2160;
export const NEO_BRUTALISM_PERFORATED_RAIL_FPS = 30;
export const NEO_BRUTALISM_PERFORATED_RAIL_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ink: "#080808",
  ivory: "#F6F0E4",
  blue: "#276AF0",
  lavender: "#A978EE",
  coral: "#FA665A",
  yellow: "#EDF12A",
} as const;

const GEOMETRY = {
  border: 9,
  rail: {x: 110, y: 570, width: 114, height: 265},
  holes: [625, 702, 779],
  backing: {x: 158, y: 584, width: 1186, height: 285},
  panel: {x: 224, y: 585, width: 1046, height: 158},
  coral: {x: 224, y: 747, width: 1046, height: 80},
  bracketOuter: "M 1204 540 H 1312 V 643 H 1282 V 572 H 1204 Z",
  bracketInner: "M 1210 548 H 1301 V 634 H 1288 V 563 H 1210 Z",
} as const;

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

const progress = (frame: number, start: number, end: number, easing = EASE_OUT) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const peak = (frame: number, start: number, middle: number, end: number, amount: number) =>
  interpolate(frame, [start, middle, end], [0, amount, 0], {
    easing: EASE_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const NeoBrutalismPerforatedRail = () => {
  const frame = useCurrentFrame();
  const railIn = progress(frame, 0, 19);
  const railOut = progress(frame, 284, 295, EASE_IN);
  const railVisible = railIn * (1 - railOut);

  const backingIn = progress(frame, 14, 41);
  const backingOut = progress(frame, 266, 289, EASE_IN);
  const backingVisible = backingIn * (1 - backingOut);
  const backingOpeningX = -74 * (1 - backingIn) + 74 * backingOut;
  const backingOffset = progress(frame, 50, 65) * (1 - progress(frame, 250, 271, EASE_IN));

  const panelIn = progress(frame, 22, 51);
  const panelOut = progress(frame, 262, 285, EASE_IN);
  const panelVisible = panelIn * (1 - panelOut);
  const panelX =
    -90 * (1 - panelIn) +
    90 * panelOut +
    peak(frame, 43, 45, 51, 7);

  const coralIn = progress(frame, 38, 61);
  const coralOut = progress(frame, 250, 271, EASE_IN);
  const coralVisible = coralIn * (1 - coralOut);
  const coralX = -80 * (1 - coralIn) + 80 * coralOut + peak(frame, 55, 57, 61, 4);

  const bracketIn = progress(frame, 58, 73);
  const bracketOut = progress(frame, 240, 253, EASE_IN);
  const bracketVisible = bracketIn * (1 - bracketOut);
  const bracketX = 8 * (1 - bracketIn) + 8 * bracketOut;
  const bracketY = -15 * (1 - bracketIn) - 15 * bracketOut;

  return (
    <svg
      viewBox="0 0 1920 1080"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{backgroundColor: PALETTE.background}}
    >
      <rect width="1920" height="1080" fill={PALETTE.background} />
      <defs>
        <clipPath id="perforated-backing-mask">
          <rect x="150" y="558" width={GEOMETRY.backing.width * backingVisible} height="330" />
        </clipPath>
        <clipPath id="perforated-panel-mask">
          <rect x={GEOMETRY.panel.x} y="570" width={GEOMETRY.panel.width * panelVisible} height="190" />
        </clipPath>
        <clipPath id="perforated-coral-mask">
          <rect x={GEOMETRY.coral.x} y="734" width={GEOMETRY.coral.width * coralVisible} height="107" />
        </clipPath>
        <clipPath id="perforated-rail-mask">
          <rect
            x={GEOMETRY.rail.x - 12}
            y={GEOMETRY.rail.y}
            width={GEOMETRY.rail.width + 24}
            height={GEOMETRY.rail.height * railVisible}
          />
        </clipPath>
        <clipPath id="perforated-bracket-mask">
          <rect x="1195" y="525" width={125 * bracketVisible} height="135" />
        </clipPath>
      </defs>

      {backingVisible > 0.001 ? (
        <g clipPath="url(#perforated-backing-mask)" transform={`translate(${backingOpeningX + 14 * backingOffset} ${12 * backingOffset})`}>
          <rect
            x={GEOMETRY.backing.x}
            y={GEOMETRY.backing.y}
            width={GEOMETRY.backing.width}
            height={GEOMETRY.backing.height}
            fill={PALETTE.lavender}
            stroke={PALETTE.ivory}
            strokeWidth={GEOMETRY.border}
          />
        </g>
      ) : null}

      {panelVisible > 0.001 ? (
        <g clipPath="url(#perforated-panel-mask)" transform={`translate(${panelX} 0)`}>
          <rect
            x={GEOMETRY.panel.x}
            y={GEOMETRY.panel.y}
            width={GEOMETRY.panel.width}
            height={GEOMETRY.panel.height}
            fill={PALETTE.ivory}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
          />
        </g>
      ) : null}

      {coralVisible > 0.001 ? (
        <g clipPath="url(#perforated-coral-mask)" transform={`translate(${coralX} 0)`}>
          <rect
            x={GEOMETRY.coral.x}
            y={GEOMETRY.coral.y}
            width={GEOMETRY.coral.width}
            height={GEOMETRY.coral.height}
            fill={PALETTE.coral}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
          />
        </g>
      ) : null}

      {railVisible > 0.001 ? (
        <g clipPath="url(#perforated-rail-mask)">
          <rect
            x={GEOMETRY.rail.x}
            y={GEOMETRY.rail.y}
            width={GEOMETRY.rail.width}
            height={GEOMETRY.rail.height}
            fill={PALETTE.blue}
            stroke={PALETTE.ivory}
            strokeWidth={GEOMETRY.border}
          />
          {GEOMETRY.holes.map((cy) => (
            <circle key={cy} cx="167" cy={cy} r="27" fill={PALETTE.background} />
          ))}
        </g>
      ) : null}

      {bracketVisible > 0.001 ? (
        <g clipPath="url(#perforated-bracket-mask)" transform={`translate(${bracketX} ${bracketY})`}>
          <path d={GEOMETRY.bracketOuter} fill={PALETTE.ivory} stroke={PALETTE.ink} strokeWidth={GEOMETRY.border} />
          <path d={GEOMETRY.bracketInner} fill={PALETTE.yellow} stroke={PALETTE.ink} strokeWidth={GEOMETRY.border} />
        </g>
      ) : null}
    </svg>
  );
};
