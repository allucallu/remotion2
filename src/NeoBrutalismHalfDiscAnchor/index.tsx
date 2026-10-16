import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_HALF_DISC_ANCHOR_DURATION,
  NEO_BRUTALISM_HALF_DISC_ANCHOR_FPS,
  NEO_BRUTALISM_HALF_DISC_ANCHOR_HEIGHT,
  NEO_BRUTALISM_HALF_DISC_ANCHOR_WIDTH,
  NeoBrutalismHalfDiscAnchor,
} from "./NeoBrutalismHalfDiscAnchor";

export const neoBrutalismHalfDiscAnchorRegistration: AssetRegistration = {
  id: "NeoBrutalismHalfDiscAnchor",
  render: () => (
    <Composition
      id="NeoBrutalismHalfDiscAnchor"
      component={NeoBrutalismHalfDiscAnchor}
      durationInFrames={NEO_BRUTALISM_HALF_DISC_ANCHOR_DURATION}
      fps={NEO_BRUTALISM_HALF_DISC_ANCHOR_FPS}
      width={NEO_BRUTALISM_HALF_DISC_ANCHOR_WIDTH}
      height={NEO_BRUTALISM_HALF_DISC_ANCHOR_HEIGHT}
    />
  ),
};
