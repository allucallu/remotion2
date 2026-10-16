import { Easing, interpolate, useCurrentFrame } from "remotion";

export const HALLOWEEN_HAUNTED_BRANCHES_WIDTH = 3840;
export const HALLOWEEN_HAUNTED_BRANCHES_HEIGHT = 2160;
export const HALLOWEEN_HAUNTED_BRANCHES_FPS = 30;
export const HALLOWEEN_HAUNTED_BRANCHES_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F4E9D2",
  warmGray: "#77736C",
  moon: "#F39A1F",
} as const;

const VIEWBOX = { width: 1920, height: 1080 } as const;
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const easeOut = Easing.bezier(0.18, 0.72, 0.24, 1);
const easeIn = Easing.bezier(0.58, 0, 0.82, 0.32);
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

type BranchShape = {
  id: string;
  fillPath: string;
  guidePath: string;
  guideLength: number;
  maskWidth: number;
  color: keyof Pick<typeof PALETTE, "ivory" | "warmGray">;
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
};

const MAIN_BRANCHES: readonly BranchShape[] = [
  {
    id: "left-top-main-clean",
    fillPath:
      "M -22 330 C 12 252 40 180 82 128 C 137 59 236 38 352 56 L 438 87 L 386 91 C 282 72 198 90 148 141 C 104 186 78 250 28 346 Z",
    guidePath: "M -3 335 C 43 231 81 137 157 95 C 228 52 319 58 422 84",
    guideLength: 520,
    maskWidth: 68,
    color: "ivory",
    enterStart: 0,
    enterEnd: 35,
    exitStart: 278,
    exitEnd: 295,
  },
  {
    id: "left-bottom-main-clean",
    fillPath:
      "M -18 1090 L -18 1028 C 39 957 99 910 166 882 C 236 852 309 850 376 872 L 464 911 L 415 904 C 350 874 283 878 219 902 C 141 931 77 997 31 1090 Z",
    guidePath: "M 4 1083 C 79 974 150 907 226 886 C 302 866 373 882 452 907",
    guideLength: 555,
    maskWidth: 72,
    color: "ivory",
    enterStart: 1,
    enterEnd: 35,
    exitStart: 278,
    exitEnd: 295,
  },
  {
    id: "right-top-main-clean",
    fillPath:
      "M 1942 325 C 1911 248 1882 180 1835 130 C 1778 68 1682 42 1571 64 L 1490 96 L 1544 98 C 1638 75 1720 92 1772 141 C 1819 185 1850 248 1894 343 Z",
    guidePath: "M 1933 332 C 1892 234 1852 140 1776 98 C 1704 57 1617 68 1504 92",
    guideLength: 520,
    maskWidth: 68,
    color: "ivory",
    enterStart: 0,
    enterEnd: 35,
    exitStart: 278,
    exitEnd: 295,
  },
  {
    id: "right-bottom-main-clean",
    fillPath:
      "M 1940 1090 L 1885 1090 C 1841 1008 1777 946 1705 914 C 1639 884 1570 880 1501 903 L 1432 936 L 1484 928 C 1552 899 1618 906 1680 932 C 1757 964 1817 1022 1862 1090 Z",
    guidePath: "M 1928 1083 C 1856 982 1787 937 1714 923 C 1645 903 1572 900 1445 930",
    guideLength: 555,
    maskWidth: 72,
    color: "ivory",
    enterStart: 1,
    enterEnd: 35,
    exitStart: 278,
    exitEnd: 295,
  },
  {
    id: "left-mid-gray-clean",
    fillPath:
      "M -15 770 C 26 717 61 659 98 618 C 139 572 190 554 246 561 L 338 591 L 291 590 C 235 575 188 588 151 625 C 113 663 78 720 18 790 Z",
    guidePath: "M -2 780 C 69 690 109 604 179 584 C 226 570 274 578 326 590",
    guideLength: 430,
    maskWidth: 50,
    color: "warmGray",
    enterStart: 5,
    enterEnd: 40,
    exitStart: 280,
    exitEnd: 295,
  },
  {
    id: "right-mid-gray-clean",
    fillPath:
      "M 1940 770 C 1904 714 1872 662 1834 623 C 1791 580 1742 566 1688 576 L 1598 609 L 1644 605 C 1699 582 1746 593 1782 629 C 1821 667 1853 716 1903 790 Z",
    guidePath: "M 1930 780 C 1866 696 1828 611 1756 590 C 1708 577 1661 590 1610 606",
    guideLength: 430,
    maskWidth: 50,
    color: "warmGray",
    enterStart: 6,
    enterEnd: 41,
    exitStart: 280,
    exitEnd: 295,
  },
  /* legacy geometry retained below for reference
  {
    id: "left-top-main",
    fillPath:
      "M -18 455 C 12 391 25 319 39 256 C 57 177 91 117 140 68 C 177 31 213 13 249 -5 L 286 -5 C 241 23 206 52 181 88 C 154 126 137 168 124 216 C 113 258 101 304 83 348 C 66 390 43 429 15 466 Z",
    guidePath: "M -8 455 C 47 367 50 239 101 151 C 139 84 199 29 268 -4",
    guideLength: 535,
    maskWidth: 120,
    color: "ivory",
    enterStart: 0,
    enterEnd: 35,
    exitStart: 278,
    exitEnd: 295,
  },
  {
    id: "left-bottom-main",
    fillPath:
      "M -12 1090 L -12 1018 C 34 961 74 908 126 868 C 179 827 239 804 306 796 C 364 789 421 806 482 836 L 514 873 C 449 845 393 831 340 836 C 281 841 231 861 187 895 C 137 934 95 989 57 1055 L 42 1090 Z",
    guidePath: "M 7 1084 C 66 972 146 884 248 839 C 334 801 420 824 501 855",
    guideLength: 605,
    maskWidth: 128,
    color: "ivory",
    enterStart: 1,
    enterEnd: 35,
    exitStart: 278,
    exitEnd: 295,
  },
  {
    id: "right-top-main",
    fillPath:
      "M 1938 397 C 1904 349 1884 294 1868 237 C 1852 179 1825 129 1782 88 C 1746 53 1705 30 1654 12 L 1622 -6 L 1669 -6 C 1727 5 1776 29 1819 65 C 1876 114 1912 181 1935 264 Z",
    guidePath: "M 1930 395 C 1894 318 1888 226 1837 147 C 1796 82 1732 34 1641 0",
    guideLength: 510,
    maskWidth: 116,
    color: "ivory",
    enterStart: 0,
    enterEnd: 35,
    exitStart: 278,
    exitEnd: 295,
  },
  {
    id: "right-bottom-main",
    fillPath:
      "M 1932 1090 L 1875 1090 C 1837 1031 1794 982 1741 942 C 1687 902 1627 875 1557 862 C 1506 853 1452 860 1394 883 L 1362 849 C 1424 816 1488 802 1553 810 C 1630 819 1702 847 1768 891 C 1830 932 1887 987 1932 1049 Z",
    guidePath: "M 1922 1084 C 1852 982 1767 910 1667 863 C 1566 816 1469 825 1380 864",
    guideLength: 650,
    maskWidth: 126,
    color: "ivory",
    enterStart: 1,
    enterEnd: 35,
    exitStart: 278,
    exitEnd: 295,
  },
  {
    id: "left-middle-gray",
    fillPath:
      "M -15 722 C 28 679 56 621 82 564 C 105 514 141 476 192 455 C 239 435 284 437 332 454 L 365 481 C 307 466 258 468 217 487 C 176 506 148 541 129 586 C 105 644 78 700 38 749 L -15 782 Z",
    guidePath: "M -6 748 C 78 681 82 565 169 493 C 221 451 286 449 349 470",
    guideLength: 500,
    maskWidth: 86,
    color: "warmGray",
    enterStart: 5,
    enterEnd: 40,
    exitStart: 280,
    exitEnd: 295,
  },
  {
    id: "right-middle-gray",
    fillPath:
      "M 1935 725 C 1900 680 1878 630 1855 582 C 1835 538 1804 505 1761 486 C 1719 468 1677 470 1630 486 L 1594 463 C 1651 437 1708 432 1761 452 C 1815 473 1854 514 1879 567 C 1904 620 1924 667 1942 692 Z",
    guidePath: "M 1930 716 C 1882 657 1880 566 1814 510 C 1760 464 1691 455 1611 476",
    guideLength: 470,
    maskWidth: 82,
    color: "warmGray",
    enterStart: 6,
    enterEnd: 41,
    exitStart: 280,
    exitEnd: 295,
  },
*/
] as const;

