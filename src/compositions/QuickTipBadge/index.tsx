import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { QuickTipBadge } from "./QuickTipBadge";
export const quickTipBadgeRegistration: AssetRegistration = {
  id: "QuickTipBadge",
  render: () => (
    <Composition
      id="QuickTipBadge"
      component={QuickTipBadge}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
