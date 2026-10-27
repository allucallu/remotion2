import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { ElasticZigzag } from "./ElasticZigzag";

export const elasticZigzagRegistration: AssetRegistration = {
	id: "ElasticZigzag",
	render: () => (
		<Composition
			id="ElasticZigzag"
			component={ElasticZigzag}
			durationInFrames={240}
			fps={30}
			width={3840}
			height={2160}
		/>
	),
};
