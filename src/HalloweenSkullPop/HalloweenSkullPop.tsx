import { Easing, interpolate, useCurrentFrame } from "remotion";

export const HALLOWEEN_SKULL_POP_WIDTH = 3840;
export const HALLOWEEN_SKULL_POP_HEIGHT = 2160;
export const HALLOWEEN_SKULL_POP_FPS = 30;
export const HALLOWEEN_SKULL_POP_DURATION = 240;

const PALETTE = {
  background: "#000000",
  skull: "#F4E9D2",
  cutout: "#000000",
} as const;

const VIEWBOX = { width: 1920, height: 1080 } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.18, 0.76, 0.24, 1);
const easeIn = Easing.bezier(0.58, 0, 0.82, 0.32);
const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);

const progress = (frame: number, start: number, end: number, easing = easeInOut) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing });

const skullMotion = (frame: number) => {
  let scaleX = 1;
  let scaleY = 1;

  if (frame <= 7) {
    const p = progress(frame, 0, 7, easeOut);
    scaleX = interpolate(p, [0, 1], [0.35, 0.85]);
    scaleY = scaleX;
  } else if (frame <= 17) {
    const p = progress(frame, 8, 17, easeOut);
    scaleX = interpolate(p, [0, 1], [0.85, 1.02]);
    scaleY = interpolate(p, [0, 1], [0.85, 1.1]);
  } else if (frame <= 29) {
    const p = progress(frame, 18, 29, easeInOut);
    scaleX = interpolate(p, [0, 1], [1.02, 1]);
    scaleY = interpolate(p, [0, 1], [1.1, 1]);
  } else if (frame <= 203) {
    scaleX = 1;
    scaleY = 1;
  } else if (frame <= 233) {
    const p = progress(frame, 204, 233, easeIn);
    scaleX = interpolate(p, [0, 1], [1.03, 0.2]);
    scaleY = scaleX;
  }

  if (frame >= 192 && frame <= 203) {
    const p = progress(frame, 192, 203, easeInOut);
    scaleX = interpolate(p, [0, 1], [1, 1.03]);
    scaleY = scaleX;
  }

  const leftTilt = interpolate(frame, [60, 74, 89], [0, -5, 0], {
    ...clamp,
    easing: easeInOut,
  });
  const rightTilt = interpolate(frame, [135, 149, 164], [0, 5, 0], {
    ...clamp,
    easing: easeInOut,
  });

  return { scaleX, scaleY, rotation: leftTilt + rightTilt };
};

export const HalloweenSkullPop = () => {
  const frame = useCurrentFrame();
  const { scaleX, scaleY, rotation } = skullMotion(frame);
  const opacity = Math.min(
    progress(frame, 0, 7, easeOut),
    1 - progress(frame, 204, 233, easeIn),
  );

  return (
    <svg
      width={HALLOWEEN_SKULL_POP_WIDTH}
      height={HALLOWEEN_SKULL_POP_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{ display: "block", backgroundColor: PALETTE.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      <g
        opacity={opacity}
        transform={`translate(960 535) rotate(${rotation}) scale(${scaleX} ${scaleY})`}
      >
        <path
          d="M 0 -352 C -210 -352 -350 -198 -350 8 C -350 106 -313 185 -254 231 C -282 263 -280 315 -250 348 C -221 380 -177 391 -136 379 L -136 441 C -136 474 -108 498 -75 498 C -42 498 -20 479 -18 448 C -14 482 13 504 47 504 C 80 504 105 481 107 448 C 109 481 135 498 169 498 C 202 498 230 474 230 441 L 230 379 C 272 391 315 380 343 348 C 374 315 376 263 348 231 C 407 185 444 106 444 8 C 444 -198 210 -352 0 -352 Z"
          fill={PALETTE.skull}
        />

        <path
          d="M -210 -43 C -210 -137 -157 -193 -101 -193 C -44 -193 -20 -127 -28 -38 C -35 47 -80 94 -143 94 C -196 94 -210 33 -210 -43 Z"
          fill={PALETTE.cutout}
        />
        <path
          d="M 210 -43 C 210 -137 157 -193 101 -193 C 44 -193 20 -127 28 -38 C 35 47 80 94 143 94 C 196 94 210 33 210 -43 Z"
          fill={PALETTE.cutout}
        />
        <path
          d="M 0 54 C 19 54 45 94 50 119 C 54 141 34 154 1 154 C -34 154 -54 141 -50 119 C -45 94 -19 54 0 54 Z"
          fill={PALETTE.cutout}
        />

        <path
          d="M -78 362 L -78 440 C -78 460 -93 472 -112 472 C -131 472 -146 458 -146 439 L -146 373 Z"
          fill={PALETTE.cutout}
        />
        <path
          d="M 75 362 L 75 440 C 75 460 91 472 110 472 C 129 472 145 458 145 439 L 145 373 Z"
          fill={PALETTE.cutout}
        />
      </g>
    </svg>
  );
};
