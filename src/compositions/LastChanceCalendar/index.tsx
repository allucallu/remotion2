import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { LastChanceCalendar } from "./LastChanceCalendar";

export const lastChanceCalendarRegistration: AssetRegistration = {
  id: "LastChanceCalendar",
  render: () => (
    <Composition
      id="LastChanceCalendar"
      component={LastChanceCalendar}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  ),
};
