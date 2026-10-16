import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  DOCUMENTARY_ARCHIVE_SLEEVE_DURATION,
  DOCUMENTARY_ARCHIVE_SLEEVE_FPS,
  DOCUMENTARY_ARCHIVE_SLEEVE_HEIGHT,
  DOCUMENTARY_ARCHIVE_SLEEVE_WIDTH,
  DocumentaryArchiveSleeve,
} from "./DocumentaryArchiveSleeve";

export const documentaryArchiveSleeveRegistration: AssetRegistration = {
  id: "DocumentaryArchiveSleeve",
  render: () => (
    <Composition
      id="DocumentaryArchiveSleeve"
      component={DocumentaryArchiveSleeve}
      durationInFrames={DOCUMENTARY_ARCHIVE_SLEEVE_DURATION}
      fps={DOCUMENTARY_ARCHIVE_SLEEVE_FPS}
      width={DOCUMENTARY_ARCHIVE_SLEEVE_WIDTH}
      height={DOCUMENTARY_ARCHIVE_SLEEVE_HEIGHT}
    />
  ),
};
