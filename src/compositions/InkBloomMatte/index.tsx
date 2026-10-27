import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { InkBloomMatte } from "./InkBloomMatte";

export const inkBloomMatteRegistration: AssetRegistration = {
	id: "InkBloomMatte",
	render: () => (
		<Composition
			id="InkBloomMatte"
			component={InkBloomMatte}
			durationInFrames={180}
			fps={30}
			width={3840}
			height={2160}
		/>
	),
};
