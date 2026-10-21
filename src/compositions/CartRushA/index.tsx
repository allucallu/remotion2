import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { CartRushA } from "./CartRushA";

export const cartRushARegistration: AssetRegistration = {
  id: "CartRushA",
  render: () => (
    <Composition
      id="CartRushA"
      component={CartRushA}
      width={3840}
      height={2160}
      fps={30}
      durationInFrames={300}
    />
  ),
};
