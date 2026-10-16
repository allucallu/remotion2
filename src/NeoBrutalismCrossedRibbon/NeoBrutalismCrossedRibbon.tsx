import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_CROSSED_RIBBON_WIDTH = 3840;
export const NEO_BRUTALISM_CROSSED_RIBBON_HEIGHT = 2160;
export const NEO_BRUTALISM_CROSSED_RIBBON_FPS = 30;
export const NEO_BRUTALISM_CROSSED_RIBBON_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ink: "#080808",
  ivory: "#F6F0E4",
  lavender: "#AA87F4",
  coral: "#FA665A",
  yellow: "#EDF12A",
} as const;

const GEOMETRY = {
  outlineOuter: 22,
  outlineInner: 10,
  ribbon: {x: 118, y: 548, width: 1250, height: 160, angle: 14},
  panel: {x: 184, y: 626, width: 1014, height: 150},
  strip: {x: 222, y: 775, width: 848, height: 86},
  badge: {x: 66, y: 636, width: 150, height: 150},
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

const framedRect = (x: number, y: number, width: number, height: number, fill: string) => (
  <>
    <rect x={x} y={y} width={width} height={height} fill={fill} stroke={PALETTE.ivory} strokeWidth={GEOMETRY.outlineOuter} />
    <rect x={x} y={y} width={width} height={height} fill={fill} stroke={PALETTE.ink} strokeWidth={GEOMETRY.outlineInner} />
  </>
);

export const NeoBrutalismCrossedRibbon = () => {
  const frame = useCurrentFrame();

  const ribbonIn = progress(frame, 0, 25);
  const ribbonOut = progress(frame, 268, 293, EASE_IN);
  const ribbonVisible = ribbonIn * (1 - ribbonOut);
  const ribbonTension = peak(frame, 60, 66, 73, 0.005);

  const panelIn = progress(frame, 18, 45);
  const panelOut = progress(frame, 250, 271, EASE_IN);
  const panelVisible = panelIn * (1 - panelOut);

  const stripIn = progress(frame, 32, 55);
  const stripOut = progress(frame, 250, 271, EASE_IN);
  const stripVisible = stripIn * (1 - stripOut);
  const stripY = 22 * (1 - stripIn) - 22 * stripOut;

  const badgeIn = progress(frame, 44, 65);
  const badgeOut = progress(frame, 240, 257, EASE_IN);
  const badgeVisible = badgeIn * (1 - badgeOut);
  const badgeX = -68 * (1 - badgeIn) - 68 * badgeOut + peak(frame, 58, 60, 65, 5);
  const badgeRotation = -6 * (1 - badgeIn) + 6 * badgeOut;
  const impactShift = peak(frame, 58, 60, 65, 2);

  const ribbonTransform = `translate(${GEOMETRY.ribbon.x} ${GEOMETRY.ribbon.y}) rotate(${GEOMETRY.ribbon.angle}) scale(${1 + ribbonTension} 1)`;
  const ribbonPath = `M 0 0 H ${GEOMETRY.ribbon.width} V ${GEOMETRY.ribbon.height} H 0 L 36 80 Z`;

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
        <clipPath id="crossed-ribbon-mask">
          <rect
            x={-12}
            y={-12}
            width={(GEOMETRY.ribbon.width + 24) * ribbonVisible}
            height={GEOMETRY.ribbon.height + 24}
          />
        </clipPath>
        <clipPath id="crossed-panel-mask">
          <rect x={GEOMETRY.panel.x} y={GEOMETRY.panel.y - 16} width={GEOMETRY.panel.width * panelVisible} height={GEOMETRY.panel.height + 32} />
        </clipPath>
        <clipPath id="crossed-strip-mask">
          <rect x={GEOMETRY.strip.x - 12} y={GEOMETRY.strip.y - 36} width={GEOMETRY.strip.width + 24} height={(GEOMETRY.strip.height + 44) * stripVisible} />
        </clipPath>
        <clipPath id="crossed-badge-mask">
          <rect x={GEOMETRY.badge.x - 16} y={GEOMETRY.badge.y - 16} width={(GEOMETRY.badge.width + 32) * badgeVisible} height={GEOMETRY.badge.height + 32} />
        </clipPath>
      </defs>

      {ribbonVisible > 0.001 ? (
        <g clipPath="url(#crossed-ribbon-mask)" transform={ribbonTransform}>
          <path d={ribbonPath} fill={PALETTE.coral} stroke={PALETTE.ivory} strokeWidth={GEOMETRY.outlineOuter} strokeLinejoin="round" />
          <path d={ribbonPath} fill={PALETTE.coral} stroke={PALETTE.ink} strokeWidth={GEOMETRY.outlineInner} strokeLinejoin="round" />
        </g>
      ) : null}

      {stripVisible > 0.001 ? (
        <g clipPath="url(#crossed-strip-mask)" transform={`translate(${impactShift} ${stripY})`}>
          {framedRect(GEOMETRY.strip.x, GEOMETRY.strip.y, GEOMETRY.strip.width, GEOMETRY.strip.height, PALETTE.ivory)}
        </g>
      ) : null}

      {panelVisible > 0.001 ? (
        <g clipPath="url(#crossed-panel-mask)" transform={`translate(${impactShift} 0)`}>
          {framedRect(GEOMETRY.panel.x, GEOMETRY.panel.y, GEOMETRY.panel.width, GEOMETRY.panel.height, PALETTE.lavender)}
        </g>
      ) : null}

      {badgeVisible > 0.001 ? (
        <g clipPath="url(#crossed-badge-mask)" transform={`translate(${badgeX} 0) rotate(${badgeRotation} ${GEOMETRY.badge.x + GEOMETRY.badge.width / 2} ${GEOMETRY.badge.y + GEOMETRY.badge.height / 2})`}>
          {framedRect(GEOMETRY.badge.x, GEOMETRY.badge.y, GEOMETRY.badge.width, GEOMETRY.badge.height, PALETTE.yellow)}
        </g>
      ) : null}
    </svg>
  );
};
