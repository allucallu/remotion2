import {Easing, interpolate, useCurrentFrame} from "remotion";

export const HALLOWEEN_BLACK_CAT_WIDTH = 3840;
export const HALLOWEEN_BLACK_CAT_HEIGHT = 2160;
export const HALLOWEEN_BLACK_CAT_FPS = 30;
export const HALLOWEEN_BLACK_CAT_DURATION = 300;

const PALETTE = {
  background: "#000000",
  outline: "#F4EBD8",
  eye: "#E6AA36",
  pupil: "#000000",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const easeOut = Easing.bezier(0.2, 0.78, 0.25, 1);
const easeIn = Easing.bezier(0.55, 0, 0.82, 0.3);

const progress = (frame: number, start: number, end: number, easing = easeOut) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing});

const strokeStyle = {
  fill: "none",
  stroke: PALETTE.outline,
  strokeWidth: 12,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1,
  strokeDasharray: 1,
};

const visiblePath = (enter: number, exit: number) => Math.max(0, enter * (1 - exit));

const DrawPath = ({d, visible}: {d: string; visible: number}) => (
  <path {...strokeStyle} d={d} strokeDashoffset={1 - visible} />
);

const tailPath = (shift: number) => `
  M 984 810
  C ${1070 + shift * 0.2} 822 ${1134 + shift * 0.5} 770 ${1139 + shift * 0.55} 684
  C ${1145 + shift * 0.65} 601 ${1090 + shift} 548 ${1100 + shift} 486
  C ${1110 + shift} 420 ${1170 + shift} 384 ${1214 + shift} 405
  C ${1248 + shift} 421 ${1243 + shift} 463 ${1210 + shift} 465
  C ${1178 + shift} 465 ${1159 + shift} 492 ${1160 + shift} 528
  C ${1161 + shift} 574 ${1208 + shift * 0.8} 614 ${1218 + shift * 0.55} 686
  C ${1232 + shift * 0.45} 777 ${1173 + shift * 0.2} 829 1080 830
  L 1001 830`;

const bodyPath = `
  M 790 824
  C 734 808 687 764 685 687
  C 684 632 709 594 748 575
  C 710 538 704 489 725 451
  C 742 420 741 394 731 360
  C 713 301 721 238 744 190
  C 773 210 800 234 821 263
  C 849 251 881 251 910 264
  C 934 233 962 210 989 190
  C 1011 240 1018 300 1001 360
  C 991 395 990 421 1008 451
  C 1029 490 1021 539 983 575
  C 1023 595 1046 633 1049 687
  C 1052 764 1013 808 964 824
  C 965 836 957 844 940 844
  L 886 844
  C 871 844 863 834 865 820
  L 865 680
  C 856 725 848 773 850 820
  C 851 835 842 844 824 844
  L 782 844
  C 766 844 758 836 760 825 Z`;

const leftLegPath = "M 794 672 C 796 727 804 778 803 818 C 782 823 772 832 772 844";
const rightLegPath = "M 873 672 C 872 727 866 778 866 820 C 884 825 894 833 894 844";

const blinkFactor = (frame: number, start: number, end: number) => {
  const midpoint = (start + end) / 2;
  if (frame < start || frame > end) return 1;
  return frame <= midpoint
    ? interpolate(frame, [start, midpoint], [1, 0], {...clamp, easing: easeIn})
    : interpolate(frame, [midpoint, end], [0, 1], {...clamp, easing: easeOut});
};

const CatEye = ({side, openness}: {side: "left" | "right"; openness: number}) => {
  const isLeft = side === "left";
  const centerX = isLeft ? 810 : 941;
  const id = `cat-eye-${side}`;
  const d = isLeft
    ? "M 764 490 C 783 463 830 462 857 488 C 849 518 818 532 786 521 C 773 516 766 505 764 490 Z"
    : "M 894 488 C 921 462 968 463 987 490 C 985 505 978 516 965 521 C 933 532 902 518 894 488 Z";
  const pupilX = isLeft ? 811 : 940;
  const visibleHeight = 2 + 68 * openness;

  return (
    <>
      <clipPath id={id}>
        <rect x={centerX - 58} y={497 - visibleHeight / 2} width="116" height={visibleHeight} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <path d={d} fill={PALETTE.eye} />
        <path d={`M ${pupilX} 471 C ${pupilX - 7} 489 ${pupilX - 7} 508 ${pupilX} 525 C ${pupilX + 7} 508 ${pupilX + 7} 489 ${pupilX} 471 Z`} fill={PALETTE.pupil} />
      </g>
    </>
  );
};

export const HalloweenBlackCat = () => {
  const frame = useCurrentFrame();
  const bodyVisible = visiblePath(progress(frame, 0, 35), progress(frame, 264, 293, easeIn));
  const tailVisible = visiblePath(progress(frame, 18, 40), progress(frame, 264, 286, easeIn));
  const legsVisible = visiblePath(progress(frame, 28, 45), progress(frame, 272, 293, easeIn));
  const tailHold = progress(frame, 48, 58) * (1 - progress(frame, 252, 264, easeIn));
  const tailShift = tailHold * (13 * Math.sin(((frame - 48) / 100) * Math.PI * 2 + 0.6) + 2 * Math.sin(((frame - 48) / 49) * Math.PI * 2));

  const initialOpen = progress(frame, 30, 47);
  const forcedClose = 1 - progress(frame, 252, 263, easeIn);
  const eyeOpen = initialOpen * blinkFactor(frame, 105, 113) * blinkFactor(frame, 195, 203) * forcedClose;

  return (
    <svg
      width={HALLOWEEN_BLACK_CAT_WIDTH}
      height={HALLOWEEN_BLACK_CAT_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      {frame < 294 ? (
        <>
          <DrawPath d={tailPath(tailShift)} visible={tailVisible} />
          <DrawPath d={bodyPath} visible={bodyVisible} />
          <DrawPath d={leftLegPath} visible={legsVisible} />
          <DrawPath d={rightLegPath} visible={legsVisible} />
          <CatEye side="left" openness={eyeOpen} />
          <CatEye side="right" openness={eyeOpen} />
        </>
      ) : null}
    </svg>
  );
};
