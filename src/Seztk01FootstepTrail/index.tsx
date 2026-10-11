import { Composition } from "remotion";
import {
  Seztk01CurvedTrail,
  Seztk01FootstepTrail,
} from "./Seztk01FootstepTrail";

export const seztk01TrailRegistration = {
  id: "seztk01",
  render: () => (
    <Composition
      id="seztk01"
      component={Seztk01FootstepTrail}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
    />
  ),
};

export const seztk01CurvedTrailRegistration = {
  id: "seztk01-CurvedTrail",
  render: () => (
    <Composition
      id="seztk01-CurvedTrail"
      component={Seztk01CurvedTrail}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
    />
  ),
};
