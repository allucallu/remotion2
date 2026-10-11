import { Composition } from "remotion";
import { FootstepsCurve, FootstepsVertical } from "./DogFootstepTrails";

export const dogFootstepRegistrations = [
  {
    id: "FootstepsVertical",
    render: () => (
      <Composition
        id="FootstepsVertical"
        component={FootstepsVertical}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={300}
      />
    ),
  },
  {
    id: "FootstepsCurve",
    render: () => (
      <Composition
        id="FootstepsCurve"
        component={FootstepsCurve}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={300}
      />
    ),
  },
] as const;
