import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  SEGMENTED_RING_DURATION,
  SEGMENTED_RING_FPS,
  SEGMENTED_RING_HEIGHT,
  SEGMENTED_RING_WIDTH,
  SegmentedRing,
} from "./SegmentedRing";

export const segmentedRingRegistration: AssetRegistration = {
  id: "SegmentedRing",
  render: () => (
    <Composition
      id="SegmentedRing"
      component={SegmentedRing}
      durationInFrames={SEGMENTED_RING_DURATION}
      fps={SEGMENTED_RING_FPS}
      width={SEGMENTED_RING_WIDTH}
      height={SEGMENTED_RING_HEIGHT}
    />
  ),
};
