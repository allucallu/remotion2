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
    red: "#F23F3B",
    redDark: "#BF292E",
    redLight: "#FF5A50",
    cream: "#F5E9CF",
    creamSide: "#D8C6A7",
    hub: "#0D0D0D",
  },
} as const;

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

const CreamCargo: React.FC = () => (
  <g aria-label="cream parcels">
    <g>
      <rect
        x={58}
        y={-222}
        width={155}
        height={222}
        rx={7}
        fill={theme.colors.cream}
        stroke={theme.colors.hub}
        strokeWidth={4}
      />
      <path d="M 135 -222 H 160 V 0 H 135 Z" fill={theme.colors.creamSide} />
    </g>
    <g>
      <rect
        x={222}
        y={-148}
        width={178}
        height={148}
        rx={7}
        fill={theme.colors.cream}
        stroke={theme.colors.hub}
        strokeWidth={4}
      />
      <path d="M 292 -148 H 320 V 0 H 292 Z" fill={theme.colors.red} />
    </g>
    <g>
      <rect
        x={407}
        y={-184}
        width={148}
        height={184}
        rx={7}
        fill={theme.colors.cream}
        stroke={theme.colors.hub}
        strokeWidth={4}
      />
      <path d="M 465 -184 H 491 V 0 H 465 Z" fill={theme.colors.red} />
      <path d="M 407 -126 H 555 V -99 H 407 Z" fill={theme.colors.red} />
    </g>
  </g>
);

const RedParcel: React.FC = () => (
  <g aria-label="red parcel">
    <path d="M -60 -42 L 48 -42 L 60 38 L -48 48 Z" fill={theme.colors.red} />
    <path
      d="M 48 -42 L 72 -29 L 60 38 L 48 -42 Z"
      fill={theme.colors.redDark}
    />
    <path
      d="M -60 -42 L -35 -57 L 72 -29 L 48 -42 Z"
      fill={theme.colors.redLight}
    />
    <path d="M -11 -50 L 13 -44 L 22 42 L -1 44 Z" fill={theme.colors.cream} />
    <path
      d="M -35 -57 L -7 -50 L 21 -43 L -7 -50 Z"
      fill={theme.colors.cream}
    />
  </g>
);

const BasketFront: React.FC = () => (
  <g
    fill="none"
    stroke={theme.colors.red}
    strokeWidth={18}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="basket front"
  >
    <path d="M 0 -270 L 585 -220 L 532 0 H 62 Z" />
    <path d="M 31 -176 L 562 -146" />
    <path d="M 49 -84 L 542 -71" />
    <path d="M 105 -260 L 132 -3" />
    <path d="M 215 -251 L 236 -2" />
    <path d="M 328 -241 L 340 -1" />
    <path d="M 441 -232 L 444 -1" />
  </g>
);

const CartChassis: React.FC<{
  wheelRotation: number;
  bodyDrop: number;
}> = ({ wheelRotation, bodyDrop }) => (
  <g aria-label="chassis and wheels">
    <g transform={`translate(0 ${bodyDrop})`}>
      <path
        d="M 64 0 L 21 48 Q 4 67 31 76 H 500"
        fill="none"
        stroke={theme.colors.red}
        strokeWidth={20}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    {[58, 494].map((wheelX) => (
      <g key={wheelX} transform={`translate(${wheelX} 132)`}>
        <circle r={47} fill={theme.colors.cream} />
        <circle r={23} fill={theme.colors.hub} />
        <g transform={`rotate(${wheelRotation})`}>
          <circle cx={16} cy={0} r={5} fill={theme.colors.creamSide} />
        </g>
      </g>
    ))}
  </g>
);

