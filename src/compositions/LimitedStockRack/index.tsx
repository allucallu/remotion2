import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { LimitedStockRack } from "./LimitedStockRack";
export const limitedStockRackRegistration: AssetRegistration = {
  id: "LimitedStockRack",
  render: () => (
    <Composition
      id="LimitedStockRack"
      component={LimitedStockRack}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
