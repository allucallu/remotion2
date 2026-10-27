import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {PrismGateLoop} from "./PrismGateLoop";
export const prismGateLoopRegistration:AssetRegistration={id:"PrismGateLoop",render:()=> <Composition id="PrismGateLoop" component={PrismGateLoop} durationInFrames={240} fps={30} width={3840} height={2160}/>};
