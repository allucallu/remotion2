import type { SneakerSide } from "./SneakerPrint";

export type SneakerStep = {
  side: SneakerSide;
  x: number;
  y: number;
  rotation: number;
  start: number;
};

export const SNEAKER_STEPS: readonly SneakerStep[] = Array.from(
  { length: 10 },
  (_, index) => ({
    side: index % 2 === 0 ? "left" : "right",
    x: index % 2 === 0 ? 860 : 1060,
    y: 1200 - index * 145,
    rotation: index % 2 === 0 ? -5 : 5,
    start: 15 + index * 21,
  }),
);
