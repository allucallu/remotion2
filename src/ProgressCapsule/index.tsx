import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  PROGRESS_CAPSULE_DURATION,
  PROGRESS_CAPSULE_FPS,
  PROGRESS_CAPSULE_HEIGHT,
  PROGRESS_CAPSULE_WIDTH,
  ProgressCapsule,
} from "./ProgressCapsule";

export const progressCapsuleRegistration: AssetRegistration = {
  id: "ProgressCapsule",
  render: () => (
    <Composition
      id="ProgressCapsule"
      component={ProgressCapsule}
      durationInFrames={PROGRESS_CAPSULE_DURATION}
      fps={PROGRESS_CAPSULE_FPS}
      width={PROGRESS_CAPSULE_WIDTH}
      height={PROGRESS_CAPSULE_HEIGHT}
    />
  ),
};
