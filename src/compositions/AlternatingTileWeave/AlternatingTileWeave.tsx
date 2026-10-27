import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const GRID_COORDINATES = [-330, 0, 330];
const MAX_SIZE = 240;
const SIZE_DELTA = 144;

export const AlternatingTileWeave: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const cycleFrames = Math.round(8 * fps);
	const wrappedFrame = ((frame % cycleFrames) + cycleFrames) % cycleFrames;
	const phase = (2 * Math.PI * wrappedFrame) / cycleFrames;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000000" }}>
			<svg width={3840} height={2160} viewBox="0 0 3840 2160" aria-label="Alternating tile weave">
				<g transform="translate(1920 1080)">
					{GRID_COORDINATES.flatMap((y, row) =>
						GRID_COORDINATES.map((x, column) => {
							const s = Math.sin(phase - (column + row) * (Math.PI / 3));
							const width = MAX_SIZE - SIZE_DELTA * Math.max(0, -s) ** 2;
							const height = MAX_SIZE - SIZE_DELTA * Math.max(0, s) ** 2;

							return (
								<rect
									key={`${row}-${column}`}
									x={x - width / 2}
									y={y - height / 2}
									width={width}
									height={height}
									fill="#F1EEE7"
								/>
							);
						}),
					)}
				</g>
			</svg>
		</AbsoluteFill>
	);
};
