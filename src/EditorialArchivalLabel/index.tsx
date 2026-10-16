import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  EDITORIAL_ARCHIVAL_LABEL_DURATION,
  EDITORIAL_ARCHIVAL_LABEL_FPS,
  EDITORIAL_ARCHIVAL_LABEL_HEIGHT,
  EDITORIAL_ARCHIVAL_LABEL_WIDTH,
  EditorialArchivalLabel,
} from "./EditorialArchivalLabel";

export const editorialArchivalLabelRegistration: AssetRegistration = {
  id: "EditorialArchivalLabel",
  render: () => (
    <Composition
      id="EditorialArchivalLabel"
      component={EditorialArchivalLabel}
      durationInFrames={EDITORIAL_ARCHIVAL_LABEL_DURATION}
      fps={EDITORIAL_ARCHIVAL_LABEL_FPS}
      width={EDITORIAL_ARCHIVAL_LABEL_WIDTH}
      height={EDITORIAL_ARCHIVAL_LABEL_HEIGHT}
    />
  ),
};
