import React, {useId} from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";

const TAU = Math.PI * 2;
const SAMPLES = 192;
const WIDTH = 3840;
const HEIGHT = 2160;

type Blob = {
	readonly x: number;
	readonly y: number;
	readonly start: number;
	readonly earlyRadius: number;
	readonly lobePhase: number;
};

const BLOBS: readonly Blob[] = [
	{x: 1500, y: 880, start: 12, earlyRadius: 1050, lobePhase: 0.18},
	{x: 2250, y: 800, start: 19, earlyRadius: 960, lobePhase: 1.27},
	{x: 1900, y: 1370, start: 26, earlyRadius: 930, lobePhase: 2.35},
	{x: 1050, y: 1390, start: 33, earlyRadius: 850, lobePhase: 3.42},
	{x: 2820, y: 1250, start: 40, earlyRadius: 820, lobePhase: 4.54},
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
	const t = clamp01(value);
	return t * t * (3 - 2 * t);
};

const midpoint = (a: Point, b: Point) => `${((a.x + b.x) / 2).toFixed(2)} ${((a.y + b.y) / 2).toFixed(2)}`;
type Point = {x: number; y: number};

/** A fixed-lobe contour. Only its radius grows, so revealed white never recedes. */
const blobPath = (blob: Blob, time: number) => {
	const age = time - blob.start / 30;
	const early = smooth(age / 2.25);
	const spread = smooth((time - 1.35) / 2.5);
	const radius = blob.earlyRadius * early + 1750 * spread;
	const cx = blob.x;
	const cy = blob.y;
	const points: Point[] = Array.from({length: SAMPLES}, (_, index) => {
		const angle = index * TAU / SAMPLES;
		// Nonnegative lobe weights with staggered growth: the contour develops
		// without translating centres or retracting previously revealed areas.
		const broad = 0.5 + 0.5 * Math.sin(3 * angle + blob.lobePhase);
		const secondary = 0.5 + 0.5 * Math.sin(5 * angle - blob.lobePhase * 0.7);
		const localRadius = radius + 160 * broad * smooth(age / 1.45) +
			85 * secondary * smooth((age - 0.18) / 1.9);
		return {x: cx + Math.cos(angle) * localRadius, y: cy + Math.sin(angle) * localRadius};
	});
	const commands = [`M ${midpoint(points[SAMPLES - 1], points[0])}`];
	points.forEach((point, index) => {
		commands.push(`Q ${point.x.toFixed(2)} ${point.y.toFixed(2)} ${midpoint(point, points[(index + 1) % SAMPLES])}`);
	});
	return `${commands.join(" ")} Z`;
};

/** 3840×2160, 30 fps, 180 frames. Black 0–11; spread 12–119;
 * white hold 120–179. Fixed filter bounds avoid changing crops as pools merge.
 * Rendered sources only grow; there is no drifting noise or reverse motion.
 */
export const LiquidSpreadMatte: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const time = frame / fps;
	const rawId = useId();
	const filterId = `liquid-spread-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
	const start = Math.round(0.4 * fps);
	const finish = Math.round(4 * fps);
	const isLiquidVisible = frame >= start && frame < finish;

	return (
		<AbsoluteFill style={{backgroundColor: "#000000"}}>
			<svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice" aria-label="Liquid spread luma matte">
				<defs>
					<filter id={filterId} filterUnits="userSpaceOnUse" x={-800} y={-800} width={WIDTH + 1600} height={HEIGHT + 1600} colorInterpolationFilters="sRGB">
						<feGaussianBlur in="SourceGraphic" stdDeviation="24" result="softLiquid" />
						<feColorMatrix in="softLiquid" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 24 -11.5" result="thresholdLiquid" />
						<feFlood floodColor="#FFFFFF" result="whiteLiquid" />
						<feComposite in="whiteLiquid" in2="thresholdLiquid" operator="in" />
					</filter>
				</defs>
				<rect width={WIDTH} height={HEIGHT} fill="#000000" />
				{isLiquidVisible ? (
					<g filter={`url(#${filterId})`}>
						{BLOBS.filter((blob) => time >= blob.start / 30).map((blob) => (
							<path key={blob.start} d={blobPath(blob, time)} fill="#FFFFFF" />
						))}
					</g>
				) : null}
				{frame >= finish ? <rect width={WIDTH} height={HEIGHT} fill="#FFFFFF" /> : null}
			</svg>
		</AbsoluteFill>
	);
};
