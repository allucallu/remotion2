import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {PixelBatLoop} from "./PixelBatLoop";

export const pixelBatLoopRegistration: AssetRegistration = {
	id: "PixelBatLoop",
	render: () => <Composition id="PixelBatLoop" component={PixelBatLoop} durationInFrames={240} fps={30} width={3840} height={2160} />,
};
