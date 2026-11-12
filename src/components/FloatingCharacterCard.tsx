import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export type CharacterPoseId = 1 | 2 | 3 | 4 | 5 | 6;

interface FloatingCharacterCardProps {
  poseId: CharacterPoseId;
  layout: "left-card" | "right-card" | "center-card";
}

export const FloatingCharacterCard: React.FC<FloatingCharacterCardProps> = ({
  poseId,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk spring lembut (seperti kartu foto yang diletakkan perlahan di atas meja)
  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 85,
      mass: 0.8,
    },
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const scale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const translateYEnter = interpolate(enterSpring, [0, 1], [25, 0]);

  // Efek melayang pelan (slow floating organic movement)
  const floatY = Math.sin((frame / 40) * Math.PI) * 7;
  const floatRot = Math.sin((frame / 55) * Math.PI) * 1.2;

  // Letak posisi kartu foto berlawanan dengan posisi blok lirik:
  // left-card -> gambar di kiri (x: 480)
  // right-card -> gambar di kanan (x: 1420)
  // center-card -> di tengah (x: 960)
  let posX = 1420;
  let posY = 520;
  let baseTilt = 2.0;

  if (layout === "left-card") {
    posX = 480;
    posY = 520;
    baseTilt = -2.5;
  } else if (layout === "center-card") {
    posX = 960;
    posY = 480;
    baseTilt = 0;
  } else {
    // right-card
    posX = 1420;
    posY = 520;
    baseTilt = 2.5;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: posX - 210,
        top: posY - 250,
        width: 420,
        height: 500,
        pointerEvents: "none",
        opacity,
        transform: `translateY(${translateYEnter + floatY}px) rotate(${baseTilt + floatRot}deg) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Frame Kartu Polaroid Hangat Elegan */}
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "16px 16px 42px 16px",
          backgroundColor: "rgba(24, 30, 44, 0.72)",
          backdropFilter: "blur(12px)",
          borderRadius: 22,
          border: "1px solid rgba(243, 179, 83, 0.22)",
          boxShadow: "0 20px 40px rgba(5, 8, 14, 0.6), 0 0 25px rgba(243, 179, 83, 0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Pendaran Cahaya Halus di Sudut Kartu */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(243, 179, 83, 0.25) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Gambar Karakter Transparan */}
        <div
          style={{
            width: "100%",
            flex: 1,
            borderRadius: 14,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, rgba(32, 40, 58, 0.5) 0%, rgba(18, 22, 34, 0.8) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Img
            src={staticFile(`art/${poseId}.png`)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: "scale(1.02)",
            }}
          />
        </div>

        {/* Caption Label Bawah Kartu */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: mvConfig.theme.accentAmber,
            fontSize: 16,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.85,
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 18 }}>✦</span>
          <span>Nona</span>
          <span style={{ fontSize: 18 }}>✦</span>
        </div>
      </div>
    </div>
  );
};

