import {
  AbsoluteFill,
  useCurrentFrame,
  useRemotionEnvironment,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const botanicalGrowthSchema = z.object({
  quality: z.enum(["production", "preview"]).default("production"),
});
type BotanicalProps = z.infer<typeof botanicalGrowthSchema>;
type Point = { x: number; y: number };
type Curve = readonly [Point, Point, Point, Point];
type Leaf = {
  id: number;
  attachment: number;
  angle: number;
  length: number;
  width: number;
  bend: number;
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
  thickness: number;
  curvature: number;
  start: number;
  duration: number;
  phase: number;
  leaves: Leaf[];
};
const INK = {
  black: "#000000",
  stem: "#C8A978",
  branch: "#A98D68",
  fine: "#D8C6A3",
  leaf: "#82917A",
  leafLight: "#AAB69B",
  detail: "#E4D9C2",
};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const p = clamp(v);
  return p * p * (3 - 2 * p);
};
const growth = (frame: number, start: number, duration: number) =>
  smooth((frame - start) / duration);
const add = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: Point, n: number): Point => ({ x: a.x * n, y: a.y * n });
const lerp = (a: Point, b: Point, t: number) => add(mul(a, 1 - t), mul(b, t));
const rotate = (p: Point, angle: number): Point => ({
  x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
  y: p.x * Math.sin(angle) + p.y * Math.cos(angle),
});
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
const direction = (p: Point) => Math.atan2(p.y, p.x);
const number = (n: number) => n.toFixed(2);
const xy = (p: Point) => `${number(p.x)},${number(p.y)}`;

// Invert the same easing used by the renderer. A child can never outrun the
// parent's tip, even on a curved parent with a nonuniform parameter speed.
const arrival = (branch: Branch, attachment: number) => {
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (smooth(mid) < attachment) lo = mid;
    else hi = mid;
  }
  return branch.start + hi * branch.duration;
};
const measure = (curve: Curve) => {
  let length = 0,
    previous = curve[0];
  for (let i = 1; i <= 32; i++) {
    const p = at(curve, i / 32);
    length += Math.hypot(p.x - previous.x, p.y - previous.y);
    previous = p;
  }
  return length;
};

