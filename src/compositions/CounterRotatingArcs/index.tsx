import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { CounterRotatingArcs } from "./CounterRotatingArcs";

export const counterRotatingArcsRegistration: AssetRegistration = {
  id: "CounterRotatingArcs",
  render: () => (
    <Composition
      id="CounterRotatingArcs"
      component={CounterRotatingArcs}
      durationInFrames={180}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
