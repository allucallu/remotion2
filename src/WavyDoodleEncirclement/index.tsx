import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  WavyDoodleEncirclement,
  WAVY_DURATION,
  WAVY_FPS,
  WAVY_HEIGHT,
  WAVY_WIDTH,
} from "./WavyDoodleEncirclement";
export const wavyDoodleEncirclementRegistration: AssetRegistration = {
  id: "WavyDoodleEncirclement",
  render: () => (
    <Composition
      id="WavyDoodleEncirclement"
      component={WavyDoodleEncirclement}
      durationInFrames={WAVY_DURATION}
      fps={WAVY_FPS}
      width={WAVY_WIDTH}
      height={WAVY_HEIGHT}
    />
  ),
};
