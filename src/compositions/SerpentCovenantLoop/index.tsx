import {Composition} from "remotion";
import type {AssetRegistration} from "../registry";
import {SerpentCovenantLoop} from "./SerpentCovenantLoop";
export const serpentCovenantLoopRegistration:AssetRegistration={id:"SerpentCovenantLoop",render:()=> <Composition id="SerpentCovenantLoop" component={SerpentCovenantLoop} durationInFrames={240} fps={30} width={3840} height={2160}/>};
