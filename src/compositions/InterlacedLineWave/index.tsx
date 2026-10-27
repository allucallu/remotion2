import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { InterlacedLineWave } from "./InterlacedLineWave";

export const interlacedLineWaveRegistration: AssetRegistration = {
	id: "InterlacedLineWave",
	render: () => (
		<Composition
			id="InterlacedLineWave"
			component={InterlacedLineWave}
			durationInFrames={240}
			fps={30}
			width={3840}
			height={2160}
		/>
	),
};
