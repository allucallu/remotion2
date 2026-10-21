import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { StackingPurchasesB } from "./StackingPurchasesB";

export const stackingPurchasesBRegistration: AssetRegistration = {
  id: "StackingPurchasesB",
  render: () => (
    <Composition
      id="StackingPurchasesB"
      component={StackingPurchasesB}
      width={3840}
      height={2160}
      fps={30}
      durationInFrames={300}
    />
  ),
};
