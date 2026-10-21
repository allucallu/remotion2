import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { ShutterRevealFlashSale } from "./ShutterRevealFlashSale";
export const shutterRevealFlashSaleRegistration: AssetRegistration = {
  id: "ShutterRevealFlashSale",
  render: () => (
    <Composition
      id="ShutterRevealFlashSale"
      component={ShutterRevealFlashSale}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
