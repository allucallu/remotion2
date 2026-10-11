import { AbsoluteFill, Composition } from "remotion";
import { PixelFire } from "./PixelFire";

export const PixelFireLoop = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <PixelFire />
  </AbsoluteFill>
);

export const pixelFireRegistration = {
  id: "PixelFireLoop",
  render: () => (
    <Composition
      id="PixelFireLoop"
      component={PixelFireLoop}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={360}
    />
  ),
};
