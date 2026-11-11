import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";
import { LayoutPreset } from "../layout";
import { getLineBoilTransform } from "./LineBoilFilter";

export type DoodleShape = "flower" | "star" | "heart" | "spiral" | "sparkle";

interface DoodleProps {
  shape: DoodleShape;
  seed: string;
  x: number;
  y: number;
  size: number;
  color?: string;
  startDelayFrames?: number;
}

export const SingleDoodle: React.FC<DoodleProps> = ({
  shape,
  seed,
  x,
  y,
  size,
  color = mvConfig.doodles.color,
  startDelayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk garis digambar menggunakan spring
  const drawSpring = spring({
    frame: Math.max(0, frame - startDelayFrames),
    fps,
    config: {
      damping: 18,
      stiffness: 90,
      mass: 0.8,
    },
  });

  const progress = interpolate(drawSpring, [0, 1], [0, 1]);
  const opacity = interpolate(drawSpring, [0, 0.2, 1], [0, 0.85, 0.95]);

  // Line-boil jitter deterministik
  const boil = getLineBoilTransform(frame, `doodle-${seed}`, {
    posJitter: 2.0,
    rotJitter: 1.2,
  });

  // Base rotation deterministik per doodle
  const baseRot = (random(`doodle-baserot-${seed}`) - 0.5) * 30;

  // Path definisi SVG (viewBox 0 0 100 100, keliling perkiraan ~350-450)
  const pathLength = 500;
  const strokeDashoffset = interpolate(progress, [0, 1], [pathLength, 0]);

  let pathData = "";
  switch (shape) {
    case "flower":
      // Bunga 5 kelopak digambar tangan
      pathData =
        "M 50 50 C 45 35, 30 20, 50 15 C 70 20, 55 35, 50 50 C 65 45, 80 30, 85 50 C 80 70, 65 55, 50 50 C 55 65, 70 80, 50 85 C 30 80, 45 65, 50 50 C 35 55, 20 70, 15 50 C 20 30, 35 45, 50 50 Z M 50 48 A 2 2 0 1 0 50 52 A 2 2 0 1 0 50 48";
      break;
    case "heart":
      // Hati sketsa tangan
      pathData =
        "M 50 78 C 30 62, 16 48, 16 32 C 16 18, 28 14, 38 18 C 45 21, 48 27, 50 31 C 52 27, 55 21, 62 18 C 72 14, 84 18, 84 32 C 84 48, 70 62, 50 78 Z";
      break;
    case "star":
      // Bintang 5 sudut coretan sketsa kontinu
      pathData =
        "M 50 12 L 61 38 L 89 39 L 66 56 L 75 83 L 50 67 L 25 83 L 34 56 L 11 39 L 39 38 Z";
      break;
    case "spiral":
      // Garis lengkung / spiral kecil coretan sketsa
      pathData =
        "M 48 50 C 45 42, 55 38, 58 45 C 62 55, 42 62, 35 50 C 26 35, 55 22, 68 38 C 78 52, 65 75, 45 72 C 25 68, 22 45, 30 30";
      break;
    case "sparkle":
      // Kilau 4 titik coretan pena
      pathData =
        "M 50 15 Q 50 45 20 50 Q 50 55 50 85 Q 50 55 80 50 Q 50 45 50 15 Z M 50 40 L 50 60 M 40 50 L 60 50";
      break;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        pointerEvents: "none",
        opacity,
        transform: `translate(${boil.x}px, ${boil.y}px) rotate(${baseRot + boil.rotation}deg)`,
        filter: "url(#line-boil-filter)",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ overflow: "visible" }}
      >
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </div>
  );
};

interface DoodlesProps {
  layout: LayoutPreset;
  groupId: number;
}

