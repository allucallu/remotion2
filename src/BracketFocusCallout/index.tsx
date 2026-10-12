import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  BRACKET_FOCUS_DURATION,
  BRACKET_FOCUS_FPS,
  BRACKET_FOCUS_HEIGHT,
  BRACKET_FOCUS_WIDTH,
  BracketFocusCallout,
} from "./BracketFocusCallout";

export const bracketFocusCalloutRegistration: AssetRegistration = {
  id: "BracketFocusCallout",
  render: () => (
    <Composition
      id="BracketFocusCallout"
      component={BracketFocusCallout}
      durationInFrames={BRACKET_FOCUS_DURATION}
      fps={BRACKET_FOCUS_FPS}
      width={BRACKET_FOCUS_WIDTH}
      height={BRACKET_FOCUS_HEIGHT}
    />
  ),
};
