import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { OrbitingDashRing } from "./OrbitingDashRing";

export const orbitingDashRingRegistration: AssetRegistration = {
	id: "OrbitingDashRing",
	render: () => (
		<Composition
			id="OrbitingDashRing"
			component={OrbitingDashRing}
			durationInFrames={240}
			fps={30}
			width={3840}
			height={2160}
		/>
	),
};
