import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  DOCUMENTARY_INDEXED_PANEL_DURATION,
  DOCUMENTARY_INDEXED_PANEL_FPS,
  DOCUMENTARY_INDEXED_PANEL_HEIGHT,
  DOCUMENTARY_INDEXED_PANEL_WIDTH,
  DocumentaryIndexedPanel,
} from "./DocumentaryIndexedPanel";

export const documentaryIndexedPanelRegistration: AssetRegistration = {
  id: "DocumentaryIndexedPanel",
  render: () => (
    <Composition
      id="DocumentaryIndexedPanel"
      component={DocumentaryIndexedPanel}
      durationInFrames={DOCUMENTARY_INDEXED_PANEL_DURATION}
      fps={DOCUMENTARY_INDEXED_PANEL_FPS}
      width={DOCUMENTARY_INDEXED_PANEL_WIDTH}
      height={DOCUMENTARY_INDEXED_PANEL_HEIGHT}
    />
  ),
};
