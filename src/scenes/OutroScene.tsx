import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";
import { mvConfig } from "../config";
import type { Section } from "../data/buildTimeline";
import { HandFilter, HAND_FILTER_ID } from "../components/HandFilter";
import { PaperBackground } from "../components/PaperBackground";
import { LyricBlock } from "../components/LyricBlock";
import { DrawPath } from "../components/DrawPath";
import { Guitar, Heart, MusicNote, WashiTape } from "../components/Doodles";

const { fontFamily: gaeguFont } = loadGaegu();
const { fontFamily: patrickHandFont } = loadPatrickHand();

interface OutroSceneProps {
  section: Section;
}

/**
 * Scene 9: Outro – Acoustic Guitar Only (4:00.32 - 4:37.20)
 * - Empat baris terakhir ditulis pelan satu per satu.
 * - Gitar bersandar & gelembung percakapan kosong menunggu.
 * - Setelah lirik berakhir: jeda tenang ~2.5s, halaman jurnal ditutup perlahan (scaleX + perspective),
 *   lalu fade ke krem menyisakan ~2.7s hening visual hingga audio selesai.
 */
export const OutroScene: React.FC<OutroSceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const currentSec = section.start + frame / fps;

  // Hitung akhir lirik terakhir sebagai patokan menutup buku & fade ke krem
  const lastLineEndSec =
    section.lines.length > 0
      ? section.lines[section.lines.length - 1].end
      : section.end - 18;

  // Timeline penutupan jurnal setelah lirik terakhir:
  // 1) Jeda hening sejenak (~2.5 detik setelah lirik terakhir agar pesan mengendap)
  const bookCloseStartSec = lastLineEndSec + 2.5;
  // 2) Buku jurnal menutup perlahan selama ~7 detik
  const bookCloseEndSec = Math.min(section.end - 6.0, bookCloseStartSec + 7.0);
  // 3) Fade halus ke krem dan sisakan 2.8 detik hening visual sebelum audio selesai
  const fadeStartSec = Math.max(bookCloseEndSec + 0.5, section.end - 5.5);
  const creamHoldStartSec = section.end - 2.8;

  const bookCloseProgress = interpolate(
    currentSec,
    [bookCloseStartSec, bookCloseEndSec],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Skala horizontal & rotasi perspektif menutup buku dari kanan ke kiri
  const pageScaleX = interpolate(bookCloseProgress, [0, 1], [1, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pageRotateY = interpolate(bookCloseProgress, [0, 1], [0, -78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const innerFadeOpacity = interpolate(bookCloseProgress, [0.55, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sampul buku jurnal yang muncul seiring halaman dilipat menutup
  const coverOpacity = interpolate(bookCloseProgress, [0.45, 0.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade penutup ke layar krem murni, memberi 2.8 detik hening visual sebelum musik berakhir
  const finalCreamFadeOpacity = interpolate(
    currentSec,
    [fadeStartSec, creamHoldStartSec],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ayunan sangat pelan gitar & gelembung menunggu
  const gentleBreath = Math.sin(frame * 0.04) * 3;
  const waitingPulse = 0.55 + Math.sin(frame * 0.08) * 0.25;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: mvConfig.palette.paperCream,
        overflow: "hidden",
        perspective: 1800,
      }}
    >
      <HandFilter frame={frame} scale={2.1} />

      {/* Lapisan Sampul Belakang Jurnal (Terlihat saat Halaman Melipat Menutup) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#EFE6D4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: coverOpacity,
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 580,
            height: 760,
            backgroundColor: "#E8D9BF",
            border: `4px solid ${mvConfig.palette.graphite}`,
            borderRadius: "10px 28px 28px 10px",
            boxShadow: "18px 24px 48px rgba(51, 54, 61, 0.16)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            position: "relative",
          }}
        >
          {/* Punggung Buku Kiri */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 34,
              backgroundColor: mvConfig.palette.highlighterPink,
              opacity: 0.45,
              borderRight: `3px solid ${mvConfig.palette.graphite}`,
            }}
          />

          <WashiTape
            width={130}
            color={mvConfig.palette.mint}
            rotate={-3}
            progress={1}
          />

          <span
            style={{
              fontFamily: `${patrickHandFont}, cursive`,
              fontSize: 64,
              color: mvConfig.palette.penBlue,
            }}
          >
            Hei, Nona
          </span>
          <span
            style={{
              fontFamily: `${gaeguFont}, cursive`,
              fontSize: 30,
              color: mvConfig.palette.graphite,
              opacity: 0.75,
            }}
          >
            — catatan pengagum diam-diam —
          </span>

          <div style={{ marginTop: 12 }}>
            <Heart size={48} start={0} color={mvConfig.palette.highlighterPink} />
          </div>
        </div>
      </div>

      {/* Halaman Jurnal Aktif (Menutup perlahan ke kiri dengan scaleX + perspective) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "left center",
          transform: `rotateY(${pageRotateY}deg) scaleX(${pageScaleX})`,
          opacity: innerFadeOpacity,
          boxShadow:
            bookCloseProgress > 0.01
              ? "24px 0px 55px rgba(51, 54, 61, 0.2)"
              : "none",
          zIndex: 4,
          overflow: "hidden",
        }}
      >
        <PaperBackground mode="day" />

        {/* Label Bab Terakhir (safe-area 96px) */}
        <div
          style={{
            position: "absolute",
            top: 96,
            left: 150,
            display: "flex",
            alignItems: "center",
            gap: 12,
            zIndex: 10,
          }}
        >
          <WashiTape
            width={92}
            color={mvConfig.palette.mint}
            rotate={-2}
            progress={1}
          />
          <span
            style={{
              fontFamily: `${gaeguFont}, cursive`,
              fontSize: 28,
              color: mvConfig.palette.graphite,
              opacity: 0.72,
            }}
          >
            epilog: caraku menyukaimu
          </span>
        </div>

        {/* Kolom Kiri: Empat Baris Terakhir Ditulis Pelan Satu per Satu (safe-area 96px) */}
        <div
          style={{
            position: "absolute",
            left: 150,
            top: "52%",
            transform: "translateY(-50%)",
            width: 780,
            zIndex: 6,
          }}
        >
          <LyricBlock
            lines={section.lines}
            align="left"
            sectionStart={section.start}
            mode="day"
            fontSize={58}
          />
        </div>

        {/* Kolom Kanan: Gitar Bersandar & Gelembung Percakapan Kosong Menunggu (safe-area 96px) */}
        <div
          style={{
            position: "absolute",
            right: 96,
            top: "52%",
            transform: "translateY(-50%)",
            width: 680,
            height: 600,
          }}
        >
          {/* Garis Sudut Dinding & Lantai Tempat Gitar Bersandar */}
          <svg
            width="620"
            height="540"
            viewBox="0 0 620 540"
            style={{
              position: "absolute",
              inset: 0,
              overflow: "visible",
              filter: `url(#${HAND_FILTER_ID})`,
            }}
          >
            <DrawPath
              d="M 100 450 L 560 450"
              start={0}
              duration={20}
              color={mvConfig.palette.graphite}
              strokeWidth={3}
              opacity={0.55}
            />
            <DrawPath
              d="M 465 95 L 465 450"
              start={8}
              duration={20}
              color={mvConfig.palette.graphite}
              strokeWidth={2.5}
              opacity={0.35}
            />
          </svg>

          {/* Gitar Akustik Bersandar Tenang */}
          <div
            style={{
              position: "absolute",
              right: 115,
              bottom: 72,
              transform: `rotate(${8 + gentleBreath * 0.25}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <Guitar size={205} start={4} rotate={0} />
          </div>

          {/* Gelembung Percakapan Kosong yang Menunggu di Sebelah Gitar */}
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 105 + gentleBreath,
              opacity: waitingPulse,
            }}
          >
            <div
              style={{
                width: 245,
                height: 98,
                border: `3.5px dashed ${mvConfig.palette.penBlue}`,
                borderRadius: "32px 32px 32px 8px",
                backgroundColor: "rgba(255, 255, 255, 0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Kosong menunggu balasan sapaan */}
              <span
                style={{
                  fontFamily: `${gaeguFont}, cursive`,
                  fontSize: 34,
                  color: mvConfig.palette.penBlue,
                  opacity: 0.45,
                  letterSpacing: 6,
                }}
              >
                . . .
              </span>
            </div>
          </div>

          {/* Hati & Not Kecil Tersisa Pelan */}
          <div style={{ position: "absolute", left: 100, bottom: 135 }}>
            <Heart size={42} start={30} color={mvConfig.palette.highlighterPink} />
          </div>
          <div style={{ position: "absolute", right: 65, top: 82 }}>
            <MusicNote
              size={44}
              start={20}
              variant="single"
              color={mvConfig.palette.penBlue}
            />
          </div>
        </div>
      </div>

      {/* Overlay Fade ke Krem Bersih (2.8 detik hening visual sebelum audio berakhir) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: mvConfig.palette.paperCream,
          opacity: finalCreamFadeOpacity,
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </div>
  );
};

