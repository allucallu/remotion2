import { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Point = { x: number; y: number };
type Vector = Point & { z: number };
type Curve = readonly [Point, Point, Point, Point];
type Spot = { s: number; across: number; size: number; slant: number };
type Tepal = {
  id: number;
  outer: boolean;
  front: boolean;
  depth: number;
  azimuth: number;
  length: number;
  width: number;
  closedLength: number;
  skew: number;
  cup: number;
  recurve: number;
  perspective: number;
  start: number;
  duration: number;
  curlStart: number;
  curlDuration: number;
  phase: number;
  spots: readonly Spot[];
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
type Stamen = {
  id: number;
  tip: Vector;
  bend: number;
  antherAngle: number;
  phase: number;
};
const INK = {
  black: "#000000",
  stem: "#647653",
  stemLight: "#A1AF83",
  stemDark: "#394B36",
  leaf: "#718660",
  leafLight: "#A4B18C",
  leafDark: "#465B3D",
  ivory: "#F4EEE3",
  white: "#FFF7ED",
  blush: "#E7B6BC",
  rose: "#D993A4",
  throat: "#B76B82",
  shadow: "#BFA4A1",
  bud: "#CFD7AF",
  budDark: "#879D6B",
  filament: "#D6DBB5",
  filamentLight: "#F4EED9",
  style: "#C4CF9B",
  amber: "#B77A3F",
  amberDark: "#85512F",
  amberLight: "#D7A269",
};
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
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const colorMix = (a: string, b: string, p: number) => {
  const channel = (hex: string, i: number) =>
    parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `rgb(${[0, 1, 2].map((i) => Math.round(mix(channel(a, i), channel(b, i), p))).join(",")})`;
};
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
  { x: 1750, y: 2050 },
  { x: 1600, y: 1620 },
  { x: 2048, y: 1400 },
  { x: 2040, y: 1020 },
];
const PEDICEL: Curve = [
  STEM[3],
  { x: 2040, y: 958 },
  { x: 2069, y: 891 },
  { x: 2100, y: 850 },
];
const LONGITUDINAL = Array.from({ length: 41 }, (_, i) => i / 40);
const STEM_SAMPLES = Array.from({ length: 61 }, (_, i) => i / 60);

const makeBotany = () => {
  let seed = 0x79d46c21;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const vary = (a: number, b: number) => mix(a, b, random());
  // Alternating outer/inner whorls: 88/208/328 and 28/148/268 degrees.
  // Length and pitch variations are constrained by a deliberately oval canopy.
  const layout = [
    {
      angle: 88,
      outer: true,
      front: false,
      depth: 0,
      length: 760,
      width: 294,
      start: 147,
      duration: 87,
      curlStart: 221,
      curlDuration: 72,
    },
    {
      angle: 28,
      outer: false,
      front: false,
      depth: 2,
      length: 900,
      width: 246,
      start: 189,
      duration: 93,
      curlStart: 237,
      curlDuration: 65,
    },
    {
      angle: 328,
      outer: true,
      front: true,
      depth: 4,
      length: 950,
      width: 303,
      start: 157,
      duration: 89,
      curlStart: 228,
      curlDuration: 72,
    },
    {
      angle: 268,
      outer: false,
      front: true,
      depth: 5,
      length: 770,
      width: 250,
      start: 201,
      duration: 91,
      curlStart: 244,
      curlDuration: 61,
    },
    {
      angle: 208,
      outer: true,
      front: true,
      depth: 3,
      length: 940,
      width: 310,
      start: 152,
      duration: 89,
      curlStart: 225,
      curlDuration: 74,
    },
    {
      angle: 148,
      outer: false,
      front: false,
      depth: 1,
      length: 920,
      width: 245,
      start: 195,
      duration: 92,
      curlStart: 241,
      curlDuration: 64,
    },
  ];
  const tepals: readonly Tepal[] = layout
    .map((p, id) => ({
      ...p,
      id,
      azimuth: rad(p.angle + vary(-2.5, 2.5)),
      length: p.length * vary(0.985, 1.015),
      width: p.width * vary(0.95, 1.05),
      closedLength: vary(398, 425) - (p.outer ? 0 : 17),
      skew: vary(-21, 21),
      cup: vary(29, 46),
      recurve: vary(0.82, 0.96),
      perspective: p.front ? vary(1.04, 1.11) : vary(0.84, 0.93),
      phase: vary(0, Math.PI * 2),
      spots: Array.from(
        {
          length:
            id === 0 ? 10 : id === 1 ? 12 : id === 2 ? 16 : id === 3 ? 14 : 11,
        },
        () => ({
          s: 0.16 + random() ** 1.8 * 0.43,
          across: vary(-0.67, 0.67),
          size: vary(3, 5.7),
          slant: vary(-0.5, 0.5),
        }),
      ),
    }))
    .sort((a, b) => a.depth - b.depth);
  const leaves: readonly Leaf[] = [
    {
      attachment: 0.29,
      angle: -1.18,
      length: 440,
      width: 118,
      bend: -35,
      start: 46,
      duration: 43,
      phase: vary(0, 6),
    },
    {
      attachment: 0.52,
      angle: 1.1,
      length: 395,
      width: 106,
      bend: -35,
      start: 65,
      duration: 43,
      phase: vary(0, 6),
    },
    {
      attachment: 0.73,
      angle: -0.92,
      length: 315,
      width: 85,
      bend: -22,
      start: 82,
      duration: 38,
      phase: vary(0, 6),
    },
  ];
  const tips: readonly Vector[] = [
    { x: -195, y: 125, z: 205 },
    { x: -52, y: 205, z: 210 },
    { x: 142, y: 168, z: 232 },
    { x: -145, y: -62, z: 255 },
    { x: 38, y: -102, z: 267 },
    { x: 188, y: -20, z: 244 },
  ];
  const stamens: readonly Stamen[] = tips.map((tip, id) => ({
    id,
    tip,
    bend: vary(-19, 19),
    antherAngle: vary(-0.58, 0.58),
    phase: vary(0, 6),
  }));
  return { tepals, leaves, stamens };
};
// Shared immutable botanical parameters; no seeded topology is rebuilt per frame.
const BOTANY = makeBotany();
const settle = (frame: number) =>
  ease((frame - 299) / 23) * (1 - 0.84 * ease((frame - 324) / 35));
const poseAt = (frame: number) => {
  const drift = settle(frame) * Math.sin((frame - 299) / 41) * 0.8;
  const stem: Curve = [
    STEM[0],
    STEM[1],
    add(STEM[2], { x: drift * 0.4, y: 0 }),
    add(STEM[3], { x: drift, y: 0 }),
  ];
  const pedicel: Curve = [
    stem[3],
    add(PEDICEL[1], { x: drift, y: 0 }),
    add(PEDICEL[2], { x: drift * 1.2, y: 0 }),
    add(PEDICEL[3], { x: drift * 1.3, y: 0 }),
  ];
  return { stem, pedicel, throat: pedicel[3] };
};

// Orthographic local flower coordinates, viewed 25 degrees off-axis with a
// gentle elevation. Azimuth, axial depth and transverse cupping all project
// through this same basis, including every spot and reproductive structure.
const project = (p: Vector, origin: Point): Point => ({
  x: origin.x + 0.9063078 * p.x + 0.4226183 * p.z,
  y: origin.y - (-0.0878673 * p.x + 0.9781476 * p.y + 0.1884318 * p.z),
});
const openContour = (points: Point[]) => {
  let path = "";
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i],
      b = points[i + 1],
      before = points[Math.max(0, i - 1)],
      after = points[Math.min(points.length - 1, i + 2)];
    path += `C${xy(add(a, mul(sub(b, before), 1 / 6)))} ${xy(sub(b, mul(sub(after, a), 1 / 6)))} ${xy(b)}`;
  }
  return path;
};
const closedContour = (points: Point[]) => {
  let path = `M${xy(points[0])}`;
  for (let i = 0; i < points.length; i++) {
    const before = points[(i - 1 + points.length) % points.length],
      a = points[i];
    const b = points[(i + 1) % points.length],
      after = points[(i + 2) % points.length];
    path += `C${xy(add(a, mul(sub(b, before), 1 / 6)))} ${xy(sub(b, mul(sub(after, a), 1 / 6)))} ${xy(b)}`;
  }
  return path + "Z";
};
const widthAt = (t: number, base: number, tip: number) =>
  tip + (base - tip) * (1 - clamp(t)) ** 1.08;
