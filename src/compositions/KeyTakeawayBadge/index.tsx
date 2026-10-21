import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { KeyTakeawayBadge } from "./KeyTakeawayBadge";
export const keyTakeawayBadgeRegistration: AssetRegistration = {
  id: "KeyTakeawayBadge",
  render: () => (
    <Composition
      id="KeyTakeawayBadge"
      component={KeyTakeawayBadge}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
