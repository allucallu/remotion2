import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";

const WHITE = "#FFF3DE";
const COPPER = "#DDA56E";
const TAU = Math.PI * 2;
const point = (radius: number, angle: number) => ({x: radius * Math.cos(angle), y: radius * Math.sin(angle)});
const radialTransform = (distance: number, angle: number) => {
	const p = point(distance, angle);
	return `translate(${p.x} ${p.y}) rotate(${angle * 180 / Math.PI + 90})`;
};
const arc = (r: number, a0: number, a1: number) => {
	const start = point(r, a0);
	const end = point(r, a1);
	return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
};
const panelMove = (frame: number, index: number) => {
	const local = ((frame - index * 6 + 120) % 120);
	if (local < 10) return 16 * (0.5 - 0.5 * Math.cos(Math.PI * local / 10));
	if (local < 20) return 16 * (0.5 + 0.5 * Math.cos(Math.PI * (local - 10) / 10));
	return 0;
};
const lockMove = (frame: number, index: number) => {
	const local = ((frame - index * 20 + 120) % 120);
	if (local < 8) return 24 * (0.5 - 0.5 * Math.cos(Math.PI * local / 8));
	if (local < 16) return 24;
	if (local < 28) return 24 * (0.5 + 0.5 * Math.cos(Math.PI * (local - 16) / 12));
	return 0;
};

const OuterPanel: React.FC<{index: number; frame: number}> = ({index, frame}) => {
	const angle = -Math.PI / 2 + index * TAU / 12;
	const move = panelMove(frame, index);
	const p = point(move, angle);
	return <g transform={`translate(${p.x} ${p.y})`} fill="none" strokeLinejoin="miter">
  <path d={`${arc(830,angle-.22,angle+.22)} L ${point(730,angle+.22).x} ${point(730,angle+.22).y} A 730 730 0 0 0 ${point(730,angle-.22).x} ${point(730,angle-.22).y} Z`} stroke={WHITE} strokeWidth="9" />
  <path d={`${arc(812,angle-.20,angle+.20)} L ${point(748,angle+.20).x} ${point(748,angle+.20).y} A 748 748 0 0 0 ${point(748,angle-.20).x} ${point(748,angle-.20).y} Z`} stroke={COPPER} strokeWidth="4" />
		<g transform={radialTransform(780, angle)} stroke={COPPER} strokeWidth="6">
			<path d="M -115 0 H -17 M 17 0 H 115" />
			<circle cx="0" cy="0" r="16" />
			<path d="M -102 0 l 13 -9 l 13 9 l -13 9 Z M 76 0 l 13 -9 l 13 9 l -13 9 Z" />
		</g>
	</g>;
};

const Lock: React.FC<{index: number; frame: number}> = ({index, frame}) => {
 const angle=-Math.PI/2+index*TAU/6;
 const inward=lockMove(frame,index);
 const locked=inward>23;
 return <g transform={radialTransform(540,angle)} fill="none" strokeLinejoin="miter">
  <defs><clipPath id={`sigil-lock-${index}`}><rect x="-26" y="-7" width="52" height="135" /></clipPath></defs>
  <circle cy="-84" r="20" stroke={COPPER} strokeWidth="7" />
  <path d="M -8 -64 V -22 L -43 5 V 52 H 43 V 5 L 8 -22 V -64 M -43 5 H 43" stroke={WHITE} strokeWidth="7" />
  {/* Local +y points inward. The shaft stays inside its fixed socket. */}
  <g clipPath={`url(#sigil-lock-${index})`}>
   <g transform={`translate(0 ${inward})`} stroke={COPPER} strokeWidth="7">
    <path d="M -15 -35 V 42 L 0 67 L 15 42 V -35 M -15 42 H 15" />
   </g>
  </g>
  <path d="M -24 18 H 24" stroke={locked?WHITE:COPPER} strokeWidth="6" />
 </g>;
};

export const MechanicalSigilLoop: React.FC = () => {
	const frame = ((useCurrentFrame() % 240) + 240) % 240;

	const markerRotation = -360 * frame / 240;
	const wheelRotation = 45 * frame / 240;
	return <AbsoluteFill style={{backgroundColor: "#000000"}}>
		<svg width="100%" height="100%" viewBox="0 0 3840 2160" aria-label="Mechanical copper sigil loop">
			<rect width="3840" height="2160" fill="#000000" />
			<g transform="translate(1920 1080)">
				{Array.from({length: 12}, (_, index) => <OuterPanel key={index} index={index} frame={frame} />)}
				{Array.from({length: 12}, (_, index) => { const a = -Math.PI / 2 + (index + .5) * TAU / 12; return <path key={index} transform={radialTransform(875,a)} d="M 0 -22 L 9 0 L 0 22 L -9 0 Z" fill={COPPER} />; })}
				<g transform={`rotate(${markerRotation})`} strokeLinecap="butt">{Array.from({length: 36}, (_, index) => { const a = index * TAU / 36; const a0 = point(index % 3 === 0 ? 638 : 650, a); const a1 = point(680, a); return <path key={index} d={`M ${a0.x} ${a0.y} L ${a1.x} ${a1.y}`} stroke={index % 3 === 0 ? WHITE : COPPER} strokeWidth={index % 3 === 0 ? 11 : 6} />; })}</g>
				{Array.from({length: 6}, (_, index) => <Lock key={index} index={index} frame={frame} />)}
				<circle r="390" fill="none" stroke={WHITE} strokeWidth="10" />
				<circle r="357" fill="none" stroke={COPPER} strokeWidth="6" />
				{[0, Math.PI].map((offset) => { const a = TAU * (frame % 120) / 120 + offset; const p = point(372, a); return <circle key={offset} cx={p.x} cy={p.y} r="10" fill={COPPER} />; })}
				<g transform={`rotate(${wheelRotation})`} fill="none" stroke={WHITE} strokeLinecap="round" strokeLinejoin="miter">
					{Array.from({length: 8}, (_, index) => <g key={index} transform={`rotate(${index * 45})`}><path d="M 100 0 H 315" strokeWidth="9" /><path d="M 204 0 L 231 -14 L 258 0 L 231 14 Z" stroke={WHITE} strokeWidth="6" /></g>)}
					<polygon points={Array.from({length:8},(_,i)=>{const p=point(108,-Math.PI/8+i*TAU/8);return `${p.x},${p.y}`;}).join(' ')} fill="#000000" stroke={COPPER} strokeWidth="9" />
				</g>
				{Array.from({length:8},(_,i)=>{const p=point(372,-Math.PI/2+i*TAU/8);return <circle key={`bearing-${i}`} cx={p.x} cy={p.y} r="13" fill="#000000" stroke={COPPER} strokeWidth="5" />;})}
			</g>
		</svg>
	</AbsoluteFill>;
};
