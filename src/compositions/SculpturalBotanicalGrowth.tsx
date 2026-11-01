import {
  AbsoluteFill,
  useCurrentFrame,
  useRemotionEnvironment,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const sculpturalBotanicalSchema = z.object({
  quality: z.enum(["production", "preview"]).default("production"),
});
type Props = z.infer<typeof sculpturalBotanicalSchema>;
type Point = { x: number; y: number };
type Curve = readonly [Point, Point, Point, Point];
type Leaf = {
  id: number;
  attachment: number;
  angle: number;
  length: number;
  width: number;
  bend: number;
  fullness: number;
  start: number;
  duration: number;
  phase: number;
  shade: number;
};
type Branch = {
  id: number;
  parent: number | null;
  depth: number;
  attachment: number;
  curve: Curve;
  length: number;
  baseWidth: number;
  tipWidth: number;
  start: number;
  duration: number;
  phase: number;
  samples: readonly number[];
  leaves: Leaf[];
};
const COLORS = {
  background: "#000000",
  wood: "#8B6548",
  highlight: "#B58B65",
  edge: "#5E4334",
  secondary: "#987453",
  foliage: ["#829477", "#A8B79B", "#5E735B"],
};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => {
  const p = clamp(v);
  return p * p * (3 - 2 * p);
};
const growth = (frame: number, start: number, duration: number) =>
  ease((frame - start) / duration);
const add = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: Point, n: number): Point => ({ x: a.x * n, y: a.y * n });
const rotate = (p: Point, angle: number): Point => ({
  x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
  y: p.x * Math.sin(angle) + p.y * Math.cos(angle),
});
const unit = (p: Point) => mul(p, 1 / Math.hypot(p.x, p.y));
const normal = (p: Point): Point => ({ x: -p.y, y: p.x });
const heading = (p: Point) => Math.atan2(p.y, p.x);
const at = ([a, b, c, d]: Curve, t: number): Point => {
  const u = 1 - t;
  return add(
    add(mul(a, u ** 3), mul(b, 3 * u * u * t)),
    add(mul(c, 3 * u * t * t), mul(d, t ** 3)),
  );
};
const tangent = ([a, b, c, d]: Curve, t: number) =>
  add(
    add(mul(sub(b, a), 3 * (1 - t) ** 2), mul(sub(c, b), 6 * (1 - t) * t)),
    mul(sub(d, c), 3 * t * t),
  );
const mapCurve = (curve: Curve, fn: (p: Point, i: number) => Point): Curve => [
  fn(curve[0], 0),
  fn(curve[1], 1),
  fn(curve[2], 2),
  fn(curve[3], 3),
];
const xy = (p: Point) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
const curveLength = (curve: Curve) => {
  let length = 0,
    previous = curve[0];
  for (let i = 1; i <= 40; i++) {
    const p = at(curve, i / 40);
    length += Math.hypot(p.x - previous.x, p.y - previous.y);
    previous = p;
  }
  return length;
};
const arrival = (branch: Branch, t: number) => {
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (ease(mid) < t) lo = mid;
    else hi = mid;
  }
  return branch.start + hi * branch.duration;
};

