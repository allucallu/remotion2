import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  SurpriseAccentRays,
  RAYS_DURATION,
  RAYS_FPS,
  RAYS_HEIGHT,
  RAYS_WIDTH,
} from "./SurpriseAccentRays";
export const surpriseAccentRaysRegistration: AssetRegistration = {
  id: "SurpriseAccentRays",
  render: () => (
    <Composition
      id="SurpriseAccentRays"
      component={SurpriseAccentRays}
      durationInFrames={RAYS_DURATION}
      fps={RAYS_FPS}
      width={RAYS_WIDTH}
      height={RAYS_HEIGHT}
    />
  ),
};
