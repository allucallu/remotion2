import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";

const FIRE = "#FF8A24";
const WATER = "#8BDCF1";
const WIND = "#FFF0CC";
const EARTH = "#D9B461";
const TAU = Math.PI * 2;
const polar = (r: number, a: number) => ({x: r * Math.cos(a), y: r * Math.sin(a)});
const mixColor = (from: string, to: string, amount: number) => {
	const a = from.match(/[\da-f]{2}/gi)?.map((part) => parseInt(part, 16)) ?? [0, 0, 0];
	const b = to.match(/[\da-f]{2}/gi)?.map((part) => parseInt(part, 16)) ?? [0, 0, 0];
	return `#${a.map((value, index) => Math.round(value + (b[index] - value) * amount).toString(16).padStart(2, "0")).join("")}`;
};

const Flame: React.FC<{frame: number}> = ({frame}) => {
	const wobble = (shift: number) => Math.sin(TAU * (frame + shift) / 60) * 14;
	return <g transform="translate(0 -650)" fill="none" stroke={FIRE} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
		<path d={`M 0 115 C -100 62 -83 -35 ${wobble(0)} -170 C 87 -37 105 55 0 115 Z`} />
		<path d={`M -32 86 C -104 26 -47 -44 ${wobble(15) - 27} -108 C 7 -48 31 18 -32 86 Z`} strokeWidth="8" />
		<path d={`M 39 82 C -2 10 57 -52 ${wobble(30) + 43} -117 C 124 -29 109 39 39 82 Z`} strokeWidth="8" />
	</g>;
};

const Water: React.FC<{frame: number}> = ({frame}) => {
	const wave = (offset: number) => Math.sin(TAU * (frame + offset) / 80) * 10;
	return <g transform="translate(650 0)" fill="none" stroke={WATER} strokeLinecap="round" strokeLinejoin="round">
		<path d="M 0 -112 C 30 -62 86 0 86 40 C 86 142 -86 142 -86 40 C -86 0 -30 -62 0 -112 Z" strokeWidth="11" />
		<path d={`M 0 -58 C 39 -9 45 22 0 70 C -45 22 -39 -9 0 -58 Z`} strokeWidth="7" transform={`translate(0 ${wave(0)})`} />
		{[-55, 0, 55].map((y, i) => <path key={i} d={`M 95 ${y} C 132 ${y + wave(i * 14)} 158 ${y + wave(i * 14)} 190 ${y}`} strokeWidth="7" />)}
	</g>;
};

const Wind: React.FC<{frame: number}> = ({frame}) => {
	const tail = Math.sin(TAU * frame / 60) * 12;
	const spiral = "M 110 0 C 110 -104 -104 -104 -104 0 C -104 86 70 86 70 0 C 70 -56 -48 -56 -48 0 C -48 34 25 34 25 0";
	return <g transform="translate(-650 0)" fill="none" stroke={WIND} strokeLinecap="round" strokeLinejoin="round">
		<path d={spiral} stroke="#C6BA9F" strokeWidth="11" />
  <path d={spiral} stroke={WIND} strokeWidth="11" pathLength={1}
    strokeDasharray="0.15 2" strokeDashoffset={0.2-1.4*(frame%60)/60}
    opacity={Math.sin(Math.PI*(frame%60)/60)**0.5} />
		<path d={`M 80 84 C 135 ${96 + tail} 162 ${75 + tail} 190 55`} strokeWidth="7" />
		<path d={`M 82 118 C 139 ${130 - tail} 170 ${109 - tail} 207 89`} strokeWidth="7" />
	</g>;
};

const Earth: React.FC<{frame: number}> = ({frame}) => {
	const color = (offset: number) => mixColor(EARTH, WIND, Math.max(0, Math.sin(TAU * (frame - offset) / 120)));
	return <g transform="translate(0 650)" fill="none" strokeLinejoin="miter">
		<path d="M -60 32 L -118 -28 L -155 43 L -86 115 L -57 106 M 60 32 L 118 -28 L 155 43 L 86 115 L 57 106 M -118 -28 L -121 40 L -86 115 M 118 -28 L 121 40 L 86 115" stroke={EARTH} strokeWidth="7" />
  <path d="M 0 -122 L 82 -31 L 57 106 L 0 151 L -57 106 L -82 -31 Z" stroke={EARTH} strokeWidth="11" />
		<path d="M 0 -122 V 151 M -82 -31 L 0 20 L 82 -31 M -57 106 L 0 20 L 57 106" stroke={color(16)} strokeWidth="7" />
		<path d="M -57 106 L 0 151 L 57 106" stroke={color(8)} strokeWidth="7" />
		<path d="M -82 -31 L 0 -72 L 82 -31" stroke={color(0)} strokeWidth="7" />
	</g>;
};

