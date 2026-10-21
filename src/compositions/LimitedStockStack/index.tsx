import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { LimitedStockStack } from "./LimitedStockStack";

export const limitedStockStackRegistration: AssetRegistration = {
  id: "LimitedStockStack",
  render: () => (
    <Composition
      id="LimitedStockStack"
      component={LimitedStockStack}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
