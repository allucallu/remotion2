import { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// All geometry, fixed engraving marks and animation for this asset live here.
type P = { x: number; y: number };
const TAU = Math.PI * 2;
const C = { black: "#000000", ink: "#E8E0D0", mid: "#B9AF9B", low: "#8F8778" };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (v: number) => {
  const t = Math.max(0, Math.min(1, v));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const ramp = (t: number, a: number, b: number) => smooth((t - a) / (b - a));
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const pt = (p: P) => `${p.x.toFixed(4)},${p.y.toFixed(4)}`;
const polar = (a: number, r: number): P => ({
  x: Math.cos(a) * r,
  y: Math.sin(a) * r,
});
const path = (points: P[], close = false) =>
  points.map((p, i) => `${i ? "L" : "M"}${pt(p)}`).join(" ") +
  (close ? "Z" : "");
const sample = (fn: (u: number) => P, a = 0, b = 1, n = 48) =>
  Array.from({ length: n }, (_, i) => fn(mix(a, b, i / (n - 1))));
const bezier = (a: P, b: P, c: P, d: P, u: number): P => {
  const v = 1 - u;
  return {
    x:
      v * v * v * a.x +
      3 * v * v * u * b.x +
      3 * v * u * u * c.x +
      u * u * u * d.x,
    y:
      v * v * v * a.y +
      3 * v * v * u * b.y +
      3 * v * u * u * c.y +
      u * u * u * d.y,
  };
};
const wrap = (frame: number, fps: number) => (((frame / fps) % 12) + 12) % 12;
const faceAt = (t: number) => {
  const blink = ramp(t, 3.2, 100 / 30) * (1 - ramp(t, 101 / 30, 3.6));
  return {
    blink,
    gaze: 12 * ramp(t, 1.5, 1.5 + 7 / 30) * (1 - ramp(t, 100 / 30, 101 / 30)),
    brow: 6 * ramp(t, 2, 2.5) * (1 - ramp(t, 3.6, 5)),
    smile: ramp(t, 5, 7) * (1 - ramp(t, 8.6, 10.5)),
    squint: ramp(t, 7, 7.6) * (1 - ramp(t, 8.6, 10.5)),
  };
};
type Face = ReturnType<typeof faceAt>;
const rayAt = (index: number, t: number) => {
  const angle = (index / 24) * TAU - Math.PI / 2;
  const phase = (t / 6) * TAU - angle;
  const curved = index % 2 === 1;
  return {
    angle,
    curved,
    length: curved
      ? 708 + 10 * Math.sin(phase - 0.35)
      : 778 + 26 * Math.sin(phase),
    bend: curved ? 16 * Math.sin(phase - 0.4) : 0,
    tip: curved ? 27 * Math.sin(phase - 0.4) : 0,
  };
};
type Ray = ReturnType<typeof rayAt>;
const rayCenter = (r: Ray, u: number) =>
  bezier(
    { x: 440, y: 0 },
    { x: 525, y: r.curved ? -54 + r.bend : 2 },
    { x: r.length - 95, y: r.curved ? 62 + r.bend : 3 },
    { x: r.length, y: r.tip },
    u,
  );
const rayWidth = (r: Ray, u: number) =>
  (r.curved ? 35 : 37) *
  Math.pow(Math.max(0, 1 - u), r.curved ? 0.82 : 1.05) *
  (1 + (r.curved ? 0.16 : 0) * Math.sin(Math.PI * u));
const rayPoint = (r: Ray, u: number, side: number): P => {
  const p = rayCenter(r, u),
    a = rayCenter(r, Math.max(0, u - 0.001)),
    b = rayCenter(r, Math.min(1, u + 0.001));
  const dx = b.x - a.x,
    dy = b.y - a.y,
    len = Math.hypot(dx, dy) || 1,
    w = side * rayWidth(r, u);
  return { x: p.x - (dy / len) * w, y: p.y + (dx / len) * w };
};
const rayOutline = (r: Ray) =>
  path(
    [
      ...sample((u) => rayPoint(r, u, -1)),
      ...sample((u) => rayPoint(r, u, 1)).reverse(),
    ],
    true,
  );
const discPoint = (a: number, inset = 0) =>
  polar(a, 450 - inset + 1.8 * Math.sin(a * 5 + 0.7) + 1.2 * Math.sin(a * 9));
const eyeCurve = (upper: boolean, s: Face) => {
  // Open controls -48 / +44 meet at +25.6: upper contributes 80%.
  const lift = upper
    ? 3 * s.squint - 0.12 * s.gaze
    : -2 * s.smile - 3 * s.squint;
  const y = mix((upper ? -48 : 44) + lift, 25.6, s.blink);
  return `C-45,${y} 43,${y} 88,-2`;
};
const eyeAperture = (s: Face) => {
  const lower = mix(44 - 2 * s.smile - 3 * s.squint, 25.6, s.blink);
  return `M-88,0 ${eyeCurve(true, s)} C43,${lower} -45,${lower} -88,0Z`;
};
// Module-level marks keep their identity throughout the loop. No frame randomness.
const templeMarks = Array.from({ length: 160 }, (_, i) => ({
  side: i % 2 ? 1 : -1,
  a: -0.85 + ((i % 80) / 79) * 1.9,
  inset: 22 + (Math.floor(i / 40) % 2) * 27 + rand(i + 10) * 12,
  len: 19 + rand(i + 200) * 18,
}));
const foreheadMarks = Array.from({ length: 72 }, (_, i) => ({
  x: -230 + (i % 18) * 26 + rand(i + 400) * 5,
  y: -325 + Math.floor(i / 18) * 29,
  len: 14 + rand(i + 500) * 14,
}));
const cheekMarks = Array.from({ length: 72 }, (_, i) => ({
  side: i % 2 ? 1 : -1,
  x: 155 + (Math.floor(i / 2) % 12) * 13,
  y: 65 + Math.floor(i / 24) * 32 + rand(i + 600) * 12,
  len: 16 + rand(i + 700) * 18,
}));
const chinMarks = Array.from({ length: 58 }, (_, i) => ({
  x: -195 + (i % 29) * 14,
  y: 286 + Math.floor(i / 29) * 25 + rand(i + 800) * 5,
  len: 12 + rand(i + 900) * 12,
}));

export const LivingEngravingBreathingSun = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = wrap(frame, fps),
    s = faceAt(t);
  const uid = useId().replace(/:/g, "") + "-sun";
  const eyes = [-158, 158];
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="3840" height="2160" fill={C.black} />
        <g
          transform="translate(1920 1080)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g fill={C.black} stroke={C.ink} strokeWidth="5.5">
            {Array.from({ length: 24 }, (_, i) => {
              const r = rayAt(i, t);
              return (
                <g key={i} transform={`rotate(${(r.angle * 180) / Math.PI})`}>
                  <path d={rayOutline(r)} />
                  <g fill="none" strokeWidth="2.6" stroke={C.mid}>
                    {[-0.64, -0.23, 0.23, 0.64].map((offset, j) => (
                      <path
                        key={j}
                        d={path(
                          sample(
                            (u) => rayPoint(r, u, offset),
                            0.06 + j * 0.016,
                            0.84 + (j % 2) * 0.07,
                          ),
                        )}
                      />
                    ))}
                  </g>
                </g>
              );
            })}
          </g>
          <path
            d={path(
              sample((u) => discPoint(u * TAU), 0, 1, 240),
              true,
            )}
            fill={C.black}
            stroke={C.ink}
            strokeWidth="6"
          />
          <g fill="none" stroke={C.mid} strokeWidth="2.8">
            {[
              [-1.5, -0.15],
              [0.03, 1.38],
              [1.53, 2.86],
              [3.04, 4.57],
            ].map(([a, b], i) => (
              <path
                key={i}
                d={path(sample((u) => discPoint(u, 16), a, b, 75))}
              />
            ))}
          </g>
          <g fill="none" stroke={C.low} strokeWidth="2.5">
            {templeMarks.map((h, i) => {
              const a = h.side === 1 ? h.a : Math.PI - h.a;
              const p = discPoint(a, h.inset),
                q = discPoint(a + 0.065 * h.side, h.inset + h.len);
              return (
                <path
                  key={i}
                  d={`M${pt(p)} Q${pt(discPoint(a + 0.03 * h.side, h.inset + h.len * 0.65))} ${pt(q)}`}
                />
              );
            })}
            {foreheadMarks.map((h, i) => {
              const offset =
                h.x > 40
                  ? -s.brow * Math.exp(-Math.pow((h.x - 158) / 120, 2)) * 0.5
                  : 0;
              const y = h.y + Math.pow(h.x / 230, 2) * 38 + offset;
              return (
                <path
                  key={"f" + i}
                  d={`M${h.x},${y} q${h.len * 0.5},-6 ${h.len},-7`}
                />
              );
            })}
            {cheekMarks.map((h, i) => {
              const x = h.x * h.side,
                y = h.y - 4 * s.smile;
              return (
                <path
                  key={"c" + i}
                  d={`M${x},${y} q${h.side * h.len * 0.5},15 ${h.side * h.len},18`}
                />
              );
            })}
            {chinMarks.map((h, i) => {
              const y = h.y - Math.pow(h.x / 200, 2) * 29;
              return (
                <path
                  key={"ch" + i}
                  d={`M${h.x},${y} q${h.len * 0.5},7 ${h.len},3`}
                />
              );
            })}
          </g>
          <g fill="none" stroke={C.mid} strokeWidth="2.6">
            {[-1, 1].map((side) => (
              <g key={side}>
                {Array.from({ length: 17 }, (_, i) => {
                  const y = -40 + i * 8;
                  const x = side * (45 + Math.sin((i / 17) * Math.PI) * 20);
                  return (
                    <path
                      key={i}
                      d={`M${x},${y} q${side * 13},4 ${side * (19 + rand(i + 1000) * 8)},14`}
                    />
                  );
                })}
                <path
                  d={`M${side * 122},100 Q${side * 187},108 ${side * 229},${63 - 4 * s.smile}`}
                />
                <path
                  d={`M${side * 100},151 Q${side * 118},169 ${side * 130},${177 - 4 * s.smile}`}
                />
              </g>
            ))}
          </g>
          {eyes.map((x, i) => {
            const right = i === 1;
            const browOffset = right ? -s.brow : 0;
            const clip = `${uid}-eye-${i}`;
            return (
              <g key={i} transform={`translate(${x} -82)`}>
                <defs>
                  <clipPath id={clip}>
                    <path d={eyeAperture(s)} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${clip})`}>
                  <path d={eyeAperture(s)} fill={C.black} />
                  <g
                    transform={`translate(${s.gaze} -4)`}
                    fill="none"
                    stroke={C.mid}
                    strokeWidth="2.4"
                  >
                    <circle r="34" fill={C.black} />
                    {Array.from({ length: 27 }, (_, j) => {
                      const a = (j / 27) * TAU;
                      return (
                        <path
                          key={j}
                          d={`M${pt(polar(a, 17 + rand(j + 2000) * 4))} Q${pt(polar(a + 0.06, 27))} ${pt(polar(a, 33))}`}
                        />
                      );
                    })}
                    <circle r="35" stroke={C.ink} strokeWidth="2.8" />
                    <circle r="14" fill={C.black} stroke={C.ink} />
                  </g>
                </g>
                <g fill="none" stroke={C.ink} strokeWidth="4.5">
                  <path d={`M-88,0 ${eyeCurve(true, s)}`} />
                  {s.blink < 0.999999 && (
                    <path
                      d={`M-88,0 ${eyeCurve(false, s)}`}
                      strokeWidth="3.3"
                    />
                  )}
                  <path
                    d={`M-99,${-54 + browOffset} Q-25,${-91 + browOffset} 88,${-64 + browOffset}`}
                    strokeWidth="4"
                  />
                  {s.blink < 0.999999 && (
                    <path
                      d={`M${mix(-76, -88, s.blink)},${mix(-23, 0, s.blink)} C${mix(-40, -45, s.blink)},${mix(-73, 25.6, s.blink)} ${mix(40, 43, s.blink)},${mix(-73, 25.6, s.blink)} ${mix(74, 88, s.blink)},${mix(-29, -2, s.blink)}`}
                      stroke={C.mid}
                      strokeWidth="2.6"
                    />
                  )}
                  {Array.from({ length: 13 }, (_, j) => {
                    const xx = -80 + j * 13;
                    const y =
                      -66 - 17 * Math.sin((j / 12) * Math.PI) + browOffset;
                    return (
                      <path
                        key={j}
                        d={`M${xx},${y} q7,-8 15,-8`}
                        stroke={C.mid}
                        strokeWidth="2.3"
                      />
                    );
                  })}
                  <path
                    d={`M-69,${44 - 4 * s.smile} Q0,${62 - 5 * s.smile} 65,${43 - 4 * s.smile}`}
                    stroke={C.mid}
                    strokeWidth="2.5"
                  />
                </g>
              </g>
            );
          })}
          <g fill="none" stroke={C.ink} strokeWidth="4">
            <path d="M-24,-61 Q-40,3 -42,53 Q-58,78 -36,96 M23,-54 Q35,17 43,53 Q58,74 37,96" />
            <path d="M-48,91 Q-29,78 -16,100 Q0,111 17,100 Q29,80 47,91" />
            <path
              d="M-28,99 Q-15,94 -10,101 M12,101 Q26,94 33,99"
              strokeWidth="3"
            />
            <path
              d={`M-102,${198 - 7 * s.smile} C-57,${191 - 3 * s.smile} -25,187 0,194 C25,187 57,${191 - 3 * s.smile} 102,${198 - 7 * s.smile}`}
            />
            <path
              d={`M-102,${198 - 7 * s.smile} Q-49,204 0,201 Q49,204 102,${198 - 7 * s.smile}`}
              strokeWidth="3.1"
            />
            <path
              d={`M-89,${201 - 6 * s.smile} Q0,232 89,${201 - 6 * s.smile}`}
              stroke={C.mid}
              strokeWidth="3.2"
            />
            <path d="M-48,254 Q0,267 48,254" stroke={C.mid} strokeWidth="2.8" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
