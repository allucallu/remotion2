import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { SlidingStripePatch } from "./SlidingStripePatch";

export const slidingStripePatchRegistration: AssetRegistration = {
	id: "SlidingStripePatch",
	render: () => (
		<Composition
			id="SlidingStripePatch"
			component={SlidingStripePatch}
			durationInFrames={240}
			fps={30}
			width={3840}
			height={2160}
		/>
	),
};
