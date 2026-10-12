import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  TECHNICAL_OUTLINE_DURATION,
  TECHNICAL_OUTLINE_FPS,
  TECHNICAL_OUTLINE_HEIGHT,
  TECHNICAL_OUTLINE_WIDTH,
  TechnicalOutlineCallout,
} from "./TechnicalOutlineCallout";

export const technicalOutlineCalloutRegistration: AssetRegistration = {
  id: "TechnicalOutlineCallout",
  render: () => (
    <Composition
      id="TechnicalOutlineCallout"
      component={TechnicalOutlineCallout}
      durationInFrames={TECHNICAL_OUTLINE_DURATION}
      fps={TECHNICAL_OUTLINE_FPS}
      width={TECHNICAL_OUTLINE_WIDTH}
      height={TECHNICAL_OUTLINE_HEIGHT}
    />
  ),
};
