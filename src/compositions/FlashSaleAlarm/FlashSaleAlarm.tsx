import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const theme = {
  colors: {
    background: "#000000",
    cream: "#FFF1CE",
    yellow: "#FFD21A",
    orange: "#FF8613",
    magenta: "#F90070",
    purple: "#571098",
    purpleDark: "#27085E",
  },
  font: '"Arial Black", Impact, sans-serif',
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
  },
} as const;

const range = (
  frame: number,
  start: number,
  end: number,
  easing: (value: number) => number = theme.ease.inOut,
) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const PanelPath: React.FC<{
  d: string;
  fill: string;
}> = ({ d, fill }) => (
  <g strokeLinejoin="round">
    <path d={d} fill={fill} stroke={theme.colors.cream} strokeWidth={30} />
    <path d={d} fill={fill} stroke={theme.colors.purpleDark} strokeWidth={16} />
  </g>
);

const yellowPanelPath =
  "M 575 295 L 1607 145 L 1573 217 L 1771 179 L 1650 381 L 1800 351 L 1684 555 L 1760 563 L 1605 804 L 590 754 Z";
const magentaPanelPath =
  "M 598 330 L 1780 190 L 1655 391 L 1814 353 L 1680 574 L 1760 575 L 1634 772 L 606 738 Z";

const Panel: React.FC<{ yellowProgress: number; magentaProgress: number }> = ({
  yellowProgress,
  magentaProgress,
}) => (
  <g aria-label="layered lightning sale panel">
    <g clipPath="url(#yellow-panel-window)">
      <g transform={`translate(${-30 * (1 - yellowProgress)} 0)`}>
        <PanelPath d={yellowPanelPath} fill={theme.colors.yellow} />
      </g>
    </g>
    <g clipPath="url(#magenta-panel-window)">
      <g transform={`translate(${-30 * (1 - magentaProgress)} 0)`}>
        <PanelPath d={magentaPanelPath} fill={theme.colors.magenta} />
      </g>
    </g>
  </g>
);

const SaleText: React.FC<{
  flashProgress: number;
  saleProgress: number;
}> = ({ flashProgress, saleProgress }) => {
  const shared = {
    fontFamily: theme.font,
    fontStyle: "italic",
    fontWeight: 900,
    letterSpacing: -10,
    paintOrder: "stroke fill" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <g aria-label="FLASH SALE text">
      <g clipPath="url(#flash-reveal)">
        <g transform={`translate(${18 * (1 - flashProgress)} 0)`}>
          <text
            x={796}
            y={515}
            fontSize={228}
            fill={theme.colors.purpleDark}
            stroke={theme.colors.purpleDark}
            strokeWidth={13}
            {...shared}
            transform="translate(18 24)"
          >
            FLASH
          </text>
          <text
            x={796}
            y={515}
            fontSize={228}
            fill={theme.colors.cream}
            stroke={theme.colors.purpleDark}
            strokeWidth={8}
            {...shared}
          >
            FLASH
          </text>
        </g>
      </g>
      <g clipPath="url(#sale-reveal)">
        <g transform={`translate(${18 * (1 - saleProgress)} 0)`}>
          <text
            x={865}
            y={704}
            fontSize={218}
            fill={theme.colors.purpleDark}
            stroke={theme.colors.purpleDark}
            strokeWidth={14}
            {...shared}
            transform="translate(18 24)"
          >
            SALE
          </text>
          <text
            x={865}
            y={704}
            fontSize={218}
            fill={theme.colors.yellow}
            stroke={theme.colors.purpleDark}
            strokeWidth={8}
            {...shared}
          >
            SALE
          </text>
        </g>
      </g>
    </g>
  );
};

