import type { CompositionBg } from "../types";

/**
 * Resolves the background color for a video composition.
 * Returns preset colors for 'black', 'greenscreen', 'bluescreen',
 * or the provided custom CSS color string.
 */
export const resolveCompositionBg = (
  bg: CompositionBg = "black",
  defaultDark = "black",
): string => {
  if (bg === "transparent") return "transparent";
  if (bg === "black") return defaultDark;
  if (bg === "white") return "#FFFFFF";
  if (bg === "greenscreen") return "#00FF00";
  if (bg === "bluescreen") return "#0047AB";
  return bg;
};
