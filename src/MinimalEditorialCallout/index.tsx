import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  MINIMAL_EDITORIAL_DURATION,
  MINIMAL_EDITORIAL_FPS,
  MINIMAL_EDITORIAL_HEIGHT,
  MINIMAL_EDITORIAL_WIDTH,
  MinimalEditorialCallout,
} from "./MinimalEditorialCallout";

export const minimalEditorialCalloutRegistration: AssetRegistration = {
  id: "MinimalEditorialCallout",
  render: () => (
    <Composition
      id="MinimalEditorialCallout"
      component={MinimalEditorialCallout}
      durationInFrames={MINIMAL_EDITORIAL_DURATION}
      fps={MINIMAL_EDITORIAL_FPS}
      width={MINIMAL_EDITORIAL_WIDTH}
      height={MINIMAL_EDITORIAL_HEIGHT}
    />
  ),
};
