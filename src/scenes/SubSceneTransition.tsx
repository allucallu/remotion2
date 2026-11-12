import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface SubSceneTransitionProps {
  /** Durasi sub-scene dalam frame */
  durationInFrames: number;
  /** Arah masuk (dari kiri atau kanan) */
  direction?: "left" | "right";
  children: React.ReactNode;
}

/**
 * Pembungkus sub-scene dengan transisi geser halaman & cross-fade halus (±12 frame).
 * Seluruh animasi berjalan deterministik menggunakan useCurrentFrame.
 */
export const SubSceneTransition: React.FC<SubSceneTransitionProps> = ({
  durationInFrames,
  direction = "right",
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitionFrames = 12;

  // Animasi masuk ±12 frame
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.7 },
    durationInFrames: transitionFrames,
  });

  const enterOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const sign = direction === "right" ? 1 : -1;
  const enterX = interpolate(enterSpring, [0, 1], [50 * sign, 0]);

  // Animasi keluar ±12 frame di penghujung sub-scene
  const exitStart = Math.max(1, durationInFrames - transitionFrames);
  const exitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const exitX = interpolate(
    frame,
    [exitStart, durationInFrames],
    [0, -40 * sign],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: enterOpacity * exitOpacity,
        transform: `translateX(${enterX + exitX}px)`,
      }}
    >
      {children}
    </div>
  );
};