const stemRibbon = (
  curve: Curve,
  progress: number,
  base: number,
  tip: number,
) => {
  if (progress <= 0) return ["", "", ""];
  const nose = Math.min(progress, 0.045),
    samples = STEM_SAMPLES.filter((t) => t < progress);
  for (let i = 0; i <= 8; i++) samples.push(progress - nose + (nose * i) / 8);
  samples.sort((a, b) => a - b);
  const left: Point[][] = [[], [], []],
    right: Point[][] = [[], [], []];
  for (let i = 0; i < samples.length; i++) {
    const t = samples[i];
    if (i > 0 && t - samples[i - 1] < 0.0000001) continue;
    const center = at(curve, t),
      n = normal(unit(tangent(curve, t)));
    const width = mix(
      widthAt(t, base, tip),
      6,
      ease((t - progress + nose) / Math.max(nose, 0.000001)),
    );
    for (let layer = 0; layer < 3; layer++) {
      const radius = width * (layer === 0 ? 0.5 : layer === 1 ? 0.46 : 0.11),
        offset = layer === 2 ? -0.22 * width : 0;
      left[layer].push(add(center, mul(n, offset + radius)));
      right[layer].push(add(center, mul(n, offset - radius)));
    }
  }
  return left.map((edge, layer) => {
    const opposite = right[layer].reverse(),
      end = edge[edge.length - 1],
      forward = unit(tangent(curve, progress));
    const back = unit(tangent(curve, 0)),
      cap = base * (layer === 2 ? 0.06 : 0.23);
    return (
      `M${xy(edge[0])}` +
      openContour(edge) +
      `C${xy(add(end, mul(forward, 3)))} ${xy(add(opposite[0], mul(forward, 3)))} ${xy(opposite[0])}` +
      openContour(opposite) +
      `C${xy(sub(opposite[opposite.length - 1], mul(back, cap)))} ${xy(sub(edge[0], mul(back, cap)))} ${xy(edge[0])}Z`
    );
  });
};