const SECONDARY_BRANCHES: readonly BranchShape[] = [
  {
    id: "lt-branch-clean",
    fillPath:
      "M 89 207 L 158 169 L 228 166 L 301 139 L 420 118 L 366 151 L 300 159 L 231 190 L 167 193 L 102 232 Z",
    guidePath: "M 95 220 L 163 184 L 230 179 L 305 150 L 406 125",
    guideLength: 330,
    maskWidth: 42,
    color: "ivory",
    enterStart: 18,
    enterEnd: 46,
    exitStart: 270,
    exitEnd: 287,
  },
  {
    id: "lt-fork-one-clean",
    fillPath:
      "M 178 181 L 205 128 L 271 53 L 248 111 L 201 190 Z",
    guidePath: "M 189 186 L 217 133 L 264 62",
    guideLength: 152,
    maskWidth: 27,
    color: "ivory",
    enterStart: 26,
    enterEnd: 49,
    exitStart: 267,
    exitEnd: 285,
  },
  {
    id: "lt-fork-two-clean",
    fillPath:
      "M 296 169 L 342 128 L 416 96 L 374 132 L 309 182 Z",
    guidePath: "M 303 176 L 349 134 L 407 102",
    guideLength: 120,
    maskWidth: 24,
    color: "ivory",
    enterStart: 31,
    enterEnd: 53,
    exitStart: 265,
    exitEnd: 283,
  },
  {
    id: "lt-top-twig-clean",
    fillPath:
      "M 168 106 C 190 68 221 39 260 21 L 294 13 L 262 35 C 230 55 207 83 187 117 Z",
    guidePath: "M 177 112 C 201 65 235 34 285 18",
    guideLength: 138,
    maskWidth: 23,
    color: "ivory",
    enterStart: 24,
    enterEnd: 47,
    exitStart: 268,
    exitEnd: 285,
  },
  {
    id: "lm-gray-branch-clean",
    fillPath:
      "M 118 644 L 184 611 L 253 614 L 367 653 L 311 647 L 252 635 L 128 670 Z",
    guidePath: "M 122 656 L 187 628 L 252 627 L 357 650",
    guideLength: 260,
    maskWidth: 34,
    color: "warmGray",
    enterStart: 28,
    enterEnd: 55,
    exitStart: 266,
    exitEnd: 284,
  },
  {
    id: "lm-gray-twig-clean",
    fillPath:
      "M 213 618 C 218 578 232 544 256 515 L 279 496 L 264 525 C 248 554 240 589 237 625 Z",
    guidePath: "M 225 622 C 226 574 244 536 272 503",
    guideLength: 122,
    maskWidth: 21,
    color: "warmGray",
    enterStart: 35,
    enterEnd: 57,
    exitStart: 263,
    exitEnd: 281,
  },
  {
    id: "lb-branch-clean",
    fillPath:
      "M 161 912 L 235 918 L 303 951 L 368 1002 L 435 1054 L 379 1028 L 317 983 L 244 947 L 171 940 Z",
    guidePath: "M 168 925 L 237 932 L 308 963 L 423 1047",
    guideLength: 320,
    maskWidth: 38,
    color: "ivory",
    enterStart: 20,
    enterEnd: 49,
    exitStart: 270,
    exitEnd: 287,
  },
  {
    id: "lb-fork-clean",
    fillPath:
      "M 274 953 C 290 908 316 868 351 837 L 382 820 L 357 848 C 326 878 306 916 295 960 Z",
    guidePath: "M 285 958 C 304 904 333 858 375 826",
    guideLength: 152,
    maskWidth: 25,
    color: "ivory",
    enterStart: 29,
    enterEnd: 53,
    exitStart: 266,
    exitEnd: 283,
  },
  {
    id: "rt-branch-clean",
    fillPath:
      "M 1831 203 L 1761 165 L 1690 164 L 1617 139 L 1497 121 L 1551 151 L 1618 159 L 1687 190 L 1754 191 L 1819 229 Z",
    guidePath: "M 1825 216 L 1757 180 L 1688 178 L 1615 150 L 1510 128",
    guideLength: 330,
    maskWidth: 41,
    color: "ivory",
    enterStart: 18,
    enterEnd: 46,
    exitStart: 270,
    exitEnd: 287,
  },
  {
    id: "rt-fork-one-clean",
    fillPath:
      "M 1742 177 L 1715 125 L 1650 51 L 1672 110 L 1719 187 Z",
    guidePath: "M 1731 183 L 1703 130 L 1657 60",
    guideLength: 150,
    maskWidth: 25,
    color: "ivory",
    enterStart: 27,
    enterEnd: 50,
    exitStart: 267,
    exitEnd: 285,
  },
  {
    id: "rt-fork-two-clean",
    fillPath:
      "M 1620 160 L 1576 123 L 1501 92 L 1544 129 L 1607 173 Z",
    guidePath: "M 1613 167 L 1569 129 L 1510 98",
    guideLength: 118,
    maskWidth: 23,
    color: "ivory",
    enterStart: 32,
    enterEnd: 54,
    exitStart: 265,
    exitEnd: 283,
  },
  {
    id: "rm-gray-branch-clean",
    fillPath:
      "M 1829 616 L 1762 587 L 1694 592 L 1634 618 L 1571 654 L 1622 644 L 1681 620 L 1748 621 L 1821 644 Z",
    guidePath: "M 1824 630 L 1760 602 L 1695 606 L 1638 631 L 1581 647",
    guideLength: 260,
    maskWidth: 34,
    color: "warmGray",
    enterStart: 28,
    enterEnd: 55,
    exitStart: 266,
    exitEnd: 284,
  },
  {
    id: "rm-gray-twig-clean",
    fillPath:
      "M 1722 601 C 1715 562 1700 528 1677 499 L 1655 483 L 1671 512 C 1688 540 1697 571 1698 608 Z",
    guidePath: "M 1710 606 C 1705 561 1687 522 1661 490",
    guideLength: 120,
    maskWidth: 21,
    color: "warmGray",
    enterStart: 35,
    enterEnd: 57,
    exitStart: 263,
    exitEnd: 281,
  },
  {
    id: "rb-branch-clean",
    fillPath:
      "M 1747 973 L 1675 954 L 1602 968 L 1530 1005 L 1451 1062 L 1505 1045 L 1566 1005 L 1640 982 L 1737 1003 Z",
    guidePath: "M 1741 988 L 1674 970 L 1605 982 L 1536 1018 L 1464 1054",
    guideLength: 325,
    maskWidth: 38,
    color: "ivory",
    enterStart: 20,
    enterEnd: 49,
    exitStart: 270,
    exitEnd: 287,
  },
  {
    id: "rb-fork-clean",
    fillPath:
      "M 1629 982 C 1612 938 1585 899 1551 869 L 1522 851 L 1547 881 C 1577 912 1598 950 1608 991 Z",
    guidePath: "M 1618 987 C 1599 934 1570 890 1529 858",
    guideLength: 150,
    maskWidth: 25,
    color: "ivory",
    enterStart: 29,
    enterEnd: 53,
    exitStart: 266,
    exitEnd: 283,
  },
  /* legacy geometry retained below for reference
  {
    id: "lt-high",
    fillPath:
      "M 102 160 C 169 129 239 109 316 105 C 363 103 410 111 459 126 L 451 142 C 402 129 357 124 318 129 C 241 137 174 157 112 190 Z",
    guidePath: "M 105 174 C 216 126 331 111 455 134",
    guideLength: 375,
    maskWidth: 42,
    color: "ivory",
    enterStart: 18,
    enterEnd: 44,
    exitStart: 270,
    exitEnd: 287,
  },
  {
    id: "lt-fork-up",
    fillPath:
      "M 229 120 C 244 81 270 49 307 22 L 338 3 L 319 34 C 286 62 265 94 251 132 Z",
    guidePath: "M 238 126 C 254 77 283 39 329 10",
    guideLength: 150,
    maskWidth: 30,
    color: "ivory",
    enterStart: 24,
    enterEnd: 46,
    exitStart: 268,
    exitEnd: 284,
  },
  {
    id: "lt-long",
    fillPath:
      "M 156 227 C 225 209 289 207 350 220 C 414 234 474 262 536 303 L 524 319 C 463 282 406 258 347 247 C 282 236 220 239 160 257 Z",
    guidePath: "M 158 242 C 292 211 413 244 532 311",
    guideLength: 420,
    maskWidth: 40,
    color: "ivory",
    enterStart: 27,
    enterEnd: 55,
    exitStart: 266,
    exitEnd: 285,
  },
  {
    id: "lt-long-fork",
    fillPath:
      "M 399 258 C 432 230 460 198 483 159 L 502 126 L 495 166 C 477 207 450 241 416 270 Z",
    guidePath: "M 405 263 C 449 228 479 185 497 136",
    guideLength: 165,
    maskWidth: 27,
    color: "ivory",
    enterStart: 35,
    enterEnd: 58,
    exitStart: 262,
    exitEnd: 281,
  },
  {
    id: "lm-gray-fork",
    fillPath:
      "M 175 492 C 153 458 141 422 143 383 L 151 348 L 162 386 C 165 422 178 452 198 479 Z",
    guidePath: "M 186 489 C 153 450 147 407 154 358",
    guideLength: 150,
    maskWidth: 29,
    color: "warmGray",
    enterStart: 31,
    enterEnd: 57,
    exitStart: 264,
    exitEnd: 284,
  },
  {
    id: "lb-wide",
    fillPath:
      "M 169 900 C 232 914 287 941 340 982 C 376 1010 410 1035 454 1050 L 448 1065 C 397 1054 356 1030 319 1002 C 268 964 216 940 158 929 Z",
    guidePath: "M 163 914 C 280 936 340 1021 451 1058",
    guideLength: 355,
    maskWidth: 39,
    color: "ivory",
    enterStart: 23,
    enterEnd: 52,
    exitStart: 268,
    exitEnd: 286,
  },
  {
    id: "lb-up-fork",
    fillPath:
      "M 285 827 C 307 779 340 743 386 716 L 420 704 L 391 730 C 352 758 326 793 308 837 Z",
    guidePath: "M 296 833 C 319 772 359 729 413 708",
    guideLength: 170,
    maskWidth: 32,
    color: "ivory",
    enterStart: 30,
    enterEnd: 57,
    exitStart: 264,
    exitEnd: 283,
  },
  {
    id: "lb-gray-low",
    fillPath:
      "M 65 1002 C 129 1015 184 1038 235 1071 L 206 1083 C 157 1059 108 1044 55 1036 Z",
    guidePath: "M 59 1019 C 125 1025 180 1049 222 1077",
    guideLength: 190,
    maskWidth: 34,
    color: "warmGray",
    enterStart: 35,
    enterEnd: 62,
    exitStart: 260,
    exitEnd: 280,
  },
  {
    id: "rt-high",
    fillPath:
      "M 1812 142 C 1754 122 1696 119 1636 132 C 1584 143 1537 164 1491 194 L 1481 177 C 1528 143 1579 119 1634 106 C 1697 91 1761 96 1820 116 Z",
    guidePath: "M 1817 128 C 1699 95 1588 122 1487 185",
    guideLength: 365,
    maskWidth: 40,
    color: "ivory",
    enterStart: 19,
    enterEnd: 45,
    exitStart: 270,
    exitEnd: 287,
  },
  {
    id: "rt-fork",
    fillPath:
      "M 1700 112 C 1685 76 1658 46 1621 23 L 1592 9 L 1614 35 C 1648 60 1670 88 1683 121 Z",
    guidePath: "M 1691 117 C 1674 73 1644 41 1601 15",
    guideLength: 145,
    maskWidth: 29,
    color: "ivory",
    enterStart: 25,
    enterEnd: 47,
    exitStart: 267,
    exitEnd: 283,
  },
  {
    id: "rt-mid-gray",
    fillPath:
      "M 1812 499 C 1745 480 1684 482 1628 505 C 1586 522 1545 549 1504 586 L 1491 569 C 1530 528 1573 498 1621 478 C 1684 452 1752 451 1820 472 Z",
    guidePath: "M 1817 486 C 1692 454 1592 491 1498 578",
    guideLength: 385,
    maskWidth: 41,
    color: "warmGray",
    enterStart: 28,
    enterEnd: 57,
    exitStart: 265,
    exitEnd: 285,
  },
  {
    id: "rb-wide",
    fillPath:
      "M 1750 938 C 1683 925 1623 937 1566 969 C 1518 996 1477 1027 1434 1054 L 1442 1069 C 1491 1045 1536 1017 1581 993 C 1635 964 1689 955 1744 967 Z",
    guidePath: "M 1750 952 C 1628 929 1539 1002 1438 1061",
    guideLength: 370,
    maskWidth: 40,
    color: "ivory",
    enterStart: 23,
    enterEnd: 52,
    exitStart: 268,
    exitEnd: 286,
  },
  {
    id: "rb-up-fork",
    fillPath:
      "M 1594 947 C 1578 901 1549 863 1509 836 L 1475 821 L 1504 849 C 1540 879 1563 914 1575 958 Z",
    guidePath: "M 1585 953 C 1567 895 1532 853 1484 826",
    guideLength: 170,
    maskWidth: 31,
    color: "ivory",
    enterStart: 31,
    enterEnd: 58,
    exitStart: 263,
    exitEnd: 282,
  },
  {
    id: "rb-gray-low",
    fillPath:
      "M 1872 1012 C 1817 1018 1763 1038 1710 1071 L 1738 1084 C 1786 1061 1834 1048 1882 1044 Z",
    guidePath: "M 1878 1028 C 1816 1030 1762 1049 1723 1077",
    guideLength: 180,
    maskWidth: 33,
    color: "warmGray",
    enterStart: 36,
    enterEnd: 63,
    exitStart: 259,
    exitEnd: 280,
  },
  {
    id: "lt-tip-extension",
    fillPath:
      "M 441 126 C 482 129 522 140 559 157 L 596 181 L 554 168 C 515 153 478 145 443 143 Z",
    guidePath: "M 443 135 C 499 137 548 155 589 177",
    guideLength: 155,
    maskWidth: 30,
    color: "ivory",
    enterStart: 38,
    enterEnd: 61,
    exitStart: 260,
    exitEnd: 280,
  },
  {
    id: "lt-tip-fork",
    fillPath:
      "M 507 149 L 535 111 L 564 88 L 542 121 L 523 157 Z",
    guidePath: "M 514 153 L 538 117 L 558 94",
    guideLength: 82,
    maskWidth: 20,
    color: "ivory",
    enterStart: 42,
    enterEnd: 63,
    exitStart: 258,
    exitEnd: 278,
  },
  {
    id: "lt-mid-extension",
    fillPath:
      "M 518 301 L 559 318 L 600 349 L 629 382 L 594 358 L 552 329 L 515 318 Z",
    guidePath: "M 520 310 L 556 323 L 597 352 L 623 377",
    guideLength: 140,
    maskWidth: 27,
    color: "ivory",
    enterStart: 40,
    enterEnd: 64,
    exitStart: 258,
    exitEnd: 280,
  },
  {
    id: "lt-mid-fork",
    fillPath:
      "M 558 326 L 579 286 L 607 260 L 589 295 L 574 336 Z",
    guidePath: "M 566 331 L 583 292 L 602 266",
    guideLength: 86,
    maskWidth: 19,
    color: "ivory",
    enterStart: 45,
    enterEnd: 65,
    exitStart: 256,
    exitEnd: 276,
  },
  {
    id: "lm-gray-tip",
    fillPath:
      "M 338 458 L 380 477 L 422 511 L 451 548 L 414 521 L 374 491 L 334 476 Z",
    guidePath: "M 340 468 L 380 484 L 419 514 L 446 542",
    guideLength: 142,
    maskWidth: 26,
    color: "warmGray",
    enterStart: 42,
    enterEnd: 65,
    exitStart: 256,
    exitEnd: 278,
  },
  {
    id: "lb-tip-extension",
    fillPath:
      "M 438 1046 L 481 1040 L 530 1019 L 573 990 L 538 1028 L 489 1053 L 443 1063 Z",
    guidePath: "M 440 1055 L 486 1047 L 530 1026 L 568 996",
    guideLength: 145,
    maskWidth: 28,
    color: "ivory",
    enterStart: 39,
    enterEnd: 63,
    exitStart: 259,
    exitEnd: 280,
  },
  {
    id: "lb-inner-fork",
    fillPath:
      "M 352 1014 L 381 974 L 414 950 L 391 982 L 368 1021 Z",
    guidePath: "M 360 1018 L 385 980 L 409 956",
    guideLength: 88,
    maskWidth: 20,
    color: "ivory",
    enterStart: 43,
    enterEnd: 64,
    exitStart: 257,
    exitEnd: 278,
  },
  {
    id: "rt-tip-extension",
    fillPath:
      "M 1490 176 C 1452 195 1418 221 1384 253 L 1354 287 L 1389 262 C 1423 234 1456 213 1496 194 Z",
    guidePath: "M 1493 185 C 1443 207 1398 242 1360 281",
    guideLength: 155,
    maskWidth: 29,
    color: "ivory",
    enterStart: 38,
    enterEnd: 61,
    exitStart: 260,
    exitEnd: 280,
  },
  {
    id: "rt-tip-fork",
    fillPath:
      "M 1430 219 L 1412 178 L 1388 148 L 1403 184 L 1416 229 Z",
    guidePath: "M 1423 224 L 1408 183 L 1392 154",
    guideLength: 88,
    maskWidth: 20,
    color: "ivory",
    enterStart: 43,
    enterEnd: 64,
    exitStart: 257,
    exitEnd: 277,
  },
  {
    id: "rt-gray-extension",
    fillPath:
      "M 1500 566 L 1462 589 L 1421 625 L 1394 660 L 1428 635 L 1468 605 L 1508 583 Z",
    guidePath: "M 1505 574 L 1465 598 L 1425 628 L 1400 654",
    guideLength: 140,
    maskWidth: 27,
    color: "warmGray",
    enterStart: 43,
    enterEnd: 65,
    exitStart: 256,
    exitEnd: 278,
  },
  {
    id: "rb-tip-extension",
    fillPath:
      "M 1443 1051 L 1398 1043 L 1351 1022 L 1309 992 L 1344 1030 L 1392 1056 L 1438 1068 Z",
    guidePath: "M 1440 1059 L 1397 1050 L 1354 1029 L 1315 998",
    guideLength: 145,
    maskWidth: 28,
    color: "ivory",
    enterStart: 39,
    enterEnd: 63,
    exitStart: 259,
    exitEnd: 280,
  },
  {
    id: "rb-inner-fork",
    fillPath:
      "M 1555 992 L 1528 951 L 1495 925 L 1518 959 L 1539 1001 Z",
    guidePath: "M 1547 997 L 1524 958 L 1501 931",
    guideLength: 90,
    maskWidth: 20,
    color: "ivory",
    enterStart: 43,
    enterEnd: 64,
    exitStart: 257,
    exitEnd: 278,
  },
*/
] as const;