const Cart: React.FC<{
  x: number;
  upperTilt: number;
  cargoTilt: number;
  bodyDrop: number;
  parcelX: number;
  parcelY: number;
  parcelRotation: number;
  parcelOpacity: number;
  motionAccentOpacity: number;
  wheelRotation: number;
}> = ({
  x,
  upperTilt,
  cargoTilt,
  bodyDrop,
  parcelX,
  parcelY,
  parcelRotation,
  parcelOpacity,
  motionAccentOpacity,
  wheelRotation,
}) => (
  <g transform={`translate(${x} 760)`}>
    <g transform={`translate(0 ${bodyDrop}) rotate(${upperTilt} 62 0)`}>
      <g aria-label="handle">
        <path
          d="M -94 -369 Q -54 -372 -43 -335 L 3 -268"
          fill="none"
          stroke={theme.colors.red}
          strokeWidth={20}
          strokeLinecap="round"
        />
        <rect
          x={-180}
          y={-390}
          width={104}
          height={34}
          rx={17}
          fill={theme.colors.red}
        />
      </g>
      <g transform={`rotate(${cargoTilt} 305 0)`}>
        <CreamCargo />
      </g>
      <g
        transform={`translate(${parcelX} ${parcelY}) rotate(${parcelRotation})`}
        opacity={parcelOpacity}
      >
        <RedParcel />
      </g>
      <g
        transform={`translate(${parcelX} ${parcelY + 88})`}
        stroke={theme.colors.cream}
        strokeWidth={8}
        strokeLinecap="round"
        opacity={motionAccentOpacity}
        aria-label="parcel motion accents"
      >
        <path d="M -20 0 L -33 35" />
        <path d="M 15 7 L 2 42" />
      </g>
      <BasketFront />
    </g>
    <CartChassis wheelRotation={wheelRotation} bodyDrop={bodyDrop} />
  </g>
);

export const CartRushB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at30 = (frameAt30Fps: number) => (frameAt30Fps / 30) * fps;

  let cartX: number;
  if (frame <= at30(44)) {
    cartX = interpolate(frame, [0, at30(44)], [370, 620], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < at30(220)) {
    cartX = 620;
  } else if (frame < at30(240)) {
    cartX = interpolate(frame, [at30(220), at30(240)], [620, 760], {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    cartX = 760 + ((frame - at30(240)) / at30(59)) * 1350;
  }

  const stopTilt =
    2.5 *
    eased(frame, at30(45), at30(52), Easing.out(Easing.cubic)) *
    (1 - eased(frame, at30(52), at30(69), Easing.inOut(Easing.cubic)));
  const cargoStopTilt =
    3 *
    eased(frame, at30(49), at30(57), Easing.out(Easing.cubic)) *
    (1 - eased(frame, at30(57), at30(69), Easing.inOut(Easing.cubic)));
  const stopDrop =
    2 *
    eased(frame, at30(47), at30(54), Easing.out(Easing.cubic)) *
    (1 - eased(frame, at30(54), at30(69), Easing.inOut(Easing.cubic)));

  const fallProgress = eased(
    frame,
    at30(70),
    at30(109),
    Easing.in(Easing.quad),
  );
  const fallArc = 4 * fallProgress * (1 - fallProgress);
  const parcelOpacity = eased(
    frame,
    at30(70),
    at30(82),
    Easing.in(Easing.cubic),
  );
  let parcelX = 290 + 28 * fallProgress + 10 * fallArc;
  let parcelY = -430 + 232 * fallProgress - 20 * fallArc;
  let parcelRotation = -12 * (1 - fallProgress);

  if (frame >= at30(110)) {
    parcelX = 318;
    parcelRotation = 0;
    if (frame < at30(116)) {
      parcelY = interpolate(frame, [at30(110), at30(116)], [-198, -212], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (frame < at30(126)) {
      parcelY = interpolate(frame, [at30(116), at30(126)], [-212, -198], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else {
      parcelY = -198;
    }
  }

  const motionAccentOpacity =
    eased(frame, at30(78), at30(86), Easing.out(Easing.cubic)) *
    (1 - eased(frame, at30(96), at30(104), Easing.in(Easing.cubic)));
  const loadDrop =
    4 *
    eased(frame, at30(110), at30(116), Easing.out(Easing.cubic)) *
    (1 - eased(frame, at30(116), at30(129), Easing.inOut(Easing.cubic)));
  const bodyDrop = stopDrop + loadDrop;

  const traveledDistance = cartX - 370;
  const wheelRotation = (traveledDistance / (2 * Math.PI * 47)) * 360;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Red shopping cart receiving a parcel"
      >
        <Cart
          x={cartX}
          upperTilt={stopTilt}
          cargoTilt={cargoStopTilt}
          bodyDrop={bodyDrop}
          parcelX={parcelX}
          parcelY={parcelY}
          parcelRotation={parcelRotation}
          parcelOpacity={parcelOpacity}
          motionAccentOpacity={motionAccentOpacity}
          wheelRotation={wheelRotation}
        />
      </svg>
    </AbsoluteFill>
  );
};
