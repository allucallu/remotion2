import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";

const GOLD = "#F2D58B";
const SECONDARY = "#CBA85B";
const TAU = Math.PI * 2;
const radians = (degrees: number) => degrees * Math.PI / 180;
const polar = (radius: number, degrees: number) => ({x: radius * Math.cos(radians(degrees)), y: radius * Math.sin(radians(degrees))});
const point = (radius: number, degrees: number) => {
	const p = polar(radius, degrees);
	return `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
};

const arcPath = (radius: number, start: number, end: number) => {
	const span = ((end - start) % 360 + 360) % 360;
	const large = span > 180 ? 1 : 0;
	return `M ${point(radius, start)} A ${radius} ${radius} 0 ${large} 1 ${point(radius, end)}`;
};

const trianglePoints = (rotation: number, radius = 440) => [0, 120, 240].map((angle) => point(radius, angle + rotation)).join(" ");
const mix = (amount: number) => {
	const a = Math.max(0, Math.min(1, amount));
	const low = [242, 213, 139];
	const high = [255, 240, 197];
	const rgb = low.map((value, index) => Math.round(value + (high[index] - value) * a));
	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

const Rune: React.FC<{variant: number}> = ({variant}) => {
	const common = {fill: "none", stroke: GOLD, strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
	if (variant % 5 === 0) return <path {...common} d="M 0 -26 L 0 26 M -17 -9 L 17 9 M -17 9 L 17 -9" />;
	if (variant % 5 === 1) return <path {...common} d="M -15 -23 L 15 0 L -15 23 M -15 -23 L -15 23" />;
	if (variant % 5 === 2) return <path {...common} d="M 0 -27 L 19 3 L 0 27 L -19 3 Z M -19 3 H 19" />;
	if (variant % 5 === 3) return <path {...common} d="M -18 -22 L 0 0 L 18 -22 M -18 22 L 0 0 L 18 22 M 0 -27 V 27" />;
	return <path {...common} d="M -17 -21 V 14 L 0 25 L 17 14 V -21 M -17 -5 H 17 M 0 -25 V 25" />;
};

const CardinalOrnament: React.FC<{angle: number}> = ({angle}) => (
 <g transform={`rotate(${angle})`} stroke={GOLD} fill="none" strokeLinejoin="round">
  <path d="M 0 -908 L -42 -815 L 0 -722 L 42 -815 Z M 0 -908 V -850 M 0 -780 V -670" strokeWidth="7" />
  <circle cx="0" cy="-815" r="25" fill="#000000" strokeWidth="7" />
  <circle cx="0" cy="-815" r="14" fill="#FFF0C5" stroke="none" />
  <path d="M -24 -540 V -615 M 0 -535 V -625 M 24 -540 V -615" strokeWidth="6" />
  <path d="M -8 -713 L 0 -724 L 8 -713 L 0 -702 Z" fill={GOLD} stroke="none" />
 </g>
);

const Dots: React.FC<{frame: number}> = ({frame}) => {
	const activeAngle = (frame % 80) / 80 * 360 - 90;
	return <>{Array.from({length: 48}, (_, index) => {
		const angle = index / 48 * 360 - 90;
		const distance = Math.abs((((angle - activeAngle + 180) % 360) + 360) % 360 - 180);
		const bright = Math.max(0, 1 - distance / 34);
		const p = polar(520, angle);
		return <circle key={index} cx={p.x} cy={p.y} r={5} fill={mix(bright)} />;
	})}</>;
};

const angularDistance = (a:number,b:number) => Math.abs(((a-b+540)%360)-180);
const StarLines: React.FC<{rotation:number; orientation:number}> = ({rotation,orientation}) => (
 <g transform={`rotate(${rotation})`} fill="none" stroke={GOLD} strokeLinejoin="miter">
  <polygon points={trianglePoints(orientation)} strokeWidth="10" />
  <polygon points={trianglePoints(orientation,407)} strokeWidth="4" />
  {[0,120,240].map((a,i)=>{
   const p=polar(302,a+orientation);
   return <path key={i} transform={`translate(${p.x} ${p.y}) rotate(${a+orientation})`}
    d="M 0 -9 L 9 0 L 0 9 L -9 0 Z" strokeWidth="5" />;
  })}
 </g>
);
const StarNodes: React.FC<{rotation:number;orientation:number;frame:number}> = ({rotation,orientation,frame}) => (
 <>{[0,120,240].map((a,i)=>{
  const world=a+orientation+rotation;
  const p=polar(440,world);
  // Brightness follows spatial angle, preserving 120-degree triangle symmetry.
  const pulse=(frame%120)/120*360-90;
  const bright=Math.max(0,1-angularDistance((world+720)%360,(pulse+720)%360)/30);
  return <g key={i}>
   <circle cx={p.x} cy={p.y} r="35" fill="#000000" stroke={mix(bright)} strokeWidth="6" />
   <circle cx={p.x} cy={p.y} r="23" fill={mix(bright)} />
  </g>;
 })}</>
);

/** Seamless 240-frame arcane seal loop built entirely from vector geometry. */
export const ArcaneSealLoop: React.FC = () => {
	const frame = useCurrentFrame();

	const symbolRotation = frame / 240 * 360;
	const innerRotation = -frame / 240 * 360;
	const coreMix = (Math.sin(TAU * frame / 120 - Math.PI / 2) + 1) / 2;
	return (
		<AbsoluteFill style={{backgroundColor: "#000000"}}>
			<svg width="100%" height="100%" viewBox="0 0 3840 2160" aria-label="Looping arcane seal">
				<rect width="3840" height="2160" fill="#000000" />
				<g transform="translate(1920 1080)">
					{/* Stable outer framework */}
					<circle r="815" fill="none" stroke={GOLD} strokeWidth="10" />
					<circle r="790" fill="none" stroke={SECONDARY} strokeWidth="6" />
					{[0, 90, 180, 270].map((angle) => <CardinalOrnament key={angle} angle={angle} />)}
					{/* Rune ribbon: a single rigid rotating band */}
					<g transform={`rotate(${symbolRotation})`}>
						{Array.from({length: 24}, (_, index) => {
							const angle = index * 15;
							return <g key={index} transform={`rotate(${angle}) translate(0 -700) scale(1.28)`}><Rune variant={index} /></g>;
						})}
						{Array.from({length: 24}, (_, index) => <path key={`tick-${index}`} d="M 0 -765 V -641" transform={`rotate(${index * 15 + 7.5})`} stroke={SECONDARY} strokeWidth="5" />)}
					</g>
					{/* Counter-rotating segmented inner ring */}
					<g transform={`rotate(${innerRotation})`} fill="none" stroke={GOLD} strokeWidth="9" strokeLinecap="round">
						{Array.from({length: 4}, (_, index) => <React.Fragment key={index}>
       <path d={arcPath(604, index * 90 + 3, index * 90 + 87)} />
       <path d={arcPath(550, index * 90 + 6, index * 90 + 84)} strokeWidth="5" />
      </React.Fragment>)}
						{Array.from({length: 4}, (_, index) => <path key={`mark-${index}`} d="M 0 -630 V -604" transform={`rotate(${index * 90})`} stroke={SECONDARY} strokeWidth="7" />)}
					</g>
					<Dots frame={frame} />
					<StarLines rotation={frame / 240 * 120} orientation={-90} />
     <StarLines rotation={-frame / 240 * 120} orientation={90} />
     <StarNodes rotation={frame / 240 * 120} orientation={-90} frame={frame} />
     <StarNodes rotation={-frame / 240 * 120} orientation={90} frame={frame} />
					<circle r="160" fill="none" stroke={mix(coreMix)} strokeWidth="10" />
					{Array.from({length:60},(_,i)=>{
      const p=polar(181,i*6);return <circle key={`core-${i}`} cx={p.x} cy={p.y} r="4.5" fill={GOLD} />;
     })}
				</g>
			</svg>
		</AbsoluteFill>
	);
};
