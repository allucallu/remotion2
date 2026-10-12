import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  OpposingSketchBrackets,
  BRACKET_DURATION,
  BRACKET_FPS,
  BRACKET_HEIGHT,
  BRACKET_WIDTH,
} from "./OpposingSketchBrackets";
export const opposingSketchBracketsRegistration: AssetRegistration = {
  id: "OpposingSketchBrackets",
  render: () => (
    <Composition
      id="OpposingSketchBrackets"
      component={OpposingSketchBrackets}
      durationInFrames={BRACKET_DURATION}
      fps={BRACKET_FPS}
      width={BRACKET_WIDTH}
      height={BRACKET_HEIGHT}
    />
  ),
};
