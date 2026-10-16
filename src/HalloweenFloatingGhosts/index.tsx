import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  HALLOWEEN_FLOATING_GHOSTS_DURATION,
  HALLOWEEN_FLOATING_GHOSTS_FPS,
  HALLOWEEN_FLOATING_GHOSTS_HEIGHT,
  HALLOWEEN_FLOATING_GHOSTS_WIDTH,
  HalloweenFloatingGhosts,
} from "./HalloweenFloatingGhosts";

export const halloweenFloatingGhostsRegistration: AssetRegistration = {
  id: "HalloweenFloatingGhosts",
  render: () => (
    <Composition
      id="HalloweenFloatingGhosts"
      component={HalloweenFloatingGhosts}
      durationInFrames={HALLOWEEN_FLOATING_GHOSTS_DURATION}
      fps={HALLOWEEN_FLOATING_GHOSTS_FPS}
      width={HALLOWEEN_FLOATING_GHOSTS_WIDTH}
      height={HALLOWEEN_FLOATING_GHOSTS_HEIGHT}
    />
  ),
};
