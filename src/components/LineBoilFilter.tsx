import React from "react";
import { random, useCurrentFrame } from "remotion";
import { mvConfig } from "../config";

interface LineBoilFilterProps {
  id?: string;
  scale?: number;
}

export const LineBoilFilter: React.FC<LineBoilFilterProps> = ({
  id = "line-boil-filter",
  scale = mvConfig.lineBoil.displacementScale,
}) => {
  const frame = useCurrentFrame();

  // Bekukan frame ke langkah (misal stepFrames = 3 => 10 fps)
  const step = Math.floor(frame / mvConfig.lineBoil.stepFrames);

  // Seed deterministik per langkah menggunakan random() dari Remotion
  const filterSeed = Math.floor(random(`boil-filter-seed-${step}`) * 1000);

  if (!mvConfig.lineBoil.enabled) {
    return null;
  }

  return (
    <svg
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={mvConfig.lineBoil.turbulenceFreq}
            numOctaves={2}
            seed={filterSeed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};

/**
 * Helper untuk menghitung offset (X, Y) dan rotasi line-boil deterministik per kata/elemen
 */
export function getLineBoilTransform(
  frame: number,
  elementSeed: string,
  options?: {
    posJitter?: number;
    rotJitter?: number;
    stepFrames?: number;
  }
) {
  if (!mvConfig.lineBoil.enabled) {
    return { x: 0, y: 0, rotation: 0, transform: "none" };
  }

  const stepFrames = options?.stepFrames ?? mvConfig.lineBoil.stepFrames;
  const posJitter = options?.posJitter ?? mvConfig.lineBoil.posJitter;
  const rotJitter = options?.rotJitter ?? mvConfig.lineBoil.rotJitter;

  const step = Math.floor(frame / stepFrames);

  const randX = random(`${elementSeed}-x-${step}`);
  const randY = random(`${elementSeed}-y-${step}`);
  const randRot = random(`${elementSeed}-rot-${step}`);

  const x = (randX * 2 - 1) * posJitter;
  const y = (randY * 2 - 1) * posJitter;
  const rotation = (randRot * 2 - 1) * rotJitter;

  return {
    x,
    y,
    rotation,
    transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rotation.toFixed(2)}deg)`,
  };
}