const ArcGroup: React.FC<{start: number; color: string; frame: number}> = ({start, color, frame}) => {
	const end = start + 84;
	const markerProgress = (frame % 60) / 60;
 const markerA = start + 7 + markerProgress * 70;
	const p = polar(730, markerA * Math.PI / 180);
	const dots = Array.from({length: 7}, (_, index) => polar(770, (start + 13 + index * 8.7) * Math.PI / 180));
	return <g fill="none" stroke={color} strokeLinecap="round">
		<path d={`M ${polar(820, start * Math.PI / 180).x} ${polar(820, start * Math.PI / 180).y} A 820 820 0 0 1 ${polar(820, end * Math.PI / 180).x} ${polar(820, end * Math.PI / 180).y}`} strokeWidth="10" />
		<path d={`M ${polar(730, (start + 6) * Math.PI / 180).x} ${polar(730, (start + 6) * Math.PI / 180).y} A 730 730 0 0 1 ${polar(730, (end - 6) * Math.PI / 180).x} ${polar(730, (end - 6) * Math.PI / 180).y}`} strokeWidth="6" />
		<path d={`M ${polar(770, (start + 10) * Math.PI / 180).x} ${polar(770, (start + 10) * Math.PI / 180).y} A 770 770 0 0 1 ${polar(770, (end - 10) * Math.PI / 180).x} ${polar(770, (end - 10) * Math.PI / 180).y}`} strokeWidth="4" />
		{dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r="6" fill={color} stroke="none" />)}
		<circle cx={p.x} cy={p.y} r="11" fill={color} stroke="none" opacity={Math.min(1,markerProgress*10,(1-markerProgress)*10)} />
	</g>;
};

/** Four independently animated elemental quadrants in a seamless 240-frame loop. */
export const ElementalRingLoop: React.FC = () => {
	const frame = ((useCurrentFrame() % 240) + 240) % 240;

	const pulseSlot = Math.floor((frame % 120) / 30);
	const active = pulseSlot < 4 ? pulseSlot : -1;
	const axes = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
	const colors = [FIRE, WATER, EARTH, WIND];
	const phase = frame % 30;
	return <AbsoluteFill style={{backgroundColor: "#000000"}}>
		<svg width="100%" height="100%" viewBox="0 0 3840 2160" aria-label="Looping elemental ring">
			<rect width="3840" height="2160" fill="#000000" />
			<defs>
    <mask id="elemental-arc-mask" maskUnits="userSpaceOnUse" x="-950" y="-950" width="1900" height="1900">
     <rect x="-950" y="-950" width="1900" height="1900" fill="white" />
     <ellipse cy="-650" rx="120" ry="200" fill="black" />
     <ellipse cx="680" rx="190" ry="145" fill="black" />
     <ellipse cy="680" rx="170" ry="175" fill="black" />
     <ellipse cx="-650" rx="140" ry="150" fill="black" />
    </mask>
   </defs>
   <g transform="translate(1920 1080)">
    <g mask="url(#elemental-arc-mask)">
    {[[-132, FIRE], [-42, WATER], [48, EARTH], [138, WIND]].map(([start, color]) => <ArcGroup key={String(start)} start={start as number} color={color as string} frame={frame} />)}
				</g>
    {[45,135,225,315].map((angle,i)=><g key={angle} transform={`rotate(${angle})`} stroke={colors[i]} fill="none">
     <path d="M 0 -838 L 30 -807 L 0 -776 L -30 -807 Z" strokeWidth="8" />
     <circle cy="-704" r="23" strokeWidth="7" />
     <path d="M 0 -650 L -14 -606 L 0 -619 L 14 -606 Z" strokeWidth="5" />
    </g>)}
				<Flame frame={frame} /><Water frame={frame} /><Earth frame={frame} /><Wind frame={frame} />
				{/* fixed base connectors and travelling pulses */}
    {axes.map((angle,i)=><g key={i}>
     {Array.from({length:6},(_,j)=>{
      const p=polar(235+j*48,angle); return <circle key={j} cx={p.x} cy={p.y} r={j===0?12:7} fill={colors[i]} />;
     })}
    </g>)}
    {[0,1,2].map(n=>{
     const age=phase-n*2;
     if(age<0 || age>19)return null;
     const p=polar(490-age/19*300,axes[active]);
     return <circle key={`pulse-${n}`} cx={p.x} cy={p.y} r="11" fill={colors[active]}
      opacity={Math.min(1,age/3,(19-age)/3)} />;
    })}
    {[0,1,2,3].map(i=>{
     const a=axes[i];const p1=polar(335,a-.54);const p2=polar(335,a+.54);
     return <path key={`inner-${i}`} d={`M ${p1.x} ${p1.y} A 335 335 0 0 1 ${p2.x} ${p2.y}`} fill="none" stroke={colors[i]} strokeWidth="5" />;
    })}
				<circle r="180" fill="#000000" stroke={EARTH} strokeWidth="10" />
    {[0,1,2,3].map(i=>{
     const arrival=i===active && phase>=23 ? Math.sin(Math.PI*(phase-23)/7) : 0;
     const path=[
      'M -132 0 C -74 -32 -32 -74 0 -132',
      'M 0 -132 C 32 -74 74 -32 132 0',
      'M 132 0 C 74 32 32 74 0 132',
      'M 0 132 C -32 74 -74 32 -132 0',
     ][i];
     return <path key={`core-${i}`} d={path} fill="none" stroke={mixColor(colors[i], '#FFFFFF',Math.max(0,arrival))} strokeWidth="8" />;
    })}
			</g>
		</svg>
	</AbsoluteFill>;
};
