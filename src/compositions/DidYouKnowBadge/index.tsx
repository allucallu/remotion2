import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { DidYouKnowBadge } from "./DidYouKnowBadge";
export const didYouKnowBadgeRegistration: AssetRegistration = {
  id: "DidYouKnowBadge",
  render: () => (
    <Composition
      id="DidYouKnowBadge"
      component={DidYouKnowBadge}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
