import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { AlternatingChevronDrift } from "./AlternatingChevronDrift";

export const alternatingChevronDriftRegistration: AssetRegistration = {
  id: "AlternatingChevronDrift",
  render: () => (
    <Composition
      id="AlternatingChevronDrift"
      component={AlternatingChevronDrift}
      durationInFrames={180}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