const createPlant = (): readonly Branch[] => {
  let seed = 0x3b57a912,
    leafId = 0;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const vary = (lo: number, hi: number) => lo + (hi - lo) * random();
  const branches: Branch[] = [];
  const register = (
    parent: Branch | null,
    attachment: number,
    curve: Curve,
    depth: number,
    width: number,
    tip: number,
    start: number,
    duration: number,
  ): Branch => {
    const length = curveLength(curve),
      steps = Math.max(12, Math.ceil(length / 32));
    const branch: Branch = {
      id: branches.length,
      parent: parent?.id ?? null,
      depth,
      attachment,
      curve,
      length,
      baseWidth: width,
      tipWidth: tip,
      start,
      duration,
      phase: vary(0, Math.PI * 2),
      samples: Array.from({ length: steps + 1 }, (_, i) => i / steps),
      leaves: [],
    };
    branches.push(branch);
    return branch;
  };
  const leaf = (branch: Branch, t: number, side: number, size: number) => {
    const length = Math.max(35, Math.min(85, size * vary(0.89, 1.12)));
    const phase = vary(0, Math.PI * 2),
      shade = random();
    branch.leaves.push({
      id: leafId++,
      attachment: t,
      angle: side * vary(0.58, 1.08),
      length,
      width: Math.max(14, Math.min(35, length * vary(0.32, 0.44))),
      bend: length * vary(-0.14, 0.18),
      fullness: vary(0.88, 1.12),
      start: Math.max(
        arrival(branch, t) + vary(6, 13),
        171 + vary(0, 61) + t * 16 + branch.depth * 4,
      ),
      duration: vary(29, 41),
      phase,
      shade: shade < 0.22 ? 1 : shade > 0.81 ? 2 : 0,
    });
  };
  // Determinate lateral shoots: one continuing axis, staggered side growth,
  // and occasional short branchlets. No repeating binary fork grammar.
  const shoot = (
    parent: Branch,
    attachment: number,
    side: number,
    size: number,
    depth: number,
    ordinal: number,
  ): Branch => {
    const origin = at(parent.curve, attachment);
    const parentDirection = unit(tangent(parent.curve, attachment));
    const angle = heading(parentDirection) + side * vary(0.55, 0.95);
    const endDirection = rotate({ x: 1, y: 0 }, angle);
    const end = add(origin, mul(endDirection, size));
    const bend = normal(endDirection);
    const curve: Curve = [
      origin,
      add(origin, mul(parentDirection, size * 0.28)),
      add(
        sub(end, mul(endDirection, size * 0.29)),
        mul(bend, side * size * 0.15),
      ),
      end,
    ];
    const start = Math.max(
      arrival(parent, attachment) + vary(5, 11),
      depth === 2 ? 121 + ordinal * 2.8 + vary(0, 12) : 163 + vary(0, 11),
    );
    const branch = register(
      parent,
      attachment,
      curve,
      depth,
      depth === 2 ? vary(9.5, 13.5) : vary(5.2, 6.7),
      depth === 2 ? 3.5 : 2.8,
      start,
      depth === 2 ? vary(33, 44) : vary(24, 32),
    );
    if (depth === 2) {
      for (let j = 0; j < 5; j++) {
        leaf(branch, 0.3 + j * 0.14, j % 2 ? -1 : 1, 75 - j * 4.2);
      }
      leaf(branch, 0.99, side * 0.22, 61);
      if (ordinal % 2 === 0)
        shoot(
          branch,
          vary(0.58, 0.72),
          -side,
          size * vary(0.37, 0.47),
          3,
          ordinal,
        );
    } else {
      leaf(branch, 0.48, side, 48);
      leaf(branch, 0.76, -side, 45);
      leaf(branch, 0.99, side * 0.15, 49);
    }
    return branch;
  };
  const trunk = register(
    null,
    0,
    [
      { x: 1920, y: 1900 },
      { x: 1640, y: 1445 },
      { x: 2290, y: 900 },
      { x: 1990, y: 365 },
    ],
    0,
    66,
    5.5,
    -12,
    138,
  );
  // Seven art-directed scaffolds define the canopy. Seeded variation stays
  // inside this silhouette envelope rather than letting recursion choose it.
  const scaffold = [
    { t: 0.22, side: -1, reach: 775, rise: 380, width: 29 },
    { t: 0.34, side: 1, reach: 850, rise: 310, width: 28 },
    { t: 0.47, side: -1, reach: 810, rise: 390, width: 27 },
    { t: 0.59, side: 1, reach: 705, rise: 300, width: 26 },
    { t: 0.7, side: -1, reach: 570, rise: 335, width: 24 },
    { t: 0.8, side: 1, reach: 405, rise: 260, width: 21 },
    { t: 0.88, side: -1, reach: 285, rise: 205, width: 18 },
  ];
  for (const [i, spec] of scaffold.entries()) {
    const t = spec.t + vary(-0.006, 0.006),
      origin = at(trunk.curve, t);
    const reach = spec.reach * vary(0.97, 1.03),
      rise = spec.rise * vary(0.94, 1.06);
    const end = add(origin, { x: spec.side * reach, y: -rise });
    const curve: Curve = [
      origin,
      add(origin, mul(unit(tangent(trunk.curve, t)), reach * 0.29)),
      add(end, { x: -spec.side * reach * 0.31, y: reach * 0.11 }),
      end,
    ];
    const major = register(
      trunk,
      t,
      curve,
      1,
      spec.width,
      4.5,
      Math.max(50 + i * 5.1, arrival(trunk, t) + vary(10, 15)),
      63 - i * 1.3,
    );
    const count = i < 5 ? 5 : 4;
    for (let j = 0; j < count; j++) {
      const attachment = 0.27 + (j / (count - 1)) * 0.62 + vary(-0.013, 0.013);
      const side = j % 2 === 0 ? -spec.side : spec.side;
      const size =
        (170 - i * 8) *
        (1 - attachment * 0.13) *
        (j % 2 ? 0.78 : 1.15) *
        vary(0.9, 1.08);
      shoot(major, attachment, side, size, 2, j);
    }
    leaf(major, 0.88, spec.side, 80 - i * 3);
    leaf(major, 0.96, -spec.side, 75 - i * 3);
    leaf(major, 0.995, spec.side * 0.1, 78 - i * 3);
  }
  for (let i = 0; i < 6; i++) {
    leaf(trunk, 0.91 + i * 0.017, i % 2 ? -1 : 1, 72 - i * 4.5);
  }
  return branches;
};
const PLANT = createPlant();

