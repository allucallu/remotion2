import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  DOCUMENTARY_DOSSIER_TABS_DURATION,
  DOCUMENTARY_DOSSIER_TABS_FPS,
  DOCUMENTARY_DOSSIER_TABS_HEIGHT,
  DOCUMENTARY_DOSSIER_TABS_WIDTH,
  DocumentaryDossierTabs,
} from "./DocumentaryDossierTabs";

export const documentaryDossierTabsRegistration: AssetRegistration = {
  id: "DocumentaryDossierTabs",
  render: () => (
    <Composition
      id="DocumentaryDossierTabs"
      component={DocumentaryDossierTabs}
      durationInFrames={DOCUMENTARY_DOSSIER_TABS_DURATION}
      fps={DOCUMENTARY_DOSSIER_TABS_FPS}
      width={DOCUMENTARY_DOSSIER_TABS_WIDTH}
      height={DOCUMENTARY_DOSSIER_TABS_HEIGHT}
    />
  ),
};
