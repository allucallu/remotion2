import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { StaggeredBarWave } from "./StaggeredBarWave";

export const staggeredBarWaveRegistration: AssetRegistration = {
  id: "StaggeredBarWave",
  render: () => (
    <Composition
      id="StaggeredBarWave"
      component={StaggeredBarWave}
      durationInFrames={180}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