const RevealedBranch = ({
  branch,
  frame,
  asTwig = false,
}: {
  branch: BranchShape;
  frame: number;
  asTwig?: boolean;
}) => {
  const enter = progress(frame, branch.enterStart, branch.enterEnd, easeOut);
  const erase = progress(frame, branch.exitStart, branch.exitEnd, easeIn);
  const visible = Math.min(enter, 1 - erase);

  if (visible <= 0.0001) {
    return null;
  }

  const length = visible * branch.guideLength;
  return (
    <g>
      <defs>
        <mask id={`branch-mask-${branch.id}`} maskUnits="userSpaceOnUse">
          <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="black" />
          <path
            d={branch.guidePath}
            fill="none"
            stroke="white"
            strokeWidth={branch.maskWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${length} ${branch.guideLength * 2}`}
          />
        </mask>
      </defs>
      {asTwig ? (
        <path
          d={branch.guidePath}
          fill="none"
          stroke={PALETTE[branch.color]}
          strokeWidth={Math.max(12, branch.maskWidth * 0.52)}
          strokeLinecap="round"
          strokeLinejoin="round"
          mask={`url(#branch-mask-${branch.id})`}
        />
      ) : (
        <path
          d={branch.fillPath}
          fill={PALETTE[branch.color]}
          mask={`url(#branch-mask-${branch.id})`}
        />
      )}
    </g>
  );
};

