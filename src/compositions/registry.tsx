import type { ReactNode } from "react";
import { Composition } from "remotion";
import {
  ANGULAR_PANELS_DURATION,
  ANGULAR_PANELS_FPS,
  ANGULAR_PANELS_PALETTE,
  CobaltNotch,
  CopperFold,
  MintFrame,
  PlumStripe,
  cobaltNotchSchema,
  copperFoldSchema,
  mintFrameSchema,
  plumStripeSchema,
} from "../LowerThirds/AngularPanels/AngularPanels";
import {
  EDITORIAL_CUT_DURATION,
  EDITORIAL_CUT_FPS,
  EDITORIAL_CUT_PALETTE,
  EditorialCut,
  editorialCutSchema,
} from "../LowerThirds/EditorialCut/EditorialCut";
import {
  ORBIT_BADGE_DURATION,
  ORBIT_BADGE_FPS,
  ORBIT_BADGE_PALETTE,
  OrbitBadge,
  orbitBadgeSchema,
} from "../LowerThirds/OrbitBadge/OrbitBadge";
import {
  FOLDED_RIBBON_DURATION,
  FOLDED_RIBBON_FPS,
  FOLDED_RIBBON_PALETTE,
  FoldedRibbon,
  foldedRibbonSchema,
} from "../LowerThirds/FoldedRibbon/FoldedRibbon";
import {
  SPLIT_TICKET_DURATION,
  SPLIT_TICKET_FPS,
  SPLIT_TICKET_PALETTE,
  SplitTicket,
  splitTicketSchema,
} from "../LowerThirds/SplitTicket/SplitTicket";
import {
  BURGUNDY_BRACKET_DURATION,
  BURGUNDY_BRACKET_FPS,
  BURGUNDY_BRACKET_PALETTE,
  BurgundyBracket,
  burgundyBracketSchema,
} from "../LowerThirds/BurgundyBracket/BurgundyBracket";
import {
  CRIMSON_BADGE_RAIL_DURATION,
  CRIMSON_BADGE_RAIL_FPS,
  CRIMSON_BADGE_RAIL_PALETTE,
  CrimsonBadgeRail,
  crimsonBadgeRailSchema,
} from "../LowerThirds/CrimsonBadgeRail/CrimsonBadgeRail";
import {
  COPPER_CORNER_DOCK_DURATION,
  COPPER_CORNER_DOCK_FPS,
  COPPER_CORNER_DOCK_PALETTE,
  CopperCornerDock,
  copperCornerDockSchema,
} from "../LowerThirds/CopperCornerDock/CopperCornerDock";
import {
  SAGE_CIRCLE_RAIL_DURATION,
  SAGE_CIRCLE_RAIL_FPS,
  SAGE_CIRCLE_RAIL_PALETTE,
  SageCircleRail,
  sageCircleRailSchema,
} from "../LowerThirds/SageCircleRail/SageCircleRail";
import {
  AQUA_RIGHT_BADGE_DURATION,
  AQUA_RIGHT_BADGE_FPS,
  AQUA_RIGHT_BADGE_PALETTE,
  AquaRightBadge,
  aquaRightBadgeSchema,
} from "../LowerThirds/AquaRightBadge/AquaRightBadge";
import {
  AMBER_LEFT_DOCK_DURATION,
  AMBER_LEFT_DOCK_FPS,
  AMBER_LEFT_DOCK_PALETTE,
  AmberLeftDock,
  amberLeftDockSchema,
} from "../LowerThirds/AmberLeftDock/AmberLeftDock";

export interface AssetRegistration {
  /** Must match the Composition id rendered by render(). */
  id: string;
  /** Return one Remotion <Composition /> or <Still /> registration. */
  render: () => ReactNode;
}

/**
 * Single source of truth for assets shown in Remotion Studio.
 * Add new registrations here; Root.tsx does not need to be edited.
 */
