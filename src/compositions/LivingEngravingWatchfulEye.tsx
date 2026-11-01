import React, {useId} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** 3840 × 2160, 30 fps, 360 frames. Standalone replacement, no local helper imports.
 * background='transparent' removes ONLY the outside background. Black ink within
 * the eye remains opaque intentionally, so the pupil retains its shape on footage.
 * Register the existing named export in your Remotion Root as before.
 */
export type WatchfulEyeProps = {background?: 'black' | 'transparent'};
type P = {x: number; y: number};
const TAU = Math.PI * 2;
const INK = '#E8E0D0';
const MID = '#B9AF9B';
const LOW = '#8F8778';
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {const x = clamp(v); return x*x*x*(x*(x*6-15)+10);};
const mix = (a: number, b: number, v: number) => a+(b-a)*v;
const pt = (p: P) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`;
const polar = (a: number, r: number): P => ({x: Math.cos(a)*r,y: Math.sin(a)*r});
const trace = (p: P[], close = false) => p.map((v,i)=>`${i?'L':'M'}${pt(v)}`).join(' ')+(close?'Z':'');
const curve = (fn: (u: number)=>P, a=0, b=1, count=96) =>
  trace(Array.from({length:count},(_,i)=>fn(mix(a,b,i/(count-1)))));
const track = (t: number, keys: readonly (readonly [number,number])[]) => {
  for(let i=1;i<keys.length;i++){
    if(t<=keys[i][0]) return mix(keys[i-1][1],keys[i][1],smooth((t-keys[i-1][0])/(keys[i][0]-keys[i-1][0])));
  }
  return keys[keys.length-1][1];
};

export const watchfulEyeState = (seconds: number) => {
  const t = ((seconds%12)+12)%12;
  // Complete closure lasts one frame at 30fps; opening is slower than closing.
  const blink = t<3.3 || t>=3.7 ? 0 : t<3.4333333333
    ? smooth((t-3.3)/0.1333333333) : t<=3.4666666667 ? 1 : 1-smooth((t-3.4666666667)/0.2333333333);
  const squint = track(t,[[0,0],[7.6,0],[8.12,0.16],[8.8,0.16],[10.4,0],[12,0]]);
  const micro = (1-blink)*Math.pow(Math.sin(Math.PI*t/12),2);
  const x = track(t,[[0,0],[1.2,0],[1.43,148],[1.65,140],[3.42,140],[3.4666666667,0],[5.2,0],[5.43,-128],[5.65,-122],[8.8,-122],[9.25,0],[12,0]])+micro*3.5*Math.sin(TAU*t/3);
  const y = track(t,[[0,0],[1.2,0],[1.43,-36],[3.42,-36],[3.4666666667,0],[5.2,0],[5.43,28],[8.8,28],[9.25,0],[12,0]])+micro*2*Math.sin(TAU*t/4);
  const pupil = track(t,[[0,95],[2,95],[3.3,82.5],[5.2,95],[6,95],[7.6,102.5],[8.8,102.5],[10.4,95],[12,95]]);
  return {t,blink,squint,x,y,pupil};
};
type State = ReturnType<typeof watchfulEyeState>;
const lid = (u: number, upper: boolean, s: State): P => {
  const arch = Math.pow(Math.max(0,Math.sin(Math.PI*u)),0.94);
  const base = 12-34*u;
  const seam = base-12*arch;
  const follow = -s.y*(upper?0.32:0.12);
  const breath = 3*Math.sin(TAU*s.t/12)*Math.pow(Math.sin(Math.PI*s.t/12),2);
  const open = upper ? base-(328+follow+breath)*(1-s.squint)*arch*(1+0.055*(u-0.5))
    : base+244*(1-s.squint*0.38)*arch*(1-0.075*(u-0.5));
  return {x:-900+1800*u,y:mix(open,seam,s.blink)};
};
const aperture = (s: State) => trace([
  ...Array.from({length:101},(_,i)=>lid(i/100,true,s)),
  ...Array.from({length:101},(_,i)=>lid(1-i/100,false,s)),
],true);
const skin = (u: number,d: number,upper: boolean,s: State): P => {
  const p = lid(u,upper,s);
  const taper = Math.pow(Math.max(0,Math.sin(Math.PI*u)),0.55);
  return {x:p.x+(u-0.5)*d*0.24,
    y:p.y+(upper?-1:1)*d*taper*(1-s.blink*0.13)};
};
const ribbon = (a: P,b: P,c: P,w: number) => {
  const len = Math.hypot(c.x-a.x,c.y-a.y)||1;
  const nx = -(c.y-a.y)/len*w/2, ny=(c.x-a.x)/len*w/2;
  return `M${pt(a)} Q${pt({x:b.x+nx,y:b.y+ny})} ${pt(c)} Q${pt({x:b.x-nx,y:b.y-ny})} ${pt(a)}Z`;
};
const ring = (r: number, seed: number) => curve(u=>{
  const a=u*TAU;
  return polar(a,r+1.1*Math.sin(11*a+seed)+0.65*Math.sin(23*a+seed));
},0,1,181)+'Z';
const hatches = Array.from({length:440},(_,i)=>{
  const upper=i<240, j=upper?i:i-240;
  const columns=upper?60:50, row=Math.floor(j/columns);
  const u=0.022+0.956*((j%columns)+0.2+rand(i+41)*0.6)/columns;
  return {upper,u,d:19+row*49+rand(i+71)*20,
    length:28+rand(i+97)*48,width:2.8+rand(i+143)*2,
    slant:(upper?1:-1)*(0.009+rand(i+179)*0.012),seed:i};
});
const fibers = Array.from({length:164},(_,i)=>({
  a:TAU*(i+rand(i+401)*0.6)/164,
  bend:(rand(i+503)-0.5)*0.14,
  inner:rand(i+601)*0.11,
  end:246+rand(i+701)*24,
  width:2.3+rand(i+809)*1.7,
}));

/** Pure artwork component also allows still-frame QA without Remotion context. */
export const WatchfulEyeArtwork: React.FC<WatchfulEyeProps & {seconds: number}> = ({seconds,background='black'}) => {
  const s=watchfulEyeState(seconds);
  const id=`eye-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  const opening=aperture(s);
  return <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 3840 2160" role="img" aria-label="Animated antique engraved eye">
    {background==='black' && <rect width={3840} height={2160} fill="#000"/>}
    <defs><clipPath id={id} clipPathUnits="userSpaceOnUse"><path d={opening}/></clipPath></defs>
    <g transform="translate(1920 1085)" strokeLinecap="round" strokeLinejoin="round">
      {/* Short curved tapered strokes, staggered across anatomical bands. */}
      <g>
        {hatches.map((h,i)=>{
          const envelope=Math.pow(Math.sin(Math.PI*h.u),0.65);
          // Broken outer silhouette: reduce density toward corners and outside.
          if(rand(i+900)>envelope*(h.d>140?0.74:0.98)) return null;
          const a=skin(h.u,h.d,h.upper,s);
          const c=skin(clamp(h.u+h.slant),h.d+h.length,h.upper,s);
          const b=skin(clamp(h.u+h.slant*0.23),h.d+h.length*0.48,h.upper,s);
          return <path key={i} d={ribbon(a,b,c,h.width)} fill={h.d>130?LOW:MID}/>;
        })}
        {Array.from({length:66},(_,i)=>{
          const upper=i<36,u=upper?0.19+(i/36)*0.49:0.28+((i-36)/30)*0.47;
          const d=56+rand(i+1300)*79;
          return <path key={`cross${i}`} d={ribbon(skin(u,d,upper,s),skin(u+0.013,d+10,upper,s),skin(u+0.032,d+18,upper,s),3.1)} fill={LOW}/>;
        })}
      </g>
      <g clipPath={`url(#${id})`}>
        <path d={opening} fill="#000"/>
        {/* Short contour-following strokes replace a rigid fan across the sclera. */}
        <g fill={MID}>
          {Array.from({length:112},(_,i)=>{
            const side=i<56?-1:1,j=i%56,upper=j<28,k=j%28;
            const u0=0.035+(k/28)*0.235;
            const u=side<0?u0:1-u0;
            const direction=side<0?1:-1;
            const inward=upper?1:-1;
            const a=lid(u,upper,s);
            const v=u+direction*(0.018+rand(i+3100)*0.043);
            const b=lid((u+v)/2,upper,s),c=lid(v,upper,s);
            const depth=10+rand(i+3200)*26;
            return <path key={i} d={ribbon(
              {x:a.x,y:a.y+inward*depth},
              {x:b.x,y:b.y+inward*(depth+11)},
              {x:c.x,y:c.y+inward*(depth+24+rand(i+3300)*22)},
              2.8+rand(i+3400)*1.4)}/>;
          })}
        </g>
        <g transform={`translate(${s.x.toFixed(4)} ${(-49+s.y).toFixed(4)})`}>
          <circle r={280} fill="#000"/>
          <g fill="none">
            <path d={ring(273,0)} stroke={INK} strokeWidth={4.5}/>
            <path d={ring(264,2)} stroke={MID} strokeWidth={2.6}/>
            {fibers.map((f,i)=>{
              // All inner iris fibers follow pupil dilation in normalized annulus coordinates.
              const inner=s.pupil+9+(258-s.pupil)*f.inner;
              const span=f.end-inner;
              return <path key={i} d={`M${pt(polar(f.a,inner))} C${pt(polar(f.a+f.bend,inner+span*0.32))} ${pt(polar(f.a-f.bend*0.38,inner+span*0.73))} ${pt(polar(f.a,f.end))}`}
                stroke={i%5===0?LOW:i%3===0?MID:INK} strokeWidth={f.width}/>;
            })}
            {Array.from({length:82},(_,i)=>{
              const a=TAU*(i+0.3)/82;
              const r=mix(s.pupil+12,257,0.55+0.15*Math.sin(a*7)+rand(i+1900)*0.08);
              return <path key={`crypt${i}`} d={`M${pt(polar(a-0.016,r-10))} Q${pt(polar(a+0.012,r+12))} ${pt(polar(a+0.039,r-6))}`} stroke={i%3?MID:INK} strokeWidth={2.7}/>;
            })}
            {Array.from({length:48},(_,i)=>{
              const a=TAU*i/48,r=232+rand(i+2200)*19;
              return <path key={`rim${i}`} d={`M${pt(polar(a,r))} Q${pt(polar(a+0.033,r-4))} ${pt(polar(a+0.07,r))}`} stroke={LOW} strokeWidth={2.5}/>;
            })}
          </g>
          <circle r={s.pupil} fill="#000"/>
          <path d={ring(s.pupil+3,1)} fill="none" stroke={INK} strokeWidth={3.2}/>
          {/* Small fixed engraving glint; its position follows the iris, not pupil scale. */}
          <path d="M-68,-100 Q-54,-107 -42,-99 L-39,-83 Q-51,-77 -64,-83Z" fill={INK}/>
        </g>
        {/* Dense fine hatching under upper lid provides depth without a gradient. */}
        <g stroke={LOW} strokeWidth={2.5} fill="none">
          {Array.from({length:106},(_,i)=>{
            const u=(i+0.5)/106,p=lid(u,true,s);
            return <path key={i} d={`M${pt(p)} q-3,${10+rand(i+2500)*9} -1,${20+rand(i+2600)*17}`}/>;
          })}
        </g>
      </g>
      <g fill="none">
        <path d={curve(u=>lid(u,true,s))} stroke={INK} strokeWidth={7}/>
        {s.blink<0.9999 && <path d={curve(u=>lid(u,false,s))} stroke={INK} strokeWidth={4.6}/>}
        <path d={curve(u=>skin(u,92,true,s),0.055,0.96)} stroke={INK} strokeWidth={3.8}/>
        <path d={curve(u=>skin(u,112,true,s),0.15,0.78)} stroke={MID} strokeWidth={2.7}/>
        <path d={curve(u=>skin(u,62,false,s),0.15,0.46)} stroke={INK} strokeWidth={3}/>
        <path d={curve(u=>skin(u,89,false,s),0.49,0.86)} stroke={MID} strokeWidth={2.8}/>
        <path d={curve(u=>skin(u,153,false,s),0.3,0.69)} stroke={LOW} strokeWidth={2.6}/>
        <path d="M-900,12 Q-925,7 -948,20 M900,-22 Q933,-38 957,-35 M-946,39 Q-920,30 -903,31" stroke={MID} strokeWidth={3}/>
      </g>
    </g>
  </svg>;
};

export const LivingEngravingWatchfulEye: React.FC<WatchfulEyeProps> = ({background='black'}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  return <AbsoluteFill style={{backgroundColor:background==='black'?'#000000':'transparent'}}>
    <WatchfulEyeArtwork seconds={frame/fps} background={background}/>
  </AbsoluteFill>;
};
