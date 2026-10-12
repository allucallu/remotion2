import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  CURVED_CAPSULE_CALLOUT_DURATION,
  CURVED_CAPSULE_CALLOUT_FPS,
  CURVED_CAPSULE_CALLOUT_HEIGHT,
  CURVED_CAPSULE_CALLOUT_WIDTH,
  CurvedCapsuleCallout,
} from "./CurvedCapsuleCallout";

export const curvedCapsuleCalloutRegistration: AssetRegistration = {
  id: "CurvedCapsuleCallout",
  render: () => (
    <Composition
      id="CurvedCapsuleCallout"
      component={CurvedCapsuleCallout}
      durationInFrames={CURVED_CAPSULE_CALLOUT_DURATION}
      fps={CURVED_CAPSULE_CALLOUT_FPS}
      width={CURVED_CAPSULE_CALLOUT_WIDTH}
      height={CURVED_CAPSULE_CALLOUT_HEIGHT}
    />
  ),
};
