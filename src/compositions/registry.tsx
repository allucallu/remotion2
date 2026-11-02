import type { ReactNode } from "react";
import { Composition } from "remotion";
import {
  AttentionMarksFivePack,
  AttentionMarksFivePackConfig,
} from "./AttentionMarksFivePack";
import {
  AttentionMarksSculptedPack,
  AttentionMarksSculptedPackConfig,
} from "./AttentionMarksSculptedPack";
import {
  BrushCaptionFivePack,
  BrushCaptionFivePackConfig,
} from "./BrushCaptionFivePack";
import {
  CaptionCapsuleTrack,
  CaptionCapsuleTrackConfig,
} from "./CaptionCapsuleTrack";
import {
  CaptionEnamelBuckle,
  CaptionEnamelBuckleConfig,
} from "./CaptionEnamelBuckle";
import {
  CaptionFoldedTicket,
  CaptionFoldedTicketConfig,
} from "./CaptionFoldedTicket";
import {
  CaptionFrostedPrism,
  CaptionFrostedPrismConfig,
} from "./CaptionFrostedPrism";
import {
  CaptionOffsetSleeve,
  CaptionOffsetSleeveConfig,
} from "./CaptionOffsetSleeve";
import { CaptionOpenFrame, CaptionOpenFrameConfig } from "./CaptionOpenFrame";
import {
  CaptionOrigamiWing,
  CaptionOrigamiWingConfig,
} from "./CaptionOrigamiWing";
import {
  CaptionRibbonEnds,
  CaptionRibbonEndsConfig,
} from "./CaptionRibbonEnds";
import {
  CaptionSideClamps,
  CaptionSideClampsConfig,
} from "./CaptionSideClamps";
import {
  CaptionSpineDrawer,
  CaptionSpineDrawerConfig,
} from "./CaptionSpineDrawer";
import {
  CaptionSplitBridge,
  CaptionSplitBridgeConfig,
} from "./CaptionSplitBridge";
import {
  CaptionStackedSlats,
  CaptionStackedSlatsConfig,
} from "./CaptionStackedSlats";
import {
  CaptionSteppedEdge,
  CaptionSteppedEdgeConfig,
} from "./CaptionSteppedEdge";
import {
  CaptionTornCollage,
  CaptionTornCollageConfig,
} from "./CaptionTornCollage";
import {
  CaptionWovenBorder,
  CaptionWovenBorderConfig,
} from "./CaptionWovenBorder";
import {
  CircleHighlightExpressivePack,
  CircleHighlightExpressivePackConfig,
} from "./CircleHighlightExpressivePack";
import {
  CircleHighlightFivePack,
  CircleHighlightFivePackConfig,
} from "./CircleHighlightFivePack";
import {
  DirectionalArrowFivePack,
  DirectionalArrowFivePackConfig,
} from "./DirectionalArrowFivePack";
import {
  DirectionalArrowSculptedPack,
  DirectionalArrowSculptedPackConfig,
} from "./DirectionalArrowSculptedPack";
import { FocusBoldBevel, FocusBoldBevelConfig } from "./FocusBoldBevel";
import {
  FocusChevronSteps,
  FocusChevronStepsConfig,
} from "./FocusChevronSteps";
import { FocusCutCorner, FocusCutCornerConfig } from "./FocusCutCorner";
import { FocusDottedTrace, FocusDottedTraceConfig } from "./FocusDottedTrace";
import { FocusFoldedFan, FocusFoldedFanConfig } from "./FocusFoldedFan";
import { FocusInkTrace, FocusInkTraceConfig } from "./FocusInkTrace";
import {
  FocusInterlockTabs,
  FocusInterlockTabsConfig,
} from "./FocusInterlockTabs";
import {
  FocusOffsetLayers,
  FocusOffsetLayersConfig,
} from "./FocusOffsetLayers";
import { FocusPivotNodes, FocusPivotNodesConfig } from "./FocusPivotNodes";
import {
  FocusPixelAssembly,
  FocusPixelAssemblyConfig,
} from "./FocusPixelAssembly";
import {
  FocusPrecisionRail,
  FocusPrecisionRailConfig,
} from "./FocusPrecisionRail";
import { FocusRibbonCurl, FocusRibbonCurlConfig } from "./FocusRibbonCurl";
import { FocusSoftSnap, FocusSoftSnapConfig } from "./FocusSoftSnap";
import { FocusTripleArc, FocusTripleArcConfig } from "./FocusTripleArc";
import { FocusWovenCorner, FocusWovenCornerConfig } from "./FocusWovenCorner";
import {
  ImpactAccentFivePack,
  ImpactAccentFivePackConfig,
} from "./ImpactAccentFivePack";
import {
  ImpactAccentGraphicPack,
  ImpactAccentGraphicPackConfig,
} from "./ImpactAccentGraphicPack";
import {
  NaturalBrushCaptionPack,
  NaturalBrushCaptionPackConfig,
} from "./NaturalBrushCaptionPack";

export interface AssetRegistration {
  /** Must match the Composition id rendered by render(). */
  id: string;
  /** Return one Remotion <Composition /> registration. */
  render: () => ReactNode;
}

/** Register new production compositions here.
 * Keep literal IDs in sync with each source config: GitHub Actions reads them here.
 * Empty defaultProps preserve the defaults defined by each component.
 */
