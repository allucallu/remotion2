import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_MODULAR_STICKER_DURATION,
  NEO_BRUTALISM_MODULAR_STICKER_FPS,
  NEO_BRUTALISM_MODULAR_STICKER_HEIGHT,
  NEO_BRUTALISM_MODULAR_STICKER_WIDTH,
  NeoBrutalismModularSticker,
} from "./NeoBrutalismModularSticker";

export const neoBrutalismModularStickerRegistration: AssetRegistration = {
  id: "NeoBrutalismModularSticker",
  render: () => (
    <Composition
      id="NeoBrutalismModularSticker"
      component={NeoBrutalismModularSticker}
      durationInFrames={NEO_BRUTALISM_MODULAR_STICKER_DURATION}
      fps={NEO_BRUTALISM_MODULAR_STICKER_FPS}
      width={NEO_BRUTALISM_MODULAR_STICKER_WIDTH}
      height={NEO_BRUTALISM_MODULAR_STICKER_HEIGHT}
    />
  ),
};
