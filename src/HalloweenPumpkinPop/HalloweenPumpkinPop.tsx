import { Easing, interpolate, useCurrentFrame } from "remotion";

export const HALLOWEEN_PUMPKIN_POP_WIDTH = 3840;
export const HALLOWEEN_PUMPKIN_POP_HEIGHT = 2160;
export const HALLOWEEN_PUMPKIN_POP_FPS = 30;
export const HALLOWEEN_PUMPKIN_POP_DURATION = 240;

const PALETTE = {
  background: "#000000",
  pumpkin: "#F47A16",
  pumpkinDeep: "#B84B0B",
  stem: "#9BAD7A",
  face: "#000000",
  accent: "#F6EBD5",
} as const;

const VIEWBOX = { width: 1920, height: 1080 } as const;
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const easeOut = Easing.bezier(0.18, 0.76, 0.24, 1);
const easeIn = Easing.bezier(0.55, 0, 0.82, 0.38);
const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);

const progress = (
  frame: number,
  start: number,
  end: number,
  easing = easeInOut,
) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing,
  });

type AccentDefinition = {
  id: string;
  shape: string;
  guide: string;
  guideLength: number;
  enterStart: number;
  exitStart: number;
};

const ACCENTS: readonly AccentDefinition[] = [
  {
    id: "left-top",
    shape:
      "M 421 425 C 390 405 355 378 319 345 C 310 337 310 324 318 317 C 326 309 339 311 347 320 C 380 355 410 386 438 414 C 443 420 441 428 436 432 C 431 436 426 433 421 425 Z",
    guide: "M 430 423 C 393 394 357 365 327 326",
    guideLength: 145,
    enterStart: 24,
    exitStart: 202,
  },
  {
    id: "right-top",
    shape:
      "M 1499 425 C 1530 405 1565 378 1601 345 C 1610 337 1610 324 1602 317 C 1594 309 1581 311 1573 320 C 1540 355 1510 386 1482 414 C 1477 420 1479 428 1484 432 C 1489 436 1494 433 1499 425 Z",
    guide: "M 1490 423 C 1527 394 1563 365 1593 326",
    guideLength: 145,
    enterStart: 26,
    exitStart: 200,
  },
  {
    id: "left-middle",
    shape:
      "M 398 552 C 354 550 306 548 260 544 C 247 543 239 535 240 525 C 241 514 251 508 264 510 C 311 516 357 523 402 530 C 410 531 415 538 414 545 C 413 551 407 553 398 552 Z",
    guide: "M 405 541 C 351 535 298 530 250 526",
    guideLength: 160,
    enterStart: 29,
    exitStart: 198,
  },
  {
    id: "right-middle",
    shape:
      "M 1522 552 C 1566 550 1614 548 1660 544 C 1673 543 1681 535 1680 525 C 1679 514 1669 508 1656 510 C 1609 516 1563 523 1518 530 C 1510 531 1505 538 1506 545 C 1507 551 1513 553 1522 552 Z",
    guide: "M 1515 541 C 1569 535 1622 530 1670 526",
    guideLength: 160,
    enterStart: 31,
    exitStart: 196,
  },
  {
    id: "left-bottom",
    shape:
      "M 431 651 C 398 676 362 705 329 736 C 320 745 319 758 327 765 C 335 772 348 770 356 761 C 386 728 417 696 445 665 C 450 659 448 652 443 648 C 439 644 435 646 431 651 Z",
    guide: "M 439 658 C 403 689 368 721 337 756",
    guideLength: 145,
    enterStart: 34,
    exitStart: 194,
  },
  {
    id: "right-bottom",
    shape:
      "M 1489 651 C 1522 676 1558 705 1591 736 C 1600 745 1601 758 1593 765 C 1585 772 1572 770 1564 761 C 1534 728 1503 696 1475 665 C 1470 659 1472 652 1477 648 C 1481 644 1485 646 1489 651 Z",
    guide: "M 1481 658 C 1517 689 1552 721 1583 756",
    guideLength: 145,
    enterStart: 36,
    exitStart: 192,
  },
] as const;

const Accent = ({ accent, frame }: { accent: AccentDefinition; frame: number }) => {
  const reveal = progress(frame, accent.enterStart, accent.enterStart + 5, easeOut);
  const erase = progress(frame, accent.exitStart, accent.exitStart + 5, easeIn);
  const visible = Math.min(reveal, 1 - erase);
  const visibleLength = visible * accent.guideLength;

  if (visible <= 0.0001) {
    return null;
  }

  return (
    <g>
      <defs>
        <mask id={`pumpkin-accent-${accent.id}`} maskUnits="userSpaceOnUse">
          <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="black" />
          <path
            d={accent.guide}
            fill="none"
            stroke="white"
            strokeWidth={48}
            strokeLinecap="round"
            strokeDasharray={`${visibleLength} ${accent.guideLength * 2}`}
          />
        </mask>
      </defs>
      <path
        d={accent.shape}
        fill={PALETTE.accent}
        mask={`url(#pumpkin-accent-${accent.id})`}
      />
    </g>
  );
};

