import { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Point = { x: number; y: number };
type Curve = readonly [Point, Point, Point, Point];
type Petal = {
  id: number;
  layer: number;
  front: boolean;
  azimuth: number;
  tilt: number;
  length: number;
  width: number;
  closedLength: number;
  closedWidth: number;
  wrap: number;
  skew: number;
  cup: number;
  start: number;
  duration: number;
  phase: number;
};
type Leaf = {
  attachment: number;
  angle: number;
  length: number;
  width: number;
  bend: number;
  start: number;
  duration: number;
  phase: number;
};
const INK = {
  black: "#000000",
  stem: "#71825E",
  stemLight: "#A0AE83",
  stemShadow: "#46563D",
  leaf: "#788C6D",
  leafLight: "#A6B59A",
  leafShadow: "#4E644B",
  petals: ["#DDA5AD", "#F0C5C7", "#F5DADB"],
  petalShadow: "#B97787",
  petalLight: "#F9E7DF",
  gold: "#D6AF66",
  paleGold: "#E9CF91",
  amber: "#A87943",
};
const radians = (n: number) => (n * Math.PI) / 180;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => {
  const p = clamp(v);
  return p * p * (3 - 2 * p);
};
const growth = (frame: number, start: number, duration: number) =>
  ease((frame - start) / duration);
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const add = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (p: Point, n: number): Point => ({ x: p.x * n, y: p.y * n });
const unit = (p: Point) => mul(p, 1 / Math.hypot(p.x, p.y));
const normal = (p: Point): Point => ({ x: -p.y, y: p.x });
const xy = (p: Point) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
const at = ([a, b, c, d]: Curve, t: number): Point => {
  const u = 1 - t;
  return add(
    add(mul(a, u ** 3), mul(b, 3 * u * u * t)),
    add(mul(c, 3 * u * t * t), mul(d, t ** 3)),
  );
};
const tangent = ([a, b, c, d]: Curve, t: number): Point =>
  add(
    add(mul(sub(b, a), 3 * (1 - t) ** 2), mul(sub(c, b), 6 * (1 - t) * t)),
    mul(sub(d, c), 3 * t * t),
  );
const STEM: Curve = [
  { x: 1920, y: 1950 },
  { x: 1770, y: 1530 },
  { x: 2070, y: 1210 },
  { x: 2000, y: 900 },
];
const makeBotany = () => {
  let seed = 0x4fa621b9;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const vary = (a: number, b: number) => mix(a, b, random());
  // Azimuth is around the flower's axis, not a screen-space radial rotation.
  // The front/back assignment and draw order never change during unfolding.
  const specification = [
    {
      layer: 0,
      azimuth: -154,
      tilt: 70,
      length: 505,
      width: 310,
      start: 125,
      duration: 89,
    },
    {
      layer: 0,
      azimuth: -90,
      tilt: 65,
      length: 510,
      width: 310,
      start: 132,
      duration: 88,
    },
    {
      layer: 0,
      azimuth: -22,
      tilt: 73,
      length: 510,
      width: 325,
      start: 129,
      duration: 91,
    },
    {
      layer: 0,
      azimuth: 48,
      tilt: 84,
      length: 480,
      width: 325,
      start: 138,
      duration: 91,
    },
    {
      layer: 0,
      azimuth: 128,
      tilt: 82,
      length: 470,
      width: 305,
      start: 135,
      duration: 92,
    },
    {
      layer: 1,
      azimuth: -128,
      tilt: 58,
      length: 425,
      width: 268,
      start: 178,
      duration: 92,
    },
    {
      layer: 1,
      azimuth: -55,
      tilt: 61,
      length: 450,
      width: 275,
      start: 185,
      duration: 91,
    },
    {
      layer: 1,
      azimuth: 157,
      tilt: 82,
      length: 390,
      width: 280,
      start: 181,
      duration: 95,
    },
    {
      layer: 2,
      azimuth: -165,
      tilt: 58,
      length: 320,
      width: 205,
      start: 209,
      duration: 75,
    },
    {
      layer: 2,
      azimuth: -30,
      tilt: 57,
      length: 345,
      width: 210,
      start: 213,
      duration: 74,
    },
    {
      layer: 2,
      azimuth: 86,
      tilt: 77,
      length: 300,
      width: 210,
      start: 216,
      duration: 73,
    },
  ];
  const petals: readonly Petal[] = specification.map((p, id) => ({
    ...p,
    id,
    front: p.azimuth > 0,
    azimuth: radians(p.azimuth + vary(-3, 3)),
    tilt: radians(p.tilt + vary(-2, 2)),
    length: p.length * vary(0.98, 1.02),
    width: p.width * vary(0.95, 1.05),
    closedLength:
      (p.layer === 0 ? 305 : p.layer === 1 ? 282 : 250) * vary(0.97, 1.03),
    closedWidth: vary(42, 59) * (1 - p.layer * 0.09),
    wrap: 56 - p.layer * 11 + vary(-3, 3),
    skew: vary(-19, 19),
    cup: vary(29, 43),
    phase: vary(0, Math.PI * 2),
  }));
  const leaves: readonly Leaf[] = [
    {
      attachment: 0.31,
      angle: -0.98,
      length: 262,
      width: 103,
      bend: -30,
      start: 46,
      duration: 45,
      phase: vary(0, 6),
    },
    {
      attachment: 0.53,
      angle: 1.07,
      length: 241,
      width: 92,
      bend: 26,
      start: 61,
      duration: 47,
      phase: vary(0, 6),
    },
    {
      attachment: 0.7,
      angle: -0.88,
      length: 184,
      width: 70,
      bend: -18,
      start: 75,
      duration: 44,
      phase: vary(0, 6),
    },
  ];
  const stamens = Array.from({ length: 14 }, (_, i) => ({
    angle: (Math.PI * 2 * i) / 14 + vary(-0.07, 0.07),
    reach: vary(42, 67),
    height: vary(44, 69),
    size: vary(5, 7.5),
  }));
  const scales = Array.from({ length: 18 }, (_, i) => ({
    row: Math.floor(i / 3),
    col: i % 3,
    skew: vary(-2, 2),
  }));
  return { petals, leaves, stamens, scales };
};
// Seeded parameters are generated once, independently of frame evaluation.
const BOTANY = makeBotany();
const PETAL_SAMPLES = [
  0, 0.07, 0.16, 0.29, 0.44, 0.6, 0.75, 0.87, 0.95, 0.985, 1,
];
const settle = (frame: number) =>
  ease((frame - 286) / 27) * (1 - 0.84 * ease((frame - 315) / 44));
const stemAt = (frame: number): Curve => {
  const drift = settle(frame) * Math.sin((frame - 286) / 43) * 0.8;
  return [
    STEM[0],
    STEM[1],
    add(STEM[2], { x: drift * 0.4, y: 0 }),
    add(STEM[3], { x: drift, y: 0 }),
  ];
};
const openContour = (points: Point[]) => {
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i],
      b = points[i + 1];
    const before = points[Math.max(0, i - 1)],
      after = points[Math.min(points.length - 1, i + 2)];
    d += `C${xy(add(a, mul(sub(b, before), 1 / 6)))} ${xy(sub(b, mul(sub(after, a), 1 / 6)))} ${xy(b)}`;
  }
  return d;
};
const closedContour = (points: Point[]) => {
  let d = `M${xy(points[0])}`;
  for (let i = 0; i < points.length; i++) {
    const before = points[(i - 1 + points.length) % points.length],
      a = points[i];
    const b = points[(i + 1) % points.length],
      after = points[(i + 2) % points.length];
    d += `C${xy(add(a, mul(sub(b, before), 1 / 6)))} ${xy(sub(b, mul(sub(after, a), 1 / 6)))} ${xy(b)}`;
  }
  return d + "Z";
};
const stemWidth = (t: number) => 22 + 44 * (1 - clamp(t)) ** 1.1;
const stemPaths = (curve: Curve, progress: number) => {
  const left: Point[][] = [[], [], []],
    right: Point[][] = [[], [], []];
  const nose = Math.min(progress, 0.045);
  const samples = Array.from({ length: 51 }, (_, i) => i / 50).filter(
    (t) => t < progress,
  );
  for (let i = 0; i <= 8; i++) samples.push(progress - nose + (nose * i) / 8);
  samples.sort((a, b) => a - b);
  for (let i = 0; i < samples.length; i++) {
    const t = samples[i];
    if (i > 0 && t - samples[i - 1] < 0.0000001) continue;
    const center = at(curve, t),
      n = normal(unit(tangent(curve, t)));
    const width = mix(
      stemWidth(t),
      6,
      ease((t - progress + nose) / Math.max(0.000001, nose)),
    );
    for (let layer = 0; layer < 3; layer++) {
      const half = width * (layer === 0 ? 0.5 : layer === 1 ? 0.46 : 0.12);
      const offset = layer === 2 ? -width * 0.21 : 0;
      left[layer].push(add(center, mul(n, offset + half)));
      right[layer].push(add(center, mul(n, offset - half)));
    }
  }
  return left.map((edge, layer) => {
    const opposite = right[layer].reverse(),
      tip = edge[edge.length - 1];
    const forward = unit(tangent(curve, progress)),
      back = unit(tangent(curve, 0));
    return (
      `M${xy(edge[0])}` +
      openContour(edge) +
      `C${xy(add(tip, mul(forward, 3)))} ${xy(add(opposite[0], mul(forward, 3)))} ${xy(opposite[0])}` +
      openContour(opposite) +
      `C${xy(sub(opposite[opposite.length - 1], mul(back, 14 * (layer === 2 ? 0.24 : 1))))} ` +
      `${xy(sub(edge[0], mul(back, 14 * (layer === 2 ? 0.24 : 1))))} ${xy(edge[0])}Z`
    );
  });
};

