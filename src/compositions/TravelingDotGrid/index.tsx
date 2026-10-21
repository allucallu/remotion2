import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { TravelingDotGrid } from "./TravelingDotGrid";

export const travelingDotGridRegistration: AssetRegistration = {
  id: "TravelingDotGrid",
  render: () => (
    <Composition
      id="TravelingDotGrid"
      component={TravelingDotGrid}
      durationInFrames={180}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
