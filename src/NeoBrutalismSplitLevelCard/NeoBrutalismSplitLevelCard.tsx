import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_SPLIT_LEVEL_CARD_WIDTH = 3840;
export const NEO_BRUTALISM_SPLIT_LEVEL_CARD_HEIGHT = 2160;
export const NEO_BRUTALISM_SPLIT_LEVEL_CARD_FPS = 30;
export const NEO_BRUTALISM_SPLIT_LEVEL_CARD_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ink: "#080808",
  ivory: "#F6F0E4",
  cobalt: "#1B49E6",
  lavender: "#A778EF",
  yellow: "#F0F216",
  coral: "#FB695A",
} as const;

const GEOMETRY = {
  keyline: 18,
  border: 10,
  anchor: "M 104 622 H 150 V 582 H 220 V 710 H 262 V 790 H 150 V 754 H 104 Z",
  backing: "M 118 568 H 948 V 606 H 1078 V 786 H 968 V 838 H 118 Z",
  panel: "M 194 614 H 1072 V 760 H 238 V 736 H 194 Z",
  strip: "M 262 770 H 970 V 830 H 262 Z",
  lock: "M 1082 604 H 1248 V 772 H 1082 Z",
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

const FramedPath = ({d, fill}: {d: string; fill: string}) => (
  <>
    <path d={d} fill={fill} stroke={PALETTE.ivory} strokeWidth={GEOMETRY.keyline} strokeLinejoin="round" />
    <path d={d} fill={fill} stroke={PALETTE.ink} strokeWidth={GEOMETRY.border} strokeLinejoin="round" />
  </>
);

export const NeoBrutalismSplitLevelCard = () => {
  const frame = useCurrentFrame();

  const anchorIn = progress(frame, 0, 19);
  const anchorOut = progress(frame, 284, 295, EASE_IN);
  const anchorVisible = anchorIn * (1 - anchorOut);
  const anchorMaskY = interpolate(anchorIn, [0, 0.5, 1], [762, 702, 558], {
    easing: EASE_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const backingIn = progress(frame, 12, 37);
  const backingOut = progress(frame, 270, 289, EASE_IN);
  const backingVisible = backingIn * (1 - backingOut);

  const panelIn = progress(frame, 24, 49);
  const panelOut = progress(frame, 262, 285, EASE_IN);
  const panelVisible = panelIn * (1 - panelOut);
  const panelLock = progress(frame, 48, 69);

  const stripIn = progress(frame, 38, 59);
  const stripOut = progress(frame, 250, 271, EASE_IN);
  const stripVisible = stripIn * (1 - stripOut);

  const lockIn = progress(frame, 48, 69);
  const lockOut = progress(frame, 240, 255, EASE_IN);
  const lockVisible = lockIn * (1 - lockOut);

  const lockRecoil = peak(frame, 63, 65, 69, 4);
  const systemResponse = peak(frame, 63, 65, 69, 2);
  const backingX = -120 * (1 - backingIn) - 1130 * backingOut + systemResponse;
  const panelX = -130 * (1 - panelIn) - 1120 * panelOut - 6 * (1 - panelLock);
  const stripX = -70 * (1 - stripIn) - 990 * stripOut + systemResponse;
  const stripY = 30 * (1 - stripIn) + 92 * stripOut;
  const lockX = 70 * (1 - lockIn) + 170 * lockOut - lockRecoil;

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
        <clipPath id="split-anchor-mask">
          <rect x="80" y={anchorMaskY} width="220" height="260" />
        </clipPath>
        <clipPath id="split-backing-mask">
          <rect x="106" y="546" width={1000 * backingIn} height="320" />
        </clipPath>
        <clipPath id="split-panel-mask">
          <rect x="182" y="596" width={910 * panelIn} height="186" />
        </clipPath>
        <clipPath id="split-strip-mask">
          <rect x="250" y="752" width={750 * stripIn} height="98" />
        </clipPath>
        <clipPath id="split-lock-mask">
          <rect x="1068" y="590" width={200 * lockIn} height="200" />
        </clipPath>
      </defs>

      {backingVisible > 0.001 ? (
        <g clipPath="url(#split-backing-mask)" transform={`translate(${backingX} 0)`}>
          <FramedPath d={GEOMETRY.backing} fill={PALETTE.lavender} />
        </g>
      ) : null}

      {stripVisible > 0.001 ? (
        <g clipPath="url(#split-strip-mask)" transform={`translate(${stripX} ${stripY})`}>
          <FramedPath d={GEOMETRY.strip} fill={PALETTE.ivory} />
        </g>
      ) : null}

      {panelVisible > 0.001 ? (
        <g clipPath="url(#split-panel-mask)" transform={`translate(${panelX} 0)`}>
          <FramedPath d={GEOMETRY.panel} fill={PALETTE.yellow} />
        </g>
      ) : null}

      {lockVisible > 0.001 ? (
        <g clipPath="url(#split-lock-mask)" transform={`translate(${lockX} 0)`}>
          <FramedPath d={GEOMETRY.lock} fill={PALETTE.coral} />
        </g>
      ) : null}

      {anchorVisible > 0.001 ? (
        <g clipPath="url(#split-anchor-mask)">
          <FramedPath d={GEOMETRY.anchor} fill={PALETTE.cobalt} />
        </g>
      ) : null}
    </svg>
  );
};
