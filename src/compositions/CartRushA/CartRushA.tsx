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
    cream: "#F5E9CE",
    creamSide: "#D8C7A8",
    red: "#F13F38",
    redDark: "#96272A",
    charcoal: "#292A2D",
    hub: "#17181A",
  },
} as const;

type CartGraphicProps = {
  x: number;
  y: number;
  scale: number;
  color: string;
  opacity?: number;
  showPackages?: boolean;
  wheelRotation?: number;
  basketTilt?: number;
  packageTilt?: number;
};

const eased = (
  frame: number,
  start: number,
  end: number,
  easing = Easing.bezier(0.45, 0, 0.55, 1),
) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Packages: React.FC = () => (
  <g aria-label="packages">
    <g transform="translate(330 -360) rotate(8)">
      <rect
        x={0}
        y={0}
        width={210}
        height={205}
        rx={10}
        fill={theme.colors.red}
      />
      <path d="M 116 0 H 148 V 205 H 116 Z" fill={theme.colors.cream} />
      <path d="M 76 0 L 132 0 L 166 25 L 109 18 Z" fill={theme.colors.cream} />
    </g>
    <g transform="translate(155 -286) rotate(-1)">
      <rect
        x={0}
        y={0}
        width={195}
        height={135}
        rx={10}
        fill={theme.colors.cream}
      />
      <path d="M 92 0 H 127 V 135 H 92 Z" fill={theme.colors.red} />
      <path d="M 57 0 H 162 L 126 25 H 93 Z" fill={theme.colors.red} />
    </g>
  </g>
);

const Basket: React.FC<{ color: string }> = ({ color }) => (
  <g
    fill="none"
    stroke={color}
    strokeWidth={22}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="basket front"
  >
    <path d="M 6 -260 L 590 -215 L 542 -32 Q 536 0 500 0 H 74 Q 48 0 42 -27 Z" />
    <path d="M 25 -174 L 568 -145" />
    <path d="M 42 -91 L 549 -76" />
    <path d="M 112 -251 L 126 -5" />
    <path d="M 229 -242 L 230 -3" />
    <path d="M 348 -233 L 337 -2" />
    <path d="M 466 -224 L 444 -1" />
  </g>
);

const Chassis: React.FC<{ color: string; wheelRotation: number }> = ({
  color,
  wheelRotation,
}) => (
  <g aria-label="chassis and wheels">
    <path
      d="M 73 0 L 28 38 Q 4 59 29 76 H 505"
      fill="none"
      stroke={color}
      strokeWidth={24}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {[76, 500].map((wheelX) => (
      <g key={wheelX} transform={`translate(${wheelX} 133)`}>
        <circle r={43} fill={color} />
        <g transform={`rotate(${wheelRotation})`}>
          <circle cx={19} cy={0} r={7} fill={theme.colors.hub} />
        </g>
      </g>
    ))}
  </g>
);

const CartGraphic: React.FC<CartGraphicProps> = ({
  x,
  y,
  scale,
  color,
  opacity = 1,
  showPackages = false,
  wheelRotation = 0,
  basketTilt = 0,
  packageTilt = 0,
}) => (
  <g
    transform={`translate(${x} ${y}) scale(${scale})`}
    opacity={opacity}
    aria-label={showPackages ? "main shopping cart" : "motion trail cart"}
  >
    <g transform={`rotate(${basketTilt} 54 0)`}>
      {showPackages ? (
        <g transform={`rotate(${packageTilt} 285 -20)`}>
          <Packages />
        </g>
      ) : null}
      <g aria-label="handle">
        <path
          d="M -52 -402 L 14 -258"
          fill="none"
          stroke={color}
          strokeWidth={23}
          strokeLinecap="round"
        />
        <rect
          x={-202}
          y={-432}
          width={166}
          height={44}
          rx={22}
          fill={showPackages ? theme.colors.red : color}
        />
      </g>
      <Basket color={color} />
    </g>
    <Chassis color={color} wheelRotation={wheelRotation} />
  </g>
);