const tepalAxis = (
  tepal: Tepal,
  s: number,
  opening: number,
  curl: number,
  formation: number,
  frame: number,
  origin: Point,
): Point => {
  // Keep the basal 70% of each tepal stable. Recurving is a broad,
  // smooth bend rather than a tightly rolled hook at the very tip.
  const q = ease((s - 0.62) / 0.38);
  const hook = curl * tepal.recurve * q;
  const budLength = Math.sqrt(1 + 0.88 * 0.88);
  const budY = 0.88 / budLength;
  const budZ = 1 / budLength;
  const angle = Math.acos(budY * Math.sin(tepal.azimuth));
  const from = Math.sin((1 - opening) * angle) / Math.sin(angle);
  const to = Math.sin(opening * angle) / Math.sin(angle);
  const distance = mix(
    tepal.closedLength * budLength * s,
    tepal.length * tepal.perspective * (0.25 * s + 0.75 * ease(s)),
    opening,
  );
  const radius =
    (1 - opening) *
      (8 * (1 - s) + (tepal.outer ? 35 : 28) * Math.sin(Math.PI * s)) -
    opening * tepal.length * 0.035 * hook;
  const axial =
    opening * tepal.length *
    (0.11 * Math.sin(Math.PI * s) - 0.075 * hook);
  const lateral =
    opening * tepal.skew * Math.sin(Math.PI * s) +
    opening * hook * tepal.length * 0.018 * (tepal.outer ? -1 : 1);
  const breathe =
    settle(frame) * Math.sin(frame / 41 + tepal.phase) * 1.15 * s * s;
  return project(
    {
      x: (
        distance * to * Math.cos(tepal.azimuth) +
        radius * Math.cos(tepal.azimuth) -
        lateral * Math.sin(tepal.azimuth)
      ) * formation,
      y: (
        distance * (from * budY + to * Math.sin(tepal.azimuth)) +
        radius * Math.sin(tepal.azimuth) +
        lateral * Math.cos(tepal.azimuth)
      ) * formation,
      z: (distance * from * budZ + axial + breathe) * formation,
    },
    origin,
  );
};
const tepalPoint = (
  tepal: Tepal,
  s: number,
  across: number,
  opening: number,
  curl: number,
  formation: number,
  frame: number,
  origin: Point,
): Point => {
  const center = tepalAxis(tepal, s, opening, curl, formation, frame, origin);
  // Tangent-based width without curvature-driven singularities.
  // The previous curvature/clearance limiter collapsed the edges into
  // narrow hooks near the tips, especially during full recurving.
  const epsilon = 0.002;
  const before = tepalAxis(
    tepal, Math.max(0, s - epsilon), opening, curl, formation, frame, origin,
  );
  const after = tepalAxis(
    tepal, Math.min(1, s + epsilon), opening, curl, formation, frame, origin,
  );
  const velocity = sub(after, before);
  const speed = Math.max(0.00001, Math.hypot(velocity.x, velocity.y));
  const profile =
    Math.max(0, Math.sin(Math.PI * s)) ** 0.88 *
    (0.52 + 0.48 * ease(s / 0.43));
  const halfWidth =
    mix(tepal.outer ? 49 : 41, tepal.width, ease(opening)) *
    profile * formation / 2;
  const tipRecurve = ease((s - 0.62) / 0.38);
  const width = halfWidth * (1 - 0.16 * curl * tipRecurve);
  const n = {
    x: velocity.y / Math.max(speed, 0.00000001),
    y: -velocity.x / Math.max(speed, 0.00000001),
  };
  const cup =
    opening *
    tepal.cup *
    0.6 *
    (1 - ease((s - 0.6) / 0.35)) *
    across *
    across *
    Math.sin(Math.PI * s) *
    formation *
    (halfWidth > 0 ? width / halfWidth : 0);
  return {
    x: center.x + n.x * across * width + 0.4226183 * cup,
    y: center.y + n.y * across * width - 0.1884318 * cup,
  };
};
const tepalGeometry = (tepal: Tepal, frame: number, origin: Point) => {
  const opening = growth(frame, tepal.start, tepal.duration),
    curl = growth(frame, tepal.curlStart, tepal.curlDuration);
  const formation = growth(frame, 94, 59);
  const point = (s: number, v: number) =>
    tepalPoint(tepal, s, v, opening, curl, formation, frame, origin);
  const outline = [
    ...LONGITUDINAL.map((s) => point(s, -1)),
    ...LONGITUDINAL.slice(1, -1)
      .reverse()
      .map((s) => point(s, 1)),
  ];
  const veins = [-0.42, 0, 0.42]
    .map((v) => {
      const points = LONGITUDINAL.filter((s) => s >= 0.075 && s <= 0.95).map(
        (s) => point(s, v + 0.045 * Math.sin(Math.PI * s)),
      );
      return `M${xy(points[0])}` + openContour(points);
    })
    .join("");
  const foldSamples = LONGITUDINAL.filter((s) => s >= 0.775);
  const underside = closedContour([
    ...foldSamples.map((s) => point(s, -0.92)),
    ...foldSamples
      .slice(0, -1)
      .reverse()
      .map((s) => point(s, -0.04)),
  ]);
  const spots = tepal.spots
    .map((spot) => {
      const profile = Math.max(0.25, Math.sin(Math.PI * spot.s) ** 0.76);
      const ds = (spot.size * 0.85) / tepal.length,
        dv = (spot.size * 0.72) / ((tepal.width * profile) / 2);
      return closedContour(
        Array.from({ length: 8 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 8;
          return point(
            spot.s + ds * Math.cos(angle),
            spot.across +
              dv * Math.sin(angle) +
              spot.slant * dv * Math.cos(angle),
          );
        }),
      );
    })
    .join("");
  return {
    opening,
    curl,
    formation,
    outline,
    shape: closedContour(outline),
    veins,
    underside,
    spots,
    left: point(0.5, -1),
    right: point(0.5, 1),
    base: point(0, 0),
    tip: point(0.9, 0),
  };
};
const leafGeometry = (leaf: Leaf, curve: Curve, frame: number) => {
  const progress = growth(frame, leaf.start, leaf.duration),
    anchor = at(curve, leaf.attachment);
  const tangentAt = tangent(curve, leaf.attachment);
  const angle =
    Math.atan2(tangentAt.y, tangentAt.x) +
    leaf.angle * mix(0.45, 1, progress) +
    settle(frame) * Math.sin(frame / 39 + leaf.phase) * 0.012;
  const cos = Math.cos(angle),
    sin = Math.sin(angle);
  const point = (s: number, v: number): Point => {
    const x = leaf.length * s * progress;
    const y =
      (leaf.bend * s * s +
        ((v * leaf.width) / 2) *
          Math.sin(Math.PI * s) ** 0.85 *
          progress ** 0.45) *
      progress;
    return { x: anchor.x + x * cos - y * sin, y: anchor.y + x * sin + y * cos };
  };
  const samples = LONGITUDINAL.filter((_, i) => i % 2 === 0);
  const outline = [
    ...samples.map((s) => point(s, -1)),
    ...samples
      .slice(1, -1)
      .reverse()
      .map((s) => point(s, 1)),
  ];
  const veins = [-0.34, 0, 0.34]
    .map((v) => {
      const points = samples.map((s) => point(s, v));
      return `M${xy(points[0])}` + openContour(points);
    })
    .join("");
  return { progress, anchor, shape: closedContour(outline), veins };
};
const reproductiveGeometry = (frame: number, origin: Point) => {
  const stamens = BOTANY.stamens.map((stamen) => {
    const p = growth(frame, 214 + stamen.id * 3, 52);
    const wave = settle(frame) * Math.sin(frame / 32 + stamen.phase) * 1.1;
    const tip = project(
      { x: stamen.tip.x * p + wave, y: stamen.tip.y * p, z: stamen.tip.z * p },
      origin,
    );
    const base = project({ x: (stamen.id - 2.5) * 3, y: 0, z: 3 }, origin);
    const c1 = project(
      {
        x: stamen.tip.x * p * 0.22,
        y: stamen.tip.y * p * 0.1,
        z: stamen.tip.z * p * 0.54,
      },
      origin,
    );
    const c2 = project(
      {
        x: (stamen.tip.x * 0.72 + stamen.bend) * p,
        y: stamen.tip.y * p * 0.81,
        z: stamen.tip.z * p * 0.91,
      },
      origin,
    );
    const angle =
      Math.atan2(tip.y - c2.y, tip.x - c2.x) + Math.PI / 2 + stamen.antherAngle;
    const local = (x: number, y: number) => ({
      x: tip.x + (x * Math.cos(angle) - y * Math.sin(angle)) * p,
      y: tip.y + (x * Math.sin(angle) + y * Math.cos(angle)) * p,
    });
    const anther =
      `M${xy(local(-23, -1))}C${xy(local(-23, -9))} ${xy(local(-4, -11))} ${xy(local(18, -6))}` +
      `C${xy(local(29, -1))} ${xy(local(26, 7))} ${xy(local(13, 9))}C${xy(local(-5, 11))} ${xy(local(-22, 7))} ${xy(local(-23, -1))}Z`;
    const seam = `M${xy(local(-17, 0))}Q${xy(local(3, -4))} ${xy(local(20, 1))}`;
    return {
      id: stamen.id,
      progress: p,
      filament: `M${xy(base)}C${xy(c1)} ${xy(c2)} ${xy(tip)}`,
      tip,
      anther,
      seam,
    };
  });
  const p = growth(frame, 235, 56),
    sway = settle(frame) * Math.sin(frame / 43) * 0.9;
  const styleTip = project(
    { x: 93 * p + sway, y: 173 * p, z: 322 * p },
    origin,
  );
  const c1 = project({ x: 7 * p, y: 25 * p, z: 137 * p }, origin),
    c2 = project({ x: 72 * p, y: 135 * p, z: 286 * p }, origin);
  const style = `M${xy(origin)}C${xy(c1)} ${xy(c2)} ${xy(styleTip)}`;
  const local = (x: number, y: number) => add(styleTip, { x: x * p, y: y * p });
  // Three joined stigma lobes, carried by one style rather than a seventh anther.
  const stigma =
    `M${xy(local(-2, 3))}C${xy(local(-20, 4))} ${xy(local(-21, -10))} ${xy(local(-10, -13))}` +
    `C${xy(local(-12, -27))} ${xy(local(7, -28))} ${xy(local(10, -14))}` +
    `C${xy(local(25, -18))} ${xy(local(28, -1))} ${xy(local(13, 4))}C${xy(local(7, 9))} ${xy(local(1, 9))} ${xy(local(-2, 3))}Z`;
  return { stamens, style, stigma, styleProgress: p, styleTip };
};

