import React, { useEffect, useRef, useState } from "react";
import {
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { noise3D } from "@remotion/noise";
import {
  type FireIconMotionConfig,
  ICON_SIZE,
  LOOP_DURATION_FRAMES,
} from "./config";

export interface WarpCanvasProps {
  /** Path inside public/, e.g. "fire/glyph_01.png" */
  src: string;
  config: FireIconMotionConfig;
  /** Total loop period in frames (default: 120 so all periodic functions divide 120) */
  loopFrames?: number;
  /** Optional multiplier for warp amplitude (e.g. boosted during CAST burst) */
  amplitudeMultiplier?: number;
  /** Optional CSS mix-blend-mode */
  blendMode?: React.CSSProperties["mixBlendMode"];
  /** Optional layer opacity */
  opacity?: number;
}

/**
 * Computes the vertical warp weight(y) in [0, 1] for a given normalized Y in [0, 1].
 * Weight shrinks smoothly to 0 at the base of the icon (warpBaseY) so the fire base
 * stays anchored while the upper flame tongues sway with maximum amplitude.
 */
export const computeWarpWeight = (
  normY: number,
  config: FireIconMotionConfig,
): number => {
  const { warpTopY, warpBaseY, warpWeightCurve } = config;
  if (normY >= warpBaseY) return 0;
  if (normY <= warpTopY) return 1;
  const t = (warpBaseY - normY) / Math.max(0.001, warpBaseY - warpTopY);
  return Math.pow(Math.max(0, Math.min(1, t)), warpWeightCurve);
};

/**
 * Computes deterministic, 100% loopable horizontal & vertical strip offsets
 * by sampling 3D simplex noise along a closed circle (cos(theta), sin(theta))
 * in the (y, z) plane of noise3D.
 */
export const computeStripDisplacement = (
  normY: number,
  frame: number,
  loopFrames: number,
  config: FireIconMotionConfig,
  amplitudeMultiplier = 1,
): { dx: number; dy: number } => {
  const weight = computeWarpWeight(normY, config);
  if (weight <= 0.0001) {
    return { dx: 0, dy: 0 };
  }

  const loopPhase = ((frame % loopFrames) / loopFrames) * Math.PI * 2;
  const theta1 = loopPhase * config.primaryLoopCycles;
  const theta2 = loopPhase * config.secondaryLoopCycles;
  const r = config.noiseCircleRadius;

  // Primary low-frequency flame body sway (travelling upward wave via phase lag along Y)
  const travelAngle1 = theta1 + (1 - normY) * Math.PI * 2.2;
  const n1 = noise3D(
    `warp1-${config.id}`,
    normY * config.spatialFreqY,
    Math.cos(travelAngle1) * r,
    Math.sin(travelAngle1) * r,
  );

  // Secondary higher-frequency upper tongue flicker/whip
  const travelAngle2 = theta2 + (1 - normY) * Math.PI * 3.8;
  const n2 = noise3D(
    `warp2-${config.id}`,
    normY * config.secondarySpatialFreqY,
    Math.cos(travelAngle2) * r * 1.15,
    Math.sin(travelAngle2) * r * 1.15,
  );

  // Vertical micro-stretch (flame tongues licking upward)
  const nY = noise3D(
    `warpY-${config.id}`,
    normY * config.spatialFreqY * 1.3,
    Math.sin(travelAngle1) * r,
    Math.cos(travelAngle2) * r,
  );

  const dx =
    (n1 * config.warpAmplitudeX +
      n2 * config.secondaryAmplitudeX * Math.sqrt(weight)) *
    weight *
    amplitudeMultiplier;

  const dy = nY * config.warpAmplitudeY * weight * amplitudeMultiplier;

  return { dx, dy };
};

/**
 * Canvas 2D Horizontal Strip Warper (2-4 px strips).
 * Avoids slow SVG feTurbulence and guarantees deterministic frame-accurate rendering.
 */
export const WarpCanvas: React.FC<WarpCanvasProps> = ({
  src,
  config,
  loopFrames = LOOP_DURATION_FRAMES,
  amplitudeMultiplier = 1,
  blendMode = "normal",
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [handle] = useState(() => delayRender(`Loading warp image: ${src}`));

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!cancelled) {
        setLoadedImage(img);
        continueRender(handle);
      }
    };
    img.onerror = (err) => {
      if (!cancelled) {
        console.error(`Failed to load image ${src}`, err);
        continueRender(handle);
      }
    };
    img.src = staticFile(src);
    return () => {
      cancelled = true;
    };
  }, [src, handle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = ICON_SIZE;
    const height = ICON_SIZE;
    ctx.clearRect(0, 0, width, height);

    const stripH = Math.max(2, Math.min(4, config.stripHeightPx));

    for (let y = 0; y < height; y += stripH) {
      const sliceH = Math.min(stripH, height - y);
      const normY = y / height;
      const { dx, dy } = computeStripDisplacement(
        normY,
        frame,
        loopFrames,
        config,
        amplitudeMultiplier,
      );

      // Sample source strip with vertical micro-displacement clamped safely inside image bounds
      const srcY = Math.max(0, Math.min(height - sliceH, y - dy));

      ctx.drawImage(
        loadedImage,
        0,
        srcY,
        width,
        sliceH,
        dx,
        y,
        width,
        sliceH,
      );
    }
  }, [loadedImage, frame, config, loopFrames, amplitudeMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      width={ICON_SIZE}
      height={ICON_SIZE}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        mixBlendMode: blendMode,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

