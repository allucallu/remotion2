import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  HALLOWEEN_BLACK_CAT_DURATION,
  HALLOWEEN_BLACK_CAT_FPS,
  HALLOWEEN_BLACK_CAT_HEIGHT,
  HALLOWEEN_BLACK_CAT_WIDTH,
  HalloweenBlackCat,
} from "./HalloweenBlackCat";

export const halloweenBlackCatRegistration: AssetRegistration = {
  id: "HalloweenBlackCat",
  render: () => (
    <Composition
      id="HalloweenBlackCat"
      component={HalloweenBlackCat}
      durationInFrames={HALLOWEEN_BLACK_CAT_DURATION}
      fps={HALLOWEEN_BLACK_CAT_FPS}
      width={HALLOWEEN_BLACK_CAT_WIDTH}
      height={HALLOWEEN_BLACK_CAT_HEIGHT}
    />
  ),
};
