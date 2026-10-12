import { interpolate, useCurrentFrame } from "remotion";

export const ORGANIC_DOUBLE_CIRCLE_WIDTH = 3840;
export const ORGANIC_DOUBLE_CIRCLE_HEIGHT = 2160;
export const ORGANIC_DOUBLE_CIRCLE_FPS = 30;
export const ORGANIC_DOUBLE_CIRCLE_DURATION = 180;

const COLORS = { background: "#000000", stroke: "#FFFFFF" } as const;
const VIEWBOX = "0 0 1920 1080";
const PATH_LENGTH = 100;

const MAIN_PATHS = [
  "M 1312 355 C 1410 385 1465 490 1450 610 C 1438 705 1340 760 1225 772 C 1030 793 760 782 620 744 C 510 714 472 635 488 522 C 502 405 575 342 700 325 C 885 298 1110 308 1265 330 C 1285 333 1300 344 1312 355 Z",
  "M 1313 354 C 1412 384 1464 491 1449 611 C 1437 704 1339 761 1224 773 C 1029 794 760 781 619 743 C 511 713 473 634 489 521 C 503 404 576 341 701 326 C 884 299 1111 309 1266 331 C 1286 334 1301 345 1313 354 Z",
  "M 1311 356 C 1409 386 1466 489 1451 609 C 1439 706 1341 759 1226 771 C 1031 792 759 783 621 745 C 509 715 471 636 487 523 C 501 406 574 343 699 324 C 886 297 1109 307 1264 329 C 1284 332 1299 343 1311 356 Z",
] as const;

const SECONDARY_PATHS = [
  "M 1243 371 C 1357 404 1414 493 1399 604 C 1385 698 1291 745 1175 754 C 986 768 755 753 637 720 C 546 695 510 628 523 535 C 537 445 597 388 713 366 C 854 340 1027 342 1145 352",
  "M 1244 370 C 1358 403 1415 494 1400 605 C 1386 697 1292 746 1176 755 C 985 769 754 752 636 719 C 547 694 511 627 524 534 C 538 444 598 387 714 365 C 855 339 1026 341 1146 351",
  "M 1242 372 C 1356 405 1413 492 1398 603 C 1384 699 1290 744 1174 753 C 987 767 756 754 638 721 C 545 696 509 629 522 536 C 536 446 596 389 712 367 C 853 341 1028 343 1144 353",
] as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const handEase = (value: number) => value * value * (3 - 2 * value);

const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing: handEase });

const strokeOffset = (draw: number, erase: number) =>
  PATH_LENGTH * (1 - draw) - PATH_LENGTH * erase;

const OrganicPath = ({
  d,
  width,
  draw,
  erase,
}: {
  d: string;
  width: number;
  draw: number;
  erase: number;
}) => (
  <path
    d={d}
    fill="none"
    stroke={COLORS.stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={PATH_LENGTH}
    strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
    strokeDashoffset={strokeOffset(draw, erase)}
  />
);

export const OrganicDoubleCircle = () => {
  const frame = useCurrentFrame();
  const sketchIndex = Math.floor(frame / 5) % MAIN_PATHS.length;
  const mainDraw = progress(frame, 0, 23);
  const secondaryDraw = progress(frame, 24, 35);
  const erase = progress(frame, 150, 173);

  return (
    <svg
      width={ORGANIC_DOUBLE_CIRCLE_WIDTH}
      height={ORGANIC_DOUBLE_CIRCLE_HEIGHT}
      viewBox={VIEWBOX}
      style={{ display: "block", backgroundColor: COLORS.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={COLORS.background} />
      <OrganicPath
        d={MAIN_PATHS[sketchIndex]}
        width={13}
        draw={mainDraw}
        erase={erase}
      />
      <OrganicPath
        d={MAIN_PATHS[sketchIndex]}
        width={15}
        draw={mainDraw}
        erase={erase}
      />
      <OrganicPath
        d={SECONDARY_PATHS[sketchIndex]}
        width={9}
        draw={secondaryDraw}
        erase={erase}
      />
    </svg>
  );
};
