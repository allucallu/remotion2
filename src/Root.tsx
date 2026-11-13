import { Composition } from "remotion";
import { MV } from "./MV";
import { mvConfig } from "./config";
import "./index.css";

export const RemotionRoot = () => (
  <Composition
    id="MV"
    component={MV}
    durationInFrames={mvConfig.defaultDurationInFrames}
    fps={mvConfig.fps}
    width={mvConfig.width}
    height={mvConfig.height}
  />
);
