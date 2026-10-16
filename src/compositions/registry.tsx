import type { ReactNode } from "react";
import { halloweenBatSwarmRegistration } from "../HalloweenBatSwarm";
import { halloweenBlackCatRegistration } from "../HalloweenBlackCat";
import { halloweenCandleRegistration } from "../HalloweenCandle";
import { halloweenFlyingBroomRegistration } from "../HalloweenFlyingBroom";
import { halloweenFloatingGhostsRegistration } from "../HalloweenFloatingGhosts";
import { halloweenHauntedBranchesRegistration } from "../HalloweenHauntedBranches";
import { halloweenPumpkinPopRegistration } from "../HalloweenPumpkinPop";
import { halloweenSkullPopRegistration } from "../HalloweenSkullPop";
import { halloweenSpiderwebFrameRegistration } from "../HalloweenSpiderwebFrame";
import { halloweenTombstoneRevealRegistration } from "../HalloweenTombstoneReveal";
import { blackFridayHangingTagRegistration } from "../BlackFridayHangingTag";
import { editorialInterviewPlateRegistration } from "../EditorialInterviewPlate";
import { editorialSerifIdentifierRegistration } from "../EditorialSerifIdentifier";
import { editorialProfileGridRegistration } from "../EditorialProfileGrid";
import { editorialLocationBracketRegistration } from "../EditorialLocationBracket";
import { editorialArchivalLabelRegistration } from "../EditorialArchivalLabel";
import { documentaryDossierTabsRegistration } from "../DocumentaryDossierTabs";
import { documentaryArchiveSleeveRegistration } from "../DocumentaryArchiveSleeve";
import { documentaryChapterFrameworkRegistration } from "../DocumentaryChapterFramework";
import { documentaryFieldNotesRegistration } from "../DocumentaryFieldNotes";
import { documentaryIndexedPanelRegistration } from "../DocumentaryIndexedPanel";
import { neoBrutalismPunchCardRegistration } from "../NeoBrutalismPunchCard";
import { neoBrutalismAcidTabStackRegistration } from "../NeoBrutalismAcidTabStack";
import { neoBrutalismModularStickerRegistration } from "../NeoBrutalismModularSticker";
import { neoBrutalismCheckeredEdgeRegistration } from "../NeoBrutalismCheckeredEdge";
import { neoBrutalismZigzagSpineRegistration } from "../NeoBrutalismZigzagSpine";
import { neoBrutalismPerforatedRailRegistration } from "../NeoBrutalismPerforatedRail";
import { neoBrutalismCrossedRibbonRegistration } from "../NeoBrutalismCrossedRibbon";
import { neoBrutalismSerratedTicketRegistration } from "../NeoBrutalismSerratedTicket";
import { neoBrutalismHalfDiscAnchorRegistration } from "../NeoBrutalismHalfDiscAnchor";
import { neoBrutalismSplitLevelCardRegistration } from "../NeoBrutalismSplitLevelCard";

export interface AssetRegistration {
  /** Must match the Composition id rendered by render(). */
  id: string;
  /** Return one Remotion <Composition /> registration. */
  render: () => ReactNode;
}

/**
 * Single source of truth for assets shown in Remotion Studio.
 * Add new registrations here; Root.tsx does not need to be edited.
 */
export const assetRegistry: readonly AssetRegistration[] = [
  halloweenSpiderwebFrameRegistration,
  halloweenCandleRegistration,
  halloweenFlyingBroomRegistration,
  halloweenBlackCatRegistration,
  halloweenBatSwarmRegistration,
  halloweenFloatingGhostsRegistration,
  halloweenPumpkinPopRegistration,
  halloweenSkullPopRegistration,
  halloweenHauntedBranchesRegistration,
  halloweenTombstoneRevealRegistration,
  blackFridayHangingTagRegistration,
  editorialInterviewPlateRegistration,
  editorialSerifIdentifierRegistration,
  editorialProfileGridRegistration,
  editorialLocationBracketRegistration,
  editorialArchivalLabelRegistration,
  documentaryDossierTabsRegistration,
  documentaryArchiveSleeveRegistration,
  documentaryChapterFrameworkRegistration,
  documentaryFieldNotesRegistration,
  documentaryIndexedPanelRegistration,
  neoBrutalismPunchCardRegistration,
  neoBrutalismAcidTabStackRegistration,
  neoBrutalismModularStickerRegistration,
  neoBrutalismCheckeredEdgeRegistration,
  neoBrutalismZigzagSpineRegistration,
  neoBrutalismPerforatedRailRegistration,
  neoBrutalismCrossedRibbonRegistration,
  neoBrutalismSerratedTicketRegistration,
  neoBrutalismHalfDiscAnchorRegistration,
  neoBrutalismSplitLevelCardRegistration,
];
