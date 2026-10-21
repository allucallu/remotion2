import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { FactCheckBadge } from "./FactCheckBadge";
export const factCheckBadgeRegistration: AssetRegistration = {
  id: "FactCheckBadge",
  render: () => (
    <Composition
      id="FactCheckBadge"
      component={FactCheckBadge}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
