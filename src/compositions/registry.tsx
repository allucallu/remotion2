import type { ReactNode } from "react";
import { dogFootstepRegistrations } from "../DogFootstepTrail";
import { editorialPackRegistrations } from "../LowerThirds/EditorialPack";
import { pixelFireRegistration } from "../PixelFireLoop";
import { sneakerTrailRegistration } from "../SneakerFootstepTrail";
import {
  catSvgLoopArcRegistration,
  catSvgTrailRegistration,
} from "../CatSvgFootstepTrail";
import {
  seztk01CurvedTrailRegistration,
  seztk01TrailRegistration,
} from "../Seztk01FootstepTrail";
import { catPawTrailRegistration } from "../CatPawTrail";

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
  ...editorialPackRegistrations,
  pixelFireRegistration,
  catPawTrailRegistration,
  sneakerTrailRegistration,
  seztk01TrailRegistration,
  seztk01CurvedTrailRegistration,
  catSvgTrailRegistration,
  catSvgLoopArcRegistration,
  ...dogFootstepRegistrations,
];
