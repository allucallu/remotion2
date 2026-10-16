import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_SPLIT_LEVEL_CARD_DURATION,
  NEO_BRUTALISM_SPLIT_LEVEL_CARD_FPS,
  NEO_BRUTALISM_SPLIT_LEVEL_CARD_HEIGHT,
  NEO_BRUTALISM_SPLIT_LEVEL_CARD_WIDTH,
  NeoBrutalismSplitLevelCard,
} from "./NeoBrutalismSplitLevelCard";

export const neoBrutalismSplitLevelCardRegistration: AssetRegistration = {
  id: "NeoBrutalismSplitLevelCard",
  render: () => (
    <Composition
      id="NeoBrutalismSplitLevelCard"
      component={NeoBrutalismSplitLevelCard}
      durationInFrames={NEO_BRUTALISM_SPLIT_LEVEL_CARD_DURATION}
      fps={NEO_BRUTALISM_SPLIT_LEVEL_CARD_FPS}
      width={NEO_BRUTALISM_SPLIT_LEVEL_CARD_WIDTH}
      height={NEO_BRUTALISM_SPLIT_LEVEL_CARD_HEIGHT}
    />
  ),
};
