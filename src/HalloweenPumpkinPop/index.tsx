import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  HALLOWEEN_PUMPKIN_POP_DURATION,
  HALLOWEEN_PUMPKIN_POP_FPS,
  HALLOWEEN_PUMPKIN_POP_HEIGHT,
  HALLOWEEN_PUMPKIN_POP_WIDTH,
  HalloweenPumpkinPop,
} from "./HalloweenPumpkinPop";

export const halloweenPumpkinPopRegistration: AssetRegistration = {
  id: "HalloweenPumpkinPop",
  render: () => (
    <Composition
      id="HalloweenPumpkinPop"
      component={HalloweenPumpkinPop}
      durationInFrames={HALLOWEEN_PUMPKIN_POP_DURATION}
      fps={HALLOWEEN_PUMPKIN_POP_FPS}
      width={HALLOWEEN_PUMPKIN_POP_WIDTH}
      height={HALLOWEEN_PUMPKIN_POP_HEIGHT}
    />
  ),
};
