import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  EDITORIAL_INTERVIEW_PLATE_DURATION,
  EDITORIAL_INTERVIEW_PLATE_FPS,
  EDITORIAL_INTERVIEW_PLATE_HEIGHT,
  EDITORIAL_INTERVIEW_PLATE_WIDTH,
  EditorialInterviewPlate,
} from "./EditorialInterviewPlate";

export const editorialInterviewPlateRegistration: AssetRegistration = {
  id: "EditorialInterviewPlate",
  render: () => (
    <Composition
      id="EditorialInterviewPlate"
      component={EditorialInterviewPlate}
      durationInFrames={EDITORIAL_INTERVIEW_PLATE_DURATION}
      fps={EDITORIAL_INTERVIEW_PLATE_FPS}
      width={EDITORIAL_INTERVIEW_PLATE_WIDTH}
      height={EDITORIAL_INTERVIEW_PLATE_HEIGHT}
    />
  ),
};
