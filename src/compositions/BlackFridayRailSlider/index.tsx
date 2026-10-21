import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { BlackFridayRailSlider } from "./BlackFridayRailSlider";
export const blackFridayRailSliderRegistration: AssetRegistration = {
  id: "BlackFridayRailSlider",
  render: () => (
    <Composition
      id="BlackFridayRailSlider"
      component={BlackFridayRailSlider}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
