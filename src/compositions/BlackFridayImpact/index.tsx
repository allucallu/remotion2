import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { BlackFridayImpact } from "./BlackFridayImpact";
export const blackFridayImpactRegistration: AssetRegistration = {
  id: "BlackFridayImpact",
  render: () => (
    <Composition
      id="BlackFridayImpact"
      component={BlackFridayImpact}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
