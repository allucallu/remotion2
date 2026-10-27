// White-on-black compositing master: apply Screen in the editing application.
// This render has an opaque black background, not an alpha channel.
import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const PATCH_SIZE = 1120;
const HALF_PATCH_SIZE = PATCH_SIZE / 2;
const STRIPE_SPACING = 128;
const LONG_ENDPOINT = 2400;
const SQRT_TWO = Math.sqrt(2);

export const SlidingStripePatch: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const clipId = `sliding-stripe-patch-${useId().replace(/:/g, "")}`;
	const cycleFrames = Math.max(1, Math.round(8 * fps));
	const wrappedFrame = ((frame % cycleFrames) + cycleFrames) % cycleFrames;
	const distance = 4 * STRIPE_SPACING * (wrappedFrame / cycleFrames);
	const translate = distance / SQRT_TWO;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000000" }}>
			<svg width="100%" height="100%" viewBox="0 0 3840 2160" preserveAspectRatio="xMidYMid meet" aria-label="Sliding diagonal stripe patch">
                <rect width="3840" height="2160" fill="#000000" />
				<g transform="translate(1920 1080)">
					<defs>
						<clipPath id={clipId} clipPathUnits="userSpaceOnUse">
							<rect
								x={-HALF_PATCH_SIZE}
								y={-HALF_PATCH_SIZE}
								width={PATCH_SIZE}
								height={PATCH_SIZE}
							/>
						</clipPath>
					</defs>
					<g clipPath={`url(#${clipId})`}>
						<g transform={`translate(${translate} ${translate})`}>
							{Array.from({ length: 25 }, (_, index) => {
								const k = index - 12;
								const c = k * STRIPE_SPACING * SQRT_TWO;
								return (
									<line
										key={k}
										x1={-LONG_ENDPOINT}
										y1={LONG_ENDPOINT + c}
										x2={LONG_ENDPOINT}
										y2={-LONG_ENDPOINT + c}
										stroke="#FFFFFF"
										strokeWidth={32}
										strokeLinecap="butt"
									/>
								);
							})}
						</g>
					</g>
				</g>
			</svg>
		</AbsoluteFill>
	);
};
