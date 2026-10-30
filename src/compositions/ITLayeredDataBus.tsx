import {useCurrentFrame, useVideoConfig} from 'remotion';

// 3840x2160, 30fps, 360 frames. No assets, network requests or random state.
const mod = (n: number, d: number) => ((n % d) + d) % d;
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

const LANES: readonly (readonly Point[])[] = Array.from({length:8},(_,i)=>{
  const y=300+i*215+(i>2?70:0)+(i>5?70:0);
  const turn=i===1?100:i===6?-100:0;
  const path: Point[]=[[-120,y],[1020,y],[1020,y+turn],[2730,y+turn],[2730,y],[3960,y]];
  return i%2 ? [...path].reverse() : path;
});
export const ITLayeredDataBus = () => {
  const frame=useCurrentFrame();
  const {durationInFrames}=useVideoConfig();
  const u=mod(frame,durationInFrames)/durationInFrames;
  return <svg width="100%" height="100%" viewBox="0 0 3840 2160" style={{background:'#000000',display:'block'}}>
    <rect width={3840} height={2160} fill="#000000" />
    {LANES.map((lane,i)=><g key={i}>
      <path d={pathData(lane)} fill="none" stroke="#263741" strokeWidth={4} />
      {Array.from({length:7},(_,n)=>{
        const pos=pointAt(lane,mod(u*2+n/7+i/17,1));
        return <rect key={n} x={-12-n%3*5} y={-5} width={24+n%3*10} height={10}
          fill={n%3?'#AFC2C7':'#5C948E'} transform={`translate(${pos.x} ${pos.y}) rotate(${pos.angle})`} />;
      })}
      {[750,2960].map((x,j)=>{
        const y=lane[0][1], phase=mod(u*2+i/17+j/3,1);
        return <g key={j}>
          <rect x={x-105} y={y-53} width={210} height={106} rx={4} fill="#03080B" stroke="#4C6471" strokeWidth={3} />
          {/* Ports cover the outline exactly where the bus enters/exits. */}
          <path d={`M ${x-108} ${y} H ${x-78} M ${x+78} ${y} H ${x+108}`} stroke="#5C948E" strokeWidth={6} />
          {Array.from({length:5},(_,n)=><rect key={n} x={x-62+n*27} y={y-12} width={18} height={24}
            fill={phase>(n+1)/7?'#7C929D':'#17252D'} />)}
        </g>;
      })}
    </g>)}
  </svg>;
};
