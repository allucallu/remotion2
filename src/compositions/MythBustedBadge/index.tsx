import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { MythBustedBadge } from "./MythBustedBadge";
export const mythBustedBadgeRegistration: AssetRegistration = {
  id: "MythBustedBadge",
  render: () => (
    <Composition
      id="MythBustedBadge"
      component={MythBustedBadge}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