const Bell: React.FC<{
  x: number;
  mirror?: boolean;
  rotation: number;
}> = ({ x, mirror = false, rotation }) => (
  <g transform={`rotate(${rotation} ${x} 336)`} aria-label="alarm bell">
    <path
      d={`M ${x - 79} 318 Q ${x - 83} 226 ${x} 205 Q ${x + 83} 226 ${x + 79} 318 L ${x + 55} 347 Q ${x} 323 ${x - 55} 347 Z`}
      fill={theme.colors.purple}
      stroke={theme.colors.cream}
      strokeWidth={17}
      strokeLinejoin="round"
    />
    <path
      d={`M ${x - 72} 319 Q ${x - 76} 234 ${x} 214 Q ${x + 76} 234 ${x + 72} 319 L ${x + 53} 338 Q ${x} 317 ${x - 53} 338 Z`}
      fill={theme.colors.purple}
      stroke={theme.colors.purpleDark}
      strokeWidth={12}
      strokeLinejoin="round"
    />
    <path
      d={`M ${x - (mirror ? 48 : 28)} 247 Q ${x - (mirror ? 20 : 51)} 259 ${x - (mirror ? 10 : 43)} 281`}
      fill="none"
      stroke={theme.colors.cream}
      strokeWidth={12}
      strokeLinecap="round"
    />
    <path
      d={`M ${x - 58} 221 Q ${x - 73} 171 ${x - 28} 163 Q ${x + 3} 161 ${x + 20} 202`}
      fill={theme.colors.yellow}
      stroke={theme.colors.cream}
      strokeWidth={15}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d={`M ${x - 55} 220 Q ${x - 67} 178 ${x - 28} 172 Q ${x - 2} 172 ${x + 11} 205`}
      fill="none"
      stroke={theme.colors.purpleDark}
      strokeWidth={10}
      strokeLinecap="round"
    />
  </g>
);

const HourMarks: React.FC = () => (
  <g aria-label="hour marks">
    {Array.from({ length: 12 }, (_, index) => (
      <line
        key={index}
        x1={510}
        y1={362}
        x2={510}
        y2={391}
        stroke={theme.colors.purpleDark}
        strokeWidth={16}
        strokeLinecap="round"
        transform={`rotate(${index * 30} 510 560)`}
      />
    ))}
  </g>
);

