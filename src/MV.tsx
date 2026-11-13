import React from "react";
import { useVideoConfig } from "remotion";
import { mvConfig } from "./config";

export const MV: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 56,
          fontWeight: 700,
          margin: "0 0 16px 0",
          letterSpacing: "-0.02em",
        }}
      >
        {mvConfig.title}
      </h1>
      <p
        style={{
          fontSize: 24,
          color: "#8b949e",
          margin: 0,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Siap untuk MV Baru
      </p>
    </div>
  );
};
