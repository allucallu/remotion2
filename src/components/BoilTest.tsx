import React from "react";
import { useCurrentFrame } from "remotion";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";
import { Paper } from "./Paper";
import { LineBoilFilter, getLineBoilTransform } from "./LineBoilFilter";
import { mvConfig } from "../config";

const patrickHand = loadPatrickHand("normal", {
  weights: ["400"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export const BoilTest: React.FC = () => {
  const frame = useCurrentFrame();

  const lineText = "Hidup makin sulit, dunia makin kejam";
  const words = lineText.split(" ");

  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      {/* 1. Latar Kertas Krem Hangat Bertekstur */}
      <Paper />

      {/* 2. Filter Goyang Tinta Sketsa */}
      <LineBoilFilter />

      {/* 3. Teks Lirik Tulisan Tangan Tunggal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          filter: "url(#line-boil-filter)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: 20,
            rowGap: 12,
          }}
        >
          {words.map((word, idx) => {
            const boil = getLineBoilTransform(frame, `boiltest-word-${idx}`);
            return (
              <span
                key={idx}
                style={{
                  fontFamily: patrickHand.fontFamily,
                  fontSize: 68,
                  fontWeight: 400,
                  color: mvConfig.ink.primary,
                  letterSpacing: "0.02em",
                  transform: boil.transform,
                  display: "inline-block",
                  textShadow: "0 1px 2px rgba(255, 255, 255, 0.4)",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Garis Sketsa Bawah Sederhana (Hand-drawn underline) */}
        <svg
          width={320}
          height={16}
          style={{
            marginTop: 24,
            overflow: "visible",
          }}
        >
          {(() => {
            const lineBoil = getLineBoilTransform(frame, "underline-sketch");
            return (
              <path
                d="M 10,8 Q 160,14 310,6"
                fill="none"
                stroke={mvConfig.ink.secondary}
                strokeWidth={2}
                strokeLinecap="round"
                transform={lineBoil.transform}
                opacity={0.65}
              />
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

