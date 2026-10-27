import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";

const AMBER = "#F2B544";
const GOLD = "#F9D779";
const CREAM = "#FFF0BB";
const SECONDARY = "#B9842B";
const TAU = Math.PI * 2;
const polar = (radius: number, angle: number) => ({x: radius * Math.cos(angle), y: radius * Math.sin(angle)});
const polygonPoints = (radius: number, sides: number, start = -Math.PI / 2) => Array.from({length: sides}, (_, i) => {
	const p = polar(radius, start + i * TAU / sides);
	return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
}).join(" ");
const diamond = (x: number, y: number, size: number, fill: string) => <path d={`M ${x} ${y - size} L ${x + size} ${y} L ${x} ${y + size} L ${x - size} ${y} Z`} fill={fill} />;

const AlchemySymbol: React.FC<{index: number}> = ({index}) => {
	const props = {fill: "none", stroke: GOLD, strokeWidth: 8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
	if (index === 0) return <path {...props} d="M 0 -45 L 43 35 H -43 Z" />;
	if (index === 1) return <path {...props} d="M -40 -25 L 0 -62 L 40 -25 M -40 14 L 0 -23 L 40 14" />;
	if (index === 2) return <path {...props} d="M 0 -52 L 38 0 L 0 52 L -38 0 Z M 0 -52 V 52" />;
	if (index === 3) return <path {...props} d="M -42 -35 H 42 M -42 0 H 42 M -42 35 H 42" />;
	if (index === 4) return <><rect x="-40" y="-40" width="80" height="80" {...props} /><circle r="14" fill={AMBER} stroke="none" /></>;
	return <path {...props} d="M -43 -45 C 15 -45 15 45 -43 45 M 43 -45 C -15 -45 -15 45 43 45" />;
};

const Pulse: React.FC<{index: number; frame: number}> = ({index, frame}) => {
	const local = frame % 80;
	const evenSet = [0, 2, 4];
	const oddSet = [1, 3, 5];
	const travelling = (local <= 23 && evenSet.includes(index)) || (local >= 40 && local <= 63 && oddSet.includes(index));
	if (!travelling) return null;
	const start = local <= 23 ? 0 : 40;
	const progress = (local - start) / 23;
	const angle = -Math.PI / 2 + index * TAU / 6;
	const radius = 530 - 340 * progress;
	const p = polar(radius, angle);
	const strength = Math.min(1, progress * 7, (1 - progress) * 7);
 return <g opacity={strength}>{diamond(p.x, p.y, 14, CREAM)}</g>;
};

const Medal: React.FC<{index: number; frame: number}> = ({index, frame}) => {
	const local = frame % 80;
	const source = (local <= 23 && [0, 2, 4].includes(index)) || (local >= 40 && local <= 63 && [1, 3, 5].includes(index));
	const angle = -Math.PI / 2 + index * TAU / 6;
	const p = polar(640, angle);
	return <g transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`}>
		<circle r="105" fill="#000000" stroke={source ? CREAM : AMBER} strokeWidth="10" />
		<circle r="83" fill="none" stroke={GOLD} strokeWidth="5" />
		<AlchemySymbol index={[0, 2, 4, 5, 3, 1][index]} />
	</g>;
};

const Cardinal: React.FC<{angle: number}> = ({angle}) => <g transform={`rotate(${angle})`} fill="none" stroke={AMBER} strokeLinejoin="miter">
	<path d="M 0 -808 L 0 -875 M -18 -840 L 0 -892 L 18 -840 L 0 -808 Z" strokeWidth="8" />
	<path d="M -52 -790 H 52" strokeWidth="6" />
</g>;

/** Seamless amber alchemical network with alternating connector pulse trios. */
export const AlchemistArrayLoop: React.FC = () => {
	const frame = ((useCurrentFrame() % 240) + 240) % 240;

	const tickRotation = frame / 240 * 360;
	const triangleRotation = frame / 240 * 120;
	const local = frame % 80;
	const arrivalAge = local % 40 - 23;
 const arrival = arrivalAge >= 0 && arrivalAge <= 13 ? Math.sin(Math.PI * arrivalAge / 13) : 0;
 const coreColor = `rgb(${[242,181,68].map((v,i)=>Math.round(v+([255,240,187][i]-v)*arrival)).join(',')})`;
	return <AbsoluteFill style={{backgroundColor: "#000000"}}>
		<svg width="100%" height="100%" viewBox="0 0 3840 2160" aria-label="Looping alchemist array">
			<rect width="3840" height="2160" fill="#000000" />
			<g transform="translate(1920 1080)">
				{/* A: static framework */}
				<circle r="810" fill="none" stroke={AMBER} strokeWidth="10" />
				<circle r="700" fill="none" stroke={GOLD} strokeWidth="6" />
    <circle r="774" fill="none" stroke={SECONDARY} strokeWidth="5" strokeDasharray="4 18" strokeLinecap="round" />
				{[0, 90, 180, 270].map((angle) => <Cardinal key={angle} angle={angle} />)}
				{/* B: one-turn marker band */}
				<g transform={`rotate(${tickRotation})`} stroke={GOLD} strokeWidth="6">
					{Array.from({length: 72}, (_, index) => <path key={index} d={`M 0 -${index % 3 === 0 ? 785 : 775} V -751`} transform={`rotate(${index * 5})`} />)}
				</g>
				{/* C: static doubled hexagon and six medallions */}
				<polygon points={polygonPoints(640, 6)} fill="none" stroke={AMBER} strokeWidth="10" />
				<polygon points={polygonPoints(614, 6)} fill="none" stroke={GOLD} strokeWidth="5" />

				{/* D: symmetric rotating triangle */}
				<g transform={`rotate(${triangleRotation})`} fill="none" strokeLinejoin="miter">
					<polygon points={polygonPoints(510, 3)} stroke={AMBER} strokeWidth="11" />
					<polygon points={polygonPoints(485, 3)} stroke={GOLD} strokeWidth="5" />
					{[0, 120, 240].map((angle) => { const p = polar(510, -Math.PI / 2 + angle * Math.PI / 180); return <circle key={angle} cx={p.x} cy={p.y} r="13" fill={CREAM} stroke="none" />; })}
				</g>
				{/* E: six fixed connectors plus travel pulses */}
				{Array.from({length: 6}, (_, index) => {
					const angle = -Math.PI / 2 + index * TAU / 6;
					const a = polar(530, angle); const b = polar(190, angle);
					const marker = polar(285,angle);
     return <g key={`connector-${index}`}>
      <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={SECONDARY} strokeWidth="5" fill="none" />
      <path d="M -13 -18 L 13 -18 L 0 8 Z" transform={`translate(${marker.x} ${marker.y}) rotate(${index*60})`} fill={GOLD} />
     </g>;
				})}
				{Array.from({length: 6}, (_, index) => <Pulse key={`pulse-${index}`} index={index} frame={frame} />)}
				{/* F: motionless core with only a colour accent on arrivals */}
				<polygon points={polygonPoints(190, 6)} fill="#000000" stroke={coreColor} strokeWidth="11" />
				<polygon points={polygonPoints(163, 6)} fill="none" stroke={GOLD} strokeWidth="5" />
				
				{Array.from({length: 6}, (_, index) => { const p = polar(190, -Math.PI / 2 + index * TAU / 6); return <circle key={index} cx={p.x} cy={p.y} r="9" fill={AMBER} />; })}
				{Array.from({length: 6}, (_, index) => <Medal key={index} index={index} frame={frame} />)}
			</g>
		</svg>
	</AbsoluteFill>;
};
