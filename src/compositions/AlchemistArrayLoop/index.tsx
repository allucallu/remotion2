import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {AlchemistArrayLoop} from "./AlchemistArrayLoop";

export const alchemistArrayLoopRegistration: AssetRegistration = {
	id: "AlchemistArrayLoop",
	render: () => <Composition id="AlchemistArrayLoop" component={AlchemistArrayLoop} durationInFrames={240} fps={30} width={3840} height={2160} />,
};
