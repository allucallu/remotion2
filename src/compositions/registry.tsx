import type { ReactNode } from "react";
import { Composition } from "remotion";
import { LivingEngravingWatchfulEye } from "./LivingEngravingWatchfulEye";
import { LivingEngravingBreathingSun } from "./LivingEngravingBreathingSun";
import { ImpossibleConveyorSphereToCube } from "./ImpossibleConveyorSphereToCube";
import { SculptedContourWaves } from "./SculptedContourWaves";
import { SculptedContourTerracottaBasin } from "./SculptedContourTerracottaBasin";
import { SatinLineCurrents } from "./SatinLineCurrents";
import { AdaptiveMesh } from "./AdaptiveMesh";
import {
  RecursiveBotanicalGrowth,
  botanicalGrowthSchema,
} from "./RecursiveBotanicalGrowth";
import {
  SculpturalBotanicalGrowth,
  sculpturalBotanicalSchema,
} from "./SculpturalBotanicalGrowth";
import { SculpturalFlowerBloom } from "./SculpturalFlowerBloom";
import { LilyNocturneBloom } from "./LilyNocturneBloom";
import { CaptionRailSlide, captionRailSlideSchema } from "./CaptionRailSlide";
import {
  CaptionCenterUnfold,
  captionCenterUnfoldSchema,
} from "./CaptionCenterUnfold";
export interface AssetRegistration {
  id: string;
  render: () => ReactNode;
}
export const assetRegistry: readonly AssetRegistration[] = [
  {
    id: "CaptionCenterUnfold",
    render: () => (
      <Composition
        id="CaptionCenterUnfold"
        component={CaptionCenterUnfold}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={300}
        schema={captionCenterUnfoldSchema}
        defaultProps={{ transparentBackground: false }}
      />
    ),
  },
  {
    id: "CaptionRailSlide",
    render: () => (
      <Composition
        id="CaptionRailSlide"
        component={CaptionRailSlide}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={300}
        schema={captionRailSlideSchema}
        defaultProps={{ transparentBackground: false }}
      />
    ),
  },
  {
    id: "LilyNocturneBloom",
    render: () => (
      <Composition
        id="LilyNocturneBloom"
        component={LilyNocturneBloom}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
      />
    ),
  },
  {
    id: "SculpturalFlowerBloom",
    render: () => (
      <Composition
        id="SculpturalFlowerBloom"
        component={SculpturalFlowerBloom}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
      />
    ),
  },
  {
    id: "SculpturalBotanicalGrowth",
    render: () => (
      <Composition
        id="SculpturalBotanicalGrowth"
        component={SculpturalBotanicalGrowth}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
        schema={sculpturalBotanicalSchema}
        defaultProps={{ quality: "production" }}
      />
    ),
  },
  {
    id: "RecursiveBotanicalGrowth",
    render: () => (
      <Composition
        id="RecursiveBotanicalGrowth"
        component={RecursiveBotanicalGrowth}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
        schema={botanicalGrowthSchema}
        defaultProps={{ quality: "production" }}
      />
    ),
  },
  {
    id: "AdaptiveMesh",
    render: () => (
      <Composition
        id="AdaptiveMesh"
        component={AdaptiveMesh}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
      />
    ),
  },
  {
    id: "SatinLineCurrents",
    render: () => (
      <Composition
        id="SatinLineCurrents"
        component={SatinLineCurrents}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
      />
    ),
  },
  {
    id: "SculptedContourTerracottaBasin",
    render: () => (
      <Composition
        id="SculptedContourTerracottaBasin"
        component={SculptedContourTerracottaBasin}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
      />
    ),
  },
  {
    id: "SculptedContourWaves",
    render: () => (
      <Composition
        id="SculptedContourWaves"
        component={SculptedContourWaves}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
      />
    ),
  },
  {
    id: "ImpossibleConveyorSphereToCube",
    render: () => (
      <Composition
        id="ImpossibleConveyorSphereToCube"
        component={ImpossibleConveyorSphereToCube}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
      />
    ),
  },
  {
    id: "LivingEngravingBreathingSun",
    render: () => (
      <Composition
        id="LivingEngravingBreathingSun"
        component={LivingEngravingBreathingSun}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
      />
    ),
  },
  {
    id: "LivingEngravingWatchfulEye",
    render: () => (
      <Composition
        id="LivingEngravingWatchfulEye"
        component={LivingEngravingWatchfulEye}
        width={3840}
        height={2160}
        fps={30}
        durationInFrames={360}
      />
    ),
  },
];