const curvesAt = (frame: number): Curve[] => {
  const envelope =
    ease((frame - 289) / 27) * (1 - 0.84 * ease((frame - 316) / 43));
  const curves: Curve[] = [];
  for (const branch of PLANT) {
    const wave =
      Math.sin((frame - 289) / 39 + branch.phase) - Math.sin(branch.phase);
    if (branch.parent === null) {
      curves.push(
        mapCurve(branch.curve, (p, i) =>
          add(p, { x: envelope * wave * [0, 0.03, 0.21, 0.3][i], y: 0 }),
        ),
      );
      continue;
    }
    const parent = PLANT[branch.parent],
      parentCurve = curves[parent.id];
    const origin = at(parentCurve, branch.attachment);
    const inherited =
      heading(tangent(parentCurve, branch.attachment)) -
      heading(tangent(parent.curve, branch.attachment));
    const axisNormal = normal(unit(sub(branch.curve[3], branch.curve[0])));
    const bend =
      envelope *
      wave *
      (branch.depth === 1 ? 0.85 : branch.depth === 2 ? 1.35 : 1.8);
    curves.push(
      mapCurve(branch.curve, (p, i) =>
        add(
          origin,
          rotate(
            add(
              sub(p, branch.curve[0]),
              mul(axisNormal, bend * [0, 0, 0.48, 1][i]),
            ),
            inherited,
          ),
        ),
      ),
    );
  }
  return curves;
};

// The width belongs to the full curve parameter, never to its visible fraction.
// Only a short advancing nose changes width as growth passes along the branch.
const widthAt = (branch: Branch, t: number) =>
  branch.tipWidth +
  (branch.baseWidth - branch.tipWidth) * (1 - clamp(t)) ** 0.8;
