import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  EDITORIAL_LOCATION_BRACKET_DURATION,
  EDITORIAL_LOCATION_BRACKET_FPS,
  EDITORIAL_LOCATION_BRACKET_HEIGHT,
  EDITORIAL_LOCATION_BRACKET_WIDTH,
  EditorialLocationBracket,
} from "./EditorialLocationBracket";

export const editorialLocationBracketRegistration: AssetRegistration = {
  id: "EditorialLocationBracket",
  render: () => (
    <Composition
      id="EditorialLocationBracket"
      component={EditorialLocationBracket}
      durationInFrames={EDITORIAL_LOCATION_BRACKET_DURATION}
      fps={EDITORIAL_LOCATION_BRACKET_FPS}
      width={EDITORIAL_LOCATION_BRACKET_WIDTH}
      height={EDITORIAL_LOCATION_BRACKET_HEIGHT}
    />
  ),
};
