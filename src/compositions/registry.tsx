import type { ReactNode } from "react";
import { curvedAttentionArrowRegistration } from "../CurvedAttentionArrow";
import { organicDoubleCircleRegistration } from "../OrganicDoubleCircle";
import { tripleScribbleUnderlineRegistration } from "../TripleScribbleUnderline";
import { surpriseAccentRaysRegistration } from "../SurpriseAccentRays";
import { roughSketchFocusBoxRegistration } from "../RoughSketchFocusBox";
import { spiralFocusCircleRegistration } from "../SpiralFocusCircle";
import { opposingSketchBracketsRegistration } from "../OpposingSketchBrackets";
import { handDrawnStarSparkRegistration } from "../HandDrawnStarSpark";
import { sketchCheckmarkRegistration } from "../SketchCheckmark";
import { wavyDoodleEncirclementRegistration } from "../WavyDoodleEncirclement";
import { progressCapsuleRegistration } from "../ProgressCapsule";
import { elasticDotsRegistration } from "../ElasticDots";
import { segmentedRingRegistration } from "../SegmentedRing";
import { pixelAssemblyRegistration } from "../PixelAssembly";
import { layeredTagCalloutRegistration } from "../LayeredTagCallout";
import { curvedCapsuleCalloutRegistration } from "../CurvedCapsuleCallout";
import { technicalOutlineCalloutRegistration } from "../TechnicalOutlineCallout";
import { minimalEditorialCalloutRegistration } from "../MinimalEditorialCallout";
import { bracketFocusCalloutRegistration } from "../BracketFocusCallout";

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
  organicDoubleCircleRegistration,
  curvedAttentionArrowRegistration,
  tripleScribbleUnderlineRegistration,
  surpriseAccentRaysRegistration,
  roughSketchFocusBoxRegistration,
  spiralFocusCircleRegistration,
  opposingSketchBracketsRegistration,
  handDrawnStarSparkRegistration,
  sketchCheckmarkRegistration,
  wavyDoodleEncirclementRegistration,
  progressCapsuleRegistration,
  elasticDotsRegistration,
  segmentedRingRegistration,
  pixelAssemblyRegistration,
  layeredTagCalloutRegistration,
  curvedCapsuleCalloutRegistration,
  technicalOutlineCalloutRegistration,
  minimalEditorialCalloutRegistration,
  bracketFocusCalloutRegistration,
];
