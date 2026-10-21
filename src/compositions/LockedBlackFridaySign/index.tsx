import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { LockedBlackFridaySign } from "./LockedBlackFridaySign";
export const lockedBlackFridaySignRegistration: AssetRegistration = {
  id: "LockedBlackFridaySign",
  render: () => (
    <Composition
      id="LockedBlackFridaySign"
      component={LockedBlackFridaySign}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
