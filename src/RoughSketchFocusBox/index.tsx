import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  RoughSketchFocusBox,
  BOX_DURATION,
  BOX_FPS,
  BOX_HEIGHT,
  BOX_WIDTH,
} from "./RoughSketchFocusBox";
export const roughSketchFocusBoxRegistration: AssetRegistration = {
  id: "RoughSketchFocusBox",
  render: () => (
    <Composition
      id="RoughSketchFocusBox"
      component={RoughSketchFocusBox}
      durationInFrames={BOX_DURATION}
      fps={BOX_FPS}
      width={BOX_WIDTH}
      height={BOX_HEIGHT}
    />
  ),
};