// A shallow oblique view of a cupped petal surface. This is just arithmetic
// generating SVG curves, with no 3D renderer, simulation or per-frame sorting.
const petalPoint = (
  petal: Petal,
  s: number,
  across: number,
  opening: number,
  formation: number,
  frame: number,
  anchor: Point,
): Point => {
  const widthOpening = ease((opening - 0.08) / 0.92);
  const theta = petal.tilt * opening;
  const length = mix(petal.closedLength, petal.length, opening);
  const attach = 17 - petal.layer * 3;
  const closedR = attach * (1 - s) + petal.wrap * Math.sin(Math.PI * s);
  const openR =
    attach * (1 - s) +
    length * Math.sin(theta) * (s + 0.13 * Math.sin(Math.PI * s)) +
    opening * petal.skew * Math.sin(Math.PI * s);
  const radius = mix(closedR, openR, opening);
  const closedH = petal.closedLength * s;
  const openH =
    length * Math.cos(theta) * s +
    length * 0.105 * Math.sin(Math.PI * s) -
    opening * 19 * s ** 4;
  const profile = Math.max(0, Math.sin(Math.PI * s)) ** 0.62 * (1 - 0.08 * s);
  const width =
    (mix(petal.closedWidth, petal.width, widthOpening) * profile) / 2;
  const transverse =
    across * width + opening * petal.skew * Math.sin(Math.PI * s) * 0.35;
  const cup =
    mix(8, petal.cup, opening) * across * across * Math.sin(Math.PI * s);
  const flutter =
    settle(frame) * Math.sin(frame / 37 + petal.phase) * s * s * 1.1;
  const height = mix(closedH, openH, opening) + cup + flutter;
  const x =
    radius * Math.cos(petal.azimuth) - transverse * Math.sin(petal.azimuth);
  const depth =
    radius * Math.sin(petal.azimuth) + transverse * Math.cos(petal.azimuth);
  return {
    x: anchor.x + x * formation,
    y: anchor.y + (-height * 0.92 + depth * 0.46) * formation,
  };
};
const petalGeometry = (petal: Petal, frame: number, anchor: Point) => {
  const opening = growth(frame, petal.start, petal.duration),
    formation = growth(frame, 69, 52);
  const point = (s: number, v: number) =>
    petalPoint(petal, s, v, opening, formation, frame, anchor);
  const outline = [
    ...PETAL_SAMPLES.map((s) => point(s, -1)),
    ...PETAL_SAMPLES.slice(1, -1)
      .reverse()
      .map((s) => point(s, 1)),
  ];
  const fold = [
    ...PETAL_SAMPLES.map((s) => point(s, 0.18)),
    ...PETAL_SAMPLES.slice(1, -1)
      .reverse()
      .map((s) => point(s, -0.045)),
  ];
  const rim = [0.18, 0.32, 0.49, 0.66, 0.8, 0.91].map((s) => point(s, -0.82));
  return {
    opening,
    formation,
    outline,
    shape: closedContour(outline),
    fold: closedContour(fold),
    rim: `M${xy(rim[0])}` + openContour(rim),
    shadeStart: point(0.52, -1),
    shadeEnd: point(0.58, 1),
  };
};
const leafGeometry = (leaf: Leaf, curve: Curve, frame: number) => {
  const p = growth(frame, leaf.start, leaf.duration),
    anchor = at(curve, leaf.attachment);
  const direction = tangent(curve, leaf.attachment);
  const angle =
    Math.atan2(direction.y, direction.x) +
    leaf.angle * mix(0.45, 1, p) +
    settle(frame) * 0.012 * Math.sin(frame / 34 + leaf.phase);
  const cos = Math.cos(angle),
    sin = Math.sin(angle);
  const point = (x: number, y: number): Point => ({
    x: anchor.x + x * cos - y * sin,
    y: anchor.y + x * sin + y * cos,
  });
  const length = leaf.length * p,
    width = leaf.width * p ** 1.4,
    bend = leaf.bend * p;
  const base = point(length * 0.1, 0),
    tip = point(length, bend);
  const shape =
    `M${xy(base)}C${xy(point(length * 0.3, -width * 0.76))} ` +
    `${xy(point(length * 0.76, bend - width * 0.55))} ${xy(tip)}` +
    `C${xy(point(length * 0.69, bend + width * 0.65))} ${xy(point(length * 0.28, width * 0.81))} ${xy(base)}Z`;
  const vein = `M${xy(anchor)}Q${xy(point(length * 0.48, -width * 0.04))} ${xy(tip)}`;
  const detail = [0.33, 0.48, 0.64, 0.79]
    .flatMap((t) =>
      [-1, 1].map(
        (side) =>
          `M${xy(point(length * t, bend * t * t))}Q${xy(point(length * (t + 0.09), bend * t * t + side * width * 0.15))} ` +
          `${xy(point(length * (t + 0.14), bend * t * t + side * width * (t > 0.7 ? 0.18 : 0.28)))}`,
      ),
    )
    .join("");
  return { progress: p, shape, vein, detail, anchor, tip };
};
const calyxGeometry = (frame: number, anchor: Point) => {
  const p = growth(frame, 76, 43);
  return [-2, -1, 0, 1, 2].map((i) => {
    const x = i * 31 * p,
      y = (-55 - (2 - Math.abs(i)) * 11) * p;
    const base = add(anchor, { x: 0, y: 21 * p });
    const tip = add(anchor, { x, y });
    return (
      `M${xy(base)}C${xy(add(anchor, { x: x * 0.9 - 19 * p, y: y * 0.18 }))} ` +
      `${xy(add(anchor, { x: x * 0.75 - 11 * p, y: y * 0.72 }))} ${xy(tip)}` +
      `C${xy(add(anchor, { x: x * 0.55 + 14 * p, y: y * 0.57 }))} ` +
      `${xy(add(anchor, { x: x * 0.18 + 23 * p, y: 7 * p }))} ${xy(base)}Z`
    );
  });
};
const centerGeometry = (frame: number, anchor: Point) => {
  const p = growth(frame, 222, 49);
  const point = (x: number, y: number) => add(anchor, { x: x * p, y: y * p });
  const body =
    `M${xy(point(-24, -45))}C${xy(point(-31, -89))} ${xy(point(-17, -153))} ${xy(point(0, -166))}` +
    `C${xy(point(22, -149))} ${xy(point(31, -83))} ${xy(point(23, -44))}Z`;
  const scales = BOTANY.scales
    .map(({ row, col, skew }) => {
      const y = -64 - row * 15,
        x = (col - 1) * (15 - row * 1.7) + (row % 2 ? 4 : 0) + skew;
      return (
        `M${xy(point(x - 5, y))}Q${xy(point(x - 7, y - 9))} ${xy(point(x, y - 12))}` +
        `Q${xy(point(x + 6, y - 6))} ${xy(point(x + 5, y + 1))}Z`
      );
    })
    .join("");
  let filaments = "",
    anthers = "";
  for (const stamen of BOTANY.stamens) {
    const x = Math.cos(stamen.angle) * stamen.reach;
    const y = -61 - stamen.height + Math.sin(stamen.angle) * 16;
    const base = point(Math.cos(stamen.angle) * 19, -38);
    const tip = point(x, y);
    filaments += `M${xy(base)}Q${xy(point(x * 0.82, -65 - stamen.height * 0.75))} ${xy(tip)}`;
    const radius = stamen.size;
    anthers +=
      `M${xy(point(x, y - radius))}C${xy(point(x - radius, y - radius * 0.8))} ` +
      `${xy(point(x - radius, y + radius))} ${xy(point(x, y + radius * 1.25))}` +
      `C${xy(point(x + radius, y + radius))} ${xy(point(x + radius, y - radius))} ${xy(point(x, y - radius))}Z`;
  }
  return { progress: p, body, scales, filaments, anthers };
};

