import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  PIXEL_ASSEMBLY_DURATION,
  PIXEL_ASSEMBLY_FPS,
  PIXEL_ASSEMBLY_HEIGHT,
  PIXEL_ASSEMBLY_WIDTH,
  PixelAssembly,
} from "./PixelAssembly";

export const pixelAssemblyRegistration: AssetRegistration = {
  id: "PixelAssembly",
  render: () => (
    <Composition
      id="PixelAssembly"
      component={PixelAssembly}
      durationInFrames={PIXEL_ASSEMBLY_DURATION}
      fps={PIXEL_ASSEMBLY_FPS}
      width={PIXEL_ASSEMBLY_WIDTH}
      height={PIXEL_ASSEMBLY_HEIGHT}
    />
  ),
};
