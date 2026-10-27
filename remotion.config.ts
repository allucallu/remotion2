import { Config } from "@remotion/cli/config";

// Output codec and image format intentionally stay configurable per render.
// This allows H.264 previews, ProRes masters, transparent ProRes 4444, and
// image sequences without changing project code.
Config.setOverwriteOutput(true);
Config.setChromiumDarkMode(true);
