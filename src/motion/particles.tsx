import React, { useMemo } from "react";
import { interpolate, interpolateColors, random, useCurrentFrame } from "remotion";
import {
  type FireIconMotionConfig,
  ICON_SIZE,
  LOOP_DURATION_FRAMES,
} from "./config";

export interface FireParticlesProps {
  config: FireIconMotionConfig;
  loopFrames?: number;
  /** Optional burst multiplier for CAST mode */
  burstFactor?: number;
}

interface EmberSpec {
  id: number;
  startX: number;
  startY: number;
  baseSize: number;
  riseDistance: number;
  swayAmp: number;
  swayFreq: 1 | 2 | 3;
  swayPhase: number;
  /** Phase offset in [0, 1) within the 120-frame loop */
  lifePhaseOffset: number;
  /** Integer number of full particle lifetimes per 120-frame loop (1 or 2, divides 120 cleanly) */
  cyclesPerLoop: 1 | 2;
  kind: "ember" | "spark" | "ash";
}

/**
 * Deterministic particle system (embers, sparks, ash) using random(seed + index) from 'remotion'.
 * Positions, sizes, opacities, and color transitions (yellow -> orange -> red) are
 * pure functions of `frame` with periods dividing 120 frames for a 100% seamless loop.
 */
export const FireParticles: React.FC<FireParticlesProps> = ({
  config,
  loopFrames = LOOP_DURATION_FRAMES,
  burstFactor = 1,
}) => {
  const frame = useCurrentFrame();
  const { particles: pCfg, id } = config;

  const embers = useMemo<readonly EmberSpec[]>(() => {
    const [minX, maxX] = pCfg.spawnXRange;
    const [minY, maxY] = pCfg.spawnYRange;

    return Array.from({ length: pCfg.count }, (_, idx) => {
      const seedBase = `fire-icon-${id}-pt-${idx}`;
      const rx = random(`${seedBase}-x`);
      const ry = random(`${seedBase}-y`);
      const rSize = random(`${seedBase}-size`);
      const rRise = random(`${seedBase}-rise`);
      const rSway = random(`${seedBase}-sway`);
      const rFreq = random(`${seedBase}-freq`);
      const rPhase = random(`${seedBase}-phase`);
      const rLife = random(`${seedBase}-life`);
      const rKind = random(`${seedBase}-kind`);

      const kind: EmberSpec["kind"] =
        rKind > 0.78 ? "spark" : rKind > 0.2 ? "ember" : "ash";

      return {
        id: idx,
        startX: (minX + rx * (maxX - minX)) * ICON_SIZE,
        startY: (minY + ry * (maxY - minY)) * ICON_SIZE,
        baseSize:
          pCfg.minSizePx + rSize * (pCfg.maxSizePx - pCfg.minSizePx),
        riseDistance: pCfg.riseDistancePx * (0.68 + rRise * 0.64),
        swayAmp: pCfg.swayAmplitudePx * (0.55 + rSway * 0.9),
        swayFreq: rFreq > 0.7 ? 3 : rFreq > 0.35 ? 2 : 1,
        swayPhase: rPhase * Math.PI * 2,
        lifePhaseOffset: rLife,
        cyclesPerLoop: idx % 3 === 0 ? 2 : 1,
        kind,
      };
    });
  }, [id, pCfg]);

  // Normalized loop progress in [0, 1)
  const loopProgress = (frame % loopFrames) / loopFrames;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    >
      {embers.map((ember) => {
        // Particle age in [0, 1) that wraps seamlessly every 120 / cyclesPerLoop frames
        const age =
          (loopProgress * ember.cyclesPerLoop + ember.lifePhaseOffset) % 1;

        // Vertical rise + sinusoidal horizontal drift
        const currentY =
          ember.startY - age * ember.riseDistance * burstFactor;
        const swayAngle =
          age * Math.PI * 2 * ember.swayFreq + ember.swayPhase;
        const currentX =
          ember.startX +
          Math.sin(swayAngle) * ember.swayAmp * (0.4 + age * 0.8);

        // Scale shrinks as the ember rises and burns out
        const scale = interpolate(age, [0, 0.18, 0.75, 1], [0.3, 1.15, 0.7, 0.15], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Smooth fade-in at birth and fade-out at end of life so wrap-around is invisible
        const opacity = interpolate(age, [0, 0.14, 0.68, 1], [0, 0.95, 0.72, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Color transition: bright yellow -> warm orange -> deep red
        const color = interpolateColors(
          age,
          [0, 0.45, 1],
          [
            pCfg.colors.birthYellow,
            pCfg.colors.midOrange,
            pCfg.colors.dyingRed,
          ],
        );

        const size = ember.baseSize * scale;
        const isSpark = ember.kind === "spark";

        return (
          <div
            key={ember.id}
            style={{
              position: "absolute",
              left: currentX,
              top: currentY,
              width: isSpark ? size * 0.75 : size,
              height: isSpark ? size * 2.1 : size,
              borderRadius: "50%",
              boxSizing: "border-box",
              backgroundColor: color,
              boxShadow: `0 0 ${Math.round(size * 2.2)}px ${color}`,
              opacity: ember.kind === "ash" ? opacity * 0.55 : opacity,
              transform: "translate3d(-50%, -50%, 0)",
            }}
          />
        );
      })}
    </div>
  );
};

