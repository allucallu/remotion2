import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  HALLOWEEN_CANDLE_DURATION,
  HALLOWEEN_CANDLE_FPS,
  HALLOWEEN_CANDLE_HEIGHT,
  HALLOWEEN_CANDLE_WIDTH,
  HalloweenCandle,
} from "./HalloweenCandle";

export const halloweenCandleRegistration: AssetRegistration = {
  id: "HalloweenCandle",
  render: () => (
    <Composition
      id="HalloweenCandle"
      component={HalloweenCandle}
      durationInFrames={HALLOWEEN_CANDLE_DURATION}
      fps={HALLOWEEN_CANDLE_FPS}
      width={HALLOWEEN_CANDLE_WIDTH}
      height={HALLOWEEN_CANDLE_HEIGHT}
    />
  ),
};
