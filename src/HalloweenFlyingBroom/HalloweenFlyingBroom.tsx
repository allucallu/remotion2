import {Easing, interpolate, useCurrentFrame} from "remotion";

export const HALLOWEEN_FLYING_BROOM_WIDTH = 3840;
export const HALLOWEEN_FLYING_BROOM_HEIGHT = 2160;
export const HALLOWEEN_FLYING_BROOM_FPS = 30;
export const HALLOWEEN_FLYING_BROOM_DURATION = 240;

const PALETTE = {
  background: "#000000",
  handle: "#F4E7CD",
  bristles: "#EF7D18",
  binding: "#70528A",
  division: "#000000",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const easeOut = Easing.bezier(0.18, 0.76, 0.24, 1);
const easeIn = Easing.bezier(0.58, 0, 0.82, 0.32);

const progress = (frame: number, start: number, end: number, easing = easeOut) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing});

const bristlePath = (bend: number) => `
  M 868 560
  C 818 573 757 595 689 624
  C 633 648 585 ${670 + bend} 548 ${687 + bend}
  C 530 ${696 + bend} 533 ${725 + bend} 551 ${733 + bend}
  C 562 ${738 + bend} 578 ${727 + bend} 593 ${717 + bend}
  C 578 ${740 + bend} 583 ${758 + bend} 600 ${763 + bend}
  C 615 ${767 + bend} 631 ${750 + bend} 645 ${738 + bend}
  C 635 ${764 + bend} 648 ${781 + bend} 666 ${782 + bend}
  C 683 ${783 + bend} 696 ${764 + bend} 708 ${747 + bend}
  C 707 ${775 + bend} 727 ${790 + bend} 744 ${781 + bend}
  C 759 ${773 + bend} 763 ${751 + bend} 767 ${730 + bend}
  C 783 ${750 + bend} 805 ${752 + bend} 820 ${738 + bend}
  C 835 ${724 + bend} 832 ${704 + bend} 830 ${690 + bend}
  C 850 ${693 + bend} 873 ${683 + bend} 885 ${663 + bend}
  C 897 ${643 + bend} 889 601 868 560 Z`;

const Broom = ({bend}: {bend: number}) => {
  const divisions = [
    `M 858 584 C 783 607 692 647 607 ${692 + bend}`,
    `M 866 594 C 808 633 723 684 639 ${731 + bend}`,
    `M 875 602 C 834 653 760 718 695 ${754 + bend}`,
    `M 883 607 C 864 661 817 718 758 ${753 + bend}`,
  ];

  return (
    <>
      <defs>
        <clipPath id="broom-bristle-clip">
          <path d={bristlePath(bend)} />
        </clipPath>
      </defs>
      <path
        d="M 875 556 C 1004 490 1166 382 1343 245"
        fill="none"
        stroke={PALETTE.handle}
        strokeLinecap="round"
        strokeWidth="26"
      />
      <path d={bristlePath(bend)} fill={PALETTE.bristles} />
      <path
        d="M 853 573 C 850 554 856 536 869 532 C 880 528 885 536 886 545
          C 891 526 905 526 909 539 C 916 525 930 532 927 548
          C 942 541 951 555 938 568 L 908 590 Z"
        fill={PALETTE.bristles}
      />
      <g clipPath="url(#broom-bristle-clip)">
        {divisions.map((division, index) => (
          <path
            key={index}
            d={division}
            fill="none"
            stroke={PALETTE.division}
            strokeLinecap="round"
            strokeWidth="6"
          />
        ))}
      </g>
      <path
        d="M 838 536 C 849 527 861 529 872 539 L 914 579
          C 923 587 923 599 914 608 L 898 623
          C 889 631 877 630 868 621 L 825 578
          C 816 568 817 556 826 547 Z"
        fill={PALETTE.binding}
      />
    </>
  );
};

export const HalloweenFlyingBroom = () => {
  const frame = useCurrentFrame();
  const entering = progress(frame, 0, 47, easeOut);
  const exiting = progress(frame, 180, 233, easeIn);
  const hold = frame >= 48 && frame < 180;
  const hoverPhase = ((frame - 48) / 75) * Math.PI * 2;
  const hoverX = hold ? 8 * Math.sin(hoverPhase + 0.45) : 0;
  const hoverY = hold ? 16 * Math.sin(hoverPhase) : 0;
  const hoverRotation = hold ? 2.4 * Math.sin(hoverPhase + 0.75) : 0;

  const enterX = interpolate(entering, [0, 1], [-360, 875]) + 72 * Math.sin(entering * Math.PI);
  const enterY = interpolate(entering, [0, 1], [1240, 575]) - 92 * Math.sin(entering * Math.PI);
  const exitX = 875 + hoverX * (1 - exiting) + 1410 * exiting + 74 * Math.sin(exiting * Math.PI);
  const exitY = 575 + hoverY * (1 - exiting) - 860 * exiting - 88 * Math.sin(exiting * Math.PI);
  const x = frame < 48 ? enterX : frame < 180 ? 875 + hoverX : exitX;
  const y = frame < 48 ? enterY : frame < 180 ? 575 + hoverY : exitY;
  const rotation = frame < 48 ? -3 * (1 - entering) : frame < 180 ? hoverRotation : hoverRotation * (1 - exiting) - 8 * exiting;

  const flightEnergy = frame < 48 ? 1 - entering * 0.45 : frame < 180 ? 0.42 : 0.42 + exiting * 0.62;
  const bristleBend = flightEnergy * (3.6 * Math.sin((frame / 19) * Math.PI * 2 + 0.4) + 1.5 * Math.sin((frame / 11) * Math.PI * 2));

  return (
    <svg
      width={HALLOWEEN_FLYING_BROOM_WIDTH}
      height={HALLOWEEN_FLYING_BROOM_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />
      {frame < 234 ? (
        <g transform={`translate(${x - 875} ${y - 575}) rotate(${rotation} 875 575)`}>
          <Broom bend={bristleBend} />
        </g>
      ) : null}
    </svg>
  );
};
