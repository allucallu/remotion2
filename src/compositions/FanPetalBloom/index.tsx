import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { FanPetalBloom } from "./FanPetalBloom";

export const fanPetalBloomRegistration: AssetRegistration = {
  id: "FanPetalBloom",
  render: () => (
    <Composition
      id="FanPetalBloom"
      component={FanPetalBloom}
      width={3840}
      height={2160}
      fps={30}
      durationInFrames={300}
    />
  ),
};
