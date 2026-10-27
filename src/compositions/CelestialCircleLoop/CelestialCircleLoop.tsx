import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";

const ICE = "#E8F4FF";
const LIGHT = "#A8D9F5";
const BLUE = "#5796C2";
const TAU = Math.PI * 2;
const polar = (radius: number, angle: number) => ({x: radius * Math.cos(angle), y: radius * Math.sin(angle)});
const mixIce = (amount: number) => {
	const a = Math.max(0, Math.min(1, amount));
	const from = [168, 217, 245];
	const to = [232, 244, 255];
	return `rgb(${from.map((v, i) => Math.round(v + (to[i] - v) * a)).join(",")})`;
};

const MoonPhase: React.FC<{phase: number}> = ({phase}) => {
 if (phase === 0) return <circle r={72} fill={ICE} />;
 if (phase === 4) return null;
 const side = phase < 4 ? -1 : 1;
 const amount = phase === 1 || phase === 7 ? 0.62 : phase === 2 || phase === 6 ? 0 : -0.62;
 // Projected spherical terminator, sampled into a closed crescent/half/gibbous.
 const edge = Array.from({length:65},(_,i)=>{
  const y=-72+144*i/64; const x=Math.sqrt(Math.max(0,72*72-y*y));
  return {x:side*x,y};
 });
 const points=[...edge,...edge.slice().reverse().map(p=>({x:p.x*amount,y:p.y}))];
 return <path d={points.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(' ')+' Z'} fill={ICE} />;
};

const MoonMedallion: React.FC<{index: number; frame: number}> = ({index, frame}) => {
	const angle = -Math.PI / 2 + index * TAU / 8 + TAU * frame / 240;
	const p = polar(590, angle);
	return <g transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`}>
		<circle r="105" fill="#000000" stroke={BLUE} strokeWidth="8" />
		<circle r="87" fill="#000000" stroke={LIGHT} strokeWidth="4" />
		<MoonPhase phase={index} />
	</g>;
};

const Constellation: React.FC<{rotation: number; phase: number; frame: number}> = ({rotation, phase, frame}) => {
	const path = "M -100 -705 L -34 -748 L 35 -710 L 98 -760";
	const progress = ((frame + phase) % 80) / 80;
 const offset = -(-0.2 + 1.4 * progress);
 const visibility = Math.sin(Math.PI * progress) ** 0.6;
	return <g transform={`rotate(${rotation})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
		<path d={path} stroke={BLUE} strokeWidth="5" />
		<path d={path} stroke={ICE} strokeWidth="7" pathLength={1} strokeDasharray="0.16 2" strokeDashoffset={offset} opacity={visibility} />
		{[[-100,-705],[-34,-748],[35,-710],[98,-760]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}>
    {i===1 || i===3 ? <path d="M 0 -19 Q 3 -3 15 0 Q 3 3 0 19 Q -3 3 -15 0 Q -3 -3 0 -19 Z" fill={ICE} stroke="none" /> : <circle r="8" fill={LIGHT} stroke="none" />}
   </g>)}
	</g>;
};

const FourPoint: React.FC<{angle: number}> = ({angle}) => (
 <g transform={`rotate(${angle})`} fill={ICE}>
  <path d="M 0 -894 Q 8 -833 39 -820 Q 8 -807 0 -746 Q -8 -807 -39 -820 Q -8 -833 0 -894 Z" />
 </g>
);

/** Calm, seamless astronomical seal: medallions orbit while staying upright. */
export const CelestialCircleLoop: React.FC = () => {
	const frame = useCurrentFrame();

	const tickRotation = -frame / 240 * 360;
	const orbitDotA = polar(400, -Math.PI / 2 + TAU * frame / 120);
	const orbitDotB = polar(450, Math.PI / 2 - TAU * frame / 240);
	const corePulse = (Math.sin(TAU * frame / 120 - Math.PI / 2) + 1) / 2;
	return <AbsoluteFill style={{backgroundColor: "#000000"}}>
		<svg width="100%" height="100%" viewBox="0 0 3840 2160" aria-label="Looping celestial circle">
			<rect width="3840" height="2160" fill="#000000" />
			<g transform="translate(1920 1080)">
				{/* A. stationary outer framework */}
				<circle r="820" fill="none" stroke={ICE} strokeWidth="10" />
				<circle r="794" fill="none" stroke={LIGHT} strokeWidth="5" />
				{[0, 90, 180, 270].map((angle) => <FourPoint key={angle} angle={angle} />)}
				{/* B. counter-rotating tick band */}
				<g transform={`rotate(${tickRotation})`} stroke={LIGHT} strokeWidth="5">
					{Array.from({length: 96}, (_, index) => <path key={index} d={`M 0 -790 V -${index % 4 === 0 ? 764 : 774}`} transform={`rotate(${index * 3.75})`} />)}
				</g>
				{/* C. moon orbit and upright orbiting medallions */}
				<circle r="590" fill="none" stroke={BLUE} strokeWidth="6" />

				{/* D. fixed inner orbits plus two travellers */}
				<circle r="450" fill="none" stroke={LIGHT} strokeWidth="4" strokeDasharray="4 18" strokeLinecap="round" />
				<circle r="400" fill="none" stroke={BLUE} strokeWidth="5" />
				<circle cx={orbitDotA.x} cy={orbitDotA.y} r="13" fill={ICE} />
				<circle cx={orbitDotB.x} cy={orbitDotB.y} r="12" fill="#000000" stroke={LIGHT} strokeWidth="7" />
				{/* E. three fixed constellation groups with travelling stroke accents */}
				<Constellation rotation={0} phase={0} frame={frame} />
				<Constellation rotation={120} phase={27} frame={frame} />
				<Constellation rotation={240} phase={54} frame={frame} />
				{Array.from({length: 8}, (_, index) => <MoonMedallion key={index} index={index} frame={frame} />)}
				{/* F. stationary sun core; only perfectly symmetric rays rotate */}
				<g transform={`rotate(${frame / 240 * 30})`} fill="none" stroke={ICE}>
					{Array.from({length: 12}, (_, index) => <path key={index} d="M -13 -210 L 0 -325 L 13 -210 L 0 -230 Z" transform={`rotate(${index * 30})`} strokeWidth="6" />)}
				</g>
				<circle r="180" fill="#000000" stroke={mixIce(corePulse)} strokeWidth="10" />
				<circle r="157" fill="none" stroke={BLUE} strokeWidth="5" />
			</g>
		</svg>
	</AbsoluteFill>;
};
