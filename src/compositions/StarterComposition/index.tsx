import { Composition } from "remotion";
import { resolveAssetMetadata } from "../../config/metadata";
import type { AssetRegistration } from "../registry";
import {
  StarterComposition,
  starterCompositionSchema,
} from "./StarterComposition";

export const starterCompositionRegistration: AssetRegistration = {
  id: "StarterComposition",
  render: () => (
    <Composition
      id="StarterComposition"
      component={StarterComposition}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={180}
      schema={starterCompositionSchema}
      defaultProps={{
        format: "landscape-hd",
        durationInSeconds: 6,
        fps: 30,
        backgroundColor: "transparent",
        primaryColor: "#00E5FF",
        secondaryColor: "#7C5CFF",
        title: "ELEVATE YOUR VISION",
        subtitle: "MINIMALIST MOTION TEMPLATE",
        showParticles: true,
      }}
      calculateMetadata={({ props }) => resolveAssetMetadata(props)}
    />
  ),
};
