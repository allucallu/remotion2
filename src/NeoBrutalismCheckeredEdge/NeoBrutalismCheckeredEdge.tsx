import {Easing, interpolate, useCurrentFrame} from "remotion";

export const NEO_BRUTALISM_CHECKERED_EDGE_WIDTH = 3840;
export const NEO_BRUTALISM_CHECKERED_EDGE_HEIGHT = 2160;
export const NEO_BRUTALISM_CHECKERED_EDGE_FPS = 30;
export const NEO_BRUTALISM_CHECKERED_EDGE_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F6F0E4",
  yellow: "#F4EF16",
  lavender: "#A678EE",
  coral: "#FA6559",
  ink: "#080808",
} as const;

const GEOMETRY = {
  border: 9,
  checker: {x: 93, y: 700, width: 72, height: 220, cell: 27, gap: 2},
  yellowPath: "M 165 695 H 1135 V 730 H 1170 V 775 H 1215 V 855 H 165 Z",
  coralPath: "M 112 680 H 1140 V 715 H 1178 V 760 H 1255 V 910 H 1185 V 965 H 112 Z",
  lavender: {x: 165, y: 867, width: 980, height: 68},
  boxes: [
    {x: 1140, y: 605, size: 78, delay: 0, rise: 18, rotate: -6},
    {x: 1210, y: 643, size: 55, delay: 5, rise: 12, rotate: 5},
  ],
} as const;

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

const progress = (frame: number, start: number, end: number, easing = EASE_OUT) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const panelStages = (amount: number) => ({
  primary: clamp(amount / 0.8),
  middle: clamp((amount - 0.8) / 0.1),
  final: clamp((amount - 0.9) / 0.1),
});

export const NeoBrutalismCheckeredEdge = () => {
  const frame = useCurrentFrame();

  const shellIn = progress(frame, 12, 35, EASE_OUT);
  const shellOut = progress(frame, 280, 293, EASE_IN);
  const shellWidth = 1200 * shellIn * (1 - shellOut);

  const panelIn = progress(frame, 24, 53, EASE_OUT);
  const panelOut = progress(frame, 262, 287, EASE_IN);
  const panelAmount = panelIn * (1 - panelOut);
  const stages = panelStages(panelAmount);

  const lavenderIn = progress(frame, 38, 59, EASE_OUT);
  const lavenderOut = progress(frame, 250, 271, EASE_IN);
  const lavenderWidth = GEOMETRY.lavender.width * lavenderIn * (1 - lavenderOut);

  const backingOffsetIn = progress(frame, 38, 59, EASE_OUT);
  const backingOffsetOut = progress(frame, 250, 265, EASE_IN);
  const backingOffset = backingOffsetIn * (1 - backingOffsetOut);

  return (
    <svg
      viewBox="0 0 1920 1080"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{backgroundColor: PALETTE.background}}
    >
      <rect width="1920" height="1080" fill={PALETTE.background} />
      <defs>
        <clipPath id="checkered-shell-mask">
          <rect x="75" y="660" width={shellWidth} height="320" />
        </clipPath>
        <clipPath id="checkered-panel-mask">
          <rect x="165" y="685" width={970 * stages.primary} height="180" />
          {stages.middle > 0 ? (
            <rect x="1135" y="720" width={35 * stages.middle} height="145" />
          ) : null}
          {stages.final > 0 ? (
            <rect x="1170" y="765" width={45 * stages.final} height="100" />
          ) : null}
        </clipPath>
        <clipPath id="checkered-lavender-mask">
          <rect
            x={GEOMETRY.lavender.x - GEOMETRY.border}
            y={GEOMETRY.lavender.y - GEOMETRY.border}
            width={lavenderWidth + GEOMETRY.border}
            height={GEOMETRY.lavender.height + GEOMETRY.border * 2}
          />
        </clipPath>
      </defs>

      {shellWidth > 0.1 ? (
        <g clipPath="url(#checkered-shell-mask)">
          <path
            d={GEOMETRY.coralPath}
            fill={PALETTE.coral}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
            transform={`translate(${18 * backingOffset} ${22 * backingOffset})`}
          />
          <path
            d="M 82 685 V 935 H 165"
            fill="none"
            stroke={PALETTE.ivory}
            strokeWidth={GEOMETRY.border}
            strokeLinecap="square"
          />
        </g>
      ) : null}

      {Array.from({length: 6}, (_, row) => {
        const start = row * 4;
        const inProgress = progress(frame, start, start + 7, EASE_OUT);
        const outProgress = progress(frame, 280 + (5 - row) * 2, 293, EASE_IN);
        const visibility = inProgress * (1 - outProgress);
        const y = GEOMETRY.checker.y + row * 35;
        const leftFirst = row % 2 === 0;
        return (
          <g key={row} opacity={visibility}>
            {[0, 1].map((column) => {
              const onLeft = leftFirst ? column === 0 : column === 1;
              const x = GEOMETRY.checker.x + (onLeft ? 0 : 28);
              const slide = 12 * (1 - inProgress) * (onLeft ? -1 : 1);
              return (
                <rect
                  key={column}
                  x={x + slide}
                  y={y}
                  width={GEOMETRY.checker.cell}
                  height={GEOMETRY.checker.cell}
                  fill={PALETTE.ivory}
                  stroke={PALETTE.ink}
                  strokeWidth="2"
                />
              );
            })}
          </g>
        );
      })}

      {lavenderWidth > 0.1 ? (
        <g clipPath="url(#checkered-lavender-mask)">
          <rect
            x={GEOMETRY.lavender.x}
            y={GEOMETRY.lavender.y}
            width={GEOMETRY.lavender.width}
            height={GEOMETRY.lavender.height}
            fill={PALETTE.lavender}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
          />
        </g>
      ) : null}

      {panelAmount > 0.001 ? (
        <g clipPath="url(#checkered-panel-mask)">
          <path
            d={GEOMETRY.yellowPath}
            fill={PALETTE.yellow}
            stroke={PALETTE.ink}
            strokeWidth={GEOMETRY.border}
            strokeLinejoin="miter"
          />
        </g>
      ) : null}

      {GEOMETRY.boxes.map((box) => {
        const inProgress = progress(frame, 52 + box.delay, 66 + box.delay, EASE_OUT);
        const outProgress = progress(frame, 240 + box.delay, 255 + box.delay, EASE_IN);
        const amount = inProgress * (1 - outProgress);
        if (amount <= 0.001) return null;
        const overshoot = 3 * (1 - progress(frame, 63 + box.delay, 73 + box.delay, EASE_OUT));
        const y = box.y + box.rise * (1 - inProgress) + overshoot + 16 * outProgress;
        const rotation = box.rotate * (1 - inProgress) - box.rotate * 0.5 * outProgress;
        const cx = box.x + box.size / 2;
        const cy = box.y + box.size / 2;
        return (
          <g key={box.x} transform={`rotate(${rotation} ${cx} ${cy})`} opacity={1 - outProgress}>
            <rect
              x={box.x}
              y={y}
              width={box.size}
              height={box.size}
              fill={PALETTE.background}
              stroke={PALETTE.ivory}
              strokeWidth={GEOMETRY.border}
            />
          </g>
        );
      })}
    </svg>
  );
};
