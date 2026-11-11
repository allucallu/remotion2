import React from "react";
import { useCurrentFrame } from "remotion";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { Paper } from "./Paper";
import { LineBoilFilter, getLineBoilTransform } from "./LineBoilFilter";
import { mvConfig } from "../config";

// Muat 3 kandidat font tulisan tangan
const patrickHand = loadPatrickHand("normal", {
  weights: ["400"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

const kalam = loadKalam("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

const gaegu = loadGaegu("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export const FontComparison: React.FC = () => {
  const frame = useCurrentFrame();

  const sampleLyric = "Hidup makin sulit, dunia makin kejam";
  const words = sampleLyric.split(" ");

  const candidates = [
    {
      id: "patrick-hand",
      name: "1. Patrick Hand (Santai, Natural, Sangat Terbaca)",
      fontFamily: patrickHand.fontFamily,
      fontSize: 54,
      letterSpacing: "0.02em",
    },
    {
      id: "kalam",
      name: "2. Kalam (Gaya Spidol/Kuas, Berkarakter & Artistik)",
      fontFamily: kalam.fontFamily,
      fontSize: 52,
      letterSpacing: "0.01em",
    },
    {
      id: "gaegu",
      name: "3. Gaegu (Gaya Doodle/Kartun, Imut & Santai)",
      fontFamily: gaegu.fontFamily,
      fontSize: 56,
      letterSpacing: "0.02em",
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      <Paper />
      <LineBoilFilter />

      {/* Konten Perbandingan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 70,
          padding: "60px 120px",
          zIndex: 10,
        }}
      >
        {/* Header Penjelasan */}
        <div style={{ textAlign: "center", marginBottom: -20 }}>
          <span
            style={{
              fontFamily: patrickHand.fontFamily,
              fontSize: 28,
              letterSpacing: "0.15em",
              color: mvConfig.ink.secondary,
              textTransform: "uppercase",
            }}
          >
            UJI FONT TULISAN TANGAN & LINE-BOIL (SUB-FASE 1)
          </span>
          <div
            style={{
              width: 80,
              height: 2,
              backgroundColor: mvConfig.ink.secondary,
              margin: "10px auto 0",
              opacity: 0.5,
            }}
          />
        </div>

        {/* 3 Kandidat Font */}
        {candidates.map((c, cIdx) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              width: "100%",
            }}
          >
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 18,
                fontWeight: 600,
                color: mvConfig.ink.secondary,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {c.name}
            </span>

            {/* Kalimat Sampel dengan Efek Goyang Line-Boil */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                columnGap: 16,
                rowGap: 8,
                filter: "url(#line-boil-filter)",
              }}
            >
              {words.map((w, wIdx) => {
                const boil = getLineBoilTransform(
                  frame,
                  `font-${cIdx}-word-${wIdx}`
                );
                return (
                  <span
                    key={wIdx}
                    style={{
                      fontFamily: c.fontFamily,
                      fontSize: c.fontSize,
                      color: mvConfig.ink.primary,
                      letterSpacing: c.letterSpacing,
                      transform: boil.transform,
                      display: "inline-block",
                      textShadow: "0 1px 1px rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

