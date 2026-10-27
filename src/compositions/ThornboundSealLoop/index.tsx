import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {ThornboundSealLoop} from "./ThornboundSealLoop";
export const thornboundSealLoopRegistration:AssetRegistration={id:"ThornboundSealLoop",render:()=> <Composition id="ThornboundSealLoop" component={ThornboundSealLoop} durationInFrames={240} fps={30} width={3840} height={2160}/>};
