import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_PERFORATED_RAIL_DURATION,
  NEO_BRUTALISM_PERFORATED_RAIL_FPS,
  NEO_BRUTALISM_PERFORATED_RAIL_HEIGHT,
  NEO_BRUTALISM_PERFORATED_RAIL_WIDTH,
  NeoBrutalismPerforatedRail,
} from "./NeoBrutalismPerforatedRail";

export const neoBrutalismPerforatedRailRegistration: AssetRegistration = {
  id: "NeoBrutalismPerforatedRail",
  render: () => (
    <Composition
      id="NeoBrutalismPerforatedRail"
      component={NeoBrutalismPerforatedRail}
      durationInFrames={NEO_BRUTALISM_PERFORATED_RAIL_DURATION}
      fps={NEO_BRUTALISM_PERFORATED_RAIL_FPS}
      width={NEO_BRUTALISM_PERFORATED_RAIL_WIDTH}
      height={NEO_BRUTALISM_PERFORATED_RAIL_HEIGHT}
    />
  ),
};
