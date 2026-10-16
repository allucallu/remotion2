import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  HALLOWEEN_HAUNTED_BRANCHES_DURATION,
  HALLOWEEN_HAUNTED_BRANCHES_FPS,
  HALLOWEEN_HAUNTED_BRANCHES_HEIGHT,
  HALLOWEEN_HAUNTED_BRANCHES_WIDTH,
  HalloweenHauntedBranches,
} from "./HalloweenHauntedBranches";

export const halloweenHauntedBranchesRegistration: AssetRegistration = {
  id: "HalloweenHauntedBranches",
  render: () => (
    <Composition
      id="HalloweenHauntedBranches"
      component={HalloweenHauntedBranches}
      durationInFrames={HALLOWEEN_HAUNTED_BRANCHES_DURATION}
      fps={HALLOWEEN_HAUNTED_BRANCHES_FPS}
      width={HALLOWEEN_HAUNTED_BRANCHES_WIDTH}
      height={HALLOWEEN_HAUNTED_BRANCHES_HEIGHT}
    />
  ),
};
