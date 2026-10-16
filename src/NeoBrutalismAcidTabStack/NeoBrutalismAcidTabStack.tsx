import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_ACID_TAB_STACK_WIDTH = 3840;
export const NEO_BRUTALISM_ACID_TAB_STACK_HEIGHT = 2160;
export const NEO_BRUTALISM_ACID_TAB_STACK_FPS = 30;
export const NEO_BRUTALISM_ACID_TAB_STACK_DURATION = 300;

const PALETTE = {
  background: "#000000",
  yellow: "#F7E500",
  coral: "#FA5965",
  lavender: "#A77AF4",
  ivory: "#F4EDE0",
  ink: "#080808",
} as const;

const GEOMETRY = {
  leftStrip: {x: 104, y: 660, width: 72, height: 190},
  panel: {x: 176, y: 660, width: 955, height: 190},
  lowerStrip: {x: 104, y: 865, width: 650, height: 65},
  tab: {x: 180, y: 590, width: 70, height: 54},
  mainBackingOffset: {x: 22, y: 25},
  lowerBackingOffset: {x: 18, y: 25},
  border: 9,
  holeX: 140,
  holeYs: [705, 760, 815],
  holeRadius: 18,
} as const;

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

const progress = (frame: number, start: number, end: number, easing = EASE_OUT) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const press = (frame: number, start: number, peak: number, end: number) => {
  const down = progress(frame, start, peak, EASE_IN);
  const release = progress(frame, peak, end, EASE_OUT);
  return down * (1 - release);
};

const Rectangle = ({
  x,
  y,
  width,
  height,
  fill,
  stroke = PALETTE.ink,
  strokeWidth = GEOMETRY.border,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    shapeRendering="geometricPrecision"
  />
);

export const NeoBrutalismAcidTabStack = () => {
  const frame = useCurrentFrame();

  const tabArrival = progress(frame, 0, 11, EASE_OUT);
  const tabSettle = progress(frame, 11, 16, EASE_IN_OUT);
  const tabExit = progress(frame, 282, 293, EASE_IN);
  const tabY =
    GEOMETRY.tab.y - 35 * (1 - tabArrival) + 5 * (1 - tabSettle) - 35 * tabExit;
  const tabOpacity = frame === 0 || frame >= 294 ? 0 : 1;

  const stripIn = progress(frame, 8, 25, EASE_OUT);
  const stripOut = progress(frame, 282, 293, EASE_IN);
  const stripHeight = GEOMETRY.leftStrip.height * stripIn * (1 - stripOut);

  const panelIn = progress(frame, 20, 45, EASE_OUT);
  const panelOut = progress(frame, 260, 283, EASE_IN);
  const panelWidth = GEOMETRY.panel.width * panelIn * (1 - panelOut);
  const panelRecoil = 8 * press(frame, 40, 45, 51);

  const mainBackingIn = progress(frame, 30, 51, EASE_OUT);
  const mainBackingOut = progress(frame, 260, 274, EASE_IN);
  const mainBackingOffset = mainBackingIn * (1 - mainBackingOut);

  const lowerIn = progress(frame, 40, 63, EASE_OUT);
  const lowerOut = progress(frame, 248, 269, EASE_IN);
  const lowerTravel = lowerIn * (1 - lowerOut);
  const lowerY = 805 + 60 * lowerTravel;
  const lowerX = GEOMETRY.lowerStrip.x + 10 * press(frame, 55, 59, 63);
  const lowerVisible = lowerTravel > 0 && frame < 269;

  const lowerBackingIn = progress(frame, 43, 66, EASE_OUT);
  const lowerBackingOut = progress(frame, 248, 266, EASE_IN);
  const lowerBackingTravel = lowerBackingIn * (1 - lowerBackingOut);
  const lowerBackingY = 805 + 60 * lowerBackingTravel;

  const compression = 3 * press(frame, 64, 67, 71);
  const mainVisible = panelWidth > 0.01;
  const backingVisible = mainBackingOffset > 0.001;

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
        <clipPath id="acid-tab-clip">
          <rect x={160} y={535} width={112} height={118} />
        </clipPath>
        <clipPath id="acid-strip-clip">
          <rect
            x={GEOMETRY.leftStrip.x - GEOMETRY.border}
            y={GEOMETRY.leftStrip.y - GEOMETRY.border}
            width={GEOMETRY.leftStrip.width + GEOMETRY.border * 2}
            height={stripHeight + GEOMETRY.border}
          />
        </clipPath>
        <clipPath id="acid-panel-clip">
          <rect
            x={GEOMETRY.panel.x - GEOMETRY.border}
            y={GEOMETRY.panel.y - GEOMETRY.border}
            width={panelWidth + GEOMETRY.border}
            height={GEOMETRY.panel.height + GEOMETRY.border * 2}
          />
        </clipPath>
      </defs>

      <g transform={`translate(0 ${compression})`}>
        {lowerBackingTravel > 0.001 ? (
          <Rectangle
            x={
              GEOMETRY.lowerStrip.x +
              GEOMETRY.lowerBackingOffset.x * lowerBackingTravel
            }
            y={lowerBackingY + GEOMETRY.lowerBackingOffset.y * lowerBackingTravel}
            width={GEOMETRY.lowerStrip.width}
            height={GEOMETRY.lowerStrip.height}
            fill={PALETTE.ivory}
            stroke={PALETTE.ink}
          />
        ) : null}

        {lowerVisible ? (
          <Rectangle
            x={lowerX}
            y={lowerY}
            width={GEOMETRY.lowerStrip.width}
            height={GEOMETRY.lowerStrip.height}
            fill={PALETTE.lavender}
          />
        ) : null}

        {backingVisible ? (
          <Rectangle
            x={GEOMETRY.panel.x + GEOMETRY.mainBackingOffset.x * mainBackingOffset}
            y={GEOMETRY.panel.y + GEOMETRY.mainBackingOffset.y * mainBackingOffset}
            width={GEOMETRY.panel.width}
            height={GEOMETRY.panel.height}
            fill={PALETTE.ivory}
          />
        ) : null}

        {stripHeight > 0.001 ? (
          <g clipPath="url(#acid-strip-clip)">
            <Rectangle
              x={GEOMETRY.leftStrip.x}
              y={GEOMETRY.leftStrip.y}
              width={GEOMETRY.leftStrip.width}
              height={GEOMETRY.leftStrip.height}
              fill={PALETTE.yellow}
            />
            {GEOMETRY.holeYs.map((cy) => (
              <circle
                key={cy}
                cx={GEOMETRY.holeX}
                cy={cy}
                r={GEOMETRY.holeRadius}
                fill={PALETTE.background}
              />
            ))}
          </g>
        ) : null}

        {mainVisible ? (
          <g clipPath="url(#acid-panel-clip)" transform={`translate(${panelRecoil} 0)`}>
            <Rectangle
              x={GEOMETRY.panel.x}
              y={GEOMETRY.panel.y}
              width={GEOMETRY.panel.width}
              height={GEOMETRY.panel.height}
              fill={PALETTE.yellow}
            />
          </g>
        ) : null}

        {tabOpacity > 0 ? (
          <g clipPath="url(#acid-tab-clip)" opacity={tabOpacity}>
            <Rectangle
              x={GEOMETRY.tab.x}
              y={tabY}
              width={GEOMETRY.tab.width}
              height={GEOMETRY.tab.height}
              fill={PALETTE.coral}
            />
          </g>
        ) : null}
      </g>
    </svg>
  );
};
