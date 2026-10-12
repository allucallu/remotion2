import { Easing, interpolate, useCurrentFrame } from "remotion";
export const WAVY_WIDTH = 3840,
  WAVY_HEIGHT = 2160,
  WAVY_FPS = 30,
  WAVY_DURATION = 210;
const C = { background: "#000000", stroke: "#FFFFFF" } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.3, 0.05, 0.2, 1);
const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const paths = [
  "M 1400 350 C 1460 365 1480 425 1450 465 C 1510 505 1505 565 1448 592 C 1465 650 1405 700 1345 688 C 1320 750 1240 766 1195 724 C 1140 780 1065 778 1025 728 C 965 775 890 765 858 718 C 790 758 720 728 715 677 C 642 700 585 650 610 597 C 540 575 535 510 600 480 C 565 425 610 365 675 385 C 695 315 770 290 820 330 C 865 270 940 280 970 325 C 1025 275 1100 285 1122 338 C 1185 292 1250 320 1260 370 C 1320 330 1370 332 1400 350 C 1421 343 1443 331 1471 316",
  "M 1400 351 C 1461 366 1479 426 1449 466 C 1511 506 1504 566 1447 593 C 1464 651 1404 701 1344 687 C 1319 751 1239 765 1194 723 C 1139 779 1064 777 1024 727 C 964 774 889 764 857 717 C 789 757 721 727 716 676 C 643 699 586 649 611 596 C 541 574 536 509 601 479 C 566 424 611 364 676 386 C 696 314 771 291 821 331 C 866 269 941 281 971 326 C 1026 274 1101 286 1123 339 C 1186 291 1251 321 1261 371 C 1321 329 1371 333 1400 351 C 1422 344 1444 332 1472 317",
  "M 1400 349 C 1459 364 1481 424 1451 464 C 1509 504 1506 564 1449 591 C 1466 649 1406 699 1346 689 C 1321 749 1241 767 1196 725 C 1141 781 1066 779 1026 729 C 966 776 891 766 859 719 C 791 759 719 729 714 678 C 641 701 584 651 609 598 C 539 576 534 511 599 481 C 564 426 609 366 674 384 C 694 316 769 289 819 329 C 864 271 939 279 969 324 C 1024 276 1099 284 1121 337 C 1184 293 1249 319 1259 369 C 1319 331 1369 331 1400 349 C 1420 342 1442 330 1470 315",
] as const;
export const WavyDoodleEncirclement = () => {
  const f = useCurrentFrame(),
    d = paths[Math.floor(f / 6) % 3];
  return (
    <svg
      width={WAVY_WIDTH}
      height={WAVY_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: C.background }}
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={C.background} />
      <path
        d={d}
        fill="none"
        stroke={C.stroke}
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        strokeDasharray="100 100"
        strokeDashoffset={100 * (1 - p(f, 0, 41)) - 100 * p(f, 174, 203)}
      />
    </svg>
  );
};