export const Doodles: React.FC<DoodlesProps> = ({ layout, groupId }) => {
  // Tata letak doodle deterministik berdasar preset tata letak lirik
  // Mengisi ruang kosong (negative space) tanpa mengganggu teks lirik
  const doodleSlots: Array<{
    shape: DoodleShape;
    x: number;
    y: number;
    size: number;
    color?: string;
    delay: number;
  }> = [];

  const baseSeed = `grp-${groupId}`;

  if (layout === "left-block") {
    // Teks di sisi kiri (x: 120 - 750) -> Doodle mengisi sisi kanan yang lapang (x: 1050 - 1700)
    doodleSlots.push(
      {
        shape: "flower",
        x: 1350 + (random(`${baseSeed}-1x`) - 0.5) * 80,
        y: 420 + (random(`${baseSeed}-1y`) - 0.5) * 60,
        size: 130,
        color: mvConfig.doodles.color,
        delay: 6,
      },
      {
        shape: "heart",
        x: 1560 + (random(`${baseSeed}-2x`) - 0.5) * 60,
        y: 310 + (random(`${baseSeed}-2y`) - 0.5) * 50,
        size: 85,
        color: mvConfig.doodles.accentColor,
        delay: 14,
      },
      {
        shape: "sparkle",
        x: 1220 + (random(`${baseSeed}-3x`) - 0.5) * 50,
        y: 580 + (random(`${baseSeed}-3y`) - 0.5) * 40,
        size: 70,
        color: mvConfig.doodles.color,
        delay: 20,
      },
      {
        shape: "spiral",
        x: 1480 + (random(`${baseSeed}-4x`) - 0.5) * 60,
        y: 650 + (random(`${baseSeed}-4y`) - 0.5) * 50,
        size: 95,
        color: mvConfig.doodles.color,
        delay: 24,
      }
    );
  } else if (layout === "right-block") {
    // Teks di sisi kanan (x: 1050 - 1800) -> Doodle mengisi sisi kiri yang lapang (x: 200 - 800)
    doodleSlots.push(
      {
        shape: "star",
        x: 480 + (random(`${baseSeed}-1x`) - 0.5) * 70,
        y: 380 + (random(`${baseSeed}-1y`) - 0.5) * 60,
        size: 120,
        color: mvConfig.doodles.color,
        delay: 6,
      },
      {
        shape: "flower",
        x: 680 + (random(`${baseSeed}-2x`) - 0.5) * 60,
        y: 540 + (random(`${baseSeed}-2y`) - 0.5) * 50,
        size: 110,
        color: mvConfig.doodles.accentColor,
        delay: 14,
      },
      {
        shape: "sparkle",
        x: 320 + (random(`${baseSeed}-3x`) - 0.5) * 40,
        y: 510 + (random(`${baseSeed}-3y`) - 0.5) * 40,
        size: 65,
        color: mvConfig.doodles.color,
        delay: 18,
      },
      {
        shape: "spiral",
        x: 520 + (random(`${baseSeed}-4x`) - 0.5) * 50,
        y: 680 + (random(`${baseSeed}-4y`) - 0.5) * 40,
        size: 90,
        color: mvConfig.doodles.color,
        delay: 22,
      }
    );
  } else if (layout === "split") {
    // Teks di kiri dan kanan -> Doodle di area tengah pemisah atau pojok atas/bawah
    doodleSlots.push(
      {
        shape: "heart",
        x: 960,
        y: 460 + (random(`${baseSeed}-1y`) - 0.5) * 40,
        size: 100,
        color: mvConfig.doodles.accentColor,
        delay: 8,
      },
      {
        shape: "sparkle",
        x: 960 + (random(`${baseSeed}-2x`) - 0.5) * 60,
        y: 310,
        size: 70,
        color: mvConfig.doodles.color,
        delay: 16,
      },
      {
        shape: "spiral",
        x: 960 + (random(`${baseSeed}-3x`) - 0.5) * 60,
        y: 620,
        size: 85,
        color: mvConfig.doodles.color,
        delay: 22,
      }
    );
  } else {
    // layout === "center"
    // Hiasan aksen halus di sudut/sisi kiri-kanan teks tengah
    doodleSlots.push(
      {
        shape: "sparkle",
        x: 280 + (random(`${baseSeed}-1x`) - 0.5) * 40,
        y: 340,
        size: 75,
        color: mvConfig.doodles.accentColor,
        delay: 8,
      },
      {
        shape: "flower",
        x: 1640 + (random(`${baseSeed}-2x`) - 0.5) * 40,
        y: 360,
        size: 95,
        color: mvConfig.doodles.color,
        delay: 14,
      },
      {
        shape: "heart",
        x: 320,
        y: 720,
        size: 75,
        color: mvConfig.doodles.color,
        delay: 18,
      },
      {
        shape: "star",
        x: 1600,
        y: 710,
        size: 80,
        color: mvConfig.doodles.accentColor,
        delay: 22,
      }
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {doodleSlots.map((doodle, i) => (
        <SingleDoodle
          key={`doodle-${groupId}-${i}`}
          shape={doodle.shape}
          seed={`${baseSeed}-${i}`}
          x={doodle.x}
          y={doodle.y}
          size={doodle.size}
          color={doodle.color}
          startDelayFrames={doodle.delay}
        />
      ))}
    </div>
  );
};

