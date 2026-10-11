import type { CatSvgSide } from "./CatSvgPrint";

export type CatSvgStep = {
  side: CatSvgSide;
  x: number;
  y: number;
  rotation: number;
  start: number;
};

export const CAT_SVG_STEPS: readonly CatSvgStep[] = Array.from(
  { length: 12 },
  (_, index) => ({
    side: index % 2 === 0 ? "left" : "right",
    x: index % 2 === 0 ? 850 : 1070,
    y: 1300 - index * 140,
    rotation: index % 2 === 0 ? -4 : 4,
    start: 12 + index * 18,
  }),
);

const LOOP_STEP_COUNT = 12;
const LOOP_CENTER = { x: 960, y: 540 } as const;
const LOOP_RADIUS = { x: 560, y: 340 } as const;
const PAW_LANE_OFFSET = 52;

const loopCenterAt = (index: number) => {
  const angle = (index / LOOP_STEP_COUNT) * Math.PI * 2;
  return {
    x: LOOP_CENTER.x + Math.sin(angle) * LOOP_RADIUS.x,
    y: LOOP_CENTER.y + Math.cos(angle) * LOOP_RADIUS.y,
  };
};

export const CAT_SVG_LOOP_STEPS: readonly CatSvgStep[] = Array.from(
  { length: LOOP_STEP_COUNT },
  (_, index) => {
    const previous = loopCenterAt(
      (index - 1 + LOOP_STEP_COUNT) % LOOP_STEP_COUNT,
    );
    const current = loopCenterAt(index);
    const next = loopCenterAt((index + 1) % LOOP_STEP_COUNT);
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const distance = Math.hypot(dx, dy);
    const normalX = -dy / distance;
    const normalY = dx / distance;
    const isLeft = index % 2 === 0;
    const laneDirection = isLeft ? -1 : 1;
    const pathRotation = (Math.atan2(dx, -dy) * 180) / Math.PI;

    return {
      side: isLeft ? "left" : "right",
      x: current.x + normalX * PAW_LANE_OFFSET * laneDirection,
      y: current.y + normalY * PAW_LANE_OFFSET * laneDirection,
      rotation: pathRotation + (isLeft ? -4 : 4),
      start: index * 25,
    };
  },
);