export const assetRegistry: readonly AssetRegistration[] = [
  {
    id: "LT-PlumStripe",
    render: () => (
      <Composition
        id="LT-PlumStripe"
        component={PlumStripe}
        width={1920}
        height={1080}
        fps={ANGULAR_PANELS_FPS}
        durationInFrames={ANGULAR_PANELS_DURATION}
        schema={plumStripeSchema}
        defaultProps={{
          accentColor: ANGULAR_PANELS_PALETTE.plum,
          scale: 1,
          position: { x: 110, y: 720 },
        }}
      />
    ),
  },
  {
    id: "LT-MintFrame",
    render: () => (
      <Composition
        id="LT-MintFrame"
        component={MintFrame}
        width={1920}
        height={1080}
        fps={ANGULAR_PANELS_FPS}
        durationInFrames={ANGULAR_PANELS_DURATION}
        schema={mintFrameSchema}
        defaultProps={{
          accentColor: ANGULAR_PANELS_PALETTE.mint,
          scale: 1,
          position: { x: 150, y: 720 },
        }}
      />
    ),
  },
  {
    id: "LT-CobaltNotch",
    render: () => (
      <Composition
        id="LT-CobaltNotch"
        component={CobaltNotch}
        width={1920}
        height={1080}
        fps={ANGULAR_PANELS_FPS}
        durationInFrames={ANGULAR_PANELS_DURATION}
        schema={cobaltNotchSchema}
        defaultProps={{
          accentColor: ANGULAR_PANELS_PALETTE.cobalt,
          scale: 1,
          position: { x: 150, y: 720 },
        }}
      />
    ),
  },
  {
    id: "LT-CopperFold",
    render: () => (
      <Composition
        id="LT-CopperFold"
        component={CopperFold}
        width={1920}
        height={1080}
        fps={ANGULAR_PANELS_FPS}
        durationInFrames={ANGULAR_PANELS_DURATION}
        schema={copperFoldSchema}
        defaultProps={{
          accentColor: ANGULAR_PANELS_PALETTE.copper,
          scale: 1,
          position: { x: 96, y: 720 },
        }}
      />
    ),
  },
  {
    id: "LT-AmberLeftDock",
    render: () => (
      <Composition
        id="LT-AmberLeftDock"
        component={AmberLeftDock}
        width={1920}
        height={1080}
        fps={AMBER_LEFT_DOCK_FPS}
        durationInFrames={AMBER_LEFT_DOCK_DURATION}
        schema={amberLeftDockSchema}
        defaultProps={{
          accentColor: AMBER_LEFT_DOCK_PALETTE.accent,
          scale: 1,
          position: { x: 96, y: 700 },
        }}
      />
    ),
  },
  {
    id: "LT-AquaRightBadge",
    render: () => (
      <Composition
        id="LT-AquaRightBadge"
        component={AquaRightBadge}
        width={1920}
        height={1080}
        fps={AQUA_RIGHT_BADGE_FPS}
        durationInFrames={AQUA_RIGHT_BADGE_DURATION}
        schema={aquaRightBadgeSchema}
        defaultProps={{
          accentColor: AQUA_RIGHT_BADGE_PALETTE.accent,
          scale: 1,
          position: { x: 96, y: 700 },
        }}
      />
    ),
  },
  {
    id: "LT-SageCircleRail",
    render: () => (
      <Composition
        id="LT-SageCircleRail"
        component={SageCircleRail}
        width={1920}
        height={1080}
        fps={SAGE_CIRCLE_RAIL_FPS}
        durationInFrames={SAGE_CIRCLE_RAIL_DURATION}
        schema={sageCircleRailSchema}
        defaultProps={{
          accentColor: SAGE_CIRCLE_RAIL_PALETTE.accent,
          scale: 1,
          position: { x: 96, y: 700 },
        }}
      />
    ),
  },
  {
    id: "LT-CopperCornerDock",
    render: () => (
      <Composition
        id="LT-CopperCornerDock"
        component={CopperCornerDock}
        width={1920}
        height={1080}
        fps={COPPER_CORNER_DOCK_FPS}
        durationInFrames={COPPER_CORNER_DOCK_DURATION}
        schema={copperCornerDockSchema}
        defaultProps={{
          accentColor: COPPER_CORNER_DOCK_PALETTE.accent,
          scale: 1,
          position: { x: 96, y: 710 },
        }}
      />
    ),
  },
  {
    id: "LT-CrimsonBadgeRail",
    render: () => (
      <Composition
        id="LT-CrimsonBadgeRail"
        component={CrimsonBadgeRail}
        width={1920}
        height={1080}
        fps={CRIMSON_BADGE_RAIL_FPS}
        durationInFrames={CRIMSON_BADGE_RAIL_DURATION}
        schema={crimsonBadgeRailSchema}
        defaultProps={{
          accentColor: CRIMSON_BADGE_RAIL_PALETTE.accent,
          scale: 1,
          position: { x: 96, y: 720 },
        }}
      />
    ),
  },
  {
    id: "LT-BurgundyBracket",
    render: () => (
      <Composition
        id="LT-BurgundyBracket"
        component={BurgundyBracket}
        width={1920}
        height={1080}
        fps={BURGUNDY_BRACKET_FPS}
        durationInFrames={BURGUNDY_BRACKET_DURATION}
        schema={burgundyBracketSchema}
        defaultProps={{
          accentColor: BURGUNDY_BRACKET_PALETTE.accent,
          scale: 1,
          position: { x: 96, y: 720 },
        }}
      />
    ),
  },
  {
    id: "LT-SplitTicket",
    render: () => (
      <Composition
        id="LT-SplitTicket"
        component={SplitTicket}
        width={1920}
        height={1080}
        fps={SPLIT_TICKET_FPS}
        durationInFrames={SPLIT_TICKET_DURATION}
        schema={splitTicketSchema}
        defaultProps={{
          accentColor: SPLIT_TICKET_PALETTE.accent,
          scale: 1,
          position: { x: 96, y: 730 },
        }}
      />
    ),
  },
  {
    id: "LT-FoldedRibbon",
    render: () => (
      <Composition
        id="LT-FoldedRibbon"
        component={FoldedRibbon}
        width={1920}
        height={1080}
        fps={FOLDED_RIBBON_FPS}
        durationInFrames={FOLDED_RIBBON_DURATION}
        schema={foldedRibbonSchema}
        defaultProps={{
          accentColor: FOLDED_RIBBON_PALETTE.accent,
          scale: 1,
          position: { x: 100, y: 720 },
        }}
      />
    ),
  },
  {
    id: "LT-OrbitBadge",
    render: () => (
      <Composition
        id="LT-OrbitBadge"
        component={OrbitBadge}
        width={1920}
        height={1080}
        fps={ORBIT_BADGE_FPS}
        durationInFrames={ORBIT_BADGE_DURATION}
        schema={orbitBadgeSchema}
        defaultProps={{
          accentColor: ORBIT_BADGE_PALETTE.accent,
          scale: 1,
          position: { x: 92, y: 700 },
        }}
      />
    ),
  },
  {
    id: "LT-EditorialCut",
    render: () => (
      <Composition
        id="LT-EditorialCut"
        component={EditorialCut}
        width={1920}
        height={1080}
        fps={EDITORIAL_CUT_FPS}
        durationInFrames={EDITORIAL_CUT_DURATION}
        schema={editorialCutSchema}
        defaultProps={{
          accentColor: EDITORIAL_CUT_PALETTE.accent,
          scale: 1,
          position: { x: 112, y: 760 },
        }}
      />
    ),
  },
];
