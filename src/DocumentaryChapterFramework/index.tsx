import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  DOCUMENTARY_CHAPTER_FRAMEWORK_DURATION,
  DOCUMENTARY_CHAPTER_FRAMEWORK_FPS,
  DOCUMENTARY_CHAPTER_FRAMEWORK_HEIGHT,
  DOCUMENTARY_CHAPTER_FRAMEWORK_WIDTH,
  DocumentaryChapterFramework,
} from "./DocumentaryChapterFramework";

export const documentaryChapterFrameworkRegistration: AssetRegistration = {
  id: "DocumentaryChapterFramework",
  render: () => (
    <Composition
      id="DocumentaryChapterFramework"
      component={DocumentaryChapterFramework}
      durationInFrames={DOCUMENTARY_CHAPTER_FRAMEWORK_DURATION}
      fps={DOCUMENTARY_CHAPTER_FRAMEWORK_FPS}
      width={DOCUMENTARY_CHAPTER_FRAMEWORK_WIDTH}
      height={DOCUMENTARY_CHAPTER_FRAMEWORK_HEIGHT}
    />
  ),
};