const visibleWidth = (branch: Branch, t: number, progress: number) => {
  const noseLength = Math.min(
    progress,
    Math.max(0.008, (widthAt(branch, progress) * 1.3) / branch.length),
  );
  const nose = ease(
    (t - (progress - noseLength)) / Math.max(noseLength, 0.000001),
  );
  const full = widthAt(branch, t);
  return full + (branch.tipWidth - full) * nose;
};
const openContour = (points: Point[]) => {
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const previous = points[Math.max(0, i - 1)],
      a = points[i],
      b = points[i + 1];
    const next = points[Math.min(points.length - 1, i + 2)];
    d +=
      `C${xy(add(a, mul(sub(b, previous), 1 / 6)))} ` +
      `${xy(sub(b, mul(sub(next, a), 1 / 6)))} ${xy(b)}`;
  }
  return d;
};
const ribbon = (
  branch: Branch,
  curve: Curve,
  progress: number,
  detail: boolean,
) => {
  const nose = Math.min(
    progress,
    Math.max(0.008, (widthAt(branch, progress) * 1.3) / branch.length),
  );
  // Fixed rest-curve samples plus extra nose samples keep the broad shoulders
  // smooth even during the first few frames of a newly growing thick branch.
  const parameters = branch.samples.filter((t) => t < progress);
  for (let i = 0; i <= 6; i++)
    parameters.push(progress - nose + (nose * i) / 6);
  parameters.sort((a, b) => a - b);
  const left: Point[][] = [[], [], []],
    right: Point[][] = [[], [], []];
  for (let i = 0; i < parameters.length; i++) {
    const t = parameters[i];
    if (i > 0 && Math.abs(t - parameters[i - 1]) < 0.0000001) continue;
    const center = at(curve, t),
      n = normal(unit(tangent(curve, t)));
    const width = visibleWidth(branch, t, progress);
    for (let layer = 0; layer < (detail ? 3 : 2); layer++) {
      const scale = layer === 0 ? 1 : layer === 1 ? 0.91 : 0.23;
      const inset = layer === 2 ? -0.21 * width : 0;
      const start = layer === 2 && branch.depth > 0 ? ease(t / 0.14) : 1;
      left[layer].push(
        add(center, mul(n, inset + (width * scale * start) / 2)),
      );
      right[layer].push(
        add(center, mul(n, inset - (width * scale * start) / 2)),
      );
    }
  }
  const front = unit(tangent(curve, progress)),
    back = unit(tangent(curve, 0));
  return left.map((edge, layer) => {
    if (edge.length < 2) return "";
    const opposite = right[layer].reverse(),
      end = edge[edge.length - 1];
    const radius =
      (branch.tipWidth * (layer === 0 ? 1 : layer === 1 ? 0.91 : 0.23)) / 2;
    const cap =
      `C${xy(add(end, mul(front, radius * 1.3)))} ` +
      `${xy(add(opposite[0], mul(front, radius * 1.3)))} ${xy(opposite[0])}`;
    const baseRadius =
      branch.baseWidth * (layer === 0 ? 1 : layer === 1 ? 0.91 : 0.23) * 0.23;
    const last = opposite[opposite.length - 1];
    return (
      `M${xy(edge[0])}` +
      openContour(edge) +
      cap +
      openContour(opposite) +
      `C${xy(sub(last, mul(back, baseRadius)))} ${xy(sub(edge[0], mul(back, baseRadius)))} ${xy(edge[0])}Z`
    );
  });
};