const pumpkinTransform = (frame: number) => {
  let scaleX = 1;
  let scaleY = 1;

  if (frame <= 7) {
    const p = progress(frame, 0, 7, easeOut);
    const scale = interpolate(p, [0, 1], [0.2, 0.75]);
    scaleX = scale;
    scaleY = scale;
  } else if (frame <= 17) {
    const p = progress(frame, 8, 17, easeOut);
    scaleX = interpolate(p, [0, 1], [0.75, 0.94]);
    scaleY = interpolate(p, [0, 1], [0.75, 1.08]);
  } else if (frame <= 25) {
    const p = progress(frame, 18, 25, easeInOut);
    scaleX = interpolate(p, [0, 1], [0.94, 1.05]);
    scaleY = interpolate(p, [0, 1], [1.08, 0.96]);
  } else if (frame <= 35) {
    const p = progress(frame, 26, 35, easeOut);
    scaleX = interpolate(p, [0, 1], [1.05, 1]);
    scaleY = interpolate(p, [0, 1], [0.96, 1]);
  }

  if (frame >= 208 && frame <= 215) {
    const p = progress(frame, 208, 215, easeInOut);
    scaleX = interpolate(p, [0, 1], [1, 1.04]);
    scaleY = interpolate(p, [0, 1], [1, 0.94]);
  } else if (frame >= 216) {
    const p = progress(frame, 216, 233, easeIn);
    scaleX = interpolate(p, [0, 1], [1.04, 0.12]);
    scaleY = interpolate(p, [0, 1], [0.94, 0.12]);
  }

  const tilt = interpolate(
    frame,
    [105, 111, 118, 125],
    [0, -2, 2, 0],
    { ...clamp, easing: easeInOut },
  );

  return { scaleX, scaleY, tilt };
};

export const HalloweenPumpkinPop = () => {
  const frame = useCurrentFrame();
  const { scaleX, scaleY, tilt } = pumpkinTransform(frame);
  const enterOpacity = progress(frame, 0, 7, easeOut);
  const exitOpacity = 1 - progress(frame, 216, 233, easeIn);
  const opacity = Math.min(enterOpacity, exitOpacity);

  return (
    <svg
      width={HALLOWEEN_PUMPKIN_POP_WIDTH}
      height={HALLOWEEN_PUMPKIN_POP_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{ display: "block", backgroundColor: PALETTE.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />

      {ACCENTS.map((accent) => (
        <Accent key={accent.id} accent={accent} frame={frame} />
      ))}

      <g
        opacity={opacity}
        transform={`translate(960 820) rotate(${tilt}) scale(${scaleX} ${scaleY}) translate(0 -260)`}
      >
        <path
          d="M -69 -202 C -65 -279 -38 -331 12 -352 C 34 -361 73 -339 85 -321 C 94 -307 78 -295 55 -286 C 22 -273 4 -244 3 -199 Z"
          fill={PALETTE.stem}
        />

        <ellipse cx={-331} cy={17} rx={183} ry={246} fill={PALETTE.pumpkin} />
        <ellipse cx={331} cy={17} rx={183} ry={246} fill={PALETTE.pumpkin} />
        <ellipse cx={-184} cy={4} rx={222} ry={277} fill={PALETTE.pumpkin} />
        <ellipse cx={184} cy={4} rx={222} ry={277} fill={PALETTE.pumpkin} />
        <ellipse cx={0} cy={7} rx={220} ry={291} fill={PALETTE.pumpkin} />

        <g
          fill="none"
          stroke={PALETTE.pumpkinDeep}
          strokeWidth={6}
          strokeLinecap="round"
        >
          <path d="M -272 -183 C -344 -68 -350 116 -280 218" />
          <path d="M -124 -231 C -205 -102 -205 143 -120 244" />
          <path d="M 124 -231 C 205 -102 205 143 120 244" />
          <path d="M 272 -183 C 344 -68 350 116 280 218" />
        </g>

        <path d="M -184 -77 L -94 76 L -242 59 Z" fill={PALETTE.face} />
        <path d="M 184 -77 L 242 59 L 94 76 Z" fill={PALETTE.face} />
        <path
          d="M -282 93 L -210 151 L -151 124 L -83 181 L 0 124 L 83 181 L 151 124 L 210 151 L 282 93 C 264 176 231 221 185 240 L 119 205 L 45 261 L 0 222 L -45 261 L -119 205 L -185 240 C -231 221 -264 176 -282 93 Z"
          fill={PALETTE.face}
          stroke={PALETTE.face}
          strokeLinejoin="round"
          strokeWidth={5}
        />
      </g>
    </svg>
  );
};