const createBotanical = (): readonly Branch[] => {
  // Local PRNG: no Math.random, global mutable seed, or per-frame regeneration.
  let seed = 0x713b4a29,
    leafId = 0;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const vary = (a: number, b: number) => a + (b - a) * random();
  const branches: Branch[] = [];
  const register = (
    parent: Branch | null,
    attachment: number,
    curve: Curve,
    depth: number,
    thickness: number,
    start: number,
    duration: number,
    curvature: number,
  ): Branch => {
    const branch: Branch = {
      id: branches.length,
      parent: parent?.id ?? null,
      depth,
      attachment,
      curve,
      length: measure(curve),
      thickness,
      curvature,
      start,
      duration,
      phase: vary(0, Math.PI * 2),
      leaves: [],
    };
    branches.push(branch);
    return branch;
  };
  const addLeaf = (
    branch: Branch,
    attachment: number,
    side: number,
    size: number,
  ) => {
    const length = size * vary(0.85, 1.15);
    branch.leaves.push({
      id: leafId++,
      attachment,
      angle: side * vary(0.62, 1.12),
      length,
      width: length * vary(0.16, 0.22),
      bend: side * length * vary(0.07, 0.18),
      start: Math.max(
        arrival(branch, attachment) + vary(5, 13),
        150 + vary(0, 51) + attachment * 24 + branch.depth * 3,
      ),
      duration: vary(25, 38),
      phase: vary(0, Math.PI * 2),
      shade: random() < 0.22 ? 1 : 0,
    });
  };
  // One continuing axis with pinnate side shoots, rather than binary Y forks.
  // Recursion changes grammar and scale at each level; maximum depth is five.
  const growAxis = (
    parent: Branch,
    attachment: number,
    angle: number,
    length: number,
    depth: number,
    sign: number,
  ) => {
    const p = at(parent.curve, attachment);
    const heading = direction(tangent(parent.curve, attachment)) + angle;
    const curvature = sign * vary(0.12, 0.27);
    const local = (x: number, y: number) => add(p, rotate({ x, y }, heading));
    const curve: Curve = [
      p,
      local(length * 0.32, 0),
      local(length * 0.76, length * curvature),
      local(length, length * curvature * 0.38),
    ];
    const start = Math.max(
      arrival(parent, attachment) + vary(3, 8),
      depth === 2 ? 96 + vary(0, 16) : 0,
    );
    const branch = register(
      parent,
      attachment,
      curve,
      depth,
      depth === 2 ? vary(2.1, 2.7) : Math.max(1.1, 2.1 - depth * 0.18),
      start,
      depth === 2 ? vary(32, 43) : vary(20, 29),
      curvature,
    );
    if (depth === 2) {
      for (let j = 0; j < 5; j++) {
        addLeaf(
          branch,
          0.22 + j * 0.155,
          j % 2 ? -1 : 1,
          (47 - j * 2.1) * vary(0.8, 1.15),
        );
      }
      addLeaf(branch, 0.98, 0.18, 38);
      if (random() < 0.68)
        growAxis(
          branch,
          vary(0.52, 0.72),
          sign * vary(0.6, 0.95),
          length * vary(0.34, 0.46),
          3,
          -sign,
        );
    } else {
      addLeaf(branch, 0.42, -sign, 29);
      addLeaf(branch, 0.91, sign * 0.4, 32 - depth * 1.5);
      if (depth < 5 && random() < (depth === 3 ? 0.34 : 0.38)) {
        growAxis(branch, 0.73, -sign * 0.5, length * 0.56, depth + 1, -sign);
      }
    }
    return branch;
  };
  const root = register(
    null,
    0,
    [
      { x: 1920, y: 1870 },
      { x: 1792, y: 1450 },
      { x: 2070, y: 815 },
      { x: 1938, y: 302 },
    ],
    0,
    10,
    -5,
    115,
    0,
  );
  const lengths = [
    580, 700, 800, 775, 735, 710, 635, 590, 500, 440, 330, 270, 190,
  ];
  for (let i = 0; i < lengths.length; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const attachment = 0.13 + i * 0.061 + vary(-0.005, 0.005);
    const p = at(root.curve, attachment),
      length = lengths[i] * vary(0.96, 1.04);
    const end = add(p, {
      x: side * length * 0.95,
      y: -length * vary(0.47, 0.61),
    });
    const curve: Curve = [
      p,
      add(p, { x: side * length * 0.28, y: -length * 0.08 }),
      add(end, { x: -side * length * 0.23, y: length * 0.39 }),
      end,
    ];
    const axis = register(
      root,
      attachment,
      curve,
      1,
      4.6 - i * 0.16,
      arrival(root, attachment) + vary(6, 11),
      57 - i * 0.8,
      side * 0.39,
    );
    const count = i < 8 ? 6 : i < 11 ? 4 : 3;
    for (let j = 0; j < count; j++) {
      const t = 0.22 + (j / (count - 1)) * 0.65 + vary(-0.015, 0.015);
      const flank = j % 2 === 0 ? -side : side;
      const shootLength =
        (0.24 * length * (1 - t * 0.48) + 25) *
        (j % 2 ? 0.78 : 1) *
        vary(0.86, 1.12);
      growAxis(axis, t, flank * vary(0.58, 0.93), shootLength, 2, flank);
    }
    addLeaf(axis, 0.97, side * 0.1, 49 - i * 1.2);
  }
  // A narrow crown continues the main axis rather than ending in a bare stick.
  for (let i = 0; i < 7; i++) {
    addLeaf(root, 0.88 + i * 0.019, i % 2 ? 1 : -1, 58 - i * 3);
  }
  return branches;
};
// Module-level stable computation is shared by every frame and Studio instance.
const BOTANICAL = createBotanical();

