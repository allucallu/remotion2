import React from "react";
import { Audio } from "remotion";
import { mvConfig } from "../config";

export const MV: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#0d0f14",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      {/* 1. Audio Trek Utama */}
      <Audio src={mvConfig.audioSrc} />

      {/* Kanvas Bersih untuk Suasana / Style MV Baru */}
      <div style={{ textAlign: "center", opacity: 0.8 }}>
        <h1 style={{ fontSize: 48, margin: 0, fontWeight: 700 }}>
          {mvConfig.title}
        </h1>
        <p style={{ fontSize: 24, margin: "16px 0 0 0", color: "#8c9ba5" }}>
          Ready for new MV visual style
        </p>
      </div>
    </div>
  );
};
