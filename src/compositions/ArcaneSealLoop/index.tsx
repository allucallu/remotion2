import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {ArcaneSealLoop} from "./ArcaneSealLoop";

export const arcaneSealLoopRegistration: AssetRegistration = {
	id: "ArcaneSealLoop",
	render: () => <Composition id="ArcaneSealLoop" component={ArcaneSealLoop} durationInFrames={240} fps={30} width={3840} height={2160} />,
};
