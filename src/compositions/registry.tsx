import type { ReactNode } from "react";
import { Composition } from "remotion";
import { BNBurgundyEditorialNews } from "./BNBurgundyEditorialNews";
import { BNCobaltDoubleDeck } from "./BNCobaltDoubleDeck";
import { BNNavyAngleReport } from "./BNNavyAngleReport";
import { BNRedSegmentNews } from "./BNRedSegmentNews";
import { BNTealLiveDesk } from "./BNTealLiveDesk";
import { ITDistributedSystemMap } from "./ITDistributedSystemMap";
import { ITLayeredDataBus } from "./ITLayeredDataBus";
import { ITNetworkPacketFlow } from "./ITNetworkPacketFlow";
import { ITServerActivityGrid } from "./ITServerActivityGrid";
import { ITTerminalProcessStream } from "./ITTerminalProcessStream";
import { LTAmberBracket } from "./LTAmberBracket";
import { LTBurgundyInset } from "./LTBurgundyInset";
import { LTCopperSplit } from "./LTCopperSplit";
import { LTCobaltCornerCut } from "./LTCobaltCornerCut";
import { LTMidnightCapsule } from "./LTMidnightCapsule";
import { LTOliveStepped } from "./LTOliveStepped";
import { LTSageSplitPanel } from "./LTSageSplitPanel";
import { LTSlateSuspended } from "./LTSlateSuspended";
import { LTTerracottaOffset } from "./LTTerracottaOffset";
import { LTTealSideRail } from "./LTTealSideRail";

export interface AssetRegistration {
  /** Must match the Composition id rendered by render(). */
  id: string;
  /** Return one Remotion <Composition /> registration. */
  render: () => ReactNode;
}

/**
 * Single source of truth for assets shown in Remotion Studio.
 * Register new compositions here as they are created.
 */
export const assetRegistry: readonly AssetRegistration[] = [
  {
    id: "ITNetworkPacketFlow",
    render: () => (
      <Composition
        id="ITNetworkPacketFlow"
        component={ITNetworkPacketFlow}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "ITLayeredDataBus",
    render: () => (
      <Composition
        id="ITLayeredDataBus"
        component={ITLayeredDataBus}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "ITServerActivityGrid",
    render: () => (
      <Composition
        id="ITServerActivityGrid"
        component={ITServerActivityGrid}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "ITTerminalProcessStream",
    render: () => (
      <Composition
        id="ITTerminalProcessStream"
        component={ITTerminalProcessStream}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "ITDistributedSystemMap",
    render: () => (
      <Composition
        id="ITDistributedSystemMap"
        component={ITDistributedSystemMap}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "BNNavyAngleReport",
    render: () => (
      <Composition
        id="BNNavyAngleReport"
        component={BNNavyAngleReport}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "BNRedSegmentNews",
    render: () => (
      <Composition
        id="BNRedSegmentNews"
        component={BNRedSegmentNews}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "BNCobaltDoubleDeck",
    render: () => (
      <Composition
        id="BNCobaltDoubleDeck"
        component={BNCobaltDoubleDeck}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "BNBurgundyEditorialNews",
    render: () => (
      <Composition
        id="BNBurgundyEditorialNews"
        component={BNBurgundyEditorialNews}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "BNTealLiveDesk",
    render: () => (
      <Composition
        id="BNTealLiveDesk"
        component={BNTealLiveDesk}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-SlateSuspended",
    render: () => (
      <Composition
        id="LT-SlateSuspended"
        component={LTSlateSuspended}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-CopperSplit",
    render: () => (
      <Composition
        id="LT-CopperSplit"
        component={LTCopperSplit}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-MidnightCapsule",
    render: () => (
      <Composition
        id="LT-MidnightCapsule"
        component={LTMidnightCapsule}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-BurgundyInset",
    render: () => (
      <Composition
        id="LT-BurgundyInset"
        component={LTBurgundyInset}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-OliveStepped",
    render: () => (
      <Composition
        id="LT-OliveStepped"
        component={LTOliveStepped}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-AmberBracket",
    render: () => (
      <Composition
        id="LT-AmberBracket"
        component={LTAmberBracket}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-SageSplitPanel",
    render: () => (
      <Composition
        id="LT-SageSplitPanel"
        component={LTSageSplitPanel}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-CobaltCornerCut",
    render: () => (
      <Composition
        id="LT-CobaltCornerCut"
        component={LTCobaltCornerCut}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-TerracottaOffset",
    render: () => (
      <Composition
        id="LT-TerracottaOffset"
        component={LTTerracottaOffset}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
  {
    id: "LT-TealSideRail",
    render: () => (
      <Composition
        id="LT-TealSideRail"
        component={LTTealSideRail}
        durationInFrames={12 * 30}
        fps={30}
        width={3840}
        height={2160}
      />
    ),
  },
];
