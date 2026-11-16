import React from "react";
import { useCurrentFrame } from "remotion";

export const BOIL_FILTER_ID = "sketch-boil-filter";

export interface BoilFilterProps {
  id?: string;
  scale?: number;          // Rentang 2-4 sesuai PRD Bagian 7
  baseFrequency?: number;  // Default 0.035 untuk getaran garis organik
  frameInterval?: number;  // Seed berganti tiap 3 frame (±10 fps)
}

/**
 * Filter SVG line-boil untuk memberi efek garis getar hidup pada sketsa pensil.
 * Seed feTurbulence berganti setiap 3 frame (10 fps).
 */
export const BoilFilter: React.FC<BoilFilterProps> = ({
  id = BOIL_FILTER_ID,
  scale = 3,
  baseFrequency = 0.035,
  frameInterval = 3,
}) => {
  const frame = useCurrentFrame();

  // Seed berganti setiap `frameInterval` frame (default: 3 frame)
  const seed = Math.floor(frame / frameInterval) % 1000;

  return (
    <svg
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        pointerEvents: "none",
        opacity: 0,
      }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id={id}
          x="-4%"
          y="-4%"
          width="108%"
          height="108%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={1}
            seed={seed}
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
