import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { FlashSaleAlarm } from "./FlashSaleAlarm";

export const flashSaleAlarmRegistration: AssetRegistration = {
  id: "FlashSaleAlarm",
  render: () => (
    <Composition
      id="FlashSaleAlarm"
      component={FlashSaleAlarm}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
