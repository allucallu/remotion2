import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export const MidnightRoomBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Animasi nafas pendaran lampu kamar tidur yang sangat lembut (85 BPM rhythm)
  const lampBreath = Math.sin((frame / 30) * Math.PI * 0.8) * 15;
  const slowFloat = Math.sin((frame / durationInFrames) * Math.PI * 2) * 8;

  // Daftar partikel debu melayang lembut (ambient floating dust particles)
  const particles = [
    { x: "18%", y: "24%", size: 4, speed: 0.3, delay: 0 },
    { x: "28%", y: "70%", size: 6, speed: 0.25, delay: 20 },
    { x: "42%", y: "35%", size: 3, speed: 0.35, delay: 40 },
    { x: "65%", y: "60%", size: 5, speed: 0.28, delay: 60 },
    { x: "78%", y: "25%", size: 4, speed: 0.32, delay: 80 },
    { x: "85%", y: "78%", size: 5, speed: 0.22, delay: 100 },
    { x: "50%", y: "82%", size: 3, speed: 0.3, delay: 120 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: mvConfig.theme.bgMidnight,
        overflow: "hidden",
      }}
    >
      {/* 1. Latar Gradasi Ruangan Malam (Deep Midnight Navy) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 15% 20%, #1e2436 0%, #111522 55%, #0a0d14 100%)
          `,
        }}
      />

      {/* 2. Pendaran Lampu Meja Tidur Hangat (Warm Tungsten / Amber Glow di pojok kanan bawah / samping karakter) */}
      <div
        style={{
          position: "absolute",
          right: "-10%",
          top: "10%",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(243, 179, 83, 0.22) 0%, rgba(231, 121, 98, 0.10) 45%, rgba(16, 20, 30, 0) 70%)`,
          filter: "blur(60px)",
          transform: `scale(${1 + lampBreath * 0.003}) translateY(${slowFloat}px)`,
          pointerEvents: "none",
        }}
      />

      {/* Pendaran lampu kedua di bagian kiri bawah (lembut untuk membaca teks) */}
      <div
        style={{
          position: "absolute",
          left: "-15%",
          bottom: "-15%",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(62, 76, 110, 0.18) 0%, rgba(16, 20, 30, 0) 65%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* 3. Partikel Cahaya Melayang Halus (Ambient Dust / Bokeh Lampu) */}
      {particles.map((p, i) => {
        const floatY = Math.sin(((frame + p.delay) / 45) * p.speed * Math.PI) * 16;
        const opacity = interpolate(
          Math.sin(((frame + p.delay) / 60) * Math.PI),
          [-1, 1],
          [0.15, 0.55]
        );

        return (
          <div
            key={`ambient-dust-${i}`}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: mvConfig.theme.accentAmber,
              boxShadow: `0 0 10px ${mvConfig.theme.accentAmber}`,
              opacity,
              transform: `translateY(${floatY}px)`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* 4. Vignette Sinematik Lembut Membingkai Layar */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 140px rgba(5, 7, 10, 0.65)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

