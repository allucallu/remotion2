import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  SketchCheckmark,
  CHECK_DURATION,
  CHECK_FPS,
  CHECK_HEIGHT,
  CHECK_WIDTH,
} from "./SketchCheckmark";
export const sketchCheckmarkRegistration: AssetRegistration = {
  id: "SketchCheckmark",
  render: () => (
    <Composition
      id="SketchCheckmark"
      component={SketchCheckmark}
      durationInFrames={CHECK_DURATION}
      fps={CHECK_FPS}
      width={CHECK_WIDTH}
      height={CHECK_HEIGHT}
    />
  ),
};
