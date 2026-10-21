import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { ClosingHourglass } from "./ClosingHourglass";
export const closingHourglassRegistration: AssetRegistration = {
  id: "ClosingHourglass",
  render: () => (
    <Composition
      id="ClosingHourglass"
      component={ClosingHourglass}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
