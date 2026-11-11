export type FireIconId =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";

export interface FireIconMotionConfig {
  id: FireIconId;
  name: string;
  description: string;
  /** Strip height in pixels for Canvas 2D horizontal strip warping (2-4 px) */
  stripHeightPx: number;
  /** Primary horizontal warp amplitude in pixels (at 1080x1080) */
  warpAmplitudeX: number;
  /** Secondary high-frequency tongue ripple amplitude in pixels */
  secondaryAmplitudeX: number;
  /** Vertical micro-stretch amplitude in pixels */
  warpAmplitudeY: number;
  /** Radius in noise space for circular loopable noise3D sampling */
  noiseCircleRadius: number;
  /** Spatial frequency along Y for primary wave */
  spatialFreqY: number;
  /** Spatial frequency along Y for secondary tongue wave */
  secondarySpatialFreqY: number;
  /** Integer harmonic cycles per 120-frame loop (must divide 120 cleanly) */
  primaryLoopCycles: number;
  secondaryLoopCycles: number;
  /** Normalized Y (0..1) where maximum warp weight is reached (top of flame) */
  warpTopY: number;
  /** Normalized Y (0..1) where warp weight drops to 0 (stable base of icon) */
  warpBaseY: number;
  /** Exponent controlling how smoothly weight increases from base to tip */
  warpWeightCurve: number;
  /** Pivot point (normalized 0..1) for CAST anticipation/burst scaling */
  pivot: { x: number; y: number };
  /** Glow pulsing parameters (screen blend) */
  glow: {
    baseOpacity: number;
    pulseAmplitude: number;
    baseScale: number;
    scaleAmplitude: number;
  };
  /** Hot-core rapid flicker parameters (additive/screen blend) */
  core: {
    baseOpacity: number;
    flickerAmplitude: number;
  };
  /** Particle system parameters (sparks, embers, ash) */
  particles: {
    count: number;
    spawnXRange: [number, number]; // normalized 0..1
    spawnYRange: [number, number]; // normalized 0..1
    minSizePx: number;
    maxSizePx: number;
    riseDistancePx: number;
    swayAmplitudePx: number;
    colors: {
      birthYellow: string;
      midOrange: string;
      dyingRed: string;
    };
  };
  /** Optional periodic light sweep (e.g. sword blade / shield sheen) */
  lightSweep?: {
    enabled: boolean;
    cyclesPerLoop: number;
    angleDeg: number;
    intensity: number;
  };
}

export const LOOP_DURATION_FRAMES = 120; // 4 seconds @ 30fps
export const CAST_DURATION_FRAMES = 90; // 3 seconds @ 30fps
export const COOLDOWN_DURATION_FRAMES = 120; // 4 seconds @ 30fps
export const ICON_FPS = 30;
export const ICON_SIZE = 1080;

