import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {MechanicalSigilLoop} from "./MechanicalSigilLoop";

export const mechanicalSigilLoopRegistration: AssetRegistration = {
	id: "MechanicalSigilLoop",
	render: () => <Composition id="MechanicalSigilLoop" component={MechanicalSigilLoop} durationInFrames={240} fps={30} width={3840} height={2160} />,
};
