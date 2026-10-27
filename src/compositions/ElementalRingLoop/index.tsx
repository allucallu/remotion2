import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {ElementalRingLoop} from "./ElementalRingLoop";
export const elementalRingLoopRegistration: AssetRegistration = {id: "ElementalRingLoop", render: () => <Composition id="ElementalRingLoop" component={ElementalRingLoop} durationInFrames={240} fps={30} width={3840} height={2160} />};