export const FIRE_ICON_CONFIGS: Record<FireIconId, FireIconMotionConfig> = {
  "01": {
    id: "01",
    name: "Standard Flame (Api Standar)",
    description:
      "Lidah api bergoyang dengan frekuensi berbeda tiap tinggi, bara naik, glow berdenyut organik, dan bagian dasar tetap kokoh.",
    stripHeightPx: 2,
    warpAmplitudeX: 16.5,
    secondaryAmplitudeX: 7.5,
    warpAmplitudeY: 4.0,
    noiseCircleRadius: 0.95,
    spatialFreqY: 3.4,
    secondarySpatialFreqY: 7.2,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 2,
    warpTopY: 0.04,
    warpBaseY: 0.84,
    warpWeightCurve: 1.55,
    pivot: { x: 0.5, y: 0.72 },
    glow: {
      baseOpacity: 0.68,
      pulseAmplitude: 0.24,
      baseScale: 1.03,
      scaleAmplitude: 0.045,
    },
    core: {
      baseOpacity: 0.62,
      flickerAmplitude: 0.34,
    },
    particles: {
      count: 34,
      spawnXRange: [0.28, 0.72],
      spawnYRange: [0.42, 0.82],
      minSizePx: 3.5,
      maxSizePx: 9.5,
      riseDistancePx: 390,
      swayAmplitudePx: 28,
      colors: {
        birthYellow: "#FFF49C",
        midOrange: "#FF881B",
        dyingRed: "#D9230F",
      },
    },
    lightSweep: {
      enabled: false,
      cyclesPerLoop: 2,
      angleDeg: -32,
      intensity: 0,
    },
  },
  "02": {
    id: "02",
    name: "Flame Sword (Pedang Api)",
    description:
      "Api merambat di bilah, bilah berkilau menyapu tiap 2 detik, percikan lepas dari ujung pedang.",
    stripHeightPx: 2,
    warpAmplitudeX: 12.0,
    secondaryAmplitudeX: 6.0,
    warpAmplitudeY: 3.0,
    noiseCircleRadius: 0.9,
    spatialFreqY: 4.2,
    secondarySpatialFreqY: 8.5,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 2,
    warpTopY: 0.08,
    warpBaseY: 0.82,
    warpWeightCurve: 1.4,
    pivot: { x: 0.5, y: 0.68 },
    glow: {
      baseOpacity: 0.64,
      pulseAmplitude: 0.22,
      baseScale: 1.02,
      scaleAmplitude: 0.035,
    },
    core: { baseOpacity: 0.58, flickerAmplitude: 0.32 },
    particles: {
      count: 30,
      spawnXRange: [0.32, 0.74],
      spawnYRange: [0.25, 0.75],
      minSizePx: 3.0,
      maxSizePx: 8.5,
      riseDistancePx: 340,
      swayAmplitudePx: 24,
      colors: {
        birthYellow: "#FFF7B2",
        midOrange: "#FF9224",
        dyingRed: "#E02B12",
      },
    },
    lightSweep: {
      enabled: true,
      cyclesPerLoop: 2,
      angleDeg: -38,
      intensity: 0.45,
    },
  },
  "03": {
    id: "03",
    name: "Phoenix (Burung Phoenix)",
    description:
      "Sayap mengepak halus, bulu-bulu api rontok sebagai partikel, glow dada berdenyut seperti napas.",
    stripHeightPx: 2,
    warpAmplitudeX: 14.0,
    secondaryAmplitudeX: 5.5,
    warpAmplitudeY: 6.5,
    noiseCircleRadius: 0.85,
    spatialFreqY: 3.0,
    secondarySpatialFreqY: 6.4,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 2,
    warpTopY: 0.08,
    warpBaseY: 0.85,
    warpWeightCurve: 1.3,
    pivot: { x: 0.5, y: 0.58 },
    glow: {
      baseOpacity: 0.72,
      pulseAmplitude: 0.26,
      baseScale: 1.04,
      scaleAmplitude: 0.05,
    },
    core: { baseOpacity: 0.65, flickerAmplitude: 0.3 },
    particles: {
      count: 38,
      spawnXRange: [0.22, 0.78],
      spawnYRange: [0.35, 0.78],
      minSizePx: 4.0,
      maxSizePx: 10.0,
      riseDistancePx: 320,
      swayAmplitudePx: 34,
      colors: {
        birthYellow: "#FFF6A8",
        midOrange: "#FF7E14",
        dyingRed: "#C91E0A",
      },
    },
  },
  "04": {
    id: "04",
    name: "Volcano (Gunung Berapi)",
    description:
      "Lava di retakan berdenyut berurutan dari bawah ke atas, awan asap bergerak pelan, percikan lava melontar.",
    stripHeightPx: 2,
    warpAmplitudeX: 8.5,
    secondaryAmplitudeX: 4.0,
    warpAmplitudeY: 2.5,
    noiseCircleRadius: 0.75,
    spatialFreqY: 2.8,
    secondarySpatialFreqY: 5.8,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 2,
    warpTopY: 0.06,
    warpBaseY: 0.62,
    warpWeightCurve: 1.8,
    pivot: { x: 0.5, y: 0.78 },
    glow: {
      baseOpacity: 0.62,
      pulseAmplitude: 0.25,
      baseScale: 1.02,
      scaleAmplitude: 0.03,
    },
    core: { baseOpacity: 0.68, flickerAmplitude: 0.35 },
    particles: {
      count: 28,
      spawnXRange: [0.36, 0.64],
      spawnYRange: [0.22, 0.48],
      minSizePx: 4.0,
      maxSizePx: 9.5,
      riseDistancePx: 300,
      swayAmplitudePx: 38,
      colors: {
        birthYellow: "#FFEE88",
        midOrange: "#FF6A00",
        dyingRed: "#B81400",
      },
    },
  },
  "05": {
    id: "05",
    name: "Volcanic Eruption (Letusan Gunung)",
    description:
      "Pilar asap membesar perlahan dan berputar, kilat oranye di dalam awan, bom lava jatuh parabola.",
    stripHeightPx: 2,
    warpAmplitudeX: 11.0,
    secondaryAmplitudeX: 5.0,
    warpAmplitudeY: 3.5,
    noiseCircleRadius: 0.85,
    spatialFreqY: 3.2,
    secondarySpatialFreqY: 6.8,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 2,
    warpTopY: 0.05,
    warpBaseY: 0.68,
    warpWeightCurve: 1.6,
    pivot: { x: 0.5, y: 0.76 },
    glow: {
      baseOpacity: 0.7,
      pulseAmplitude: 0.28,
      baseScale: 1.04,
      scaleAmplitude: 0.045,
    },
    core: { baseOpacity: 0.72, flickerAmplitude: 0.38 },
    particles: {
      count: 36,
      spawnXRange: [0.3, 0.7],
      spawnYRange: [0.2, 0.55],
      minSizePx: 4.0,
      maxSizePx: 10.5,
      riseDistancePx: 350,
      swayAmplitudePx: 42,
      colors: {
        birthYellow: "#FFF494",
        midOrange: "#FF7312",
        dyingRed: "#C41808",
      },
    },
  },
  "06": {
    id: "06",
    name: "Meteor Strike (Meteor)",
    description:
      "Ikon meluncur diagonal dengan jejak api, kepala meteor bergetar, percikan menyebar ke belakang.",
    stripHeightPx: 2,
    warpAmplitudeX: 13.0,
    secondaryAmplitudeX: 6.5,
    warpAmplitudeY: 4.0,
    noiseCircleRadius: 0.95,
    spatialFreqY: 3.8,
    secondarySpatialFreqY: 7.5,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 3,
    warpTopY: 0.06,
    warpBaseY: 0.78,
    warpWeightCurve: 1.4,
    pivot: { x: 0.45, y: 0.65 },
    glow: {
      baseOpacity: 0.68,
      pulseAmplitude: 0.24,
      baseScale: 1.03,
      scaleAmplitude: 0.04,
    },
    core: { baseOpacity: 0.66, flickerAmplitude: 0.34 },
    particles: {
      count: 40,
      spawnXRange: [0.28, 0.72],
      spawnYRange: [0.28, 0.72],
      minSizePx: 3.5,
      maxSizePx: 9.0,
      riseDistancePx: 360,
      swayAmplitudePx: 32,
      colors: {
        birthYellow: "#FFF6A6",
        midOrange: "#FF8418",
        dyingRed: "#D1200D",
      },
    },
  },
  "07": {
    id: "07",
    name: "Lava Meteor (Meteor Kedua)",
    description:
      "Jejak lebih pendek, kepala berputar pelan, retakan lava berpendar.",
    stripHeightPx: 2,
    warpAmplitudeX: 10.5,
    secondaryAmplitudeX: 5.0,
    warpAmplitudeY: 3.2,
    noiseCircleRadius: 0.85,
    spatialFreqY: 3.5,
    secondarySpatialFreqY: 7.0,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 2,
    warpTopY: 0.08,
    warpBaseY: 0.76,
    warpWeightCurve: 1.5,
    pivot: { x: 0.5, y: 0.62 },
    glow: {
      baseOpacity: 0.66,
      pulseAmplitude: 0.22,
      baseScale: 1.03,
      scaleAmplitude: 0.038,
    },
    core: { baseOpacity: 0.64, flickerAmplitude: 0.32 },
    particles: {
      count: 32,
      spawnXRange: [0.3, 0.7],
      spawnYRange: [0.3, 0.72],
      minSizePx: 3.5,
      maxSizePx: 8.5,
      riseDistancePx: 320,
      swayAmplitudePx: 26,
      colors: {
        birthYellow: "#FFF090",
        midOrange: "#FF7A14",
        dyingRed: "#C81C0A",
      },
    },
  },
  "08": {
    id: "08",
    name: "Fire Tornado (Tornado Api)",
    description:
      "Lapisan cincin berputar kecepatan berbeda, partikel tersedot spiral ke atas.",
    stripHeightPx: 2,
    warpAmplitudeX: 21.0,
    secondaryAmplitudeX: 9.5,
    warpAmplitudeY: 3.5,
    noiseCircleRadius: 1.1,
    spatialFreqY: 4.8,
    secondarySpatialFreqY: 9.2,
    primaryLoopCycles: 2,
    secondaryLoopCycles: 3,
    warpTopY: 0.05,
    warpBaseY: 0.86,
    warpWeightCurve: 1.25,
    pivot: { x: 0.5, y: 0.75 },
    glow: {
      baseOpacity: 0.7,
      pulseAmplitude: 0.25,
      baseScale: 1.04,
      scaleAmplitude: 0.045,
    },
    core: { baseOpacity: 0.66, flickerAmplitude: 0.36 },
    particles: {
      count: 42,
      spawnXRange: [0.26, 0.74],
      spawnYRange: [0.35, 0.84],
      minSizePx: 3.5,
      maxSizePx: 9.0,
      riseDistancePx: 420,
      swayAmplitudePx: 48,
      colors: {
        birthYellow: "#FFF59E",
        midOrange: "#FF851A",
        dyingRed: "#D6220E",
      },
    },
  },
  "09": {
    id: "09",
    name: "Fire Shield (Perisai Api)",
    description:
      "Api di tengah perisai bergoyang, tepi perisai berkilau, pantulan cahaya hangat menyapu.",
    stripHeightPx: 2,
    warpAmplitudeX: 11.5,
    secondaryAmplitudeX: 5.5,
    warpAmplitudeY: 2.8,
    noiseCircleRadius: 0.85,
    spatialFreqY: 3.4,
    secondarySpatialFreqY: 6.8,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 2,
    warpTopY: 0.12,
    warpBaseY: 0.78,
    warpWeightCurve: 1.45,
    pivot: { x: 0.5, y: 0.58 },
    glow: {
      baseOpacity: 0.65,
      pulseAmplitude: 0.22,
      baseScale: 1.02,
      scaleAmplitude: 0.035,
    },
    core: { baseOpacity: 0.6, flickerAmplitude: 0.3 },
    particles: {
      count: 28,
      spawnXRange: [0.3, 0.7],
      spawnYRange: [0.35, 0.75],
      minSizePx: 3.0,
      maxSizePx: 8.0,
      riseDistancePx: 310,
      swayAmplitudePx: 22,
      colors: {
        birthYellow: "#FFF49C",
        midOrange: "#FF881B",
        dyingRed: "#D9230F",
      },
    },
    lightSweep: {
      enabled: true,
      cyclesPerLoop: 1,
      angleDeg: -35,
      intensity: 0.4,
    },
  },
  "10": {
    id: "10",
    name: "TallInferno (Api Tinggi)",
    description:
      "Lebih agresif dari 01, lidah lebih tinggi, flicker lebih cepat, percikan banyak.",
    stripHeightPx: 2,
    warpAmplitudeX: 20.0,
    secondaryAmplitudeX: 9.5,
    warpAmplitudeY: 5.0,
    noiseCircleRadius: 1.15,
    spatialFreqY: 3.9,
    secondarySpatialFreqY: 8.4,
    primaryLoopCycles: 2,
    secondaryLoopCycles: 3,
    warpTopY: 0.03,
    warpBaseY: 0.85,
    warpWeightCurve: 1.4,
    pivot: { x: 0.5, y: 0.74 },
    glow: {
      baseOpacity: 0.74,
      pulseAmplitude: 0.28,
      baseScale: 1.04,
      scaleAmplitude: 0.055,
    },
    core: { baseOpacity: 0.7, flickerAmplitude: 0.4 },
    particles: {
      count: 46,
      spawnXRange: [0.26, 0.74],
      spawnYRange: [0.38, 0.84],
      minSizePx: 3.5,
      maxSizePx: 10.0,
      riseDistancePx: 430,
      swayAmplitudePx: 34,
      colors: {
        birthYellow: "#FFF7AA",
        midOrange: "#FF8C1E",
        dyingRed: "#DE2410",
      },
    },
  },
  "11": {
    id: "11",
    name: "Fireball Orb (Bola Api)",
    description:
      "Orb berputar pelan, pusat berdenyut kuat, corona berdenyut berlawanan fase, percikan melingkar.",
    stripHeightPx: 2,
    warpAmplitudeX: 13.5,
    secondaryAmplitudeX: 6.0,
    warpAmplitudeY: 4.5,
    noiseCircleRadius: 0.95,
    spatialFreqY: 3.6,
    secondarySpatialFreqY: 7.4,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 2,
    warpTopY: 0.1,
    warpBaseY: 0.84,
    warpWeightCurve: 1.2,
    pivot: { x: 0.5, y: 0.56 },
    glow: {
      baseOpacity: 0.74,
      pulseAmplitude: 0.28,
      baseScale: 1.05,
      scaleAmplitude: 0.055,
    },
    core: { baseOpacity: 0.72, flickerAmplitude: 0.36 },
    particles: {
      count: 38,
      spawnXRange: [0.25, 0.75],
      spawnYRange: [0.28, 0.78],
      minSizePx: 3.5,
      maxSizePx: 9.5,
      riseDistancePx: 340,
      swayAmplitudePx: 36,
      colors: {
        birthYellow: "#FFF6A2",
        midOrange: "#FF8216",
        dyingRed: "#D4200C",
      },
    },
  },
  "12": {
    id: "12",
    name: "Wide Blaze (Api Lebar)",
    description:
      "Gelombang menyebar dari tengah ke tepi, bara naik dalam tiga kecepatan berbeda (parallax).",
    stripHeightPx: 2,
    warpAmplitudeX: 15.5,
    secondaryAmplitudeX: 7.0,
    warpAmplitudeY: 4.0,
    noiseCircleRadius: 0.95,
    spatialFreqY: 3.2,
    secondarySpatialFreqY: 6.6,
    primaryLoopCycles: 1,
    secondaryLoopCycles: 2,
    warpTopY: 0.06,
    warpBaseY: 0.84,
    warpWeightCurve: 1.45,
    pivot: { x: 0.5, y: 0.74 },
    glow: {
      baseOpacity: 0.7,
      pulseAmplitude: 0.24,
      baseScale: 1.03,
      scaleAmplitude: 0.045,
    },
    core: { baseOpacity: 0.66, flickerAmplitude: 0.34 },
    particles: {
      count: 44,
      spawnXRange: [0.2, 0.8],
      spawnYRange: [0.42, 0.84],
      minSizePx: 3.0,
      maxSizePx: 10.0,
      riseDistancePx: 380,
      swayAmplitudePx: 30,
      colors: {
        birthYellow: "#FFF49C",
        midOrange: "#FF881B",
        dyingRed: "#D9230F",
      },
    },
  },
};

