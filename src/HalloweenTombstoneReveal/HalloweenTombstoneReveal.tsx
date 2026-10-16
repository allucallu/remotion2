import {Easing, interpolate, useCurrentFrame} from "remotion";

export const HALLOWEEN_TOMBSTONE_REVEAL_WIDTH = 3840;
export const HALLOWEEN_TOMBSTONE_REVEAL_HEIGHT = 2160;
export const HALLOWEEN_TOMBSTONE_REVEAL_FPS = 30;
export const HALLOWEEN_TOMBSTONE_REVEAL_DURATION = 240;

const PALETTE = {
  background: "#000000",
  stone: "#AAA39A",
  ivory: "#F4EBD8",
  sage: "#8FA17D",
};

const clampProgress = (frame: number, start: number, end: number, easing = Easing.linear) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const revealLength = (frame: number, growStart: number, growEnd: number, shrinkStart: number, shrinkEnd: number) => {
  const grown = clampProgress(frame, growStart, growEnd, Easing.out(Easing.cubic));
  const shrinking = clampProgress(frame, shrinkStart, shrinkEnd, Easing.in(Easing.cubic));
  return Math.max(0, grown * (1 - shrinking));
};

type BladeProps = {
  id: string;
  shape: string;
  guide: string;
  start: number;
};

const GrassBlade = ({id, shape, guide, start}: BladeProps) => {
  const frame = useCurrentFrame();
  const visible = revealLength(frame, start, start + 12, 192 + (start - 28), 204 + (start - 28));

  return (
    <>
      <mask id={`grass-mask-${id}`} maskUnits="userSpaceOnUse">
        <path
          d={guide}
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="30"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - visible}
        />
      </mask>
      <path d={shape} fill={PALETTE.sage} mask={`url(#grass-mask-${id})`} />
    </>
  );
};

const Grass = ({side}: {side: "left" | "right"}) => {
  const frame = useCurrentFrame();
  const isLeft = side === "left";
  const rootX = isLeft ? 700 : 1220;
  const sway = Math.sin((frame / 76) * Math.PI * 2 + (isLeft ? 0 : 1.8)) * (isLeft ? -1.7 : 1.7);

  // Right-hand grass uses a horizontal mirror of the left group, keeping every root on the baseline.
  const blades: Omit<BladeProps, "id">[] = [
    {
      shape: "M688 825 C690 782 695 735 713 697 C720 738 714 784 709 825 Z",
      guide: "M699 825 C699 781 702 736 713 697",
      start: 28,
    },
    {
      shape: "M695 825 C674 795 650 769 616 751 C631 784 655 808 676 825 Z",
      guide: "M696 825 C671 795 648 771 616 751",
      start: 31,
    },
    {
      shape: "M691 825 C660 809 632 791 595 791 C624 813 651 824 671 825 Z",
      guide: "M694 825 C658 808 628 793 595 791",
      start: 34,
    },
    {
      shape: "M706 825 C721 790 743 765 770 750 C752 783 731 808 719 825 Z",
      guide: "M704 825 C724 789 747 764 770 750",
      start: 32,
    },
    {
      shape: "M709 825 C739 803 764 789 795 790 C768 808 746 820 731 825 Z",
      guide: "M708 825 C738 803 767 790 795 790",
      start: 35,
    },
  ];

  return (
    <g transform={`rotate(${sway} ${rootX} 825)`}>
      <g transform={isLeft ? undefined : "translate(1920 0) scale(-1 1)"}>
        {blades.map((blade, index) => (
          <GrassBlade
            key={index}
            id={`${side}-${index}`}
            shape={blade.shape}
            guide={blade.guide}
            start={blade.start}
          />
        ))}
      </g>
    </g>
  );
};

export const HalloweenTombstoneReveal = () => {
  const frame = useCurrentFrame();
  const enter = clampProgress(frame, 0, 35, Easing.out(Easing.cubic));
  const exit = clampProgress(frame, 202, 233, Easing.in(Easing.cubic));
  const tombstoneY = interpolate(enter, [0, 1], [700, 0]) + interpolate(exit, [0, 1], [0, 700]);
  const visible = frame < 234;

  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{backgroundColor: PALETTE.background}}>
      <defs>
        <clipPath id="tombstone-ground-clip">
          <rect x="0" y="0" width="1920" height="825" />
        </clipPath>
      </defs>
      {visible ? (
        <>
          <g clipPath="url(#tombstone-ground-clip)" transform={`translate(0 ${tombstoneY})`}>
            <path
              d="M705 825 L705 425 C705 286 819 190 960 190 C1101 190 1215 286 1215 425 L1215 825 Z"
              fill={PALETTE.stone}
            />
            <path
              d="M750 745 L750 432 C750 320 842 245 960 245 C1078 245 1170 320 1170 432 L1170 745 Z"
              fill="none"
              stroke={PALETTE.ivory}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1009 382 C950 403 923 464 945 515 C967 566 1028 593 1084 557 C1035 567 991 546 975 507 C959 468 973 418 1009 382 Z"
              fill={PALETTE.ivory}
            />
          </g>
          <Grass side="left" />
          <Grass side="right" />
        </>
      ) : null}
    </svg>
  );
};
