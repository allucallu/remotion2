import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { BrushSweepMatte } from "./BrushSweepMatte";
export const brushSweepMatteRegistration: AssetRegistration = {id:"BrushSweepMatte",render:()=> <Composition id="BrushSweepMatte" component={BrushSweepMatte} durationInFrames={180} fps={30} width={3840} height={2160}/>};
