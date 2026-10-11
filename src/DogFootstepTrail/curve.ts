export type Point = { x: number; y: number };

const P0: Point = { x: -260, y: 1060 };
const P1: Point = { x: 550, y: 1060 };
const P2: Point = { x: 1200, y: 100 };
const P3: Point = { x: 2180, y: 100 };
const SAMPLE_COUNT = 600;

const pointAt = (t: number): Point => {
  const inverse = 1 - t;
  return {
    x:
      inverse ** 3 * P0.x +
      3 * inverse ** 2 * t * P1.x +
      3 * inverse * t ** 2 * P2.x +
      t ** 3 * P3.x,
    y:
      inverse ** 3 * P0.y +
      3 * inverse ** 2 * t * P1.y +
      3 * inverse * t ** 2 * P2.y +
      t ** 3 * P3.y,
  };
};

const tangentAt = (t: number): Point => {
  const inverse = 1 - t;
  return {
    x:
      3 * inverse ** 2 * (P1.x - P0.x) +
      6 * inverse * t * (P2.x - P1.x) +
      3 * t ** 2 * (P3.x - P2.x),
    y:
      3 * inverse ** 2 * (P1.y - P0.y) +
      6 * inverse * t * (P2.y - P1.y) +
      3 * t ** 2 * (P3.y - P2.y),
  };
};

const ARC_TABLE = Array.from({ length: SAMPLE_COUNT + 1 }, (_, index) => {
  const t = index / SAMPLE_COUNT;
  return { t, point: pointAt(t), length: 0 };
});

for (let index = 1; index < ARC_TABLE.length; index++) {
  const previous = ARC_TABLE[index - 1].point;
  const current = ARC_TABLE[index].point;
  ARC_TABLE[index].length =
    ARC_TABLE[index - 1].length +
    Math.hypot(current.x - previous.x, current.y - previous.y);
}

const TOTAL_LENGTH = ARC_TABLE[ARC_TABLE.length - 1].length;

const tAtDistanceRatio = (ratio: number) => {
  const target = TOTAL_LENGTH * ratio;
  let low = 0;
  let high = ARC_TABLE.length - 1;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (ARC_TABLE[middle].length < target) low = middle + 1;
    else high = middle;
  }

  const upper = ARC_TABLE[low];
  const lower = ARC_TABLE[Math.max(0, low - 1)];
  const span = upper.length - lower.length;
  const mix = span === 0 ? 0 : (target - lower.length) / span;
  return lower.t + (upper.t - lower.t) * mix;
};

export const curvePoseAtDistanceRatio = (ratio: number) => {
  const t = tAtDistanceRatio(ratio);
  const point = pointAt(t);
  const tangent = tangentAt(t);
  const magnitude = Math.hypot(tangent.x, tangent.y);
  return {
    point,
    tangent,
    normal: { x: -tangent.y / magnitude, y: tangent.x / magnitude },
  };
};
