import { Composition } from "remotion";
import { SneakerFootstepTrail } from "./SneakerFootstepTrail";

export const sneakerTrailRegistration = {
  id: "SneakerFootstepTrail",
  render: () => (
    <Composition
      id="SneakerFootstepTrail"
      component={SneakerFootstepTrail}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
    />
  ),
};
