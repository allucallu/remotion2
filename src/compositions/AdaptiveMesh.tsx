import { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Fixed staggered triangular lattice. Geometry adapts; connectivity never changes.
type Point = { x: number; y: number };
type Vertex = Point & { qx: number; qy: number; z: number; influence: number };
type Triangle = readonly [number, number, number];
type Edge = readonly [number, number];
type RGB = readonly [number, number, number];
const PALETTE = {
  navy: "#102238",
  petroleum: "#153D50",
  teal: "#205C65",
  primary: [132, 173, 184] as RGB,
  secondary: [93, 133, 151] as RGB,
  accent: [168, 214, 211] as RGB,
};
const TAU = Math.PI * 2,
  SPACING = 110,
  ROW_HEIGHT = (SPACING * Math.sqrt(3)) / 2,
  COLS = 49,
  ROWS = 35;
const BASE_VERTICES: readonly Point[] = Array.from(
  { length: COLS * ROWS },
  (_, i) => {
    const row = Math.floor(i / COLS),
      col = i % COLS;
    return {
      x: -660 + col * SPACING + ((row % 2) * SPACING) / 2,
      y: -560 + row * ROW_HEIGHT,
    };
  },
);
const TRIANGLES: readonly Triangle[] = Array.from(
  { length: (ROWS - 1) * (COLS - 1) },
  (_, i) => {
    const row = Math.floor(i / (COLS - 1)),
      col = i % (COLS - 1),
      a = row * COLS + col,
      b = a + 1,
      c = a + COLS,
      d = c + 1;
    return row % 2 === 0
      ? ([
          [a, b, c],
          [b, d, c],
        ] as Triangle[])
      : ([
          [a, b, d],
          [a, d, c],
        ] as Triangle[]);
  },
).flat();
const EDGES: readonly Edge[] = (() => {
  const seen = new Set<string>(),
    edges: Edge[] = [];
  for (const [a, b, c] of TRIANGLES)
    for (const [i, j] of [
      [a, b],
      [b, c],
      [c, a],
    ]) {
      const lo = Math.min(i, j),
        hi = Math.max(i, j),
        key = `${lo}:${hi}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([lo, hi]);
      }
    }
  return edges;
})();
const gaussian = (x: number, y: number, sx: number, sy: number) =>
  Math.exp(-0.5 * ((x / sx) ** 2 + (y / sy) ** 2));
const calmAt = (x: number, y: number) => gaussian(x - 1900, y - 1050, 850, 540);
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const mixColor = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const rgb = (a: RGB) => `rgb(${a.map(Math.round).join(",")})`;
const phaseAt = (frame: number, loopFrames: number) =>
  (TAU * (((frame % loopFrames) + loopFrames) % loopFrames)) / loopFrames;
const activeAt = (phase: number) => {
  const angle = (3 * Math.PI) / 4 - phase;
  const x = 1920 + 1000 * Math.cos(angle),
    y = 1080 + 520 * Math.sin(angle);
  return { x, y, strength: 0.21 * (1 - 0.26 * calmAt(x, y)) };
};
const heightAt = (x: number, y: number, phase: number) => {
  const quiet = 1 - 0.65 * calmAt(x, y);
  const left = 155 * gaussian(x - 690 + 0.18 * (y - 1650), y - 1650, 780, 650);
  const basin = -102 * gaussian(x - 2070, y - 1750, 820, 610);
  const right = 107 * gaussian(x - 3180, y - 500, 650, 530);
  const main = 90 * Math.sin(TAU * (x / 3450 - y / 2780) - 2 * phase + 0.4);
  const secondary = 24 * Math.sin(TAU * (x / 5300 - y / 17300) - phase + 1.7);
  return left + basin + right + quiet * (main + secondary);
};
const vertexAt = (
  point: Point,
  phase: number,
  active = activeAt(phase),
): Vertex => {
  const dx = point.x - active.x,
    dy = point.y - active.y;
  const influence = gaussian(dx, dy, 720, 490);
  // A bounded elliptical radial contraction: center scale >= .79, gentle outer stretch.
  const amount = active.strength * influence;
  const qx = point.x - dx * amount,
    qy = point.y - dy * amount;
  const z = heightAt(qx, qy, phase);
  return { x: qx + 0.14 * z, y: qy - 0.32 * z, qx, qy, z, influence };
};
const verticesAt = (phase: number) => {
  const active = activeAt(phase);
  return BASE_VERTICES.map((point) => vertexAt(point, phase, active));
};
const EDGE_STYLE = EDGES.map(([a, b], i) => {
  const x = (BASE_VERTICES[a].x + BASE_VERTICES[b].x) / 2,
    y = (BASE_VERTICES[a].y + BASE_VERTICES[b].y) / 2;
  return {
    opacity: 0.43 - 0.08 * calmAt(x, y),
    color: mixColor(
      PALETTE.secondary,
      PALETTE.primary,
      0.58 + 0.12 * Math.sin(i * 0.071),
    ),
  };
});
const FACE_STYLE = TRIANGLES.map((_, i) => ({
  visible: (i * 37 + 17) % 101 < 36,
  tint: i % 3 === 0 ? "#54848C" : "#467185",
}));
const triangleShade = (a: Vertex, b: Vertex, c: Vertex) => {
  const ux = b.qx - a.qx,
    uy = b.qy - a.qy,
    uz = b.z - a.z,
    vx = c.qx - a.qx,
    vy = c.qy - a.qy,
    vz = c.z - a.z;
  const nx = uy * vz - uz * vy,
    ny = uz * vx - ux * vz,
    nz = ux * vy - uy * vx;
  const length = Math.hypot(nx, ny, nz);
  return clamp((-0.38 * nx - 0.46 * ny + 0.8 * nz) / length);
};
const faceOpacity = (a: Vertex, b: Vertex, c: Vertex) =>
  0.025 + 0.04 * triangleShade(a, b, c);
const edgePaint = (a: Vertex, b: Vertex, index: number) => {
  const influence = (a.influence + b.influence) / 2;
  return {
    color: rgb(
      mixColor(EDGE_STYLE[index].color, PALETTE.accent, 0.17 * influence),
    ),
    opacity: EDGE_STYLE[index].opacity + 0.055 * influence,
  };
};
const f = (n: number) => n.toFixed(3);

export const AdaptiveMesh = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = phaseAt(frame, Math.round(12 * fps));
  const vertices = verticesAt(phase),
    uid = useId().replace(/:/g, "") + "-adaptive-mesh";
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.petroleum }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient
            id={uid + "-background"}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="2160"
            x2="3840"
            y2="0"
          >
            <stop offset="0" stopColor={PALETTE.navy} />
            <stop offset=".52" stopColor={PALETTE.petroleum} />
            <stop offset="1" stopColor={PALETTE.teal} />
          </linearGradient>
        </defs>
        <rect width="3840" height="2160" fill={`url(#${uid}-background)`} />
        <g stroke="none">
          {TRIANGLES.map(([a, b, c], i) => {
            if (!FACE_STYLE[i].visible) return null;
            const p = vertices[a],
              q = vertices[b],
              r = vertices[c];
            return (
              <path
                key={i}
                d={`M${f(p.x)},${f(p.y)} L${f(q.x)},${f(q.y)} ${f(r.x)},${f(r.y)}Z`}
                fill={FACE_STYLE[i].tint}
                fillOpacity={faceOpacity(p, q, r)}
              />
            );
          })}
        </g>
        <g
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {EDGES.map(([a, b], i) => {
            const p = vertices[a],
              q = vertices[b],
              paint = edgePaint(p, q, i);
            return (
              <path
                key={i}
                d={`M${f(p.x)},${f(p.y)} L${f(q.x)},${f(q.y)}`}
                stroke={paint.color}
                strokeOpacity={paint.opacity}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
