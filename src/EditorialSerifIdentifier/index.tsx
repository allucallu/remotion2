import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  EDITORIAL_SERIF_IDENTIFIER_DURATION,
  EDITORIAL_SERIF_IDENTIFIER_FPS,
  EDITORIAL_SERIF_IDENTIFIER_HEIGHT,
  EDITORIAL_SERIF_IDENTIFIER_WIDTH,
  EditorialSerifIdentifier,
} from "./EditorialSerifIdentifier";

export const editorialSerifIdentifierRegistration: AssetRegistration = {
  id: "EditorialSerifIdentifier",
  render: () => (
    <Composition
      id="EditorialSerifIdentifier"
      component={EditorialSerifIdentifier}
      durationInFrames={EDITORIAL_SERIF_IDENTIFIER_DURATION}
      fps={EDITORIAL_SERIF_IDENTIFIER_FPS}
      width={EDITORIAL_SERIF_IDENTIFIER_WIDTH}
      height={EDITORIAL_SERIF_IDENTIFIER_HEIGHT}
    />
  ),
};
