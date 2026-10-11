import type { Seztk01Side } from "./Seztk01Print";

export type Seztk01Step = {
  side: Seztk01Side;
  x: number;
  y: number;
  rotation: number;
  start: number;
};

export const SEZTK01_STEPS: readonly Seztk01Step[] = Array.from(
  { length: 12 },
  (_, index) => ({
    side: index % 2 === 0 ? "left" : "right",
    x: index % 2 === 0 ? 850 : 1070,
    y: 1300 - index * 140,
    rotation: index % 2 === 0 ? -4 : 4,
    start: 12 + index * 18,
  }),
);

const CURVED_CENTERS = [
  720, 760, 825, 910, 1000, 1080, 1130, 1140, 1100, 1020, 920, 820,
] as const;

export const SEZTK01_CURVED_STEPS: readonly Seztk01Step[] = CURVED_CENTERS.map(
  (centerX, index) => {
    const previous = CURVED_CENTERS[Math.max(0, index - 1)];
    const next = CURVED_CENTERS[Math.min(CURVED_CENTERS.length - 1, index + 1)];
    const pathRotation = (Math.atan2(next - previous, 280) * 180) / Math.PI;
    const isLeft = index % 2 === 0;

    return {
      side: isLeft ? "left" : "right",
      x: centerX + (isLeft ? -92 : 92),
      y: 1300 - index * 140,
      rotation: pathRotation + (isLeft ? -4 : 4),
      start: 12 + index * 18,
    };
  },
);
