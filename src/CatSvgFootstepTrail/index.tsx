import { Composition } from "remotion";
import { CatSvgFootstepTrail, CatSvgLoopArcTrail } from "./CatSvgFootstepTrail";

export const catSvgTrailRegistration = {
  id: "jejak-kucing",
  render: () => (
    <Composition
      id="jejak-kucing"
      component={CatSvgFootstepTrail}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
    />
  ),
};
export const catSvgLoopArcRegistration = {
  id: "jejak-kucing-LoopArc",
  render: () => (
    <Composition
      id="jejak-kucing-LoopArc"
      component={CatSvgLoopArcTrail}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
    />
  ),
};
