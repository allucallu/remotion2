import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {LiquidSpreadMatte} from "./LiquidSpreadMatte";

export const liquidSpreadMatteRegistration: AssetRegistration = {
	id: "LiquidSpreadMatte",
	render: () => (
		<Composition
			id="LiquidSpreadMatte"
			component={LiquidSpreadMatte}
			durationInFrames={180}
			fps={30}
			width={3840}
			height={2160}
		/>
	),
};