const Clock: React.FC<{
  x: number;
  rotation: number;
  opacity: number;
  leftBellRotation: number;
  rightBellRotation: number;
  longHandRotation: number;
  shortHandRotation: number;
}> = ({
  x,
  rotation,
  opacity,
  leftBellRotation,
  rightBellRotation,
  longHandRotation,
  shortHandRotation,
}) => (
  <g
    transform={`translate(${x} 0) rotate(${rotation} 510 560)`}
    opacity={opacity}
    aria-label="alarm clock"
  >
    <g aria-label="rear handle">
      <path
        d="M 345 315 Q 510 97 683 315"
        fill="none"
        stroke={theme.colors.cream}
        strokeWidth={28}
        strokeLinecap="round"
      />
      <path
        d="M 345 315 Q 510 112 683 315"
        fill="none"
        stroke={theme.colors.purpleDark}
        strokeWidth={18}
        strokeLinecap="round"
      />
      <path
        d="M 365 310 Q 510 135 663 310"
        fill="none"
        stroke={theme.colors.purple}
        strokeWidth={10}
        strokeLinecap="round"
      />
    </g>

    <Bell x={334} rotation={leftBellRotation} />
    <Bell x={684} mirror rotation={rightBellRotation} />

    <g aria-label="clock feet">
      <path
        d="M 302 786 L 350 816 L 282 900 Q 269 916 252 904 L 230 889 Q 218 880 227 864 Z"
        fill={theme.colors.purple}
        stroke={theme.colors.cream}
        strokeWidth={18}
        strokeLinejoin="round"
      />
      <path
        d="M 663 806 L 710 775 L 790 870 Q 800 883 786 894 L 756 914 Q 742 922 731 908 Z"
        fill={theme.colors.purple}
        stroke={theme.colors.cream}
        strokeWidth={18}
        strokeLinejoin="round"
      />
      <path
        d="M 310 795 L 339 816 L 274 892 L 244 875 Z M 674 808 L 706 788 L 774 875 L 747 896 Z"
        fill={theme.colors.purple}
        stroke={theme.colors.purpleDark}
        strokeWidth={10}
        strokeLinejoin="round"
      />
    </g>

    <g aria-label="clock casing">
      <circle
        cx={510}
        cy={560}
        r={296}
        fill={theme.colors.orange}
        stroke={theme.colors.cream}
        strokeWidth={20}
      />
      <circle
        cx={510}
        cy={560}
        r={284}
        fill={theme.colors.orange}
        stroke={theme.colors.purpleDark}
        strokeWidth={12}
      />
      <circle
        cx={510}
        cy={560}
        r={260}
        fill="none"
        stroke={theme.colors.yellow}
        strokeWidth={23}
      />
      <path
        d="M 280 692 A 260 260 0 0 0 729 727"
        fill="none"
        stroke={theme.colors.yellow}
        strokeWidth={18}
        strokeLinecap="round"
      />
    </g>

    <g aria-label="clock face">
      <circle
        cx={510}
        cy={560}
        r={219}
        fill={theme.colors.cream}
        stroke={theme.colors.purpleDark}
        strokeWidth={10}
      />
      <HourMarks />
    </g>

    <g aria-label="clock hands">
      <g transform={`rotate(${shortHandRotation} 510 560)`}>
        <line
          x1={510}
          y1={560}
          x2={510}
          y2={455}
          stroke={theme.colors.purpleDark}
          strokeWidth={34}
          strokeLinecap="round"
        />
        <line
          x1={510}
          y1={560}
          x2={510}
          y2={455}
          stroke={theme.colors.orange}
          strokeWidth={20}
          strokeLinecap="round"
        />
      </g>
      <g transform={`rotate(${longHandRotation} 510 560)`}>
        <line
          x1={510}
          y1={560}
          x2={510}
          y2={397}
          stroke={theme.colors.purpleDark}
          strokeWidth={35}
          strokeLinecap="round"
        />
        <line
          x1={510}
          y1={560}
          x2={510}
          y2={397}
          stroke={theme.colors.magenta}
          strokeWidth={21}
          strokeLinecap="round"
        />
      </g>
      <circle cx={510} cy={560} r={37} fill={theme.colors.purpleDark} />
      <circle cx={510} cy={560} r={23} fill={theme.colors.yellow} />
    </g>

    <g aria-label="top button">
      <path
        d="M 468 246 V 214 H 552 V 246"
        fill="none"
        stroke={theme.colors.cream}
        strokeWidth={18}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x={465}
        y={208}
        width={90}
        height={24}
        rx={7}
        fill={theme.colors.yellow}
      />
      <rect x={497} y={229} width={27} height={23} fill={theme.colors.orange} />
    </g>
  </g>
);

const Lightning: React.FC<{ progress: number }> = ({ progress }) => (
  <g aria-label="lightning accents" clipPath="url(#accent-reveal)">
    <path
      d="M 108 254 L 244 368 L 187 380 L 243 501 L 121 403 L 168 385 Z"
      fill={theme.colors.orange}
      stroke={theme.colors.cream}
      strokeWidth={24}
      strokeLinejoin="round"
    />
    <path
      d="M 108 254 L 244 368 L 187 380 L 243 501 L 121 403 L 168 385 Z"
      fill="none"
      stroke={theme.colors.purpleDark}
      strokeWidth={11}
      strokeLinejoin="round"
    />
    <path
      d="M 93 592 L 202 520 L 170 583 L 224 596 L 99 702 L 132 623 Z"
      fill={theme.colors.orange}
      stroke={theme.colors.cream}
      strokeWidth={24}
      strokeLinejoin="round"
    />
    <path
      d="M 93 592 L 202 520 L 170 583 L 224 596 L 99 702 L 132 623 Z"
      fill="none"
      stroke={theme.colors.purpleDark}
      strokeWidth={11}
      strokeLinejoin="round"
    />
    <rect
      x={65}
      y={210}
      width={220 * progress}
      height={520}
      fill="transparent"
    />
  </g>
);

