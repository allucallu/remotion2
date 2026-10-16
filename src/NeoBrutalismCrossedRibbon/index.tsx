import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_CROSSED_RIBBON_DURATION,
  NEO_BRUTALISM_CROSSED_RIBBON_FPS,
  NEO_BRUTALISM_CROSSED_RIBBON_HEIGHT,
  NEO_BRUTALISM_CROSSED_RIBBON_WIDTH,
  NeoBrutalismCrossedRibbon,
} from "./NeoBrutalismCrossedRibbon";

export const neoBrutalismCrossedRibbonRegistration: AssetRegistration = {
  id: "NeoBrutalismCrossedRibbon",
  render: () => (
    <Composition
      id="NeoBrutalismCrossedRibbon"
      component={NeoBrutalismCrossedRibbon}
      durationInFrames={NEO_BRUTALISM_CROSSED_RIBBON_DURATION}
      fps={NEO_BRUTALISM_CROSSED_RIBBON_FPS}
      width={NEO_BRUTALISM_CROSSED_RIBBON_WIDTH}
      height={NEO_BRUTALISM_CROSSED_RIBBON_HEIGHT}
    />
  ),
};
