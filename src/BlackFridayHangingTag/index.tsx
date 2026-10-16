import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  BLACK_FRIDAY_HANGING_TAG_DURATION,
  BLACK_FRIDAY_HANGING_TAG_FPS,
  BLACK_FRIDAY_HANGING_TAG_HEIGHT,
  BLACK_FRIDAY_HANGING_TAG_WIDTH,
  BlackFridayHangingTag,
} from "./BlackFridayHangingTag";

export const blackFridayHangingTagRegistration: AssetRegistration = {
  id: "BlackFridayHangingTag",
  render: () => (
    <Composition
      id="BlackFridayHangingTag"
      component={BlackFridayHangingTag}
      durationInFrames={BLACK_FRIDAY_HANGING_TAG_DURATION}
      fps={BLACK_FRIDAY_HANGING_TAG_FPS}
      width={BLACK_FRIDAY_HANGING_TAG_WIDTH}
      height={BLACK_FRIDAY_HANGING_TAG_HEIGHT}
    />
  ),
};
