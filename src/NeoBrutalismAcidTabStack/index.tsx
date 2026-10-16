import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_ACID_TAB_STACK_DURATION,
  NEO_BRUTALISM_ACID_TAB_STACK_FPS,
  NEO_BRUTALISM_ACID_TAB_STACK_HEIGHT,
  NEO_BRUTALISM_ACID_TAB_STACK_WIDTH,
  NeoBrutalismAcidTabStack,
} from "./NeoBrutalismAcidTabStack";

export const neoBrutalismAcidTabStackRegistration: AssetRegistration = {
  id: "NeoBrutalismAcidTabStack",
  render: () => (
    <Composition
      id="NeoBrutalismAcidTabStack"
      component={NeoBrutalismAcidTabStack}
      durationInFrames={NEO_BRUTALISM_ACID_TAB_STACK_DURATION}
      fps={NEO_BRUTALISM_ACID_TAB_STACK_FPS}
      width={NEO_BRUTALISM_ACID_TAB_STACK_WIDTH}
      height={NEO_BRUTALISM_ACID_TAB_STACK_HEIGHT}
    />
  ),
};
