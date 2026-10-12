import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  LAYERED_TAG_CALLOUT_DURATION,
  LAYERED_TAG_CALLOUT_FPS,
  LAYERED_TAG_CALLOUT_HEIGHT,
  LAYERED_TAG_CALLOUT_WIDTH,
  LayeredTagCallout,
} from "./LayeredTagCallout";

export const layeredTagCalloutRegistration: AssetRegistration = {
  id: "LayeredTagCallout",
  render: () => (
    <Composition
      id="LayeredTagCallout"
      component={LayeredTagCallout}
      durationInFrames={LAYERED_TAG_CALLOUT_DURATION}
      fps={LAYERED_TAG_CALLOUT_FPS}
      width={LAYERED_TAG_CALLOUT_WIDTH}
      height={LAYERED_TAG_CALLOUT_HEIGHT}
    />
  ),
};