export const CartRushA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at30 = (frameAt30Fps: number) => (frameAt30Fps / 30) * fps;

  let mainX: number;
  if (frame <= at30(44)) {
    mainX = interpolate(frame, [0, at30(44)], [-650, 970], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < at30(75)) {
    mainX = interpolate(frame, [at30(44), at30(75)], [970, 1075], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < at30(210)) {
    mainX = 1075;
  } else if (frame < at30(240)) {
    mainX = interpolate(frame, [at30(210), at30(240)], [1075, 1250], {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    mainX = 1250 + ((frame - at30(240)) / at30(59)) * 1300;
  }

  const arrivalX = (delay: number, target: number) => {
    const localFrame = frame - at30(delay);
    if (localFrame <= at30(44)) {
      return interpolate(localFrame, [0, at30(44)], [-650, target - 105], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    return interpolate(
      localFrame,
      [at30(44), at30(74)],
      [target - 105, target],
      {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
  };

  let redTrailX = arrivalX(6, 790);
  let charcoalTrailX = arrivalX(12, 610);
  let redTrailOpacity = 0.95;
  let charcoalTrailOpacity = 0.9;

  if (frame >= at30(75) && frame < at30(105)) {
    redTrailX = interpolate(frame, [at30(75), at30(101)], [790, 1000], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    charcoalTrailX = interpolate(frame, [at30(81), at30(104)], [610, 940], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    redTrailOpacity =
      0.95 * (1 - eased(frame, at30(75), at30(101), Easing.in(Easing.cubic)));
    charcoalTrailOpacity =
      0.9 * (1 - eased(frame, at30(81), at30(104), Easing.in(Easing.cubic)));
  } else if (frame >= at30(105) && frame < at30(210)) {
    redTrailOpacity = 0;
    charcoalTrailOpacity = 0;
  } else if (frame >= at30(210)) {
    redTrailX = mainX - 285;
    charcoalTrailX = mainX - 465;
    redTrailOpacity =
      0.95 * eased(frame, at30(210), at30(226), Easing.out(Easing.cubic));
    charcoalTrailOpacity =
      0.9 * eased(frame, at30(216), at30(234), Easing.out(Easing.cubic));
  }

  const brakeTilt =
    3 *
    eased(frame, at30(45), at30(54), Easing.out(Easing.cubic)) *
    (1 - eased(frame, at30(54), at30(74), Easing.inOut(Easing.cubic)));
  const packageBrakeTilt =
    4 *
    eased(frame, at30(50), at30(60), Easing.out(Easing.cubic)) *
    (1 - eased(frame, at30(60), at30(74), Easing.inOut(Easing.cubic)));
  const packageAccelerationTilt =
    -3 *
    eased(frame, at30(210), at30(220), Easing.out(Easing.cubic)) *
    (1 - eased(frame, at30(220), at30(239), Easing.inOut(Easing.cubic)));

  const traveledDistance = mainX + 650;
  const wheelRotation = (traveledDistance / (2 * Math.PI * 43)) * 360;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Accelerating shopping cart"
      >
        <CartGraphic
          x={charcoalTrailX}
          y={835}
          scale={0.45}
          color={theme.colors.charcoal}
          opacity={charcoalTrailOpacity}
          wheelRotation={wheelRotation}
        />
        <CartGraphic
          x={redTrailX}
          y={815}
          scale={0.66}
          color={theme.colors.redDark}
          opacity={redTrailOpacity}
          wheelRotation={wheelRotation}
        />
        <CartGraphic
          x={mainX}
          y={775}
          scale={1}
          color={theme.colors.cream}
          showPackages
          wheelRotation={wheelRotation}
          basketTilt={brakeTilt}
          packageTilt={packageBrakeTilt + packageAccelerationTilt}
        />
      </svg>
    </AbsoluteFill>
  );
};
