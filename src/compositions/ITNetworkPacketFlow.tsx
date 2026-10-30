import {useCurrentFrame, useVideoConfig} from 'remotion';

// 3840x2160, 30fps, 360 frames. No assets, network requests or random state.
const TAU = Math.PI * 2;
const mod = (n: number, d: number) => ((n % d) + d) % d;
const wave = (u: number, cycles: number, phase = 0) =>
  (1 + Math.sin(TAU * (u * cycles + phase))) / 2;
type Point = readonly [number, number];
const pathData = (points: readonly Point[]) => points.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
const pointAt = (points: readonly Point[], progress: number) => {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let distance = Math.max(0, Math.min(1, progress)) * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] ? distance / lengths[i] : 0;
      return {x: points[i][0] + (points[i + 1][0] - points[i][0]) * t,
        y: points[i][1] + (points[i + 1][1] - points[i][1]) * t,
        angle: Math.atan2(points[i + 1][1] - points[i][1], points[i + 1][0] - points[i][0]) * 180 / Math.PI};
    }
    distance -= lengths[i];
  }
  return {x: points[0][0], y: points[0][1], angle: 0};
};

const ROUTES: readonly (readonly Point[])[] = Array.from({length: 6}, (_, row) => {
  const y = 300 + row * 300;
  return [[270,y], [1020,y], [1020,y + (row % 2 ? -70 : 70)],
    [2820,y + (row % 2 ? -70 : 70)], [2820,y], [3570,y]] as Point[];
});
export const ITNetworkPacketFlow = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const u = mod(frame, durationInFrames) / durationInFrames;
  return <svg width="100%" height="100%" viewBox="0 0 3840 2160" style={{background:'#000000',display:'block'}}>
    <rect width={3840} height={2160} fill="#000000" />
    {ROUTES.map((route, i) => <g key={i}>
      <path d={pathData(route)} stroke="#26343E" strokeWidth={i % 2 ? 4 : 6} fill="none" />
      {[0,1,2,3].map((n) => {
        const p = mod(u * 2 + n / 4 + i / 11, 1);
        const pos = pointAt(route,p);
        // Packets travel at constant path speed, hiding reset inside endpoint nodes.
        const opacity = Math.min(1,p * 45,(1-p)*45);
        return <rect key={n} x={-15} y={-5} width={30} height={10} rx={2}
          fill={n%2 ? '#648F99' : '#B7CCC9'} opacity={opacity}
          transform={`translate(${pos.x} ${pos.y}) rotate(${pos.angle})`} />;
      })}
      {route.filter((_, n) => [0,1,4,5].includes(n)).map(([x,y], n) => {
        const pulse = Math.pow(wave(u,8,(i*3+n)/13),18);
        return <g key={n}><rect x={x-30} y={y-24} width={60} height={48} rx={4}
          fill="#080E12" stroke="#536773" strokeWidth={3} />
          <rect x={x-13} y={y-7} width={26} height={14} fill="#43867F" opacity={.3+.7*pulse} /></g>;
      })}
    </g>)}
    {[1020,2820].map((x) => <path key={x} d={`M ${x} 300 V 1800`} fill="none" stroke="#26343E" strokeWidth={3} opacity={.65} />)}
  </svg>;
};