export const LilyNocturneBloom = () => {
  const currentFrame = useCurrentFrame(),
    { fps } = useVideoConfig();
  const frame = (currentFrame * 30) / fps,
    uid = useId().replace(/:/g, "") + "-lily-nocturne";
  const pose = poseAt(frame);
  const stem = stemRibbon(pose.stem, growth(frame, -12, 82), 94, 38);
  const pedicel = stemRibbon(pose.pedicel, growth(frame, 67, 28), 38, 27);
  const leaves = BOTANY.leaves.map((leaf) =>
    leafGeometry(leaf, pose.stem, frame),
  );
  const tepals = BOTANY.tepals.map((tepal) => ({
    tepal,
    ...tepalGeometry(tepal, frame, pose.throat),
  }));
  const center = reproductiveGeometry(frame, pose.throat);
  const renderTepals = (front: boolean) =>
    tepals
      .filter((p) => p.tepal.front === front)
      .map((p) => (
        <g key={p.tepal.id}>
          <path d={p.shape} fill={`url(#${uid}-surface-${p.tepal.id})`} />
          <path d={p.shape} fill={`url(#${uid}-throat-${p.tepal.id})`} />
          <g clipPath={`url(#${uid}-clip-${p.tepal.id})`}>
            <path
              d={p.veins}
              fill="none"
              stroke={INK.throat}
              strokeWidth={p.tepal.outer ? 1.4 : 1.9}
              opacity={mix(0.13, 0.27, p.opening)}
            />
            <path
              d={p.spots}
              fill={INK.throat}
              opacity={ease((p.opening - 0.24) / 0.42) * 0.76}
            />
            <path d={p.underside} fill={INK.white} opacity={p.curl * 0.19} />
          </g>
        </g>
      ));
  const renderStamens = (front: boolean) =>
    center.stamens
      .filter((s) => s.id >= 3 === front)
      .map(
        (s) =>
          s.progress > 0 && (
            <g key={s.id}>
              <path
                d={s.filament}
                fill="none"
                stroke={INK.filament}
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d={s.filament}
                fill="none"
                stroke={INK.filamentLight}
                strokeWidth="2"
                opacity="0.7"
              />
              <path d={s.anther} fill={`url(#${uid}-anther)`} />
              <path
                d={s.seam}
                fill="none"
                stroke={INK.amberDark}
                strokeWidth="1.8"
                opacity="0.7"
              />
            </g>
          ),
      );
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
          {tepals.map((p) => (
            <g key={p.tepal.id}>
              <linearGradient
                id={`${uid}-surface-${p.tepal.id}`}
                gradientUnits="userSpaceOnUse"
                x1={p.left.x}
                y1={p.left.y}
                x2={p.right.x}
                y2={p.right.y}
              >
                <stop offset="0" stopColor={INK.ivory} />
                <stop offset="0.18" stopColor={INK.white} />
                <stop
                  offset="0.45"
                  stopColor={colorMix(INK.bud, INK.blush, p.opening)}
                />
                <stop
                  offset="0.59"
                  stopColor={colorMix(INK.bud, INK.rose, p.opening)}
                />
                <stop offset="0.86" stopColor={INK.ivory} />
                <stop offset="1" stopColor={INK.shadow} />
              </linearGradient>
              <linearGradient
                id={`${uid}-throat-${p.tepal.id}`}
                gradientUnits="userSpaceOnUse"
                x1={p.base.x}
                y1={p.base.y}
                x2={p.tip.x}
                y2={p.tip.y}
              >
                <stop
                  offset="0"
                  stopColor={colorMix(INK.budDark, INK.throat, p.opening)}
                  stopOpacity="0.85"
                />
                <stop
                  offset="0.32"
                  stopColor={colorMix(INK.bud, INK.blush, p.opening)}
                  stopOpacity="0.24"
                />
                <stop offset="0.78" stopColor={INK.ivory} stopOpacity="0" />
              </linearGradient>
              <clipPath
                id={`${uid}-clip-${p.tepal.id}`}
                clipPathUnits="userSpaceOnUse"
              >
                <path d={p.shape} />
              </clipPath>
            </g>
          ))}
          {leaves.map((leaf, i) => (
            <clipPath key={i} id={`${uid}-leaf-${i}`}>
              <path d={leaf.shape} />
            </clipPath>
          ))}
          <linearGradient id={`${uid}-leaf-fill`} x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0" stopColor={INK.leafDark} />
            <stop offset="0.5" stopColor={INK.leaf} />
            <stop offset="1" stopColor={INK.leafLight} />
          </linearGradient>
          <linearGradient id={`${uid}-anther`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={INK.amberDark} />
            <stop offset="0.42" stopColor={INK.amberLight} />
            <stop offset="0.7" stopColor={INK.amber} />
            <stop offset="1" stopColor={INK.amberDark} />
          </linearGradient>
        </defs>
        <rect width="3840" height="2160" fill={INK.black} />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={stem[i] + pedicel[i]}
            fill={[INK.stemDark, INK.stem, INK.stemLight][i]}
            opacity={i === 2 ? 0.44 : 1}
          />
        ))}
        {leaves.map(
          (leaf, i) =>
            leaf.progress > 0 && (
              <g key={i}>
                <path d={leaf.shape} fill={`url(#${uid}-leaf-fill)`} />
                <path
                  d={leaf.veins}
                  fill="none"
                  stroke={INK.leafLight}
                  strokeWidth="1.5"
                  opacity="0.57"
                  clipPath={`url(#${uid}-leaf-${i})`}
                />
              </g>
            ),
        )}
        {frame > 94 && (
          <>
            {renderTepals(false)}
            {renderStamens(false)}
            {renderTepals(true)}
            {renderStamens(true)}
            {center.styleProgress > 0 && (
              <g>
                <path
                  d={center.style}
                  fill="none"
                  stroke={INK.style}
                  strokeWidth="7.2"
                  strokeLinecap="round"
                />
                <path
                  d={center.style}
                  fill="none"
                  stroke={INK.filamentLight}
                  strokeWidth="2"
                  opacity="0.7"
                />
                <path d={center.stigma} fill={INK.style} />
                <path
                  d={center.stigma}
                  fill="none"
                  stroke={INK.stemLight}
                  strokeWidth="1"
                />
              </g>
            )}
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};
