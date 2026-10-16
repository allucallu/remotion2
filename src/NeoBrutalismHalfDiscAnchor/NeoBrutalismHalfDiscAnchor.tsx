import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_HALF_DISC_ANCHOR_WIDTH = 3840;
export const NEO_BRUTALISM_HALF_DISC_ANCHOR_HEIGHT = 2160;
export const NEO_BRUTALISM_HALF_DISC_ANCHOR_FPS = 30;
export const NEO_BRUTALISM_HALF_DISC_ANCHOR_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ink: "#080808",
  ivory: "#F6F0E4",
  cobalt: "#1857E8",
  lavender: "#A978EE",
  yellow: "#EDF12A",
  coral: "#FA665A",
} as const;

const GEOMETRY = {
  border: 10,
  keyline: 18,
  hinge: {cx: 255, cy: 690, radius: 172},
  backing: "M 248 578 H 1270 V 598 H 1310 V 808 H 1268 V 876 H 248 Z",
  panel: "M 248 594 H 1252 V 738 H 248 Z",
  strip: "M 248 746 H 1225 V 826 H 248 Z",
  tab: "M 1124 552 H 1258 V 594 H 1124 Z",
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

const angularMask = (value: number) => {
  const angle = -90 - 180 * value;
  const radians = (angle * Math.PI) / 180;
  const x = GEOMETRY.hinge.cx + GEOMETRY.hinge.radius * Math.cos(radians);
  const y = GEOMETRY.hinge.cy + GEOMETRY.hinge.radius * Math.sin(radians);
  const largeArc = value > 0.5 ? 1 : 0;

  return `M ${GEOMETRY.hinge.cx} ${GEOMETRY.hinge.cy} L ${GEOMETRY.hinge.cx} ${
    GEOMETRY.hinge.cy - GEOMETRY.hinge.radius
  } A ${GEOMETRY.hinge.radius} ${GEOMETRY.hinge.radius} 0 ${largeArc} 0 ${x} ${y} Z`;
};

const FramedPath = ({d, fill}: {d: string; fill: string}) => (
  <>
    <path d={d} fill={fill} stroke={PALETTE.ivory} strokeWidth={GEOMETRY.keyline} strokeLinejoin="round" />
    <path d={d} fill={fill} stroke={PALETTE.ink} strokeWidth={GEOMETRY.border} strokeLinejoin="round" />
  </>
);

export const NeoBrutalismHalfDiscAnchor = () => {
  const frame = useCurrentFrame();

  const hingeIn = progress(frame, 0, 23);
  const hingeOut = progress(frame, 282, 295, EASE_IN);
  const hingeVisible = hingeIn * (1 - hingeOut);

  const backingIn = progress(frame, 16, 43);
  const backingOut = progress(frame, 264, 287, EASE_IN);
  const backingVisible = backingIn * (1 - backingOut);
  const backingOffset = progress(frame, 50, 65) * (1 - progress(frame, 264, 287, EASE_IN));
  const backingX = -120 * (1 - backingIn) - 1180 * backingOut + 16 * backingOffset;
  const backingY = 12 * backingOffset;

  const panelIn = progress(frame, 24, 51);
  const panelOut = progress(frame, 256, 279, EASE_IN);
  const panelVisible = panelIn * (1 - panelOut);
  const panelX =
    -124 * (1 - panelIn) -
    1150 * panelOut +
    peak(frame, 46, 48, 51, 7);

  const stripIn = progress(frame, 34, 61);
  const stripOut = progress(frame, 250, 273, EASE_IN);
  const stripVisible = stripIn * (1 - stripOut);
  const stripX =
    -110 * (1 - stripIn) -
    1130 * stripOut +
    peak(frame, 57, 59, 61, 4);

  const tabIn = progress(frame, 58, 73);
  const tabOut = progress(frame, 240, 255, EASE_IN);
  const tabVisible = tabIn * (1 - tabOut);
  const tabY = 40 * (1 - tabIn) - 40 * tabOut + peak(frame, 69, 71, 73, 3);

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
        <clipPath id="half-disc-hinge-mask">
          <path d={angularMask(hingeVisible)} />
        </clipPath>
        <clipPath id="half-disc-backing-mask">
          <rect x="246" y="540" width={1080 * backingIn} height="380" />
        </clipPath>
        <clipPath id="half-disc-panel-mask">
          <rect x="246" y="582" width={1024 * panelIn} height="170" />
        </clipPath>
        <clipPath id="half-disc-strip-mask">
          <rect x="246" y="734" width={1000 * stripIn} height="108" />
        </clipPath>
        <clipPath id="half-disc-tab-mask">
          <rect x="1114" y={594 - 46 * tabIn} width="156" height={48 * tabIn} />
        </clipPath>
      </defs>

      {backingVisible > 0.001 ? (
        <g clipPath="url(#half-disc-backing-mask)" transform={`translate(${backingX} ${backingY})`}>
          <FramedPath d={GEOMETRY.backing} fill={PALETTE.yellow} />
        </g>
      ) : null}

      {stripVisible > 0.001 ? (
        <g clipPath="url(#half-disc-strip-mask)" transform={`translate(${stripX} 0)`}>
          <FramedPath d={GEOMETRY.strip} fill={PALETTE.lavender} />
        </g>
      ) : null}

      {panelVisible > 0.001 ? (
        <g clipPath="url(#half-disc-panel-mask)" transform={`translate(${panelX} 0)`}>
          <FramedPath d={GEOMETRY.panel} fill={PALETTE.ivory} />
        </g>
      ) : null}

      {tabVisible > 0.001 ? (
        <g clipPath="url(#half-disc-tab-mask)" transform={`translate(0 ${tabY})`}>
          <FramedPath d={GEOMETRY.tab} fill={PALETTE.coral} />
        </g>
      ) : null}

      {hingeVisible > 0.001 ? (
        <g clipPath={hingeVisible < 0.999 ? "url(#half-disc-hinge-mask)" : undefined}>
          <path
            d="M 255 518 A 172 172 0 0 0 255 862 Z"
            fill={PALETTE.cobalt}
            stroke={PALETTE.ivory}
            strokeWidth={GEOMETRY.keyline}
            strokeLinejoin="round"
          />
          <path
            d="M 255 518 A 172 172 0 0 0 255 862 Z"
            fill={PALETTE.cobalt}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
            strokeLinejoin="round"
          />
        </g>
      ) : null}
    </svg>
  );
};
