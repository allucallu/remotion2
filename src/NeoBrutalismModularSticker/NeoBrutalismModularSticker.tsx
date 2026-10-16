import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_MODULAR_STICKER_WIDTH = 3840;
export const NEO_BRUTALISM_MODULAR_STICKER_HEIGHT = 2160;
export const NEO_BRUTALISM_MODULAR_STICKER_FPS = 30;
export const NEO_BRUTALISM_MODULAR_STICKER_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F6F0E4",
  coral: "#FF6650",
  blue: "#164AE5",
  yellow: "#EAF31F",
  lavender: "#A66CF2",
  ink: "#070707",
} as const;

const GEOMETRY = {
  badge: {x: 92, y: 665, width: 220, height: 230, radius: 34},
  panel: {x: 292, y: 700, width: 925, height: 164, radius: 27},
  backing: {x: 178, y: 730, width: 1098, height: 220, radius: 31},
  strip: {x: 220, y: 880, width: 880, height: 63, radius: 23},
  border: 10,
  tabPath: "M 1018 720 L 1018 687 L 1044 687 L 1044 659 L 1075 659 L 1075 632 L 1110 632 L 1110 605 L 1170 605 L 1170 720 Z",
  tabCenter: {x: 1094, y: 663},
} as const;

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

const progress = (frame: number, start: number, end: number, easing = EASE_OUT) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const impact = (frame: number, start: number, hit: number, settle: number) => {
  const arrive = progress(frame, start, hit, EASE_IN);
  const release = progress(frame, hit, settle, EASE_OUT);
  return arrive * (1 - release);
};

const OutlinedRoundRect = ({
  x,
  y,
  width,
  height,
  radius,
  fill,
  outer = PALETTE.ivory,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  fill: string;
  outer?: string;
}) => (
  <>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={radius}
      fill={fill}
      stroke={outer}
      strokeWidth={GEOMETRY.border + 5}
      shapeRendering="geometricPrecision"
    />
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={radius}
      fill="none"
      stroke={PALETTE.ink}
      strokeWidth={GEOMETRY.border}
      shapeRendering="geometricPrecision"
    />
  </>
);

export const NeoBrutalismModularSticker = () => {
  const frame = useCurrentFrame();

  const backingIn = progress(frame, 0, 19, EASE_OUT);
  const backingExit = progress(frame, 282, 295, EASE_IN);
  const backingImpact = 2 * impact(frame, 35, 39, 44);
  const backingY = 45 * (1 - backingIn) + backingImpact + 28 * backingExit;
  const backingRotation = -3 * (1 - backingIn) + 1.5 * backingExit;
  const backingVisible = frame > 0 && frame < 296;

  const panelIn = progress(frame, 12, 35, EASE_OUT);
  const panelExit = progress(frame, 274, 289, EASE_IN);
  const panelImpact = 5 * impact(frame, 31, 35, 41);
  const panelY = -35 * (1 - panelIn) + panelImpact - 35 * panelExit;
  const panelRotation = 2 * (1 - panelIn) + 2 * panelExit;
  const panelMaskWidth = GEOMETRY.panel.width * panelIn * (1 - panelExit);

  const badgeIn = progress(frame, 26, 47, EASE_OUT);
  const badgeExit = progress(frame, 264, 283, EASE_IN);
  const badgeRecoil = 5 * impact(frame, 43, 47, 52);
  const badgeX = -35 * (1 - badgeIn) + badgeRecoil - 55 * badgeExit;
  const badgeRotation = -8 * (1 - badgeIn) - 4 * badgeExit;

  const stripIn = progress(frame, 38, 59, EASE_OUT);
  const stripExit = progress(frame, 250, 271, EASE_IN);
  const stripWidth = GEOMETRY.strip.width * stripIn * (1 - stripExit);

  const tabIn = progress(frame, 50, 68, EASE_OUT);
  const tabExit = progress(frame, 240, 255, EASE_IN);
  const tabSettle = 4 * impact(frame, 64, 68, 71);
  const tabY = 80 * (1 - tabIn) + tabSettle + 80 * tabExit;

  const panelVisible = panelMaskWidth > 0.1 && frame < 290;

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
        <clipPath id="modular-panel-mask">
          <rect
            x={GEOMETRY.panel.x - GEOMETRY.border}
            y={GEOMETRY.panel.y - 55}
            width={panelMaskWidth + GEOMETRY.border}
            height={GEOMETRY.panel.height + 110}
          />
        </clipPath>
        <clipPath id="modular-strip-mask">
          <rect
            x={GEOMETRY.strip.x - GEOMETRY.border}
            y={GEOMETRY.strip.y - GEOMETRY.border}
            width={stripWidth + GEOMETRY.border}
            height={GEOMETRY.strip.height + GEOMETRY.border * 2}
          />
        </clipPath>
      </defs>

      {backingVisible ? (
        <g
          transform={`rotate(${backingRotation} 727 840) translate(0 ${backingY})`}
          opacity={backingIn * (1 - backingExit)}
        >
          <OutlinedRoundRect {...GEOMETRY.backing} fill={PALETTE.blue} />
        </g>
      ) : null}

      {tabIn > 0.001 && tabExit < 1 ? (
        <g transform={`translate(0 ${tabY})`} opacity={1 - tabExit}>
          <path
            d={GEOMETRY.tabPath}
            fill={PALETTE.lavender}
            stroke={PALETTE.ivory}
            strokeWidth={GEOMETRY.border + 5}
            strokeLinejoin="round"
          />
          <path
            d={GEOMETRY.tabPath}
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
            strokeLinejoin="round"
          />
        </g>
      ) : null}

      {stripWidth > 0.1 ? (
        <g clipPath="url(#modular-strip-mask)">
          <OutlinedRoundRect {...GEOMETRY.strip} fill={PALETTE.yellow} />
        </g>
      ) : null}

      {panelVisible ? (
        <g
          clipPath="url(#modular-panel-mask)"
          transform={`rotate(${panelRotation} 754 782) translate(0 ${panelY})`}
        >
          <OutlinedRoundRect {...GEOMETRY.panel} fill={PALETTE.coral} outer={PALETTE.ink} />
        </g>
      ) : null}

      {badgeIn > 0.001 && badgeExit < 1 ? (
        <g
          transform={`rotate(${badgeRotation} 202 780) translate(${badgeX} 0)`}
          opacity={1 - badgeExit}
        >
          <OutlinedRoundRect {...GEOMETRY.badge} fill={PALETTE.ivory} />
        </g>
      ) : null}
    </svg>
  );
};
