import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { OffsetOutlineSquares } from "./OffsetOutlineSquares";

export const offsetOutlineSquaresRegistration: AssetRegistration = {
  id: "OffsetOutlineSquares",
  render: () => (
    <Composition
      id="OffsetOutlineSquares"
      component={OffsetOutlineSquares}
      durationInFrames={180}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
