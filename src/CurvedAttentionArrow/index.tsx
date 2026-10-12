import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  CurvedAttentionArrow,
  CURVED_ARROW_DURATION,
  CURVED_ARROW_FPS,
  CURVED_ARROW_HEIGHT,
  CURVED_ARROW_WIDTH,
} from "./CurvedAttentionArrow";

export const curvedAttentionArrowRegistration: AssetRegistration = {
  id: "CurvedAttentionArrow",
  render: () => (
    <Composition
      id="CurvedAttentionArrow"
      component={CurvedAttentionArrow}
      durationInFrames={CURVED_ARROW_DURATION}
      fps={CURVED_ARROW_FPS}
      width={CURVED_ARROW_WIDTH}
      height={CURVED_ARROW_HEIGHT}
    />
  ),
};
