import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  OrganicDoubleCircle,
  ORGANIC_DOUBLE_CIRCLE_DURATION,
  ORGANIC_DOUBLE_CIRCLE_FPS,
  ORGANIC_DOUBLE_CIRCLE_HEIGHT,
  ORGANIC_DOUBLE_CIRCLE_WIDTH,
} from "./OrganicDoubleCircle";

export const organicDoubleCircleRegistration: AssetRegistration = {
  id: "OrganicDoubleCircle",
  render: () => (
    <Composition
      id="OrganicDoubleCircle"
      component={OrganicDoubleCircle}
      durationInFrames={ORGANIC_DOUBLE_CIRCLE_DURATION}
      fps={ORGANIC_DOUBLE_CIRCLE_FPS}
      width={ORGANIC_DOUBLE_CIRCLE_WIDTH}
      height={ORGANIC_DOUBLE_CIRCLE_HEIGHT}
    />
  ),
};
