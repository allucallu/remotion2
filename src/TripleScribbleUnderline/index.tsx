import { Composition } from "remotion";
import type { AssetRegistration } from "../compositions/registry";
import {
  TripleScribbleUnderline,
  TRIPLE_SCRIBBLE_DURATION,
  TRIPLE_SCRIBBLE_FPS,
  TRIPLE_SCRIBBLE_HEIGHT,
  TRIPLE_SCRIBBLE_WIDTH,
} from "./TripleScribbleUnderline";

export const tripleScribbleUnderlineRegistration: AssetRegistration = {
  id: "TripleScribbleUnderline",
  render: () => (
    <Composition
      id="TripleScribbleUnderline"
      component={TripleScribbleUnderline}
      durationInFrames={TRIPLE_SCRIBBLE_DURATION}
      fps={TRIPLE_SCRIBBLE_FPS}
      width={TRIPLE_SCRIBBLE_WIDTH}
      height={TRIPLE_SCRIBBLE_HEIGHT}
    />
  ),
};
