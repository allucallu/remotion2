import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {AstralCompassLoop} from "./AstralCompassLoop";
export const astralCompassLoopRegistration: AssetRegistration = {id:"AstralCompassLoop",render:()=> <Composition id="AstralCompassLoop" component={AstralCompassLoop} durationInFrames={240} fps={30} width={3840} height={2160}/>};
