import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const SECTION_TRANSITION_FRAMES = 12;

interface SubSceneTransitionProps {
  /** Durasi sub-scene dalam frame */
  durationInFrames: number;
  /** Arah masuk (dari kiri atau kanan) */
  direction?: "left" | "right";
  /** Matikan fade-out di ujung akhir seksi agar overlap antar seksi mulus tanpa frame kosong */
  disableExit?: boolean;
  children: React.ReactNode;
}

/**
 * Pembungkus sub-scene dengan transisi geser halaman & cross-fade halus (±12 frame).
 * Seluruh animasi berjalan deterministik menggunakan useCurrentFrame.
 */
export const SubSceneTransition: React.FC<SubSceneTransitionProps> = ({
  durationInFrames,
  direction = "right",
  disableExit = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitionFrames = SECTION_TRANSITION_FRAMES;

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

  // Animasi keluar ±12 frame (dimatikan pada sub-scene terakhir seksi bila digantikan transisi seksi)
  const exitStart = Math.max(1, durationInFrames - transitionFrames);
  const exitOpacity = disableExit
    ? 1
    : interpolate(frame, [exitStart, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const exitX = disableExit
    ? 0
    : interpolate(frame, [exitStart, durationInFrames], [0, -40 * sign], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

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

interface SectionTransitionProps {
  /** Indeks seksi (seksi 0 tidak perlu animasi slide masuk dari kosong) */
  sectionIndex: number;
  children: React.ReactNode;
}

/**
 * Transisi masuk konsisten ±12 frame antar seksi utama di MV.tsx.
 * Seksi berikutnya bergeser/cross-fade di atas seksi sebelumnya tanpa pernah memunculkan frame hitam.
 */
export const SectionTransition: React.FC<SectionTransitionProps> = ({
  sectionIndex,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (sectionIndex === 0) {
    return (
      <div style={{ position: "absolute", inset: 0, zIndex: sectionIndex + 1 }}>
        {children}
      </div>
    );
  }

  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 130, mass: 0.7 },
    durationInFrames: SECTION_TRANSITION_FRAMES,
  });

  const opacity = interpolate(enterProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(enterProgress, [0, 1], [64, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: sectionIndex + 1,
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      {children}
    </div>
  );
};
