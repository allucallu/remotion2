import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_ZIGZAG_SPINE_DURATION,
  NEO_BRUTALISM_ZIGZAG_SPINE_FPS,
  NEO_BRUTALISM_ZIGZAG_SPINE_HEIGHT,
  NEO_BRUTALISM_ZIGZAG_SPINE_WIDTH,
  NeoBrutalismZigzagSpine,
} from "./NeoBrutalismZigzagSpine";

export const neoBrutalismZigzagSpineRegistration: AssetRegistration = {
  id: "NeoBrutalismZigzagSpine",
  render: () => (
    <Composition
      id="NeoBrutalismZigzagSpine"
      component={NeoBrutalismZigzagSpine}
      durationInFrames={NEO_BRUTALISM_ZIGZAG_SPINE_DURATION}
      fps={NEO_BRUTALISM_ZIGZAG_SPINE_FPS}
      width={NEO_BRUTALISM_ZIGZAG_SPINE_WIDTH}
      height={NEO_BRUTALISM_ZIGZAG_SPINE_HEIGHT}
    />
  ),
};
