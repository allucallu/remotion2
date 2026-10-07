import type { SpringConfig } from "remotion";

export const motion = {
  spring: {
    snappy: {
      damping: 14,
      mass: 0.6,
      stiffness: 180,
      overshootClamping: false,
    },
    bouncy: {
      damping: 10,
      mass: 0.8,
      stiffness: 120,
      overshootClamping: false,
    },
    soft: {
      damping: 20,
      mass: 1.2,
      stiffness: 80,
      overshootClamping: false,
    },
  } satisfies Record<string, SpringConfig>,
  staggerSeconds: 0.12,
  entranceSeconds: 0.65,
  exitSeconds: 0.35,
} as const;
