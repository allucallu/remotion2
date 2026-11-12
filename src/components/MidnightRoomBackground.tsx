import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export const MidnightRoomBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Ritme nafas lampu tidur 85 BPM
  const lampBreath = Math.sin((frame / 30) * Math.PI * 0.8) * 15;
  const slowFloat = Math.sin((frame / durationInFrames) * Math.PI * 2) * 8;

  // 14 partikel debu cahaya melayang (lebih padat dan hidup)
  const particles = [
    { x: "12%", y: "18%", size: 4, speed: 0.3, delay: 0 },
    { x: "22%", y: "65%", size: 6, speed: 0.25, delay: 20 },
    { x: "35%", y: "30%", size: 5, speed: 0.35, delay: 40 },
    { x: "48%", y: "75%", size: 3, speed: 0.28, delay: 60 },
    { x: "58%", y: "20%", size: 5, speed: 0.32, delay: 80 },
    { x: "68%", y: "55%", size: 4, speed: 0.22, delay: 100 },
    { x: "82%", y: "28%", size: 6, speed: 0.3, delay: 120 },
    { x: "90%", y: "70%", size: 4, speed: 0.26, delay: 140 },
    { x: "15%", y: "85%", size: 5, speed: 0.34, delay: 160 },
    { x: "75%", y: "88%", size: 3, speed: 0.2, delay: 180 },
    { x: "30%", y: "45%", size: 4, speed: 0.38, delay: 200 },
    { x: "62%", y: "40%", size: 5, speed: 0.27, delay: 220 },
    { x: "40%", y: "15%", size: 3, speed: 0.31, delay: 240 },
    { x: "85%", y: "45%", size: 4, speed: 0.29, delay: 260 },
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
      {/* 1. Latar Gradasi Kamar Malam */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 20% 25%, #1f2638 0%, #121624 55%, #080b12 100%)
          `,
        }}
      />

      {/* 2. Siluet Jendela Kamar Malam Halus di Latar Belakang (Late-Night Window Slats) */}
      <div
        style={{
          position: "absolute",
          left: "5%",
          top: "10%",
          width: "360px",
          height: "520px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(45, 58, 86, 0.25) 0%, rgba(20, 26, 40, 0.1) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.04)",
          boxShadow: "0 0 50px rgba(35, 48, 75, 0.15)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          padding: "20px",
          opacity: 0.45,
          pointerEvents: "none",
        }}
      >
        <div style={{ height: "2px", backgroundColor: "rgba(255, 255, 255, 0.05)" }} />
        <div style={{ height: "2px", backgroundColor: "rgba(255, 255, 255, 0.05)" }} />
        <div style={{ height: "2px", backgroundColor: "rgba(255, 255, 255, 0.05)" }} />
      </div>

      {/* 3. Pendaran Lampu Meja Tidur Hangat (Warm Tungsten Glow di samping karakter) */}
      <div
        style={{
          position: "absolute",
          right: "-5%",
          top: "8%",
          width: "950px",
          height: "950px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(243, 179, 83, 0.25) 0%, rgba(231, 121, 98, 0.12) 40%, rgba(16, 20, 30, 0) 70%)`,
          filter: "blur(70px)",
          transform: `scale(${1 + lampBreath * 0.003}) translateY(${slowFloat}px)`,
          pointerEvents: "none",
        }}
      />

      {/* Pendaran lampu kedua di kiri bawah */}
      <div
        style={{
          position: "absolute",
          left: "-10%",
          bottom: "-10%",
          width: "850px",
          height: "850px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(72, 88, 125, 0.22) 0%, rgba(16, 20, 30, 0) 65%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* 4. Ornamen Garis Akustik Gelombang Melayang (Subtle Ambient Audio Waves) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.25,
        }}
      >
        <path
          d="M 0 650 Q 480 620 960 650 T 1920 650"
          fill="none"
          stroke={mvConfig.theme.accentAmber}
          strokeWidth={1.2}
          strokeDasharray="6 8"
        />
        <path
          d="M 0 680 Q 480 710 960 680 T 1920 680"
          fill="none"
          stroke={mvConfig.theme.accentCoral}
          strokeWidth={1}
          opacity={0.6}
        />
      </svg>

      {/* 5. Partikel Bintik Cahaya Melayang Halus (Floating Bokeh) */}
      {particles.map((p, i) => {
        const floatY = Math.sin(((frame + p.delay) / 45) * p.speed * Math.PI) * 18;
        const opacity = interpolate(
          Math.sin(((frame + p.delay) / 60) * Math.PI),
          [-1, 1],
          [0.2, 0.75]
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
              boxShadow: `0 0 14px ${mvConfig.theme.accentAmber}, 0 0 25px rgba(243, 179, 83, 0.4)`,
              opacity,
              transform: `translateY(${floatY}px)`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* 6. Vignette Sinematik Membingkai Layar */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 160px rgba(4, 6, 10, 0.7)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
