import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { ShoppingBagConveyorA } from "./ShoppingBagConveyorA";

export const shoppingBagConveyorARegistration: AssetRegistration = {
  id: "ShoppingBagConveyorA",
  render: () => (
    <Composition
      id="ShoppingBagConveyorA"
      component={ShoppingBagConveyorA}
      width={3840}
      height={2160}
      fps={30}
      durationInFrames={300}
    />
  ),
};
