import { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Point = { x: number; y: number };
const P = {
  frame: "#647784",
  top: "#AAB7BC",
  side: "#354751",
  metal: "#D6DBD8",
  belt: "#26343D",
  orange: "#F3A34B",
  rust: "#C76B2E",
  light: "#FFD18A",
  black: "#000000",
};
const DX = 28,
  DY = -22,
  TAU = Math.PI * 2,
  UPPER = 1150,
  LOWER = 1510,
  TRAVEL = 2540,
  PITCH = 127,
  ROLLER = TRAVEL / (10 * TAU);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (v: number) => {
  const t = Math.max(0, Math.min(1, v));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const move = (t: number, a: number, b: number) => smooth((t - a) / (b - a));
const pulse = (t: number, a: number, b: number, c: number, d: number) =>
  move(t, a, b) * (1 - move(t, c, d));
const loopTime = (frame: number, fps: number) =>
  (((frame / fps) % 12) + 12) % 12;
const pt = (p: Point) => `${p.x.toFixed(4)},${p.y.toFixed(4)}`;
const polygon = (points: Point[]) => points.map(pt).join(" ");
const trace = (points: Point[]) =>
  points.map((p, i) => `${i ? "L" : "M"}${pt(p)}`).join(" ") + "Z";

const conveyorAt = (t: number) => ({
  upper:
    770 * move(t, 1.7, 2.5) +
    770 * move(t, 3.8, 4.6) +
    500 * move(t, 6, 6.7) +
    500 * move(t, 9.9, 11.3),
  lower: 2540 * move(t, 7.45, 9.15),
});
const liftsAt = (t: number) => ({
  left: 360 * pulse(t, 7.65, 8.65, 9.15, 9.9),
  right: 360 * pulse(t, 6.7, 7.45, 7.8, 8.55),
});
const objectAt = (t: number) => {
  let x = 1150,
    y = UPPER;
  if (t >= 1.7 && t < 2.5) x = mix(1150, 1920, move(t, 1.7, 2.5));
  else if (t >= 2.5 && t < 3.8) x = 1920;
  else if (t >= 3.8 && t < 4.6) x = mix(1920, 2690, move(t, 3.8, 4.6));
  else if (t >= 4.6 && t < 6) x = 2690;
  else if (t >= 6 && t < 6.7) x = mix(2690, 3190, move(t, 6, 6.7));
  else if (t >= 6.7 && t < 7.45) {
    x = 3190;
    y = UPPER + liftsAt(t).right;
  } else if (t >= 7.45 && t < 9.15) {
    x = mix(3190, 650, move(t, 7.45, 9.15));
    y = LOWER;
  } else if (t >= 9.15 && t < 9.9) {
    x = 650;
    y = UPPER + liftsAt(t).left;
  } else if (t >= 9.9) x = mix(650, 1150, move(t, 9.9, 11.3));
  const cube = move(t, 0.86, 1.24) * (1 - move(t, 5.16, 5.58));
  return {
    x,
    y,
    cube,
    gap: 22 * move(t, 3.5, 3.8) * (1 - move(t, 4.6, 4.95)),
    pieces: t >= 3.25 && t < 5.58,
    join: 1 - move(t, 5.22, 5.58),
  };
};
const toolsAt = (t: number) => {
  const object = objectAt(t);
  const top = UPPER - mix(170, 160, object.cube);
  const pressDown = pulse(t, 0.62, 0.86, 1.34, 1.6);
  return {
    pressBottom: mix(850, top, pressDown),
    jaw: pulse(t, 0.5, 0.7, 1.57, 1.7),
    clamp: pulse(t, 2.5, 2.68, 3.36, 3.5),
    bladeTip: mix(930, 1160, pulse(t, 2.74, 3.17, 3.22, 3.4)),
    cut: move(t, 2.74, 3.17) * (1 - move(t, 5.22, 5.58)),
    push: pulse(t, 4.6, 4.95, 5.86, 6),
    moldGap:
      110 -
      75 * pulse(t, 4.97, 5.16, 5.7, 5.94) -
      35 * pulse(t, 5.16, 5.58, 5.7, 5.94),
    finger: pulse(t, 4.8, 5.08, 5.5, 5.7),
  };
};
// A single carrier travels the entire circuit, including both lift platforms.
const Box = ({
  x,
  y,
  w,
  h,
  fill = P.frame,
  depth = DX,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  depth?: number;
}) => (
  <g stroke={P.side} strokeWidth="3" strokeLinejoin="round">
    <polygon
      points={polygon([
        { x, y },
        { x: x + depth, y: y + DY },
        { x: x + w + depth, y: y + DY },
        { x: x + w, y },
      ])}
      fill={P.top}
    />
    <polygon
      points={polygon([
        { x: x + w, y },
        { x: x + w + depth, y: y + DY },
        { x: x + w + depth, y: y + h + DY },
        { x: x + w, y: y + h },
      ])}
      fill={P.side}
    />
    <rect x={x} y={y} width={w} height={h} rx="4" fill={fill} />
  </g>
);
const Bolt = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x} cy={y} r="8" fill={P.side} />
    <circle cx={x} cy={y} r="4" fill={P.metal} />
  </g>
);
const sphereCubePoint = (angle: number, cube: number): Point => {
  const power = 2 / mix(2, 14, cube);
  const c = Math.cos(angle),
    s = Math.sin(angle);
  const half = mix(85, 80, cube);
  return {
    x: half * Math.sign(c) * Math.pow(Math.abs(c), power),
    y: -half + half * Math.sign(s) * Math.pow(Math.abs(s), power),
  };
};
const shapePoints = (cube: number, start = 0, end = TAU, n = 100) =>
  Array.from({ length: n }, (_, i) =>
    sphereCubePoint(mix(start, end, i / (n - 1)), cube),
  );
