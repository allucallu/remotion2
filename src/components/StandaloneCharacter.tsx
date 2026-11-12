import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type CharacterPoseId = 1 | 2 | 3 | 4 | 5 | 6;

interface StandaloneCharacterProps {
  poseId: CharacterPoseId;
  layout: "left-character" | "right-character" | "center-character";
}

export const StandaloneCharacter: React.FC<StandaloneCharacterProps> = ({
  poseId,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk spring lembut
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 85, mass: 0.8 },
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const scale = interpolate(enterSpring, [0, 1], [0.92, 1]);
  const translateYEnter = interpolate(enterSpring, [0, 1], [25, 0]);

  // Efek nafas melayang lembut di ruangan (floating presence)
  const floatY = Math.sin((frame / 45) * Math.PI) * 7;
  const breatheScale = Math.sin((frame / 35) * Math.PI) * 0.015;

  // Letak posisi karakter berdiri mandiri (tanpa frame kartu yang mengurung):
  // left-character -> di sisi kiri (x: 480)
  // right-character -> di sisi kanan (x: 1420)
  // center-character -> di tengah (x: 960)
  let posX = 1420;
  let posY = 520;

  if (layout === "left-character") {
    posX = 480;
    posY = 520;
  } else if (layout === "center-character") {
    posX = 960;
    posY = 480;
  } else {
    // right-character
    posX = 1420;
    posY = 520;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: posX - 260,
        top: posY - 290,
        width: 520,
        height: 580,
        pointerEvents: "none",
        opacity,
        transform: `translateY(${translateYEnter + floatY}px) scale(${scale + breatheScale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 25px rgba(243, 179, 83, 0.15))",
      }}
    >
      <Img
        src={staticFile(`art/${poseId}.png`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

