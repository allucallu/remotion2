import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  HALLOWEEN_SKULL_POP_DURATION,
  HALLOWEEN_SKULL_POP_FPS,
  HALLOWEEN_SKULL_POP_HEIGHT,
  HALLOWEEN_SKULL_POP_WIDTH,
  HalloweenSkullPop,
} from "./HalloweenSkullPop";

export const halloweenSkullPopRegistration: AssetRegistration = {
  id: "HalloweenSkullPop",
  render: () => (
    <Composition
      id="HalloweenSkullPop"
      component={HalloweenSkullPop}
      durationInFrames={HALLOWEEN_SKULL_POP_DURATION}
      fps={HALLOWEEN_SKULL_POP_FPS}
      width={HALLOWEEN_SKULL_POP_WIDTH}
      height={HALLOWEEN_SKULL_POP_HEIGHT}
    />
  ),
};
