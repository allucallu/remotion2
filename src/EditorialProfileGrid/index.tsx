import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  EDITORIAL_PROFILE_GRID_DURATION,
  EDITORIAL_PROFILE_GRID_FPS,
  EDITORIAL_PROFILE_GRID_HEIGHT,
  EDITORIAL_PROFILE_GRID_WIDTH,
  EditorialProfileGrid,
} from "./EditorialProfileGrid";

export const editorialProfileGridRegistration: AssetRegistration = {
  id: "EditorialProfileGrid",
  render: () => (
    <Composition
      id="EditorialProfileGrid"
      component={EditorialProfileGrid}
      durationInFrames={EDITORIAL_PROFILE_GRID_DURATION}
      fps={EDITORIAL_PROFILE_GRID_FPS}
      width={EDITORIAL_PROFILE_GRID_WIDTH}
      height={EDITORIAL_PROFILE_GRID_HEIGHT}
    />
  ),
};
