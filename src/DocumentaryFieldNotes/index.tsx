import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  DOCUMENTARY_FIELD_NOTES_DURATION,
  DOCUMENTARY_FIELD_NOTES_FPS,
  DOCUMENTARY_FIELD_NOTES_HEIGHT,
  DOCUMENTARY_FIELD_NOTES_WIDTH,
  DocumentaryFieldNotes,
} from "./DocumentaryFieldNotes";

export const documentaryFieldNotesRegistration: AssetRegistration = {
  id: "DocumentaryFieldNotes",
  render: () => (
    <Composition
      id="DocumentaryFieldNotes"
      component={DocumentaryFieldNotes}
      durationInFrames={DOCUMENTARY_FIELD_NOTES_DURATION}
      fps={DOCUMENTARY_FIELD_NOTES_FPS}
      width={DOCUMENTARY_FIELD_NOTES_WIDTH}
      height={DOCUMENTARY_FIELD_NOTES_HEIGHT}
    />
  ),
};
