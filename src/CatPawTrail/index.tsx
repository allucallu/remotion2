import { Composition } from "remotion";
import { CatPawTrail } from "./CatPawTrail";

export const catPawTrailRegistration = {
  id: "CatPawTrail",
  render: () => (
    <Composition
      id="CatPawTrail"
      component={CatPawTrail}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
    />
  ),
};

export { CatPawPrint } from "./CatPawPrint";
