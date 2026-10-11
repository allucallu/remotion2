type Point = { x: number; y: number };
export type PawStep = Point & { rotation: number };

const anchors: readonly Point[] = [
  { x: 220, y: 840 },
  { x: 850, y: 700 },
  { x: 1150, y: 400 },
  { x: 1700, y: 240 },
];

const catmull = (
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
): Point => {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
};

const dense: Point[] = [];
for (let segment = 0; segment < anchors.length - 1; segment++) {
  const p0 = anchors[Math.max(0, segment - 1)];
  const p1 = anchors[segment];
  const p2 = anchors[segment + 1];
  const p3 = anchors[Math.min(anchors.length - 1, segment + 2)];
  for (let i = 0; i < 160; i++) dense.push(catmull(p0, p1, p2, p3, i / 160));
}
dense.push(anchors[anchors.length - 1]);

const distances = [0];
for (let i = 1; i < dense.length; i++)
  distances.push(
    distances[i - 1] +
      Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y),
  );
const total = distances[distances.length - 1];

const pointAtDistance = (distance: number): Point => {
  let index = 1;
  while (index < distances.length && distances[index] < distance) index++;
  const before = dense[index - 1];
  const after = dense[Math.min(index, dense.length - 1)];
  const span = distances[index] - distances[index - 1] || 1;
  const mix = (distance - distances[index - 1]) / span;
  return {
    x: before.x + (after.x - before.x) * mix,
    y: before.y + (after.y - before.y) * mix,
  };
};

const angleVariations = [
  -2, 2, -1, 1, -2, 2, 0, -1, 2, -2, 1, 0, -1, 1,
] as const;

export const PAW_STEPS: readonly PawStep[] = Array.from(
  { length: 14 },
  (_, index) => {
    const distance = (total * index) / 13;
    const center = pointAtDistance(distance);
    const previous = pointAtDistance(Math.max(0, distance - 2));
    const next = pointAtDistance(Math.min(total, distance + 2));
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.hypot(dx, dy);
    const side = index % 2 === 0 ? -35 : 35;
    return {
      x: center.x + (-dy / length) * side,
      y: center.y + (dx / length) * side,
      rotation:
        (Math.atan2(dy, dx) * 180) / Math.PI + 90 + angleVariations[index],
    };
  },
);
