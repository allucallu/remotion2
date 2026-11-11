import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { noise2D } from "@remotion/noise";
import {
  CAST_DURATION_FRAMES,
  COOLDOWN_DURATION_FRAMES,
  FIRE_ICON_CONFIGS,
  type FireIconId,
  LOOP_DURATION_FRAMES,
} from "./config";
import { WarpCanvas } from "./warpCanvas";
import { FireParticles } from "./particles";

export type FireAnimationMode = "loop" | "cast" | "cooldown";

export interface FireIconLayersProps {
  iconId?: FireIconId;
  mode?: FireAnimationMode;
  /** Background mode: 'dark' (default game UI dark canvas) or 'transparent' (for WebM VP9 alpha export) */
  backgroundMode?: "dark" | "transparent";
}

const EASE_OUT_BACK = Easing.bezier(0.22, 1.35, 0.36, 1);
const EASE_IN_CUBIC = Easing.bezier(0.32, 0, 0.67, 0);
const EASE_OUT_CUBIC = Easing.bezier(0.33, 1, 0.68, 1);

/**
 * Computes loopable 1D noise by sampling noise2D on a circle of radius R
 * so that frame = loopFrames connects with 0.000 difference to frame = 0.
 */
const sampleLoopNoise = (
  seed: string,
  frame: number,
  loopFrames: number,
  cycles: number,
  radius = 0.9,
): number => {
  const angle = ((frame % loopFrames) / loopFrames) * Math.PI * 2 * cycles;
  return noise2D(seed, Math.cos(angle) * radius, Math.sin(angle) * radius);
};

/**
 * Layer stack from bottom to top:
 * 1. Dark background (or transparent for alpha export)
 * 2. Large pulsing glow (screen blend)
 * 3. Warped flame glyph (Canvas 2D per-strip horizontal warp)
 * 4. Hot-core mask (fast additive/screen flicker, synced strip warp)
 * 5. Rising ember & spark particles
 * 6. Optional periodic light sweep
 * 7. Static metallic ornate frame (NEVER wobbles!) + synced top flame breakout tongue
 * 8. Mode-specific overlays (CAST burst flash & shockwave ring, or COOLDOWN radial sweep + countdown)
 * 9. Subtle vignette
 */