const leafPaths = (
  leaf: Leaf,
  curve: Curve,
  progress: number,
  frame: number,
  detail: boolean,
) => {
  const anchor = at(curve, leaf.attachment);
  const calm = ease((frame - 291) / 25) * (1 - 0.86 * ease((frame - 316) / 43));
  const angle =
    heading(tangent(curve, leaf.attachment)) +
    leaf.angle * (0.56 + progress * 0.44) +
    calm * 0.025 * Math.sin(frame / 26 + leaf.phase);
  const cos = Math.cos(angle),
    sin = Math.sin(angle);
  const point = (x: number, y: number): Point => ({
    x: anchor.x + x * cos - y * sin,
    y: anchor.y + x * sin + y * cos,
  });
  const length = leaf.length * progress,
    width = leaf.width * progress ** 1.45;
  const bend = leaf.bend * progress,
    petiole = length * 0.13;
  const base = point(petiole, 0),
    tip = point(length, bend);
  const blade =
    `M${xy(base)}C${xy(point(length * 0.28, -width * 0.75 * leaf.fullness))} ` +
    `${xy(point(length * 0.72, bend - width * 0.65))} ${xy(tip)}` +
    `C${xy(point(length * 0.75, bend + width * 0.55))} ` +
    `${xy(point(length * 0.35, (width * 0.85) / leaf.fullness))} ${xy(base)}Z`;
  const stalk = `M${xy(anchor)}Q${xy(point(petiole * 0.5, 0))} ${xy(base)}`;
  const vein = `M${xy(base)}Q${xy(point(length * 0.55, -width * 0.045))} ${xy(point(length * 0.94, bend * 0.88))}`;
  const sideVeins = detail
    ? [0.38, 0.6, 0.77]
        .map(
          (t, i) =>
            `M${xy(point(length * t, bend * t * t))}Q${xy(point(length * (t + 0.055), bend * t * t + width * 0.12))} ` +
            `${xy(point(length * (t + 0.12), bend * t * t + width * (i === 2 ? 0.19 : 0.29)))}`,
        )
        .join("")
    : "";
  return { blade, stalk, vein, sideVeins };
};

export const SculpturalBotanicalGrowth = ({
  quality = "production",
}: Props) => {
  const currentFrame = useCurrentFrame(),
    { fps } = useVideoConfig();
  const frame = (currentFrame * 30) / fps;
  const environment = useRemotionEnvironment();
  // Preview only removes surface details. CLI, Studio exports and Actions
  // always retain production detail, including when preview props were saved.
  const preview =
    quality === "preview" &&
    environment.isStudio &&
    !environment.isRendering &&
    !environment.isClientSideRendering;
  const curves = curvesAt(frame),
    wood = ["", "", ""],
    foliage = ["", "", ""];
  let stalks = "",
    veins = "",
    sideVeins = "";
  for (const branch of PLANT) {
    const progress = growth(frame, branch.start, branch.duration);
    if (progress <= 0) continue;
    const curve = curves[branch.id];
    const paths = ribbon(branch, curve, progress, !preview);
    for (let i = 0; i < 3; i++) wood[i] += paths[i];
    for (const leaf of branch.leaves) {
      const g = growth(frame, leaf.start, leaf.duration);
      if (g <= 0) continue;
      const paths = leafPaths(
        leaf,
        curve,
        g,
        frame,
        !preview && leaf.id % 2 === 0,
      );
      foliage[leaf.shade] += paths.blade;
      stalks += paths.stalk;
      veins += paths.vein;
      sideVeins += paths.sideVeins;
    }
  }
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        style={{ display: "block" }}
      >
        <rect width="3840" height="2160" fill={COLORS.background} />
        {/* One union-like silhouette per fill: internal branch edges are covered
          by the shared core, so junctions have no dark cross-seams. */}
        <path d={wood[0]} fill={COLORS.edge} />
        <path d={wood[1]} fill={COLORS.wood} />
        {!preview && (
          <path d={wood[2]} fill={COLORS.highlight} opacity="0.43" />
        )}
        <path
          d={stalks}
          fill="none"
          stroke={COLORS.secondary}
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        {foliage.map((d, i) => (
          <path key={i} d={d} fill={COLORS.foliage[i]} />
        ))}
        <path
          d={veins}
          fill="none"
          stroke={COLORS.foliage[1]}
          strokeWidth="1.1"
          opacity="0.58"
          strokeLinecap="round"
        />
        {!preview && (
          <path
            d={sideVeins}
            fill="none"
            stroke={COLORS.foliage[1]}
            strokeWidth="0.8"
            opacity="0.27"
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