export const SculpturalFlowerBloom = () => {
  const currentFrame = useCurrentFrame(),
    { fps } = useVideoConfig();
  const frame = (currentFrame * 30) / fps,
    uid = useId().replace(/:/g, "") + "-magnolia";
  const curve = stemAt(frame),
    anchor = curve[3];
  const stem = stemPaths(curve, growth(frame, -10, 78));
  const petals = BOTANY.petals.map((petal) => ({
    petal,
    ...petalGeometry(petal, frame, anchor),
  }));
  const leaves = BOTANY.leaves.map((leaf) => leafGeometry(leaf, curve, frame));
  const calyx = calyxGeometry(frame, anchor),
    center = centerGeometry(frame, anchor);
  const renderPetals = (front: boolean) =>
    petals
      .filter((p) => p.petal.front === front)
      .map((p) => (
        <g key={p.petal.id}>
          <path d={p.shape} fill={`url(#${uid}-petal-${p.petal.id})`} />
          <path
            d={p.fold}
            fill={INK.petalShadow}
            opacity={mix(0.05, 0.15, p.opening)}
          />
          <path
            d={p.rim}
            fill="none"
            stroke={INK.petalLight}
            strokeWidth="2"
            opacity="0.24"
          />
        </g>
      ));
  return (
    <AbsoluteFill style={{ backgroundColor: INK.black }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        style={{ display: "block" }}
      >
        <defs>
          {petals.map((p) => (
            <linearGradient
              key={p.petal.id}
              id={`${uid}-petal-${p.petal.id}`}
              gradientUnits="userSpaceOnUse"
              x1={p.shadeStart.x}
              y1={p.shadeStart.y}
              x2={p.shadeEnd.x}
              y2={p.shadeEnd.y}
            >
              <stop offset="0" stopColor={INK.petalShadow} />
              <stop offset="0.27" stopColor={INK.petals[p.petal.layer]} />
              <stop offset="0.66" stopColor={INK.petalLight} />
              <stop offset="1" stopColor={INK.petals[p.petal.layer]} />
            </linearGradient>
          ))}
          <linearGradient id={`${uid}-leaf`} x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0" stopColor={INK.leafShadow} />
            <stop offset="0.46" stopColor={INK.leaf} />
            <stop offset="1" stopColor={INK.leafLight} />
          </linearGradient>
          <linearGradient id={`${uid}-center`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={INK.amber} />
            <stop offset="0.55" stopColor={INK.gold} />
            <stop offset="1" stopColor={INK.amber} />
          </linearGradient>
          {leaves.map((leaf, i) => (
            <clipPath
              key={i}
              id={`${uid}-leaf-clip-${i}`}
              clipPathUnits="userSpaceOnUse"
            >
              <path d={leaf.shape} />
            </clipPath>
          ))}
        </defs>
        <rect width="3840" height="2160" fill={INK.black} />
        <path d={stem[0]} fill={INK.stemShadow} />
        <path d={stem[1]} fill={INK.stem} />
        <path d={stem[2]} fill={INK.stemLight} opacity="0.44" />
        {leaves.map(
          (leaf, i) =>
            leaf.progress > 0 && (
              <g key={i}>
                <path d={leaf.shape} fill={`url(#${uid}-leaf)`} />
                <path
                  d={leaf.vein}
                  fill="none"
                  stroke={INK.leafLight}
                  strokeWidth="2.3"
                  opacity="0.7"
                />
                <path
                  d={leaf.detail}
                  clipPath={`url(#${uid}-leaf-clip-${i})`}
                  fill="none"
                  stroke={INK.leafLight}
                  strokeWidth="1.1"
                  opacity="0.28"
                />
              </g>
            ),
        )}
        {frame > 69 && (
          <>
            <path d={calyx.slice(0, 3).join("")} fill={INK.stemShadow} />
            {renderPetals(false)}
            {center.progress > 0 && (
              <g>
                <path
                  d={center.filaments}
                  fill="none"
                  stroke={INK.gold}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path d={center.body} fill={`url(#${uid}-center)`} />
                <path d={center.scales} fill={INK.paleGold} opacity="0.83" />
                <path d={center.anthers} fill={INK.paleGold} />
              </g>
            )}
            {renderPetals(true)}
            <path d={calyx.slice(3).join("")} fill={INK.stem} />
            <path d={calyx[2]} fill={INK.stemLight} opacity="0.48" />
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};
