import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {ResonanceArrayLoop} from "./ResonanceArrayLoop";
export const resonanceArrayLoopRegistration:AssetRegistration={id:"ResonanceArrayLoop",render:()=> <Composition id="ResonanceArrayLoop" component={ResonanceArrayLoop} durationInFrames={240} fps={30} width={3840} height={2160}/>};