const Star = ({
  frame,
  x,
  y,
  size,
  start,
  phase,
}: {
  frame: number;
  x: number;
  y: number;
  size: number;
  start: number;
  phase: number;
}) => {
  const enter = progress(frame, start, start + 12, easeOut);
  const exit = progress(frame, 252 + phase, 267 + phase, easeIn);
  const idle = Math.sin(((frame - 84 + phase * 13) / 112) * Math.PI * 2);
  const scale = (0.55 + enter * 0.45) * (1 + idle * 0.04);

  if (enter <= 0.0001 || exit >= 0.9999) {
    return null;
  }

  return (
    <path
      d="M 0 -50 C 7 -17 16 -8 49 0 C 16 8 7 17 0 50 C -7 17 -16 8 -49 0 C -16 -8 -7 -17 0 -50 Z"
      fill={PALETTE.ivory}
      opacity={enter * (1 - exit)}
      transform={`translate(${x} ${y}) scale(${(size / 100) * scale})`}
    />
  );
};

export const HalloweenHauntedBranches = () => {
  const frame = useCurrentFrame();
  const leftSway = Math.sin(((frame - 84) / 132) * Math.PI * 2) * 0.7;
  const rightSway = Math.sin(((frame - 84) / 147) * Math.PI * 2 + 1.7) * 0.62;
  const graySway = Math.sin(((frame - 84) / 159) * Math.PI * 2 + 0.8) * 0.48;
  const idleRamp = progress(frame, 84, 102, easeInOut) * (1 - progress(frame, 250, 260));

  const moonEnter = progress(frame, 54, 77, easeOut);
  const moonExit = progress(frame, 252, 269, easeIn);
  const moonScale = 0.85 + moonEnter * 0.15;

  const ivoryMain = MAIN_BRANCHES.filter((branch) => branch.color === "ivory");
  const grayMain = MAIN_BRANCHES.filter((branch) => branch.color === "warmGray");
  const ivorySecondary = SECONDARY_BRANCHES.filter(
    (branch) => branch.color === "ivory",
  );
  const graySecondary = SECONDARY_BRANCHES.filter(
    (branch) => branch.color === "warmGray",
  );

  return (
    <svg
      width={HALLOWEEN_HAUNTED_BRANCHES_WIDTH}
      height={HALLOWEEN_HAUNTED_BRANCHES_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{ display: "block", backgroundColor: PALETTE.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />

      <g transform={`rotate(${graySway * idleRamp} 0 540)`}>
        {grayMain
          .filter((branch) => branch.id.startsWith("left"))
          .map((branch) => (
            <RevealedBranch key={branch.id} branch={branch} frame={frame} />
          ))}
        {graySecondary
          .filter((branch) => branch.id.startsWith("l"))
          .map((branch) => (
            <RevealedBranch key={branch.id} branch={branch} frame={frame} asTwig />
          ))}
      </g>
      <g transform={`rotate(${-graySway * idleRamp} 1920 540)`}>
        {grayMain
          .filter((branch) => branch.id.startsWith("right"))
          .map((branch) => (
            <RevealedBranch key={branch.id} branch={branch} frame={frame} />
          ))}
        {graySecondary
          .filter((branch) => branch.id.startsWith("r"))
          .map((branch) => (
            <RevealedBranch key={branch.id} branch={branch} frame={frame} asTwig />
          ))}
      </g>

      <g transform={`rotate(${leftSway * idleRamp} 0 540)`}>
        {ivoryMain
          .filter((branch) => branch.id.startsWith("left"))
          .map((branch) => (
            <RevealedBranch key={branch.id} branch={branch} frame={frame} />
          ))}
        {ivorySecondary
          .filter((branch) => branch.id.startsWith("l"))
          .map((branch) => (
            <RevealedBranch key={branch.id} branch={branch} frame={frame} asTwig />
          ))}
      </g>
      <g transform={`rotate(${rightSway * idleRamp} 1920 540)`}>
        {ivoryMain
          .filter((branch) => branch.id.startsWith("right"))
          .map((branch) => (
            <RevealedBranch key={branch.id} branch={branch} frame={frame} />
          ))}
        {ivorySecondary
          .filter((branch) => branch.id.startsWith("r"))
          .map((branch) => (
            <RevealedBranch key={branch.id} branch={branch} frame={frame} asTwig />
          ))}
      </g>

      {moonEnter > 0.0001 && moonExit < 0.9999 ? (
        <g transform="translate(-190 0)">
          <path
            d="M 1465 48 C 1536 46 1594 92 1598 153 C 1602 214 1557 267 1492 277 C 1467 281 1444 276 1424 265 C 1478 260 1518 214 1518 161 C 1518 108 1498 70 1465 48 Z"
            fill={PALETTE.moon}
            opacity={moonEnter * (1 - moonExit)}
            transform={`translate(1526 134) scale(${moonScale}) translate(-1526 -134)`}
          />
        </g>
      ) : null}

      <Star frame={frame} x={1215} y={101} size={47} start={66} phase={0} />
      <Star frame={frame} x={1260} y={164} size={39} start={70} phase={2} />
      <Star frame={frame} x={1432} y={247} size={45} start={74} phase={4} />
    </svg>
  );
};
