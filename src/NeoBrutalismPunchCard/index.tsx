import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_PUNCH_CARD_DURATION,
  NEO_BRUTALISM_PUNCH_CARD_FPS,
  NEO_BRUTALISM_PUNCH_CARD_HEIGHT,
  NEO_BRUTALISM_PUNCH_CARD_WIDTH,
  NeoBrutalismPunchCard,
} from "./NeoBrutalismPunchCard";

export const neoBrutalismPunchCardRegistration: AssetRegistration = {
  id: "NeoBrutalismPunchCard",
  render: () => (
    <Composition
      id="NeoBrutalismPunchCard"
      component={NeoBrutalismPunchCard}
      durationInFrames={NEO_BRUTALISM_PUNCH_CARD_DURATION}
      fps={NEO_BRUTALISM_PUNCH_CARD_FPS}
      width={NEO_BRUTALISM_PUNCH_CARD_WIDTH}
      height={NEO_BRUTALISM_PUNCH_CARD_HEIGHT}
    />
  ),
};