const Plus: React.FC<{ x: number; y: number; scale: number }> = ({
  x,
  y,
  scale,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path
      d="M -13 -45 H 13 V -13 H 45 V 13 H 13 V 45 H -13 V 13 H -45 V -13 H -13 Z"
      fill={theme.colors.yellow}
      stroke={theme.colors.purpleDark}
      strokeWidth={10}
      strokeLinejoin="round"
    />
  </g>
);

export const FlashSaleAlarm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (frameAt30: number) => (frameAt30 / 30) * fps;

  const clockArrival = range(frame, f(0), f(23), theme.ease.out);
  const clockOpacity = range(frame, f(0), f(6), theme.ease.out);
  const correction =
    1.8 *
    range(frame, f(15), f(19), theme.ease.out) *
    (1 - range(frame, f(19), f(23), theme.ease.inOut));
  const clockExit = range(frame, f(270), f(299), theme.ease.in);
  const clockX = -180 * (1 - clockArrival) - 1020 * clockExit;
  const clockRotation = -8 * (1 - clockArrival) + correction - 6 * clockExit;

  const yellowOpen = range(frame, f(12), f(38), theme.ease.out);
  const magentaOpen = range(frame, f(17), f(43), theme.ease.out);
  const magentaClose = range(frame, f(240), f(260), theme.ease.in);
  const yellowClose = range(frame, f(248), f(269), theme.ease.in);
  const yellowProgress = yellowOpen * (1 - yellowClose);
  const magentaProgress = magentaOpen * (1 - magentaClose);

  const flashOpen = range(frame, f(35), f(52), theme.ease.out);
  const saleOpen = range(frame, f(40), f(59), theme.ease.out);
  const flashProgress = Math.min(flashOpen, magentaProgress);
  const saleProgress = Math.min(saleOpen, magentaProgress);

  const alarmProgress = range(frame, f(35), f(59), theme.ease.out);
  const bellEnvelope = frame >= f(35) && frame < f(60) ? 1 - alarmProgress : 0;
  const bellWave = Math.sin((frame - f(35)) * 1.05);
  const leftBellRotation = 9 * bellEnvelope * bellWave;
  const rightBellRotation = -9 * bellEnvelope * bellWave;
  const longHandRotation = 45 - 360 * (1 - alarmProgress);
  const shortHandRotation = 230 - 70 * (1 - alarmProgress);

  const accentOpen = range(frame, f(38), f(54), theme.ease.out);
  const accentClose = range(frame, f(240), f(247), theme.ease.in);
  const accentProgress = accentOpen * (1 - accentClose);
  const plusScale =
    range(frame, f(43), f(51), theme.ease.out) * (1 - accentClose);
  const secondPlusScale =
    range(frame, f(47), f(55), theme.ease.out) * (1 - accentClose);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Flash sale alarm badge"
      >
        <defs>
          <clipPath id="yellow-panel-window">
            <rect
              x={570}
              y={105}
              width={1280 * yellowProgress}
              height={750}
            />
          </clipPath>
          <clipPath id="magenta-panel-window">
            <rect
              x={570}
              y={105}
              width={1280 * magentaProgress}
              height={750}
            />
          </clipPath>
          <clipPath id="flash-reveal">
            <rect x={760} y={260} width={1020 * flashProgress} height={300} />
          </clipPath>
          <clipPath id="sale-reveal">
            <rect x={820} y={480} width={790 * saleProgress} height={280} />
          </clipPath>
          <clipPath id="accent-reveal">
            <rect x={55} y={200} width={210 * accentProgress} height={540} />
          </clipPath>
        </defs>

        <Panel
          yellowProgress={yellowProgress}
          magentaProgress={magentaProgress}
        />
        <SaleText flashProgress={flashProgress} saleProgress={saleProgress} />
        <g opacity={accentProgress}>
          <Lightning progress={accentProgress} />
        </g>
        <Plus x={900} y={650} scale={plusScale} />
        <Plus x={1625} y={548} scale={secondPlusScale} />
        <Clock
          x={clockX}
          rotation={clockRotation}
          opacity={clockOpacity}
          leftBellRotation={leftBellRotation}
          rightBellRotation={rightBellRotation}
          longHandRotation={longHandRotation}
          shortHandRotation={shortHandRotation}
        />
      </svg>
    </AbsoluteFill>
  );
};
