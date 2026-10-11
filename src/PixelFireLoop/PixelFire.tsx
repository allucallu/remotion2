import { useCurrentFrame } from "remotion";
import { FIRE_PALETTE, GRID } from "./palette";
import { FIRE_POSES, type PixelRect } from "./poses";

const RectLayer = ({
  rects,
  color,
}: {
  rects: readonly PixelRect[];
  color: string;
}) => (
  <>
    {rects.map(([x, y, width, height], index) => (
      <rect
        key={`${x}-${y}-${index}`}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
      />
    ))}
  </>
);

type Ember = {
  x: number;
  start: number;
  duration: number;
  drift: readonly number[];
  color: string;
};
const EMBERS: readonly Ember[] = [
  {
    x: 13,
    start: 2,
    duration: 8,
    drift: [0, 0, -1, -1, -1, -2, -2, -2],
    color: FIRE_PALETTE.yellow,
  },
  {
    x: 20,
    start: 10,
    duration: 9,
    drift: [0, 1, 1, 1, 2, 2, 1, 1, 0],
    color: FIRE_PALETTE.orangeRed,
  },
  {
    x: 16,
    start: 19,
    duration: 8,
    drift: [0, 0, 1, 1, 1, 0, 0, -1],
    color: FIRE_PALETTE.yellow,
  },
  {
    x: 11,
    start: 27,
    duration: 7,
    drift: [0, -1, -1, -1, -2, -2, -1],
    color: FIRE_PALETTE.orangeRed,
  },
] as const;

const Embers = ({ cycleFrame }: { cycleFrame: number }) => (
  <>
    {EMBERS.map((ember, index) => {
      const age = cycleFrame - ember.start;
      if (age < 0 || age >= ember.duration) return null;
      const height = age >= ember.duration - 2 ? 1 : 2;
      return (
        <rect
          key={index}
          x={ember.x + ember.drift[age]}
          y={15 - age * 2}
          width="1"
          height={height}
          fill={ember.color}
        />
      );
    })}
  </>
);

export const PixelFire = () => {
  const frame = useCurrentFrame();
  const cycleFrame = frame % 36;
  const poseIndex = Math.floor(cycleFrame / 3);
  const current = FIRE_POSES[poseIndex];
  return (
    <svg
      width={GRID.width}
      height={GRID.height}
      viewBox={`0 0 ${GRID.columns} ${GRID.rows}`}
      shapeRendering="crispEdges"
    >
      <RectLayer rects={current.outer} color={FIRE_PALETTE.darkRed} />
      <RectLayer rects={current.middle} color={FIRE_PALETTE.orangeRed} />
      <RectLayer rects={current.inner} color={FIRE_PALETTE.yellow} />
      <RectLayer rects={current.core} color={FIRE_PALETTE.paleYellow} />
      <Embers cycleFrame={cycleFrame} />
    </svg>
  );
};
