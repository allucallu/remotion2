import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { AlternatingTileWeave } from "./AlternatingTileWeave";

export const alternatingTileWeaveRegistration: AssetRegistration = {
	id: "AlternatingTileWeave",
	render: () => (
		<Composition
			id="AlternatingTileWeave"
			component={AlternatingTileWeave}
			durationInFrames={240}
			fps={30}
			width={3840}
			height={2160}
		/>
	),
};
