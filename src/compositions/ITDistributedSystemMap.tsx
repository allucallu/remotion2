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

const HUBS: readonly Point[]=[[540,470],[610,1570],[1820,340],[3210,500],[3130,1630]];
const EDGES: readonly [number,number,boolean][]=[[0,2,false],[2,3,false],[0,1,false],[1,4,true],[3,4,false],[0,3,true],[1,2,true],[2,4,true]];
const routeFor=(a:Point,b:Point):Point[]=>[a,[(a[0]+b[0])/2,a[1]],[(a[0]+b[0])/2,b[1]],b];
export const ITDistributedSystemMap = () => {
  const frame=useCurrentFrame();
  const {durationInFrames}=useVideoConfig();
  const u=mod(frame,durationInFrames)/durationInFrames;
  // Event birth times repeat every cycle. Routing is fixed at birth, so in-flight
  // packets never teleport when load shifts; previous-cycle packets are retained.
  const events=Array.from({length:48},(_,n)=>{
    const birth=n/48;
    const reroute=wave(birth,1,-.3)>.62;
    const edgeIndex=reroute ? [3,5,6,7][n%4] : [0,1,2,4][n%4];
    const [from,to,alternate]=EDGES[edgeIndex];
    const age=mod(u-birth,1), life=.13+(edgeIndex%3)*.035;
    return {n,edgeIndex,from,to,alternate,age,life};
  });
  return <svg width="100%" height="100%" viewBox="0 0 3840 2160" style={{background:'#000000',display:'block'}}>
    <rect width={3840} height={2160} fill="#000000" />
    {EDGES.map(([a,b,alt],i)=><path key={i} d={pathData(routeFor(HUBS[a],HUBS[b]))}
      fill="none" stroke={alt?'#304B50':'#283944'} strokeWidth={alt?3:5} />)}
    {events.filter(e=>e.age<e.life).map(e=>{
      const p=e.age/e.life,pos=pointAt(routeFor(HUBS[e.from],HUBS[e.to]),p);
      return <rect key={e.n} x={-13} y={-5} width={26} height={10} fill={e.alternate?'#548F8C':'#AAC5BF'}
        transform={`translate(${pos.x} ${pos.y}) rotate(${pos.angle})`} />;
    })}
    {HUBS.map(([x,y],i)=>{
      const receive=events.some(e=>e.to===i&&e.age>=e.life&&e.age<e.life+.023);
      const high=i===2&&wave(u,1,-.3)>.82;
      return <g key={i}>
        {Array.from({length:4},(_,j)=>{
          const sx=x+(j%2?1:-1)*160,sy=y+(j<2?-1:1)*110;
          return <g key={j}><path d={`M ${x} ${y} H ${sx} V ${sy}`} fill="none" stroke="#283944" strokeWidth={3}/>
            <rect x={sx-19} y={sy-15} width={38} height={30} rx={4} fill="#071014" stroke="#6C8793" strokeWidth={2}/></g>;
        })}
        <rect x={x-58} y={y-43} width={116} height={86} rx={7} fill="#03090C" stroke="#6C8793" strokeWidth={3}/>
        <rect x={x-48} y={y-33} width={96} height={66} rx={4} fill={receive?'#548F8C':'#0B161B'} stroke="#344B58" strokeWidth={2}/>
        {[0,1,2].map(j=><rect key={j} x={x-30+j*24} y={y-6} width={13} height={12} fill={high?'#AB9565':'#6C8793'}/>)}
      </g>;
    })}
  </svg>;
};