export const assetRegistry: readonly AssetRegistration[] = [
  {
    id: "AttentionMarksFivePack",
    render: () => (
      <Composition
        {...AttentionMarksFivePackConfig}
        component={AttentionMarksFivePack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "AttentionMarksSculptedPack",
    render: () => (
      <Composition
        {...AttentionMarksSculptedPackConfig}
        component={AttentionMarksSculptedPack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "BrushCaptionFivePack",
    render: () => (
      <Composition
        {...BrushCaptionFivePackConfig}
        component={BrushCaptionFivePack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionCapsuleTrack",
    render: () => (
      <Composition
        {...CaptionCapsuleTrackConfig}
        component={CaptionCapsuleTrack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionEnamelBuckle",
    render: () => (
      <Composition
        {...CaptionEnamelBuckleConfig}
        component={CaptionEnamelBuckle}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionFoldedTicket",
    render: () => (
      <Composition
        {...CaptionFoldedTicketConfig}
        component={CaptionFoldedTicket}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionFrostedPrism",
    render: () => (
      <Composition
        {...CaptionFrostedPrismConfig}
        component={CaptionFrostedPrism}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionOffsetSleeve",
    render: () => (
      <Composition
        {...CaptionOffsetSleeveConfig}
        component={CaptionOffsetSleeve}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionOpenFrame",
    render: () => (
      <Composition
        {...CaptionOpenFrameConfig}
        component={CaptionOpenFrame}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionOrigamiWing",
    render: () => (
      <Composition
        {...CaptionOrigamiWingConfig}
        component={CaptionOrigamiWing}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionRibbonEnds",
    render: () => (
      <Composition
        {...CaptionRibbonEndsConfig}
        component={CaptionRibbonEnds}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionSideClamps",
    render: () => (
      <Composition
        {...CaptionSideClampsConfig}
        component={CaptionSideClamps}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionSpineDrawer",
    render: () => (
      <Composition
        {...CaptionSpineDrawerConfig}
        component={CaptionSpineDrawer}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionSplitBridge",
    render: () => (
      <Composition
        {...CaptionSplitBridgeConfig}
        component={CaptionSplitBridge}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionStackedSlats",
    render: () => (
      <Composition
        {...CaptionStackedSlatsConfig}
        component={CaptionStackedSlats}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionSteppedEdge",
    render: () => (
      <Composition
        {...CaptionSteppedEdgeConfig}
        component={CaptionSteppedEdge}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionTornCollage",
    render: () => (
      <Composition
        {...CaptionTornCollageConfig}
        component={CaptionTornCollage}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CaptionWovenBorder",
    render: () => (
      <Composition
        {...CaptionWovenBorderConfig}
        component={CaptionWovenBorder}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CircleHighlightExpressivePack",
    render: () => (
      <Composition
        {...CircleHighlightExpressivePackConfig}
        component={CircleHighlightExpressivePack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "CircleHighlightFivePack",
    render: () => (
      <Composition
        {...CircleHighlightFivePackConfig}
        component={CircleHighlightFivePack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "DirectionalArrowFivePack",
    render: () => (
      <Composition
        {...DirectionalArrowFivePackConfig}
        component={DirectionalArrowFivePack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "DirectionalArrowSculptedPack",
    render: () => (
      <Composition
        {...DirectionalArrowSculptedPackConfig}
        component={DirectionalArrowSculptedPack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusBoldBevel",
    render: () => (
      <Composition
        {...FocusBoldBevelConfig}
        component={FocusBoldBevel}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusChevronSteps",
    render: () => (
      <Composition
        {...FocusChevronStepsConfig}
        component={FocusChevronSteps}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusCutCorner",
    render: () => (
      <Composition
        {...FocusCutCornerConfig}
        component={FocusCutCorner}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusDottedTrace",
    render: () => (
      <Composition
        {...FocusDottedTraceConfig}
        component={FocusDottedTrace}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusFoldedFan",
    render: () => (
      <Composition
        {...FocusFoldedFanConfig}
        component={FocusFoldedFan}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusInkTrace",
    render: () => (
      <Composition
        {...FocusInkTraceConfig}
        component={FocusInkTrace}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusInterlockTabs",
    render: () => (
      <Composition
        {...FocusInterlockTabsConfig}
        component={FocusInterlockTabs}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusOffsetLayers",
    render: () => (
      <Composition
        {...FocusOffsetLayersConfig}
        component={FocusOffsetLayers}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusPivotNodes",
    render: () => (
      <Composition
        {...FocusPivotNodesConfig}
        component={FocusPivotNodes}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusPixelAssembly",
    render: () => (
      <Composition
        {...FocusPixelAssemblyConfig}
        component={FocusPixelAssembly}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusPrecisionRail",
    render: () => (
      <Composition
        {...FocusPrecisionRailConfig}
        component={FocusPrecisionRail}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusRibbonCurl",
    render: () => (
      <Composition
        {...FocusRibbonCurlConfig}
        component={FocusRibbonCurl}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusSoftSnap",
    render: () => (
      <Composition
        {...FocusSoftSnapConfig}
        component={FocusSoftSnap}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusTripleArc",
    render: () => (
      <Composition
        {...FocusTripleArcConfig}
        component={FocusTripleArc}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "FocusWovenCorner",
    render: () => (
      <Composition
        {...FocusWovenCornerConfig}
        component={FocusWovenCorner}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "ImpactAccentFivePack",
    render: () => (
      <Composition
        {...ImpactAccentFivePackConfig}
        component={ImpactAccentFivePack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "ImpactAccentGraphicPack",
    render: () => (
      <Composition
        {...ImpactAccentGraphicPackConfig}
        component={ImpactAccentGraphicPack}
        defaultProps={{}}
      />
    ),
  },
  {
    id: "NaturalBrushCaptionPack",
    render: () => (
      <Composition
        {...NaturalBrushCaptionPackConfig}
        component={NaturalBrushCaptionPack}
        defaultProps={{}}
      />
    ),
  },
];
