import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { CartRushB } from "./CartRushB";

export const cartRushBRegistration: AssetRegistration = {
  id: "CartRushB",
  render: () => (
    <Composition
      id="CartRushB"
      component={CartRushB}
      width={3840}
      height={2160}
      fps={30}
      durationInFrames={300}
    />
  ),
};
