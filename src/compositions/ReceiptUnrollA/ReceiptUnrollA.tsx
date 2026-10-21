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
    paper: "#F4E7CB",
    paperTop: "#FFF2D8",
    charcoal: "#292A2B",
    underside: "#242528",
    undersideDark: "#17181A",
    red: "#ED2E31",
  },
  ease: {
    mechanical: Easing.bezier(0.45, 0, 0.3, 1),
    slow: Easing.bezier(0.2, 0.75, 0.25, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
  },
} as const;

const progress = (
  frame: number,
  start: number,
  end: number,
  easing: (value: number) => number,
) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const DecorativeBars: React.FC = () => (
  <g fill={theme.colors.charcoal} aria-label="decorative receipt bars">
    <rect x={46} y={72} width={304} height={17} rx={1} />
    <rect x={46} y={101} width={304} height={17} rx={1} />
    <rect x={46} y={130} width={166} height={17} rx={1} />
    <rect x={46} y={604} width={182} height={17} rx={1} />
    <rect x={46} y={635} width={140} height={17} rx={1} />
    <rect x={46} y={666} width={68} height={17} rx={1} />
  </g>
);

const Printer: React.FC = () => (
  <g aria-label="cream receipt printer slot">
    <rect
      x={640}
      y={78}
      width={640}
      height={126}
      rx={21}
      fill={theme.colors.paperTop}
    />
    <rect x={670} y={114} width={580} height={16} fill={theme.colors.red} />
    <path
      d="M 688 146 Q 682 146 682 158 V 180 Q 682 190 694 190 H 718 L 729 160 H 1191 L 1202 190 H 1226 Q 1238 190 1238 180 V 158 Q 1238 146 1226 146 Z"
      fill={theme.colors.charcoal}
    />
  </g>
);

const ReceiptSheet: React.FC<{
  translateY: number;
  curlExtra: number;
}> = ({ translateY, curlExtra }) => {
  const curlAmount = 10 + curlExtra;
  const curlTop = 700 - curlAmount * 0.85;
  const curlControlX = 480 - curlAmount * 1.15;
  const curlControlY = 735 + curlAmount * 0.18;
  const undersideTipX = 496 + curlAmount * 0.5;
  const jaggedEdge =
    "L 416 745 L 402 760 L 388 745 L 374 760 L 360 745 L 346 760 L 332 745 L 318 760 L 304 745 L 290 760 L 276 745 L 262 760 L 248 745 L 234 760 L 220 745 L 206 760 L 192 745 L 178 760 L 164 745 L 150 760 L 136 745 L 122 760 L 108 745 L 94 760 L 80 745 L 66 760 L 52 745 L 38 760 L 24 745 L 10 760 L 0 748 V 0 Z";
  const paperPath = `M 0 0 H 480 V ${curlTop} Q ${curlControlX} ${curlControlY} 430 760 ${jaggedEdge}`;
  const undersidePath = `M 430 760 Q ${undersideTipX + 8} ${738 - curlAmount * 0.45} ${undersideTipX} ${curlTop} Q ${458 - curlAmount * 0.7} ${724 - curlAmount * 0.25} ${420 - curlAmount * 0.35} ${744 - curlAmount * 0.15} Z`;

  return (
    <g
      transform={`translate(720 ${168 + translateY})`}
      aria-label="single translating receipt sheet"
    >
      <path d={undersidePath} fill={theme.colors.undersideDark} />
      <path
        d={undersidePath}
        fill={theme.colors.underside}
        transform="translate(-8 -4)"
      />
      <defs>
        <clipPath id="receipt-paper-shape" clipPathUnits="userSpaceOnUse">
          <path d={paperPath} />
        </clipPath>
      </defs>
      <g clipPath="url(#receipt-paper-shape)">
        <path d={paperPath} fill={theme.colors.paper} />
        <DecorativeBars />
      </g>
    </g>
  );
};

export const ReceiptUnrollA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at30 = (value: number) => (value / 30) * fps;

  let paperY = -690;
  if (frame >= at30(15) && frame < at30(43)) {
    const pullOne = progress(frame, at30(15), at30(43), theme.ease.mechanical);
    paperY = -690 + 230 * pullOne;
  } else if (frame >= at30(43) && frame < at30(47)) {
    paperY = -460;
  } else if (frame >= at30(47) && frame < at30(75)) {
    const pullTwo = progress(frame, at30(47), at30(75), theme.ease.mechanical);
    paperY = -460 + 240 * pullTwo;
  } else if (frame >= at30(75) && frame < at30(79)) {
    paperY = -220;
  } else if (frame >= at30(79) && frame < at30(105)) {
    const pullThree = progress(frame, at30(79), at30(105), theme.ease.slow);
    paperY = -220 + 220 * pullThree;
  } else if (frame >= at30(105)) {
    paperY = 0;
  }

  if (frame >= at30(240)) {
    const reverseFeed = progress(frame, at30(240), at30(299), theme.ease.inOut);
    paperY = -690 * reverseFeed;
  }

  const curlOut = progress(
    frame,
    at30(105),
    at30(116),
    Easing.out(Easing.cubic),
  );
  const curlBack = progress(
    frame,
    at30(116),
    at30(129),
    Easing.inOut(Easing.cubic),
  );
  const curlExtra = 22 * curlOut * (1 - curlBack);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Receipt feeding from a cream printer slot"
      >
        <defs>
          <clipPath id="receipt-output-window" clipPathUnits="userSpaceOnUse">
            <rect x={0} y={176} width={1920} height={824} />
          </clipPath>
        </defs>
        <g clipPath="url(#receipt-output-window)">
          <ReceiptSheet translateY={paperY} curlExtra={curlExtra} />
        </g>
        <Printer />
      </svg>
    </AbsoluteFill>
  );
};