const Workpiece = ({ cube, gradient }: { cube: number; gradient: string }) => {
  const dx = DX * cube,
    dy = DY * cube;
  const points = shapePoints(cube);
  const face = (a: number, b: number) => {
    const edge = shapePoints(cube, a, b, 50);
    return trace([
      ...edge,
      ...edge.map((p) => ({ x: p.x + dx, y: p.y + dy })).reverse(),
    ]);
  };
  return (
    <g stroke={P.rust} strokeWidth="2.6" strokeLinejoin="round">
      <path
        d={trace(points.map((p) => ({ x: p.x + dx, y: p.y + dy })))}
        fill={P.rust}
      />
      <path d={face(-Math.PI / 2, Math.PI / 2)} fill={P.rust} />
      <path d={face(Math.PI, TAU)} fill={P.light} />
      <path d={trace(points)} fill={`url(#${gradient})`} />
      <path
        d={`M${-40 + 10 * cube},${-132 + 3 * cube} Q-13,${-151 + 4 * cube} 10,${-148 + 4 * cube}`}
        fill="none"
        stroke={P.light}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </g>
  );
};
const Belt = ({
  x,
  end,
  y,
  distance,
  clip,
}: {
  x: number;
  end: number;
  y: number;
  distance: number;
  clip: string;
}) => (
  <g>
    <defs>
      <clipPath id={clip}>
        <rect x={x} y={y - 23} width={end - x + DX} height="105" />
      </clipPath>
    </defs>
    <Box x={x} y={y} w={end - x} h={80} fill={P.belt} />
    <g clipPath={`url(#${clip})`} stroke={P.frame} strokeWidth="4">
      {Array.from({ length: 26 }, (_, i) => {
        const xx =
          x - 2 * PITCH + i * PITCH + (((distance % PITCH) + PITCH) % PITCH);
        return (
          <path
            key={i}
            d={`M${xx},${y + 3} l${DX},${DY} M${xx},${y + 8} v22`}
          />
        );
      })}
    </g>
    {[x + 40, end - 40].map((xx, i) => (
      <g key={i} transform={`translate(${xx} ${y + 40})`}>
        <circle r={ROLLER} fill={P.side} stroke={P.frame} strokeWidth="6" />
        <g
          transform={`rotate(${((distance / ROLLER) * 180) / Math.PI})`}
          stroke={P.top}
          strokeWidth="5"
        >
          {[0, 120, 240].map((a) => (
            <path key={a} d="M0,0 H27" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="10" fill={P.metal} />
      </g>
    ))}
  </g>
);
const Lift = ({ x, offset }: { x: number; offset: number }) => (
  <g>
    <Box x={x - 120} y={1190} w={34} h={432} />
    <Box x={x + 86} y={1190} w={34} h={432} />
    <path
      d={`M${x - 72},1210 V1600 M${x + 72},1210 V1600`}
      stroke={P.metal}
      strokeWidth="9"
    />
    <Box x={x - 135} y={1630} w={270} h={44} />
    <rect
      x={x - 29}
      y={1445}
      width="58"
      height="185"
      rx="9"
      fill={P.side}
      stroke={P.frame}
      strokeWidth="4"
    />
    <rect
      x={x - 12}
      y={1200 + offset}
      width="24"
      height={Math.max(0, 1445 - (1200 + offset))}
      fill={P.metal}
    />
    <Box x={x - 110} y={1200 + offset} w={220} h={32} fill={P.top} />
    <path
      d={`M${x - 104},${1194 + offset} h22 M${x + 82},${1194 + offset} h22`}
      stroke={P.metal}
      strokeWidth="7"
    />
    <Bolt x={x - 103} y={1649} />
    <Bolt x={x + 103} y={1649} />
  </g>
);
const Gantry = ({ x, kind }: { x: number; kind: "press" | "cut" | "mold" }) => (
  <g>
    {[x - 228, x + 194].map((xx, i) => (
      <g key={i}>
        <Box x={xx} y={660} w={34} h={580} />
        <rect x={xx + 11} y={751} width="9" height="370" fill={P.metal} />
        <Bolt x={xx + 17} y={690} />
        <Bolt x={xx + 17} y={1211} />
      </g>
    ))}
    <Box x={x - 248} y={620} w={496} h={94} />
    <Box x={x - 250} y={1244} w={500} h={48} />
    <Box
      x={x - 102}
      y={kind === "cut" ? 520 : 714}
      w={204}
      h={kind === "cut" ? 100 : 80}
      fill={P.side}
    />
    <rect x={x - 66} y={731} width="132" height="19" rx="3" fill={P.frame} />
    {kind === "mold" && (
      <circle
        cx={x}
        cy={757}
        r="23"
        fill={P.frame}
        stroke={P.metal}
        strokeWidth="4"
      />
    )}
  </g>
);
const moldHalf = (side: number, gap: number) => {
  const angles =
    side < 0 ? [Math.PI / 2, Math.PI * 1.5] : [-Math.PI / 2, Math.PI / 2];
  const arc = (radius: number) =>
    Array.from({ length: 55 }, (_, i) => {
      const a = mix(angles[0], angles[1], i / 54);
      return {
        x: side * gap + Math.cos(a) * radius,
        y: 1065 + Math.sin(a) * radius,
      };
    });
  return trace([...arc(119), ...arc(87).reverse()]);
};

export const ImpossibleConveyorSphereToCube = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = loopTime(frame, fps),
    o = objectAt(t),
    tools = toolsAt(t),
    belts = conveyorAt(t),
    lifts = liftsAt(t);
  const uid = useId().replace(/:/g, "") + "-conveyor";
  return (
    <AbsoluteFill style={{ backgroundColor: P.black }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
      >
        <defs>
          <radialGradient id={uid + "-material"} cx="30%" cy="25%" r="80%">
            <stop offset="0" stopColor={P.light} />
            <stop offset=".38" stopColor={P.orange} />
            <stop offset="1" stopColor={P.rust} />
          </radialGradient>
          <clipPath id={uid + "-return"}>
            <rect x="760" y="1528" width="2320" height="85" />
          </clipPath>
        </defs>
        <rect width="3840" height="2160" fill={P.black} />
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Rear cross-members and legs make a single connected machine. */}
          <Box x={770} y={1608} w={2290} h={62} />
          {[870, 1460, 2280, 2970].map((x, i) => (
            <g key={i}>
              <Box x={x} y={1265} w={72} h={398} />
              <Box x={x - 28} y={1668} w={145} h={36} />
              <Bolt x={x + 36} y={1640} />
            </g>
          ))}
          {[1150, 1920, 2690].map((x, i) => (
            <Gantry
              key={i}
              x={x}
              kind={i === 0 ? "press" : i === 1 ? "cut" : "mold"}
            />
          ))}
          {/* Independent cooling fan keeps the ready machine alive without belt slip. */}
          <g transform="translate(2690 757)">
            <g transform={`rotate(${(t / 6) * 360})`} fill={P.top}>
              {[0, 120, 240].map((angle) => (
                <path
                  key={angle}
                  transform={`rotate(${angle})`}
                  d="M-4,-3 Q-20,-15 -10,-19 Q6,-20 7,-5Z"
                />
              ))}
            </g>
            <circle r="5" fill={P.metal} />
          </g>
          <Lift x={650} offset={lifts.left} />
          <Lift x={3190} offset={lifts.right} />
          {/* Short continuous belt sections, with lift docks at their ends. */}
          {[
            [760, 1535],
            [1535, 2305],
            [2305, 3080],
          ].map(([x, end], i) => (
            <Belt
              key={i}
              x={x}
              end={end}
              y={1200}
              distance={belts.upper}
              clip={`${uid}-belt-${i}`}
            />
          ))}
          <Belt
            x={760}
            end={3080}
            y={1560}
            distance={-belts.lower}
            clip={uid + "-lower-belt"}
          />
          <g clipPath={`url(#${uid}-return)`}>
            {Array.from({ length: 23 }, (_, i) => {
              const x =
                650 + i * PITCH - (((belts.lower % PITCH) + PITCH) % PITCH);
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={1538}
                    width="64"
                    height="14"
                    rx="4"
                    fill={P.top}
                  />
                  <circle cx={x + 14} cy={1551} r="7" fill={P.metal} />
                  <circle cx={x + 50} cy={1551} r="7" fill={P.metal} />
                </g>
              );
            })}
          </g>
          {/* Working beds and guide rails behind the moving universal carrier. */}
          {[1150, 1920, 2690].map((x, i) => (
            <g key={i}>
              <Box x={x - 162} y={1200} w={324} h={24} fill={P.top} />
              <path
                d={`M${x - 178},1181 h356`}
                stroke={P.metal}
                strokeWidth="6"
              />
            </g>
          ))}
          {/* Back halves of horizontal actuator housings. */}
          {[1150, 1920, 2690].map((x, i) => (
            <g key={i}>
              <Box x={x - 246} y={1048} w={85} h={67} fill={P.side} />
              <Box x={x + 161} y={1048} w={85} h={67} fill={P.side} />
              <path
                d={`M${x - 171},1080 H${x + 171}`}
                stroke={P.top}
                strokeWidth="9"
              />
            </g>
          ))}
          {/* One pallet, three independent saddles, four wheels: support never disappears. */}
          <g transform={`translate(${o.x} ${o.y})`}>
            <Box x={-120} y={20} w={240} h={17} fill={P.side} />
            {[-87, 87].map((x) => (
              <g key={x}>
                <circle
                  cx={x}
                  cy={38}
                  r="12"
                  fill={P.side}
                  stroke={P.top}
                  strokeWidth="4"
                />
                <circle cx={x} cy={38} r="4" fill={P.metal} />
              </g>
            ))}
            <path d="M-107,14 H107" stroke={P.metal} strokeWidth="5" />
            {[-1, 0, 1].map((side, i) => {
              const x = side * (160 / 3 + o.gap);
              return (
                <Box
                  key={i}
                  x={x - 26.6667}
                  y={0}
                  w={53.3334}
                  h={20}
                  depth={DX}
                  fill={P.top}
                />
              );
            })}
            <path
              d="M-115,-10 V14 M115,-10 V14"
              stroke={P.metal}
              strokeWidth="7"
            />
            {!o.pieces ? (
              <Workpiece cube={o.cube} gradient={uid + "-material"} />
            ) : (
              <g>
                {[-1, 0, 1].map((side, i) => {
                  const left = -80 + (i * 160) / 3,
                    right = left + 160 / 3,
                    clip = `${uid}-slab-${i}`;
                  return (
                    <g key={i} transform={`translate(${side * o.gap} 0)`}>
                      <defs>
                        <clipPath id={clip}>
                          <rect
                            x={i === 0 ? -95 : left}
                            y="-200"
                            width={
                              160 / 3 + (i === 2 ? DX + 10 : i === 0 ? 15 : 0)
                            }
                            height="202"
                          />
                        </clipPath>
                      </defs>
                      <g clipPath={`url(#${clip})`}>
                        <Workpiece cube={o.cube} gradient={uid + "-material"} />
                      </g>
                      {i < 2 && o.gap > 0 && (
                        <path
                          d={`M${right},-160 l${DX},${DY} v160 l-${DX},${-DY}Z`}
                          fill={P.rust}
                          stroke={P.orange}
                          strokeWidth="2"
                        />
                      )}
                      {i < 2 && (
                        <path
                          d={`M${right},-160 V0`}
                          stroke={P.rust}
                          strokeWidth={2.5 * o.join}
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            )}
            {/* Cut fronts grow only as the blades cross the material, before separation. */}
            {t >= 2.5 &&
              t < 3.25 &&
              [-80 / 3, 80 / 3].map((x) => (
                <path
                  key={x}
                  d={`M${x},-160 V${Math.max(-160, Math.min(0, tools.bladeTip - UPPER))}`}
                  stroke={P.rust}
                  strokeWidth="3"
                />
              ))}
          </g>
          {/* Press: piston stays inside its housing; platen underside shares workpiece depth. */}
          <rect
            x={1132}
            y={776}
            width="36"
            height={tools.pressBottom - 55 - 776}
            fill={P.metal}
            stroke={P.side}
            strokeWidth="3"
          />
          <Box
            x={1037}
            y={tools.pressBottom - 55}
            w={226}
            h={55}
            fill={P.frame}
          />
          {[-1, 1].map((side) => {
            const edge = side * mix(134, mix(85, 80, o.cube), tools.jaw);
            const x = 1150 + edge + (side < 0 ? -24 : 0);
            return (
              <g key={side}>
                <rect
                  x={side < 0 ? 992 : x}
                  y={1063}
                  width={side < 0 ? x - 992 : 1308 - x}
                  height="25"
                  fill={P.metal}
                />
                <Box x={x} y={998} w={24} h={120} fill={P.top} depth={0} />
              </g>
            );
          })}
          {/* Separator: blade handles above, tips visibly pass through the two cut planes. */}
          <rect
            x={1906}
            y={600}
            width="28"
            height={tools.bladeTip - 230 - 600}
            fill={P.metal}
          />
          <Box x={1820} y={tools.bladeTip - 230} w={200} h={34} />
          {[-80 / 3, 80 / 3].map((x) => (
            <g key={x}>
              <path
                d={`M${1920 + x - 4},${tools.bladeTip - 200} l${DX},${DY} v200 l-${DX},${-DY}Z`}
                fill={P.top}
                stroke={P.side}
                strokeWidth="2"
              />
              <rect
                x={1920 + x - 4}
                y={tools.bladeTip - 200}
                width="8"
                height="200"
                fill={P.metal}
              />
            </g>
          ))}
          {[-1, 1].map((side) => (
            <Box
              key={side}
              x={1920 + side * mix(135, 80, tools.clamp) + (side < 0 ? -21 : 0)}
              y={1042}
              w={21}
              h={80}
              fill={P.frame}
              depth={0}
            />
          ))}
          {/* Assembly fingers converge before the circular split mold forms the sphere. */}
          {[-1, 1].map((side) => {
            const x =
              2690 +
              side * mix(145, mix(85, 80, o.cube), tools.push) +
              (side < 0 ? -20 : 0);
            return (
              <g key={side}>
                <path
                  d={`M${2690 + side * 190},1076 H${x + 10}`}
                  stroke={P.metal}
                  strokeWidth="18"
                />
                <Box x={x} y={1028} w={20} h={105} depth={0} fill={P.top} />
              </g>
            );
          })}
          <rect
            x={2679}
            y={775}
            width="22"
            height={mix(920, 972 + 10 * o.cube, tools.finger) - 775}
            fill={P.metal}
          />
          <Box
            x={2646}
            y={mix(920, 972 + 10 * o.cube, tools.finger)}
            w={88}
            h={8}
            fill={P.top}
            depth={0}
          />
          {[-1, 1].map((side) => (
            <g key={side} transform="translate(2690 0)">
              <path
                d={moldHalf(side, tools.moldGap)}
                fill={P.frame}
                stroke={P.top}
                strokeWidth="5"
              />
              <path
                d={`M${side * (tools.moldGap + 102)},1025 V1105`}
                stroke={P.side}
                strokeWidth="9"
              />
              <Bolt x={side * (tools.moldGap + 105)} y={1065} />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
