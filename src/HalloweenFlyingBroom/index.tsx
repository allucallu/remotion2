import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  HALLOWEEN_FLYING_BROOM_DURATION,
  HALLOWEEN_FLYING_BROOM_FPS,
  HALLOWEEN_FLYING_BROOM_HEIGHT,
  HALLOWEEN_FLYING_BROOM_WIDTH,
  HalloweenFlyingBroom,
} from "./HalloweenFlyingBroom";

export const halloweenFlyingBroomRegistration: AssetRegistration = {
  id: "HalloweenFlyingBroom",
  render: () => (
    <Composition
      id="HalloweenFlyingBroom"
      component={HalloweenFlyingBroom}
      durationInFrames={HALLOWEEN_FLYING_BROOM_DURATION}
      fps={HALLOWEEN_FLYING_BROOM_FPS}
      width={HALLOWEEN_FLYING_BROOM_WIDTH}
      height={HALLOWEEN_FLYING_BROOM_HEIGHT}
    />
  ),
};
