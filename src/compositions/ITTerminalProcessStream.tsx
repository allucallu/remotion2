import {useCurrentFrame, useVideoConfig} from 'remotion';

const LINES = [
 ['INFO','scheduler','worker cycle completed'],['INFO','gateway','request batch processed'],
 ['INFO','queue','pending tasks dispatched'],['INFO','storage','snapshot verification passed'],
 ['INFO','monitor','health check completed'],['INFO','cache','index refresh completed'],
 ['INFO','worker','job accepted'],['WARN','worker','retry scheduled'],
 ['INFO','queue','task returned to queue'],['INFO','worker','retry completed'],
 ['INFO','gateway','response batch delivered'],['INFO','monitor','latency check completed'],
 ['INFO','storage','replica check completed'],['INFO','scheduler','next batch dispatched'],
 ['INFO','cache','expired entries removed'],['INFO','worker','task group completed'],
 ['INFO','queue','buffer checkpoint saved'],['INFO','monitor','resource check completed'],
 ['INFO','storage','snapshot index updated'],['INFO','gateway','connection pool verified'],
 ['INFO','scheduler','worker lease renewed'],['INFO','cache','index refresh completed'],
 ['INFO','queue','pending tasks dispatched'],['INFO','monitor','health check completed'],
] as const;
export const ITTerminalProcessStream = () => {
  const frame=useCurrentFrame();
  const {durationInFrames}=useVideoConfig();
  const u=((frame%durationInFrames)+durationInFrames)%durationInFrames/durationInFrames;
  const pitch=68, block=LINES.length*pitch, offset=u*block;
  return <svg width="100%" height="100%" viewBox="0 0 3840 2160" style={{background:'#000000',display:'block'}}>
    <rect width={3840} height={2160} fill="#000000" />
    {/* SVG viewport provides clipping; extra repeats cover the entire scroll. */}
    {[-1,0,1,2].flatMap(copy=>LINES.map(([level,service,message],i)=>{
      const y=170+copy*block+i*pitch-offset;
      return <text key={`${copy}-${i}`} x={190} y={y} fontSize={38}
        fontFamily="'DejaVu Sans Mono', 'Liberation Mono', Consolas, monospace" xmlSpace="preserve">
        <tspan fill="#52696B">{`09:42:${String(i*2).padStart(2,'0')}  `}</tspan>
        <tspan fill={level==='WARN'?'#B19B6C':'#B0C2BB'}>{`[${level}]  `}</tspan>
        <tspan fill="#60757D">{service.padEnd(12,' ')}</tspan>
        <tspan fill="#8EAAA0">{message}</tspan>
      </text>;
    }))}
    <rect width={3840} height={145} fill="#000000" />
    <rect y={2020} width={3840} height={140} fill="#000000" />
  </svg>;
};
