import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  HandDrawnStarSpark,
  STAR_DURATION,
  STAR_FPS,
  STAR_HEIGHT,
  STAR_WIDTH,
} from "./HandDrawnStarSpark";
export const handDrawnStarSparkRegistration: AssetRegistration = {
  id: "HandDrawnStarSpark",
  render: () => (
    <Composition
      id="HandDrawnStarSpark"
      component={HandDrawnStarSpark}
      durationInFrames={STAR_DURATION}
      fps={STAR_FPS}
      width={STAR_WIDTH}
      height={STAR_HEIGHT}
    />
  ),
};
