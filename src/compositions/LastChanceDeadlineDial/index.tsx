import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { LastChanceDeadlineDial } from "./LastChanceDeadlineDial";
export const lastChanceDeadlineDialRegistration: AssetRegistration = {
  id: "LastChanceDeadlineDial",
  render: () => (
    <Composition
      id="LastChanceDeadlineDial"
      component={LastChanceDeadlineDial}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
