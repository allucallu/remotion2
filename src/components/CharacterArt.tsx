import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LayoutPreset } from "../layout";
import { getLineBoilTransform } from "./LineBoilFilter";

export type CharacterArtId = 1 | 2 | 3 | 4;

interface CharacterArtProps {
  artId: CharacterArtId;
  layout: LayoutPreset;
  groupId: number;
}

export const CharacterArt: React.FC<CharacterArtProps> = ({
  artId,
  layout,
  groupId,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk (muncul bertahap dengan spring organik seperti digambar)
  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 85,
      mass: 0.9,
    },
  });

  const opacity = interpolate(enterSpring, [0, 0.25, 1], [0, 0.88, 0.98]);
  const scale = interpolate(enterSpring, [0, 1], [0.94, 1]);

  // Line-boil getar tinta tangan 10 fps (menyelaraskan gambar dengan teks dan doodle)
  const boil = getLineBoilTransform(frame, `char-art-${groupId}`, {
    posJitter: 2.2,
    rotJitter: 0.8,
  });

  // Bernapas pelan lembut
  const breathe = Math.sin((frame / 45) * Math.PI * 2) * 5;

  // Letak posisi gambar berlawanan dengan letak teks:
  let posX = 1380;
  let posY = 510;

  if (layout === "left-block") {
    posX = 1380;
    posY = 500;
  } else if (layout === "right-block") {
    posX = 540;
    posY = 500;
  } else if (layout === "split") {
    posX = 960;
    posY = 490;
  } else {
    // center
    posX = 1450;
    posY = 510;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: posX - 170,
        top: posY - 170 + breathe,
        width: 340,
        height: 340,
        pointerEvents: "none",
        opacity,
        transform: `translate(${boil.x}px, ${boil.y}px) scale(${scale})`,
        filter: "url(#line-boil-filter)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile(`art/${artId}.jpg`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          // mix-blend-mode multiply menghilangkan latar belakang putih sehingga menyatu alami di atas kertas krem
          mixBlendMode: "multiply",
          // Filter sepia + saturasi + kontras untuk menyelaraskan tinta hitam/abu menjadi warna tinta sketsa cokelat tua hangat
          filter: "sepia(0.65) saturate(1.8) brightness(0.92) contrast(1.15)",
        }}
      />
    </div>
  );
};

// Menentukan gambar karakter 1-4 yang sesuai untuk tiap bait lagu
export function getCharacterArtForGroup(groupId: number): CharacterArtId | null {
  switch (groupId) {
    case 9:  // Hei, Nona, bolehkah aku minta satu foto senyum (Chorus 1) -> Gambar 1 (senyum manis ceria)
      return 1;
    case 10: // Cukup di story, biar kusimpan sendiri -> Gambar 2 (pose santai/kamera)
      return 2;
    case 13: // Kita bahkan jarang berbicara, sapa saja belum -> Gambar 3 (menoleh kalem)
      return 3;
    case 14: // Tapi anehnya aku bisa merindu... seolah kita punya masa lalu -> Gambar 4 (kalem teduh)
      return 4;
    case 18: // Belum jadi siapa-siapa bagimu, tapi sudah jadi penggemar senyummu -> Gambar 1 (senyum manis)
      return 1;
    case 19: // Hei, Nona, bolehkah aku minta? (Chorus 2) -> Gambar 2 (pose manis)
      return 2;
    case 24: // Aku hanya ingin melihat senyummu meski tak tahu siapa aku -> Gambar 4 (senyum teduh)
      return 4;
    case 26: // Orang lain sibuk mencari kepastian, aku menunggu story tanpa kepastian -> Gambar 3 (menoleh kalem)
      return 3;
    case 27: // Hei, Nona, sekali lagi kuminta! (Final Chorus) -> Gambar 1 (senyum manis)
      return 1;
    case 28: // Aku tahu diri, jangan khawatir, Nona! -> Gambar 3 (menoleh kalem)
      return 3;
    case 33: // Nona, pap dong... -> Gambar 2 (pose selfie pap)
      return 2;
    default:
      return null;
  }
}

