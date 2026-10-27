import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";

const CREAM = "#FFF0CC";
const BLUE = "#A8D9F5";
const BLUE2 = "#6AA9CA";
const TAU = Math.PI * 2;
const p = (r: number, a: number) => ({x: r * Math.cos(a), y: r * Math.sin(a)});
const diamond = (r: number, a: number, s: number, color: string) => { const q = p(r, a); return <path d={`M ${q.x} ${q.y-s} L ${q.x+s} ${q.y} L ${q.x} ${q.y+s} L ${q.x-s} ${q.y} Z`} fill="#000" stroke={color} strokeWidth="7" />; };
const smooth = (t: number) => t * t * (3 - 2 * t);
const needleAngle = (frame: number) => {
	const section = Math.floor(frame / 60);
	const local = frame % 60;
	const base = 20 + section * 90;
	if (local < 12) return base;
	if (local < 44) return base + 90 * smooth((local - 12) / 32);
	if (local < 50) return base + 90 + 2 * Math.sin(Math.PI * (local - 44) / 6) ** 2;
	return base + 90;
};
const symbol = (index: number, r: number) => {
	const a = -Math.PI / 2 + index * TAU / 8;
	const q = p(r, a);
	return <g key={index} transform={`translate(${q.x} ${q.y}) rotate(${a * 180 / Math.PI + 90})`} fill="none" stroke={BLUE} strokeWidth="7" strokeLinejoin="miter">
		{index % 4 === 0 ? <path d="M 0 -24 L 18 0 L 0 24 L -18 0 Z M -31 0 H 31" /> : index % 4 === 1 ? <path d="M -22 16 C -37 -13 -5 -34 15 -13 C 33 6 11 31 -11 12" /> : index % 4 === 2 ? <path d="M 0 -30 L 8 -8 L 30 0 L 8 8 L 0 30 L -8 8 L -30 0 L -8 -8 Z" /> : <path d="M -25 20 L 0 -26 L 25 20 Z M -12 0 H 12" />}
	</g>;
};

export const AstralCompassLoop: React.FC = () => {
	const frame = ((useCurrentFrame() % 240) + 240) % 240;

	const needle = needleAngle(frame);
	const lock = frame % 60 >= 50;
	const lockAge = frame % 60 - 50;
 const lockProgress = lock ? Math.min(1, lockAge / 6) : 0;
 const lockOpacity = lock ? Math.min(1,lockAge/2,(10-lockAge)/4) : 0;
	return <AbsoluteFill style={{backgroundColor: "#000"}}><svg width="100%" height="100%" viewBox="0 0 3840 2160"><rect width="3840" height="2160" fill="#000" />
		<g transform="translate(1920 1080)">
			<circle r="820" fill="none" stroke={CREAM} strokeWidth="11"/><circle r="790" fill="none" stroke={BLUE} strokeWidth="7"/>
			{[0,90,180,270].map(a=><path key={a} transform={`rotate(${a})`} d="M 0 -895 L 24 -835 L 0 -775 L -24 -835 Z" fill={CREAM} />)}
			<g transform={`rotate(${-360*frame/240})`} strokeLinecap="butt">{Array.from({length:96},(_,i)=>{const a=i*TAU/96;const a0=p(i%4===0?715:735,a),a1=p(765,a);return <path key={i} d={`M ${a0.x} ${a0.y} L ${a1.x} ${a1.y}`} stroke={i%4===0?CREAM:BLUE} strokeWidth={i%4===0?10:5}/>;})}</g>
			<circle r="500" fill="none" stroke={CREAM} strokeWidth="8"/><circle r="480" fill="none" stroke={CREAM} strokeWidth="4"/>
			{Array.from({length:8},(_,i)=>symbol(i,600))}
			{Array.from({length:8},(_,i)=>{const a=i*TAU/8+Math.PI/8;const a0=p(520,a),a1=p(695,a);return <path key={i} d={`M ${a0.x} ${a0.y} L ${a1.x} ${a1.y}`} stroke={BLUE2} strokeWidth="6"/>;})}
			
			{Array.from({length:48},(_,i)=>{const a=i*TAU/48;const q=p(405,a);const intensity=Math.max(0,(Math.cos(TAU*frame/120-a)-0.75)/0.25);return <circle key={i} cx={q.x} cy={q.y} r="6" fill={`rgb(${[168,217,245].map((v,j)=>Math.round(v+([255,240,204][j]-v)*intensity)).join(",")})`}/>;})}
			<circle r="235" fill="none" stroke={BLUE} strokeWidth="6"/><circle r="215" fill="none" stroke={BLUE2} strokeWidth="4"/>
   {[0,Math.PI/2,Math.PI,Math.PI*1.5].map(a=><g key={`node-${a}`}>{diamond(490,a,22,BLUE)}</g>)}
   {Array.from({length:8},(_,i)=>{
    const a=-Math.PI/2+i*TAU/8;
    const outer=p(i%2===0?450:360,a),left=p(78,a-.65),right=p(78,a+.65);
    const color=i%2===0?CREAM:BLUE;
    return <g key={`rose-${i}`}>
     <path d={`M 0 0 L ${left.x} ${left.y} L ${outer.x} ${outer.y} L ${right.x} ${right.y} Z`} fill="#000000" stroke={color} strokeWidth="6" />
     <path d={`M 0 0 L ${outer.x} ${outer.y} L ${right.x} ${right.y} Z`} fill={color} />
    </g>;
   })}
			<g transform={`rotate(${needle})`}>
    <path d="M 0 -450 L -34 0 L 0 370 Z" fill={CREAM} />
    <path d="M 0 -450 L 34 0 L 0 370 Z" fill={BLUE} />
    <path d="M 0 -450 L 34 0 L 0 370 L -34 0 Z" fill="none" stroke={CREAM} strokeWidth="7" />
    {lock && <g opacity={lockOpacity} stroke="#FFF8E7" strokeWidth="7" strokeLinecap="round">
     <path d={`M 0 -50 V ${-50-365*lockProgress}`} />
     <path d="M -38 -370 L -32 -400 M 32 -400 L 38 -370" />
    </g>}
			</g>
			<circle r="46" fill="#000" stroke={CREAM} strokeWidth="10"/><circle r="20" fill={BLUE}/>
		</g></svg></AbsoluteFill>;
};
