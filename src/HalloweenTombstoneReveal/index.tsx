import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  HALLOWEEN_TOMBSTONE_REVEAL_DURATION,
  HALLOWEEN_TOMBSTONE_REVEAL_FPS,
  HALLOWEEN_TOMBSTONE_REVEAL_HEIGHT,
  HALLOWEEN_TOMBSTONE_REVEAL_WIDTH,
  HalloweenTombstoneReveal,
} from "./HalloweenTombstoneReveal";

export const halloweenTombstoneRevealRegistration: AssetRegistration = {
  id: "HalloweenTombstoneReveal",
  render: () => (
    <Composition
      id="HalloweenTombstoneReveal"
      component={HalloweenTombstoneReveal}
      durationInFrames={HALLOWEEN_TOMBSTONE_REVEAL_DURATION}
      fps={HALLOWEEN_TOMBSTONE_REVEAL_FPS}
      width={HALLOWEEN_TOMBSTONE_REVEAL_WIDTH}
      height={HALLOWEEN_TOMBSTONE_REVEAL_HEIGHT}
    />
  ),
};
