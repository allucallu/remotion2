import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {TornPaperMatte} from "./TornPaperMatte";

export const tornPaperMatteRegistration: AssetRegistration = {
	id: "TornPaperMatte",
	render: () => <Composition id="TornPaperMatte" component={TornPaperMatte} durationInFrames={180} fps={30} width={3840} height={2160} />,
};
