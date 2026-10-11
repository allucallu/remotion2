import type { DogFootSide } from "./DogPrint";
import { curvePoseAtDistanceRatio } from "./curve";

export type DogStep = {
  side: DogFootSide;
  x: number;
  y: number;
  rotation: number;
  birth: number;
};

export const VERTICAL_CYCLE = 150;
export const CURVE_CYCLE = 300;
const CURVE_PHASE_OFFSET = 45;

export const VERTICAL_STEPS: readonly DogStep[] = Array.from(
  { length: 12 },
  (_, index) => {
    const isLeft = index % 2 === 0;
    return {
      side: isLeft ? "left" : "right",
      x: isLeft ? 860 : 1060,
      y: 1380 - index * 140,
      rotation: isLeft ? -4 : 4,
      birth: index * (VERTICAL_CYCLE / 12),
    };
  },
);

export const CURVE_STEPS: readonly DogStep[] = Array.from(
  { length: 20 },
  (_, index) => {
    const isLeft = index % 2 === 0;
    const pose = curvePoseAtDistanceRatio(index / 19);
    const sideDirection = isLeft ? -1 : 1;
    const pathRotation =
      (Math.atan2(pose.tangent.x, -pose.tangent.y) * 180) / Math.PI;

    return {
      side: isLeft ? "left" : "right",
      x: pose.point.x + pose.normal.x * 90 * sideDirection,
      y: pose.point.y + pose.normal.y * 90 * sideDirection,
      rotation: pathRotation + (isLeft ? -4 : 4),
      birth: CURVE_PHASE_OFFSET + index * (CURVE_CYCLE / 20),
    };
  },
);
