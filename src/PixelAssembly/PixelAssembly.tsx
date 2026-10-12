import { Easing, interpolate, useCurrentFrame } from "remotion";

export const PIXEL_ASSEMBLY_WIDTH = 3840;
export const PIXEL_ASSEMBLY_HEIGHT = 2160;
export const PIXEL_ASSEMBLY_FPS = 30;
export const PIXEL_ASSEMBLY_DURATION = 240;

const PALETTE = {
  background: "#000000",
  cream: "#F6F0E2",
  blue: "#6397C3",
} as const;

const GRID = {
  centerX: 960,
  centerY: 540,
  pitch: 120,
  size: 96,
  radius: 16,
} as const;

const LOOP_FRAMES = 120;
const smooth = Easing.bezier(0.35, 0, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Side = "top" | "right" | "bottom" | "left";
type Pixel = {
  row: number;
  column: number;
  color: string;
  side: Side | null;
  rotation: number;
};

const COLOR_GRID = [
  [PALETTE.blue, PALETTE.cream, PALETTE.cream, PALETTE.blue, PALETTE.cream],
  [PALETTE.cream, PALETTE.blue, PALETTE.cream, PALETTE.blue, PALETTE.cream],
  [PALETTE.cream, PALETTE.cream, null, PALETTE.cream, PALETTE.cream],
  [PALETTE.cream, PALETTE.blue, PALETTE.cream, PALETTE.blue, PALETTE.cream],
  [PALETTE.cream, PALETTE.cream, PALETTE.blue, PALETTE.cream, PALETTE.blue],
] as const;

const perimeterSide = (row: number, column: number): Side | null => {
  if (row === 0) return "top";
  if (column === 4) return "right";
  if (row === 4) return "bottom";
  if (column === 0) return "left";
  return null;
};

const PIXELS: Pixel[] = COLOR_GRID.flatMap((colors, row) =>
  colors.flatMap((color, column) =>
    color === null
      ? []
      : [
          {
            row,
            column,
            color,
            side: perimeterSide(row, column),
            rotation: ((row * 7 + column * 11) % 23) - 11,
          },
        ],
  ),
);

const sideDelay = (side: Side, reverse: boolean) => {
  const order: Side[] = reverse
    ? ["left", "bottom", "right", "top"]
    : ["top", "right", "bottom", "left"];
  return order.indexOf(side) * 4;
};

const moveProgress = (frame: number, start: number) =>
  interpolate(frame, [start, start + 20], [0, 1], { ...clamp, easing: smooth });

const openAmount = (frame: number, side: Side | null) => {
  if (side === null) return 0;
  const localFrame = frame % LOOP_FRAMES;
  if (localFrame < 36)
    return 1 - moveProgress(localFrame, sideDelay(side, false));
  if (localFrame < 56) return 0;
  if (localFrame < 96)
    return moveProgress(localFrame, 56 + sideDelay(side, true));
  return 1;
};

const openOffset = (row: number, column: number) => {
  const horizontal = column === 0 ? -28 : column === 4 ? 28 : 0;
  const vertical = row === 0 ? -28 : row === 4 ? 28 : 0;
  return { x: horizontal, y: vertical };
};

export const PixelAssembly = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      width={PIXEL_ASSEMBLY_WIDTH}
      height={PIXEL_ASSEMBLY_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: PALETTE.background }}
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={PALETTE.background} />
      {PIXELS.map((pixel) => {
        const centerX = GRID.centerX + (pixel.column - 2) * GRID.pitch;
        const centerY = GRID.centerY + (pixel.row - 2) * GRID.pitch;
        const amount = openAmount(frame, pixel.side);
        const offset = openOffset(pixel.row, pixel.column);
        const translateX = offset.x * amount;
        const translateY = offset.y * amount;
        const rotation = pixel.side === null ? 0 : pixel.rotation * amount;

        return (
          <g
            key={`${pixel.row}-${pixel.column}`}
            transform={`translate(${translateX} ${translateY}) rotate(${rotation} ${centerX} ${centerY})`}
          >
            <rect
              x={centerX - GRID.size / 2}
              y={centerY - GRID.size / 2}
              width={GRID.size}
              height={GRID.size}
              rx={GRID.radius}
              fill={pixel.color}
            />
          </g>
        );
      })}
    </svg>
  );
};
