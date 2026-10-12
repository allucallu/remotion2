import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  ELASTIC_DOTS_DURATION,
  ELASTIC_DOTS_FPS,
  ELASTIC_DOTS_HEIGHT,
  ELASTIC_DOTS_WIDTH,
  ElasticDots,
} from "./ElasticDots";

export const elasticDotsRegistration: AssetRegistration = {
  id: "ElasticDots",
  render: () => (
    <Composition
      id="ElasticDots"
      component={ElasticDots}
      durationInFrames={ELASTIC_DOTS_DURATION}
      fps={ELASTIC_DOTS_FPS}
      width={ELASTIC_DOTS_WIDTH}
      height={ELASTIC_DOTS_HEIGHT}
    />
  ),
};
