import {useCurrentFrame, useVideoConfig} from 'remotion';

// 3840x2160, 30fps, 360 frames. No assets, network requests or random state.
const TAU = Math.PI * 2;
const mod = (n: number, d: number) => ((n % d) + d) % d;
const wave = (u: number, cycles: number, phase = 0) =>
  (1 + Math.sin(TAU * (u * cycles + phase))) / 2;

export const ITServerActivityGrid = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const u = mod(frame,durationInFrames)/durationInFrames;
  return <svg width="100%" height="100%" viewBox="0 0 3840 2160" style={{background:'#000000',display:'block'}}>
    <rect width={3840} height={2160} fill="#000000" />
    {Array.from({length:24},(_,i) => {
      const col=i%6,row=Math.floor(i/6),x=220+col*575,y=230+row*435;
      const load=.22+.42*wave(u,1,i/9)+.22*wave(u,3,i/7);
      const amber=(i===4||i===19)&&wave(u,1,i/24)>.94;
      const accent=amber?'#B39B67':'#7DA79E';
      const quiet=col===2||col===3;
      return <g key={i} transform={`translate(${x} ${y})`} opacity={quiet?.58:1}>
        <rect width={520} height={345} rx={9} fill="#060A0D" stroke="#34444F" strokeWidth={3} />
        <rect x={26} y={27} width={16} height={16} rx={2} fill={accent} opacity={.45+.55*wave(u,4,i/13)} />
        {[0,1,2].map(n=><rect key={n} x={66} y={28+n*32} width={330-n*55} height={7} fill="#26323B" />)}
        {Array.from({length:12},(_,n)=><rect key={n} x={27+n*39} y={152} width={29} height={16}
          fill={n<Math.floor(load*12)?accent:'#1A2830'} />)}
        {Array.from({length:24},(_,n)=>{
          const h=16+90*(.45*load+.55*wave(u,2+(n%3),(i*7+n)/29));
          return <rect key={n} x={28+n*19} y={306-h} width={11} height={h} fill="#7294A5" opacity={.45+.4*load} />;
        })}
      </g>;
    })}
  </svg>;
};
