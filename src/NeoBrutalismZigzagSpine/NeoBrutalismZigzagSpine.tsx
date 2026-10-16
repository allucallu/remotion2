import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_ZIGZAG_SPINE_WIDTH = 3840;
export const NEO_BRUTALISM_ZIGZAG_SPINE_HEIGHT = 2160;
export const NEO_BRUTALISM_ZIGZAG_SPINE_FPS = 30;
export const NEO_BRUTALISM_ZIGZAG_SPINE_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ink: "#080808",
  coral: "#FA6559",
  lavender: "#B293F2",
  ivory: "#F6F0E4",
  yellow: "#E7EB28",
} as const;

const GEOMETRY = {
  border: 9,
  coralPath: "M 80 562 H 196 L 222 592 L 194 625 L 222 658 L 194 691 L 222 724 L 194 756 H 144 V 786 H 80 Z",
  panelPath: "M 221 562 H 1238 V 760 H 221 L 195 726 L 223 693 L 195 660 L 223 627 L 195 594 Z",
  backing: {x: 202, y: 548, width: 1065, height: 238},
  bottomStrip: {x: 153, y: 764, width: 940, height: 61},
  tab: {x: 900, y: 524, width: 316, height: 32},
  slash: [
    "1100,744 1126,744 1171,657 1145,657",
    "1148,744 1174,744 1219,657 1193,657",
  ],
} as const;

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

const progress = (frame: number, start: number, end: number, easing = EASE_OUT) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const recoil = (frame: number, start: number, peak: number, end: number, amount: number) =>
  interpolate(frame, [start, peak, end], [0, amount, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const NeoBrutalismZigzagSpine = () => {
  const frame = useCurrentFrame();
  const coralIn = progress(frame, 0, 17);
  const coralOut = progress(frame, 288, 295, EASE_IN);
  const coralVisible = coralIn * (1 - coralOut);

  const backingIn = progress(frame, 12, 39);
  const backingOut = progress(frame, 272, 289, EASE_IN);
  const backingWidth = GEOMETRY.backing.width * backingIn * (1 - backingOut);

  const panelIn = progress(frame, 22, 49);
  const panelOut = progress(frame, 272, 289, EASE_IN);
  const panelRecoil = recoil(frame, 43, 46, 49, 4) - recoil(frame, 260, 265, 271, 4);
  const panelX = 90 * (1 - panelIn) + 90 * panelOut - panelRecoil;
  const panelMaskWidth = 1045 * panelIn * (1 - panelOut);
  const coralReaction = -recoil(frame, 43, 46, 49, 2);

  const stripIn = progress(frame, 40, 61);
  const stripOut = progress(frame, 248, 265, EASE_IN);
  const stripWidth = GEOMETRY.bottomStrip.width * stripIn * (1 - stripOut);

  const tabIn = progress(frame, 50, 67);
  const tabOut = progress(frame, 248, 265, EASE_IN);
  const tabY = 30 * (1 - tabIn) + 30 * tabOut + recoil(frame, 61, 64, 67, 3);

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
        <clipPath id="zigzag-coral-reveal">
          <rect x="65" y={674 - 120 * coralVisible} width="180" height={240 * coralVisible} />
        </clipPath>
        <clipPath id="zigzag-backing-reveal">
          <rect x={GEOMETRY.backing.x} y="532" width={backingWidth} height="275" />
        </clipPath>
        <clipPath id="zigzag-panel-reveal">
          <rect x="185" y="545" width={panelMaskWidth} height="235" />
        </clipPath>
        <clipPath id="zigzag-strip-reveal">
          <rect x={GEOMETRY.bottomStrip.x} y="748" width={stripWidth} height="95" />
        </clipPath>
        <clipPath id="zigzag-tab-reveal">
          <rect x={GEOMETRY.tab.x} y="500" width={GEOMETRY.tab.width} height={40 * tabIn * (1 - tabOut)} />
        </clipPath>
      </defs>

      {backingWidth > 0.1 ? (
        <g clipPath="url(#zigzag-backing-reveal)">
          <path
            d={`M ${GEOMETRY.backing.x} ${GEOMETRY.backing.y} H ${GEOMETRY.backing.x + GEOMETRY.backing.width} V ${GEOMETRY.backing.y + GEOMETRY.backing.height} H ${GEOMETRY.backing.x} Z`}
            fill={PALETTE.ivory}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
          />
        </g>
      ) : null}

      {stripWidth > 0.1 ? (
        <g clipPath="url(#zigzag-strip-reveal)">
          <rect
            x={GEOMETRY.bottomStrip.x}
            y={GEOMETRY.bottomStrip.y}
            width={GEOMETRY.bottomStrip.width}
            height={GEOMETRY.bottomStrip.height}
            fill={PALETTE.ivory}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
          />
        </g>
      ) : null}

      {coralVisible > 0.001 ? (
        <g clipPath="url(#zigzag-coral-reveal)" transform={`translate(${coralReaction} 0)`}>
          <path
            d={GEOMETRY.coralPath}
            fill={PALETTE.coral}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
            strokeLinejoin="miter"
          />
        </g>
      ) : null}

      {panelMaskWidth > 0.1 ? (
        <g clipPath="url(#zigzag-panel-reveal)" transform={`translate(${panelX} 0)`}>
          <path
            d={GEOMETRY.panelPath}
            fill={PALETTE.lavender}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
            strokeLinejoin="miter"
          />
        </g>
      ) : null}

      {tabIn * (1 - tabOut) > 0.001 ? (
        <g clipPath="url(#zigzag-tab-reveal)" transform={`translate(0 ${tabY})`}>
          <rect
            x={GEOMETRY.tab.x}
            y={GEOMETRY.tab.y}
            width={GEOMETRY.tab.width}
            height={GEOMETRY.tab.height}
            fill={PALETTE.yellow}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
          />
        </g>
      ) : null}

      {GEOMETRY.slash.map((points, index) => {
        const slashIn = progress(frame, 58 + index * 7, 66 + index * 7);
        const slashOut = progress(frame, 240 + index * 5, 253 + index * 5, EASE_IN);
        const visible = slashIn * (1 - slashOut);
        if (visible <= 0.001) return null;
        const clipWidth = 85 * visible;
        return (
          <g key={points} transform={`translate(${panelX} 0)`}>
            <clipPath id={`zigzag-slash-${index}`}>
              <rect x={1090 + index * 48} y="645" width={clipWidth} height="115" />
            </clipPath>
            <polygon points={points} fill={PALETTE.ink} clipPath={`url(#zigzag-slash-${index})`} />
          </g>
        );
      })}
    </svg>
  );
};
