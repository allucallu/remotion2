import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  SpiralFocusCircle,
  SPIRAL_DURATION,
  SPIRAL_FPS,
  SPIRAL_HEIGHT,
  SPIRAL_WIDTH,
} from "./SpiralFocusCircle";
export const spiralFocusCircleRegistration: AssetRegistration = {
  id: "SpiralFocusCircle",
  render: () => (
    <Composition
      id="SpiralFocusCircle"
      component={SpiralFocusCircle}
      durationInFrames={SPIRAL_DURATION}
      fps={SPIRAL_FPS}
      width={SPIRAL_WIDTH}
      height={SPIRAL_HEIGHT}
    />
  ),
};