export const FireIconScene: React.FC<FireIconLayersProps> = ({
  iconId = "01",
  mode = "loop",
  backgroundMode = "dark",
}) => {
  const frame = useCurrentFrame();
  const config = FIRE_ICON_CONFIGS[iconId];

  // For LOOP mode, period is 120 frames. For CAST mode (90 frames), periodic noise uses 90.
  const loopPeriod =
    mode === "cast"
      ? CAST_DURATION_FRAMES
      : mode === "cooldown"
        ? COOLDOWN_DURATION_FRAMES
        : LOOP_DURATION_FRAMES;

  // 1. Irregular organic glow pulsing (sum of 1x and 2x loop harmonics + loopable simplex noise)
  const glowNoise = sampleLoopNoise(
    `glow-${iconId}`,
    frame,
    loopPeriod,
    1,
    0.85,
  );
  const glowSubHarmonic = Math.sin(
    ((frame % loopPeriod) / loopPeriod) * Math.PI * 4,
  );
  const glowPulse = (glowNoise * 0.65 + glowSubHarmonic * 0.35);

  const glowOpacity = Math.max(
    0.15,
    Math.min(1, config.glow.baseOpacity + glowPulse * config.glow.pulseAmplitude),
  );
  const glowScale =
    config.glow.baseScale + glowPulse * config.glow.scaleAmplitude;

  // 2. Rapid hot-core flicker (sum of 2x and 4x loop harmonics + loopable noise)
  const coreNoise = sampleLoopNoise(
    `core-${iconId}`,
    frame,
    loopPeriod,
    3,
    1.15,
  );
  const coreHarmonic = Math.cos(
    ((frame % loopPeriod) / loopPeriod) * Math.PI * 8,
  );
  const coreFlicker = coreNoise * 0.6 + coreHarmonic * 0.4;
  const coreOpacity = Math.max(
    0.15,
    Math.min(1, config.core.baseOpacity + coreFlicker * config.core.flickerAmplitude),
  );

  // 3. Mode CAST envelope (90 frames):
  // - Frame 0..10: Anticipation (shrinks 6% -> scale 0.94, dims brightness to 0.72)
  // - Frame 10..26: Burst (overshoot scale to 1.12, bright yellow-white flash, expanding shockwave ring)
  // - Frame 26..90: Settle smoothly back to idle 1.0
  let castScale = 1;
  let castBrightness = 1;
  let castWarpBoost = 1;
  let burstFlashOpacity = 0;
  let shockwaveProgress = 0;
  let shockwaveOpacity = 0;

  if (mode === "cast") {
    if (frame <= 10) {
      castScale = interpolate(frame, [0, 10], [1, 0.94], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_IN_CUBIC,
      });
      castBrightness = interpolate(frame, [0, 10], [1, 0.72], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (frame <= 24) {
      castScale = interpolate(frame, [10, 24], [0.94, 1.12], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT_BACK,
      });
      castBrightness = interpolate(frame, [10, 16, 24], [0.72, 1.45, 1.15], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else {
      castScale = interpolate(frame, [24, 58], [1.12, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT_CUBIC,
      });
      castBrightness = interpolate(frame, [24, 52], [1.15, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    castWarpBoost = interpolate(frame, [8, 18, 48], [0.85, 1.85, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    burstFlashOpacity = interpolate(frame, [9, 13, 28], [0, 0.88, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    shockwaveProgress = interpolate(frame, [11, 44], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_CUBIC,
    });
    shockwaveOpacity = interpolate(frame, [11, 16, 44], [0, 0.92, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // 4. Optional Light Sweep (for weapon/shield icons or subtle sheen)
  const sweepCfg = config.lightSweep;
  const sweepPhase =
    sweepCfg && sweepCfg.enabled
      ? ((frame % loopPeriod) / loopPeriod) * sweepCfg.cyclesPerLoop
      : 0;
  const sweepLocal = sweepPhase % 1;
  const sweepOffsetPct = interpolate(sweepLocal, [0, 0.45, 1], [-120, 140, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5. Mode COOLDOWN (120 frames = 4.0s radial clockwise sweep with countdown number)
  const cooldownProgress =
    mode === "cooldown"
      ? interpolate(frame, [0, COOLDOWN_DURATION_FRAMES - 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const cooldownAngleDeg = cooldownProgress * 360;
  const cooldownRemainingSec = Math.max(
    0,
    ((COOLDOWN_DURATION_FRAMES - 1 - frame) / 30),
  ).toFixed(1);
  const cooldownReadyFlash =
    mode === "cooldown"
      ? interpolate(
          frame,
          [COOLDOWN_DURATION_FRAMES - 12, COOLDOWN_DURATION_FRAMES - 5, COOLDOWN_DURATION_FRAMES - 1],
          [0, 0.75, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

  const glyphSrc = `fire/glyph_${iconId}.png`;
  const breakoutSrc = `fire/breakout_${iconId}.png`;
  const glowSrc = `fire/glow_${iconId}.png`;
  const coreSrc = `fire/core_${iconId}.png`;
  const frameSrc = "fire/frame.png";

  return (
    <AbsoluteFill
      style={{
        backgroundColor:
          backgroundMode === "transparent" ? "transparent" : "#060608",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* LAYER 1: Ambient Dark Radial Backplate (only when backgroundMode === 'dark') */}
      {backgroundMode === "dark" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxSizing: "border-box",
            background:
              "radial-gradient(circle at 50% 54%, rgba(72, 18, 6, 0.36) 0%, rgba(18, 6, 4, 0.85) 58%, #050507 100%)",
          }}
        />
      )}

      {/* DYNAMIC FLAME CONTAINER (scales around icon pivot during CAST mode; static frame stays outside!) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          transformOrigin: `${config.pivot.x * 100}% ${config.pivot.y * 100}%`,
          transform: `scale(${castScale})`,
          filter:
            castBrightness !== 1 ? `brightness(${castBrightness})` : undefined,
        }}
      >
        {/* LAYER 2: Pulsing Large Glow (Screen Blend) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxSizing: "border-box",
            mixBlendMode: "screen",
            opacity: glowOpacity,
            transformOrigin: "50% 62%",
            transform: `scale(${glowScale})`,
          }}
        >
          <Img
            src={staticFile(glowSrc)}
            style={{
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* LAYER 3: Warped Flame Glyph (Canvas 2D Horizontal Strip Warp) */}
        <WarpCanvas
          src={glyphSrc}
          config={config}
          loopFrames={loopPeriod}
          amplitudeMultiplier={castWarpBoost}
          blendMode="normal"
          opacity={1}
        />

        {/* LAYER 4: Hot-Core Rapid Flicker (Additive/Screen Blend, Synced Strip Warp) */}
        <WarpCanvas
          src={coreSrc}
          config={config}
          loopFrames={loopPeriod}
          amplitudeMultiplier={castWarpBoost}
          blendMode="screen"
          opacity={coreOpacity}
        />

        {/* LAYER 5: Rising Embers, Sparks & Ash Particles */}
        <FireParticles
          config={config}
          loopFrames={loopPeriod}
          burstFactor={castWarpBoost}
        />

        {/* LAYER 6: Optional Light Sweep */}
        {sweepCfg && sweepCfg.enabled && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxSizing: "border-box",
              mixBlendMode: "screen",
              opacity: sweepCfg.intensity,
              background: `linear-gradient(${sweepCfg.angleDeg}deg, rgba(255,255,255,0) ${sweepOffsetPct - 18}%, rgba(255,240,180,0.85) ${sweepOffsetPct}%, rgba(255,255,255,0) ${sweepOffsetPct + 18}%)`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* LAYER 7A-PRE: Radial Clockwise Dark Cooldown Sweep Inside the Inner Window (underneath the ornate frame) */}
      {mode === "cooldown" && cooldownProgress < 0.985 && (
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 220,
            width: 640,
            height: 640,
            boxSizing: "border-box",
            pointerEvents: "none",
            background: `conic-gradient(from 0deg at 50% 50%, rgba(0, 0, 0, 0.08) 0deg, rgba(0, 0, 0, 0.08) ${cooldownAngleDeg}deg, rgba(4, 6, 12, 0.82) ${cooldownAngleDeg + 1.5}deg, rgba(4, 6, 12, 0.82) 360deg)`,
          }}
        />
      )}

      {/* LAYER 7A: STATIC METALLIC ORNATE FRAME (100% Stationary - Never Wobbles!) */}
      <Img
        src={staticFile(frameSrc)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 7B: Top Flame Breakout Tongue (Licks in front of the top frame bar, synced with inner flame) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          transformOrigin: `${config.pivot.x * 100}% ${config.pivot.y * 100}%`,
          transform: `scale(${castScale})`,
          pointerEvents: "none",
        }}
      >
        <WarpCanvas
          src={breakoutSrc}
          config={config}
          loopFrames={loopPeriod}
          amplitudeMultiplier={castWarpBoost}
          blendMode="normal"
          opacity={1}
        />
      </div>

      {/* LAYER 8A: CAST Mode Burst Flash & Expanding Shockwave Ring */}
      {mode === "cast" && (
        <AbsoluteFill
          style={{
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          {/* Yellow-White Spell Ignition Flash */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxSizing: "border-box",
              mixBlendMode: "screen",
              opacity: burstFlashOpacity,
              background:
                "radial-gradient(circle at 50% 56%, rgba(255, 252, 210, 0.95) 0%, rgba(255, 168, 45, 0.65) 38%, rgba(255, 80, 10, 0) 72%)",
            }}
          />

          {/* Expanding Shockwave Ring */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "56%",
              width: interpolate(shockwaveProgress, [0, 1], [220, 980], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              height: interpolate(shockwaveProgress, [0, 1], [220, 980], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              borderRadius: "50%",
              boxSizing: "border-box",
              transform: "translate3d(-50%, -50%, 0)",
              border: `${interpolate(shockwaveProgress, [0, 1], [18, 2], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px solid rgba(255, 224, 130, 0.95)`,
              boxShadow:
                "0 0 42px rgba(255, 150, 30, 0.85), inset 0 0 28px rgba(255, 220, 120, 0.65)",
              opacity: shockwaveOpacity,
              mixBlendMode: "screen",
            }}
          />
        </AbsoluteFill>
      )}

      {/* LAYER 8B: COOLDOWN Mode Countdown Readout & Ready Flash */}
      {mode === "cooldown" && (
        <AbsoluteFill
          style={{
            boxSizing: "border-box",
            pointerEvents: "none",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Glowing Countdown Readout Centered in the Frame Window */}
          {cooldownProgress < 0.96 && (
            <div
              style={{
                position: "relative",
                marginTop: 14,
                padding: "16px 34px",
                borderRadius: 18,
                boxSizing: "border-box",
                backgroundColor: "rgba(8, 10, 16, 0.76)",
                border: "2px solid rgba(255, 180, 72, 0.68)",
                boxShadow: "0 10px 32px rgba(0, 0, 0, 0.78)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Montserrat', 'Inter', sans-serif",
                  fontSize: 92,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: "#FFF7D6",
                  textShadow: "0 0 24px rgba(255, 145, 28, 0.9)",
                }}
              >
                {cooldownRemainingSec}s
              </span>
            </div>
          )}

          {/* Ready Flash at Cooldown Completion */}
          {cooldownReadyFlash > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxSizing: "border-box",
                mixBlendMode: "screen",
                opacity: cooldownReadyFlash,
                background:
                  "radial-gradient(circle at 50% 56%, rgba(255, 244, 180, 0.9) 0%, rgba(255, 145, 24, 0.45) 45%, rgba(0, 0, 0, 0) 72%)",
              }}
            />
          )}
        </AbsoluteFill>
      )}

      {/* LAYER 9: Cinematic Vignette (only when backgroundMode === 'dark') */}
      {backgroundMode === "dark" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxSizing: "border-box",
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 50% 54%, rgba(0, 0, 0, 0) 56%, rgba(0, 0, 0, 0.45) 82%, rgba(0, 0, 0, 0.82) 100%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
