import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  HALLOWEEN_SPIDERWEB_DURATION,
  HALLOWEEN_SPIDERWEB_FPS,
  HALLOWEEN_SPIDERWEB_HEIGHT,
  HALLOWEEN_SPIDERWEB_WIDTH,
  HalloweenSpiderwebFrame,
} from "./HalloweenSpiderwebFrame";

export const halloweenSpiderwebFrameRegistration: AssetRegistration = {
  id: "HalloweenSpiderwebFrame",
  render: () => (
    <Composition
      id="HalloweenSpiderwebFrame"
      component={HalloweenSpiderwebFrame}
      durationInFrames={HALLOWEEN_SPIDERWEB_DURATION}
      fps={HALLOWEEN_SPIDERWEB_FPS}
      width={HALLOWEEN_SPIDERWEB_WIDTH}
      height={HALLOWEEN_SPIDERWEB_HEIGHT}
    />
  ),
};
