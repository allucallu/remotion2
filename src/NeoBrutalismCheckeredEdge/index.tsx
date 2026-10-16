import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_CHECKERED_EDGE_DURATION,
  NEO_BRUTALISM_CHECKERED_EDGE_FPS,
  NEO_BRUTALISM_CHECKERED_EDGE_HEIGHT,
  NEO_BRUTALISM_CHECKERED_EDGE_WIDTH,
  NeoBrutalismCheckeredEdge,
} from "./NeoBrutalismCheckeredEdge";

export const neoBrutalismCheckeredEdgeRegistration: AssetRegistration = {
  id: "NeoBrutalismCheckeredEdge",
  render: () => (
    <Composition
      id="NeoBrutalismCheckeredEdge"
      component={NeoBrutalismCheckeredEdge}
      durationInFrames={NEO_BRUTALISM_CHECKERED_EDGE_DURATION}
      fps={NEO_BRUTALISM_CHECKERED_EDGE_FPS}
      width={NEO_BRUTALISM_CHECKERED_EDGE_WIDTH}
      height={NEO_BRUTALISM_CHECKERED_EDGE_HEIGHT}
    />
  ),
};
