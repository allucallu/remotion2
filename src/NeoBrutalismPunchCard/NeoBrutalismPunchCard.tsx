import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_PUNCH_CARD_WIDTH = 3840;
export const NEO_BRUTALISM_PUNCH_CARD_HEIGHT = 2160;
export const NEO_BRUTALISM_PUNCH_CARD_FPS = 30;
export const NEO_BRUTALISM_PUNCH_CARD_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F6F0E2",
  ink: "#101010",
  blue: "#1746EF",
  pink: "#F32987",
  yellow: "#E6F500",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ENTER_EASING = Easing.bezier(0.18, 0.82, 0.24, 1);
const EXIT_EASING = Easing.bezier(0.6, 0, 0.82, 0.28);

const progress = (frame: number, start: number, end: number, easing = ENTER_EASING) =>
  interpolate(frame, [start, end], [0, 1], {...CLAMP, easing});

const reveal = (frame: number, start: number, end: number, outStart: number, outEnd: number) =>
  progress(frame, start, end) * (1 - progress(frame, outStart, outEnd, EXIT_EASING));

const pressing = (frame: number, start: number, peak: number, end: number) => {
  const down = progress(frame, start, peak);
  const release = progress(frame, peak, end, EXIT_EASING);
  return down * (1 - release);
};

export const NeoBrutalismPunchCard = () => {
  const frame = useCurrentFrame();
  const button = reveal(frame, 0, 13, 282, 291);
  const buttonPress = pressing(frame, 14, 18, 23) + pressing(frame, 282, 286, 291) * 0.55;
  const backing = reveal(frame, 20, 43, 265, 283);
  const panelIn = progress(frame, 26, 45);
  const panelKick = progress(frame, 45, 51);
  const panelSettle = progress(frame, 51, 57, EXIT_EASING);
  const panelOut = progress(frame, 260, 283, EXIT_EASING);
  const stripIn = progress(frame, 40, 55);
  const stripRecoil = progress(frame, 55, 61, EXIT_EASING);
  const stripOut = progress(frame, 248, 269, EXIT_EASING);
  const star = reveal(frame, 56, 69, 240, 253);

  const buttonRadius = 154 * button;
  const buttonX = 270 + 8 * buttonPress;
  const buttonY = 814 + 5 * buttonPress;
  const buttonRx = buttonRadius * (1 + 0.04 * buttonPress);
  const buttonRy = buttonRadius * (1 - 0.04 * buttonPress);
  const backingX = -1040 * (1 - backing);
  const panelX = -1040 * (1 - panelIn) + 10 * panelKick * (1 - panelSettle) - 1040 * panelOut;
  const stripX = -940 * (1 - stripIn) + 6 * stripRecoil - 940 * stripOut;
  const starRadius = 48 * star;

  return (
    <svg
      width={NEO_BRUTALISM_PUNCH_CARD_WIDTH}
      height={NEO_BRUTALISM_PUNCH_CARD_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <defs>
        <clipPath id="punch-backing-mask"><rect x="330" y="700" width="1100" height="230" /></clipPath>
        <clipPath id="punch-panel-mask"><rect x="330" y="675" width="1075" height="225" /></clipPath>
        <clipPath id="punch-strip-mask"><rect x="330" y="885" width="710" height="100" /></clipPath>
        <clipPath id="punch-button-mask"><circle cx="270" cy="814" r={buttonRadius} /></clipPath>
        <clipPath id="punch-star-mask"><circle cx="1440" cy="685" r={starRadius} /></clipPath>
      </defs>

      {backing > 0 ? (
        <g clipPath="url(#punch-backing-mask)" transform={`translate(${backingX} 0)`}>
          <path d="M 340 730 H 1320 L 1385 790 V 915 H 340 Z" fill={PALETTE.pink} />
        </g>
      ) : null}

      {stripIn > 0 && stripOut < 1 ? (
        <g clipPath="url(#punch-strip-mask)" transform={`translate(${stripX} 0)`}>
          <path d="M 340 890 H 1115 V 932 L 1075 972 H 340 L 315 945 Z" fill={PALETTE.ivory} />
          <path d="M 352 901 H 1102 V 930 L 1067 960 H 352 L 330 943 Z" fill={PALETTE.yellow} />
        </g>
      ) : null}

      {panelIn > 0 && panelOut < 1 ? (
        <g clipPath="url(#punch-panel-mask)" transform={`translate(${panelX} 0)`}>
          <path
            d="M 340 690 H 1325 L 1380 745 V 865 H 340 Z"
            fill={PALETTE.ivory}
            stroke={PALETTE.ink}
            strokeWidth="9"
            strokeLinejoin="round"
          />
        </g>
      ) : null}

      {star > 0 ? (
        <g clipPath="url(#punch-star-mask)" transform={`rotate(${-25 * (1 - star)} 1440 685)`}>
          <path d="M 1440 632 L 1452 673 L 1493 685 L 1452 697 L 1440 738 L 1428 697 L 1387 685 L 1428 673 Z" fill={PALETTE.ivory} />
        </g>
      ) : null}

      {button > 0 ? (
        <g clipPath="url(#punch-button-mask)">
          <ellipse cx={buttonX} cy={buttonY} rx={buttonRx} ry={buttonRy} fill={PALETTE.ivory} />
          <ellipse cx={buttonX} cy={buttonY} rx={Math.max(0, buttonRx - 11)} ry={Math.max(0, buttonRy - 11)} fill={PALETTE.ink} />
          <ellipse cx={buttonX} cy={buttonY} rx={Math.max(0, buttonRx - 20)} ry={Math.max(0, buttonRy - 20)} fill={PALETTE.blue} />
        </g>
      ) : null}
    </svg>
  );
};
