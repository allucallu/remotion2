import type { ReactNode } from "react";
import { interlacedLineWaveRegistration } from "./InterlacedLineWave";
import { orbitingDashRingRegistration } from "./OrbitingDashRing";
import { slidingStripePatchRegistration } from "./SlidingStripePatch";
import { elasticZigzagRegistration } from "./ElasticZigzag";
import { alternatingTileWeaveRegistration } from "./AlternatingTileWeave";
import { inkBloomMatteRegistration } from "./InkBloomMatte";
import { brushSweepMatteRegistration } from "./BrushSweepMatte";
import { liquidSpreadMatteRegistration } from "./LiquidSpreadMatte";
import { tornPaperMatteRegistration } from "./TornPaperMatte";
import { pixelBatLoopRegistration } from "./PixelBatLoop";
import { arcaneSealLoopRegistration } from "./ArcaneSealLoop";
import { celestialCircleLoopRegistration } from "./CelestialCircleLoop";
import { alchemistArrayLoopRegistration } from "./AlchemistArrayLoop";
import { elementalRingLoopRegistration } from "./ElementalRingLoop";
import { mechanicalSigilLoopRegistration } from "./MechanicalSigilLoop";
import { astralCompassLoopRegistration } from "./AstralCompassLoop";
import { serpentCovenantLoopRegistration } from "./SerpentCovenantLoop";
import { prismGateLoopRegistration } from "./PrismGateLoop";
import { thornboundSealLoopRegistration } from "./ThornboundSealLoop";
import { resonanceArrayLoopRegistration } from "./ResonanceArrayLoop";

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
	interlacedLineWaveRegistration,
	orbitingDashRingRegistration,
	slidingStripePatchRegistration,
	elasticZigzagRegistration,
	alternatingTileWeaveRegistration,
	inkBloomMatteRegistration,
	brushSweepMatteRegistration,
	liquidSpreadMatteRegistration,
	tornPaperMatteRegistration,
	pixelBatLoopRegistration,
	arcaneSealLoopRegistration,
	celestialCircleLoopRegistration,
	alchemistArrayLoopRegistration,
	elementalRingLoopRegistration,
	mechanicalSigilLoopRegistration,
	astralCompassLoopRegistration,
	serpentCovenantLoopRegistration,
	prismGateLoopRegistration,
	thornboundSealLoopRegistration,
	resonanceArrayLoopRegistration,
];
