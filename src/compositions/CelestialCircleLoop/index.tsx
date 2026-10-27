import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {CelestialCircleLoop} from "./CelestialCircleLoop";

export const celestialCircleLoopRegistration: AssetRegistration = {
	id: "CelestialCircleLoop",
	render: () => <Composition id="CelestialCircleLoop" component={CelestialCircleLoop} durationInFrames={240} fps={30} width={3840} height={2160} />,
};
