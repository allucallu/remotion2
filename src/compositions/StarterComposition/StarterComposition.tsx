import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { assetSettingsSchema } from "../../config/schema";
import { motion } from "../../motion-tokens";
import { seededRandom } from "../../utils/random";

export const starterCompositionSchema = assetSettingsSchema.extend({
  primaryColor: z.string().default("#00E5FF"),
  secondaryColor: z.string().default("#7C5CFF"),
  title: z.string().default("ELEVATE YOUR VISION"),
  subtitle: z.string().default("MINIMALIST MOTION TEMPLATE"),
  showParticles: z.boolean().default(true),
});

export type StarterCompositionProps = z.infer<typeof starterCompositionSchema>;

export const StarterComposition: React.FC<StarterCompositionProps> = ({
  primaryColor = "#00E5FF",
  secondaryColor = "#7C5CFF",
  title = "ELEVATE YOUR VISION",
  subtitle = "MINIMALIST MOTION TEMPLATE",
  showParticles = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // Entrance spring animation
  const entrance = spring({
    frame,
    fps,
    config: motion.spring.soft,
  });

  // Slow continuous ambient floating drift
  const drift = interpolate(frame, [0, durationInFrames], [0, 20]);
  const rotationDrift = interpolate(frame, [0, durationInFrames], [-2, 4]);

  // Staggered text animations
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [10, 35], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleLetterSpacing = interpolate(frame, [10, durationInFrames], [4, 8]);

  const subtitleOpacity = interpolate(frame, [25, 45], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Deterministic floating particles for visual depth
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      x: seededRandom(i * 11 + 1) * width,
      y: seededRandom(i * 23 + 2) * height,
      size: seededRandom(i * 37 + 3) * 3 + 1.5,
      speed: seededRandom(i * 41 + 4) * 0.4 + 0.2,
      opacity: seededRandom(i * 53 + 5) * 0.5 + 0.2,
    }));
  }, [width, height]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070A12",
        color: "#FFFFFF",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* LAYER 1: Deep Background Glows */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: width * 0.65,
          height: height * 0.65,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
          filter: "blur(90px)",
          transform: `translate3d(${drift}px, ${drift * 0.5}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: width * 0.7,
          height: height * 0.7,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${secondaryColor}26 0%, transparent 70%)`,
          filter: "blur(100px)",
          transform: `translate3d(${-drift}px, ${-drift * 0.5}px, 0)`,
        }}
      />

      {/* LAYER 2: Floating Particles (Depth) */}
      {showParticles &&
        particles.map((p, i) => {
          const currentY = (p.y - frame * p.speed * 1.5 + height) % height;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.x,
                top: currentY,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
                opacity: p.opacity * entrance,
                boxShadow: `0 0 10px ${i % 2 === 0 ? primaryColor : secondaryColor}`,
              }}
            />
          );
        })}

      {/* LAYER 3: Hero Accent Element with Negative Space */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/* Subtle decorative geometry backdrop */}
        <div
          style={{
            position: "absolute",
            width: Math.min(width, height) * 0.45,
            height: Math.min(width, height) * 0.45,
            borderRadius: "32px",
            border: `1px solid rgba(255, 255, 255, 0.08)`,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)",
            backdropFilter: "blur(20px)",
            transform: `scale(${entrance}) rotate(${rotationDrift}deg)`,
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
          }}
        />

        {/* Content Box */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "24px 48px",
            maxWidth: "80%",
          }}
        >
          {/* Top Pill Tag */}
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "999px",
              background: `rgba(255, 255, 255, 0.06)`,
              border: `1px solid ${primaryColor}44`,
              color: primaryColor,
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "3px",
              marginBottom: "20px",
              opacity: subtitleOpacity,
              backdropFilter: "blur(8px)",
            }}
          >
            {subtitle}
          </div>

          {/* Main Title */}
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: `${titleLetterSpacing}px`,
              background: `linear-gradient(180deg, #FFFFFF 20%, rgba(255,255,255,0.7) 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: titleOpacity,
              transform: `translate3d(0, ${titleY}px, 0)`,
            }}
          >
            {title}
          </h1>

          {/* Bottom Accent Line */}
          <div
            style={{
              margin: "24px auto 0",
              height: "2px",
              width: `${interpolate(frame, [20, 50], [0, 80], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px`,
              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: "2px",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* LAYER 4: Subtle Vignette Overlay for Depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(5,7,12,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