const animatedCurves = (frame: number): Curve[] => {
  const envelope =
    smooth((frame - 265) / 28) * (1 - 0.84 * smooth((frame - 288) / 71));
  const curves: Curve[] = [];
  for (const branch of BOTANICAL) {
    const wave =
      Math.sin((frame - 265) / 37 + branch.phase) - Math.sin(branch.phase);
    if (branch.parent === null) {
      curves.push(
        branch.curve.map((p, i) => ({
          x: p.x + i * i * 0.075 * envelope * wave,
          y: p.y,
        })) as unknown as Curve,
      );
    } else {
      const parent = BOTANICAL[branch.parent],
        parentCurve = curves[branch.parent];
      const origin = at(parentCurve, branch.attachment);
      const inherited =
        direction(tangent(parentCurve, branch.attachment)) -
        direction(tangent(parent.curve, branch.attachment));
      const angle =
        inherited + envelope * wave * (0.0009 + branch.depth * 0.0011);
      curves.push(
        branch.curve.map((p) =>
          add(origin, rotate(sub(p, branch.curve[0]), angle)),
        ) as unknown as Curve,
      );
    }
  }
  return curves;
};

// Exact de Casteljau left subdivision: the engraved centerline ends at the
// growing tip. No DOM path measurements or stroke-dash length approximations.
const partialPath = ([a, b, c, d]: Curve, p: number) => {
  const ab = lerp(a, b, p),
    bc = lerp(b, c, p),
    cd = lerp(c, d, p);
  const abc = lerp(ab, bc, p),
    bcd = lerp(bc, cd, p);
  return `M${xy(a)}C${xy(ab)} ${xy(abc)} ${xy(lerp(abc, bcd, p))}`;
};
const contour = (points: Point[]) => {
  let path = `M${xy(points[0])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const prev = points[Math.max(0, i - 1)],
      a = points[i],
      b = points[i + 1];
    const next = points[Math.min(points.length - 1, i + 2)];
    path +=
      `C${xy(add(a, mul(sub(b, prev), 1 / 6)))} ` +
      `${xy(sub(b, mul(sub(next, a), 1 / 6)))} ${xy(b)}`;
  }
  return path;
};
const branchRibbon = (curve: Curve, p: number, branch: Branch) => {
  const steps = Math.max(5, Math.ceil((branch.length * p) / 65));
  const left: Point[] = [],
    right: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps,
      t = u * p,
      center = at(curve, t),
      v = tangent(curve, t);
    const magnitude = Math.hypot(v.x, v.y);
    const width =
      ((0.55 + (branch.thickness - 0.55) * (1 - t) ** 0.86) *
        (1 - 0.65 * smooth((u - 0.83) / 0.17)) *
        Math.min(1, p * 18)) /
      2;
    const normal = {
      x: (-v.y / magnitude) * width,
      y: (v.x / magnitude) * width,
    };
    left.push(add(center, normal));
    right.push(sub(center, normal));
  }
  const reverse = right.reverse();
  return (
    contour(left) +
    `L${xy(reverse[0])}` +
    contour(reverse).replace(/^M[^C]+/, "") +
    "Z"
  );
};

const leafGeometry = (
  leaf: Leaf,
  curve: Curve,
  g: number,
  frame: number,
  detail = true,
) => {
  const origin = at(curve, leaf.attachment);
  const calm =
    smooth((frame - 270) / 25) * (1 - 0.87 * smooth((frame - 290) / 69));
  const angle =
    direction(tangent(curve, leaf.attachment)) +
    leaf.angle * (0.66 + 0.34 * g) +
    calm * 0.024 * Math.sin(frame / 23 + leaf.phase);
  const c = Math.cos(angle),
    s = Math.sin(angle);
  const point = (x: number, y: number): Point => ({
    x: origin.x + x * c - y * s,
    y: origin.y + x * s + y * c,
  });
  const length = leaf.length * g,
    width = leaf.width * g ** 1.35;
  const bend = leaf.bend * g,
    petiole = length * 0.11;
  const base = point(petiole, 0),
    tip = point(length, bend);
  const shape =
    `M${xy(base)}C${xy(point(length * 0.38, -width * 0.52))} ` +
    `${xy(point(length * 0.72, bend - width * 0.49))} ${xy(tip)}` +
    `C${xy(point(length * 0.64, bend + width * 0.66))} ` +
    `${xy(point(length * 0.27, width * 0.37))} ${xy(base)}Z`;
  const vein = `M${xy(origin)}Q${xy(point(length * 0.48, -width * 0.035))} ${xy(tip)}`;
  const hatching = (detail ? [0.38, 0.58, 0.76] : [])
    .map((t, i) => {
      const spine = point(length * t, bend * t * t);
      return (
        `M${xy(spine)}Q${xy(point(length * (t + 0.06), bend * t * t + width * 0.16))} ` +
        `${xy(point(length * (t + 0.12), bend * t * t + width * (i === 2 ? 0.2 : 0.36)))}`
      );
    })
    .join("");
  return { shape, vein, hatching };
};

export const RecursiveBotanicalGrowth = ({
  quality = "production",
}: BotanicalProps) => {
  const currentFrame = useCurrentFrame(),
    { fps } = useVideoConfig();
  // Timings are authored at 30 fps; all animation remains tied to video time.
  const frame = (currentFrame * 30) / fps;
  // A saved Studio preview choice cannot downgrade CLI/GitHub Actions output.
  const environment = useRemotionEnvironment();
  const preview =
    quality === "preview" &&
    environment.isStudio &&
    !environment.isRendering &&
    !environment.isClientSideRendering;
  const curves = animatedCurves(frame);
  const stems = ["", "", ""],
    highlights = ["", ""];
  const blades = ["", ""],
    veins: string[] = [],
    hatching: string[] = [];
  for (const branch of BOTANICAL) {
    const p = growth(frame, branch.start, branch.duration);
    if (p <= 0) continue;
    const curve = curves[branch.id];
    const layer = Math.min(branch.depth, 2);
    stems[layer] += branchRibbon(curve, p, branch);
    if (!preview && branch.depth <= 1) {
      highlights[branch.depth] += partialPath(curve, p);
    }
    for (const leaf of branch.leaves) {
      const g = growth(frame, leaf.start, leaf.duration);
      if (g <= 0) continue;
      const geometry = leafGeometry(
        leaf,
        curve,
        g,
        frame,
        !preview && leaf.id % 3 === 0,
      );
      blades[leaf.shade] += geometry.shape;
      veins.push(geometry.vein);
      if (!preview && leaf.id % 3 === 0) hatching.push(geometry.hatching);
    }
  }
  return (
    <AbsoluteFill style={{ backgroundColor: INK.black }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        style={{ display: "block" }}
      >
        <rect width="3840" height="2160" fill={INK.black} />
        {/* Tiny persistent cotyledon scar: the first frame is already alive. */}
        <path
          d="M1920,1878C1911,1872 1911,1863 1918,1857C1926,1863 1927,1871 1920,1878Z"
          fill={INK.branch}
          stroke={INK.stem}
          strokeWidth="1.2"
        />
        {stems.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={[INK.stem, INK.branch, INK.fine][i]}
            opacity={i === 2 ? 0.83 : 1}
          />
        ))}
        {!preview &&
          highlights.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={INK.detail}
              strokeWidth={i === 0 ? 0.95 : 0.65}
              opacity="0.47"
            />
          ))}
        {blades.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={i === 0 ? INK.leaf : INK.leafLight}
            fillOpacity={i === 0 ? 0.88 : 0.81}
            stroke={INK.leafLight}
            strokeWidth="0.65"
            strokeOpacity="0.47"
          />
        ))}
        <path
          d={veins.join("")}
          fill="none"
          stroke={INK.leafLight}
          strokeWidth="0.85"
          strokeLinecap="round"
          opacity="0.72"
        />
        {!preview && (
          <path
            d={hatching.join("")}
            fill="none"
            stroke={INK.detail}
            strokeWidth="0.65"
            opacity="0.24"
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
