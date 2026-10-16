import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_SERRATED_TICKET_WIDTH = 3840;
export const NEO_BRUTALISM_SERRATED_TICKET_HEIGHT = 2160;
export const NEO_BRUTALISM_SERRATED_TICKET_FPS = 30;
export const NEO_BRUTALISM_SERRATED_TICKET_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ink: "#080808",
  ivory: "#F6F0E4",
  coral: "#FA665A",
  lavender: "#A978EE",
  yellow: "#EDF12A",
} as const;

const GEOMETRY = {
  border: 10,
  ivoryKeyline: 9,
  box: {x: 86, width: 112, height: 82},
  topBoxY: 614,
  bottomBoxY: 714,
  backingPath:
    "M 170 578 H 1195 L 1232 615 V 812 H 1058 V 856 H 170 Z",
  coralPath:
    "M 176 610 H 1162 V 638 L 1134 666 L 1162 694 L 1134 722 L 1162 750 L 1134 778 L 1162 806 H 176 Z",
  tabPath: "M 177 560 H 365 L 405 610 H 177 Z",
  stripPath: "M 178 787 H 1032 V 848 H 178 Z",
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
    <path
      d={d}
      fill={fill}
      stroke={PALETTE.ivory}
      strokeWidth={GEOMETRY.ivoryKeyline * 2}
      strokeLinejoin="round"
    />
    <path
      d={d}
      fill={fill}
      stroke={PALETTE.ink}
      strokeWidth={GEOMETRY.border}
      strokeLinejoin="round"
    />
  </>
);

export const NeoBrutalismSerratedTicket = () => {
  const frame = useCurrentFrame();

  const topBoxIn = progress(frame, 0, 17);
  const topBoxOut = progress(frame, 284, 295, EASE_IN);
  const topBoxVisible = topBoxIn * (1 - topBoxOut);
  const topBoxY = -18 * (1 - topBoxIn) + 18 * topBoxOut + peak(frame, 13, 15, 17, 3);

  const bottomBoxIn = progress(frame, 4, 21);
  const bottomBoxOut = progress(frame, 284, 295, EASE_IN);
  const bottomBoxVisible = bottomBoxIn * (1 - bottomBoxOut);
  const bottomBoxY = 18 * (1 - bottomBoxIn) - 18 * bottomBoxOut - peak(frame, 17, 19, 21, 3);

  const tabIn = progress(frame, 14, 31);
  const tabOut = progress(frame, 264, 287, EASE_IN);
  const tabVisible = tabIn * (1 - tabOut);

  const panelIn = progress(frame, 24, 53);
  const panelOut = progress(frame, 264, 287, EASE_IN);
  const panelVisible = panelIn * (1 - panelOut);
  const panelX = -104 * (1 - panelIn) + 104 * panelOut;
  const panelImpactY = peak(frame, 67, 69, 71, -2);

  const backingIn = progress(frame, 40, 61);
  const backingOut = progress(frame, 252, 269, EASE_IN);
  const backingVisible = backingIn * (1 - backingOut);
  const backingX = -76 * (1 - backingIn) + 76 * backingOut + 14 * backingIn * (1 - backingOut);
  const backingY = 12 * backingIn * (1 - backingOut);

  const stripIn = progress(frame, 50, 71);
  const stripOut = progress(frame, 240, 259, EASE_IN);
  const stripVisible = stripIn * (1 - stripOut);
  const stripX = -102 * (1 - stripIn) + 102 * stripOut + peak(frame, 65, 67, 71, 6);

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
        <clipPath id="serrated-backing-mask">
          <rect x="160" y="545" width={1100 * backingVisible} height="340" />
        </clipPath>
        <clipPath id="serrated-panel-mask">
          <rect x="168" y="540" width={1032 * panelVisible} height="290" />
        </clipPath>
        <clipPath id="serrated-tab-mask">
          <rect x="168" y={610 - 58 * tabVisible} width="250" height={70 * tabVisible} />
        </clipPath>
        <clipPath id="serrated-strip-mask">
          <rect x="168" y="776" width={880 * stripVisible} height="86" />
        </clipPath>
        <clipPath id="serrated-top-box-mask">
          <rect x="75" y={GEOMETRY.topBoxY - 28} width="136" height={118 * topBoxVisible} />
        </clipPath>
        <clipPath id="serrated-bottom-box-mask">
          <rect
            x="75"
            y={GEOMETRY.bottomBoxY + GEOMETRY.box.height + 28 - 118 * bottomBoxVisible}
            width="136"
            height={118 * bottomBoxVisible}
          />
        </clipPath>
      </defs>

      {backingVisible > 0.001 ? (
        <g
          clipPath="url(#serrated-backing-mask)"
          transform={`translate(${backingX} ${backingY})`}
        >
          <path
            d={GEOMETRY.backingPath}
            fill={PALETTE.ivory}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
            strokeLinejoin="round"
          />
        </g>
      ) : null}

      {stripVisible > 0.001 ? (
        <g clipPath="url(#serrated-strip-mask)" transform={`translate(${stripX} 0)`}>
          <FramedPath d={GEOMETRY.stripPath} fill={PALETTE.yellow} />
        </g>
      ) : null}

      {tabVisible > 0.001 ? (
        <g
          clipPath="url(#serrated-tab-mask)"
          transform={`translate(${panelX} ${panelImpactY})`}
        >
          <FramedPath d={GEOMETRY.tabPath} fill={PALETTE.lavender} />
        </g>
      ) : null}

      {panelVisible > 0.001 ? (
        <g
          clipPath="url(#serrated-panel-mask)"
          transform={`translate(${panelX} ${panelImpactY})`}
        >
          <FramedPath d={GEOMETRY.coralPath} fill={PALETTE.coral} />
        </g>
      ) : null}

      {topBoxVisible > 0.001 ? (
        <g clipPath="url(#serrated-top-box-mask)" transform={`translate(0 ${topBoxY})`}>
          <rect
            x={GEOMETRY.box.x}
            y={GEOMETRY.topBoxY}
            width={GEOMETRY.box.width}
            height={GEOMETRY.box.height}
            fill={PALETTE.ivory}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
          />
        </g>
      ) : null}

      {bottomBoxVisible > 0.001 ? (
        <g clipPath="url(#serrated-bottom-box-mask)" transform={`translate(0 ${bottomBoxY})`}>
          <rect
            x={GEOMETRY.box.x}
            y={GEOMETRY.bottomBoxY}
            width={GEOMETRY.box.width}
            height={GEOMETRY.box.height}
            fill={PALETTE.ivory}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
          />
        </g>
      ) : null}
    </svg>
  );
};
