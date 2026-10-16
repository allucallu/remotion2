import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  HALLOWEEN_BAT_SWARM_DURATION,
  HALLOWEEN_BAT_SWARM_FPS,
  HALLOWEEN_BAT_SWARM_HEIGHT,
  HALLOWEEN_BAT_SWARM_WIDTH,
  HalloweenBatSwarm,
} from "./HalloweenBatSwarm";

export const halloweenBatSwarmRegistration: AssetRegistration = {
  id: "HalloweenBatSwarm",
  render: () => (
    <Composition
      id="HalloweenBatSwarm"
      component={HalloweenBatSwarm}
      durationInFrames={HALLOWEEN_BAT_SWARM_DURATION}
      fps={HALLOWEEN_BAT_SWARM_FPS}
      width={HALLOWEEN_BAT_SWARM_WIDTH}
      height={HALLOWEEN_BAT_SWARM_HEIGHT}
    />
  ),
};
