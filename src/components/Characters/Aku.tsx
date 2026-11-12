import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../../config";
import { HAND_FILTER_ID } from "../HandFilter";
import type { PaperMode } from "../PaperBackground";

export type AkuExpression =
  | "neutral"
  | "smile"
  | "confused"
  | "shy"
  | "happy"
  | "sleepy";

export type AkuPose =
  | "standing"
  | "holdingGuitar"
  | "holdingPhone"
  | "sitting";

interface AkuProps {
  /** Ekspresi wajah doodle */
  expression?: AkuExpression;
  /** Pose tubuh doodle */
  pose?: AkuPose;
  /** Skala ukuran karakter */
  scale?: number;
  /** Mode kertas (menyesuaikan warna outline tinta biru vs kapur malam) */
  mode?: PaperMode;
  /** Putar menghadap kiri/kanan */
  flipX?: boolean;
}

/**
 * Karakter doodle utama "Aku" (si pengagum diam-diam):
 * Kepala bulat, rambut acak-acakan, memakai hoodie, dengan animasi idle kedip & goyang 90 BPM.
 */
export const Aku: React.FC<AkuProps> = ({
  expression = "smile",
  pose = "standing",
  scale = 1,
  mode = "day",
  flipX = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isNight = mode === "night";
  const outline = isNight
    ? mvConfig.palette.nightChalk
    : mvConfig.palette.graphite;
  const penAccent = isNight
    ? mvConfig.palette.mint
    : mvConfig.palette.penBlue;

  const skinFill = isNight ? "#2a355c" : "#FFFFFF";
  const hoodieFill = isNight
    ? "rgba(154, 219, 197, 0.25)"
    : "rgba(188, 211, 232, 0.45)";

  // Animasi idle: Goyang halus mengikuti tempo lagu ±90 BPM (1.5 ketuk per detik)
  const beatCycle = (frame / ((fps * 60) / 90)) * Math.PI;
  const swayDeg = Math.sin(beatCycle * 0.5) * 2.2;
  const bobY = Math.sin(beatCycle) * 3;

  // Kedip mata alami tiap ~3 detik (90 frame), menutup selama 4 frame
  const blinkMod = frame % 90;
  const isBlinking = blinkMod >= 84 && blinkMod <= 87;

  const renderFace = () => {
    const headTilt = expression === "confused" ? -6 : 0;

    return (
      <g transform={`rotate(${headTilt} 100 68)`}>
        {/* Pipi Blush untuk shy & happy */}
        {(expression === "shy" || expression === "happy") && (
          <g fill={mvConfig.palette.highlighterPink} opacity={0.6}>
            <ellipse cx="78" cy="78" rx="7" ry="4" />
            <ellipse cx="122" cy="78" rx="7" ry="4" />
          </g>
        )}

        {/* Alis */}
        {expression === "confused" ? (
          <g stroke={outline} strokeWidth={2.5} strokeLinecap="round" fill="none">
            <path d="M 80 54 Q 86 48 92 53" />
            <path d="M 108 56 Q 114 57 120 55" />
          </g>
        ) : expression === "shy" ? (
          <g stroke={outline} strokeWidth={2.2} strokeLinecap="round" fill="none">
            <path d="M 81 55 Q 86 52 91 55" />
            <path d="M 109 55 Q 114 52 119 55" />
          </g>
        ) : expression === "sleepy" ? (
          <g stroke={outline} strokeWidth={2.2} strokeLinecap="round" fill="none">
            <path d="M 80 57 L 92 59" />
            <path d="M 108 59 L 120 57" />
          </g>
        ) : (
          <g stroke={outline} strokeWidth={2.3} strokeLinecap="round" fill="none">
            <path d="M 81 55 Q 86 51 91 55" />
            <path d="M 109 55 Q 114 51 119 55" />
          </g>
        )}

        {/* Mata */}
        {isBlinking || expression === "sleepy" ? (
          <g stroke={outline} strokeWidth={2.8} strokeLinecap="round" fill="none">
            <path d="M 81 68 Q 86 71 91 68" />
            <path d="M 109 68 Q 114 71 119 68" />
          </g>
        ) : expression === "happy" ? (
          <g stroke={outline} strokeWidth={3} strokeLinecap="round" fill="none">
            <path d="M 80 70 Q 86 61 92 70" />
            <path d="M 108 70 Q 114 61 120 70" />
          </g>
        ) : (
          <g fill={outline}>
            <circle cx={expression === "shy" ? 88 : 86} cy="68" r="3.6" />
            <circle cx={expression === "shy" ? 116 : 114} cy="68" r="3.6" />
          </g>
        )}

        {/* Mulut */}
        {expression === "neutral" && (
          <path
            d="M 94 84 Q 100 84 106 84"
            stroke={outline}
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {(expression === "smile" || expression === "shy") && (
          <path
            d="M 91 81 Q 100 90 109 81"
            stroke={outline}
            strokeWidth={2.8}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {expression === "happy" && (
          <path
            d="M 88 80 Q 100 94 112 80 Z"
            fill={mvConfig.palette.highlighterPink}
            stroke={outline}
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
        )}
        {expression === "confused" && (
          <path
            d="M 91 85 Q 96 81 100 85 T 109 85"
            stroke={outline}
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {expression === "sleepy" && (
          <circle
            cx="100"
            cy="84"
            r="3.5"
            fill="none"
            stroke={outline}
            strokeWidth={2.4}
          />
        )}
      </g>
    );
  };

  return (
    <svg
      width={220 * scale}
      height={280 * scale}
      viewBox="0 0 200 250"
      style={{
        overflow: "visible",
        transform: `scaleX(${flipX ? -1 : 1}) translateY(${bobY}px) rotate(${swayDeg}deg)`,
        transformOrigin: "center bottom",
        filter: `url(#${HAND_FILTER_ID})`,
      }}
    >
      {/* Bayangan Alas Kaki / Duduk */}
      <ellipse
        cx="100"
        cy={pose === "sitting" ? 215 : 235}
        rx="45"
        ry="8"
        fill={isNight ? "rgba(0,0,0,0.35)" : "rgba(43, 74, 139, 0.12)"}
      />

      {/* Kaki */}
      {pose === "sitting" ? (
        <g stroke={outline} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Kaki ditekuk santai */}
          <path d="M 78 180 L 65 210 L 88 212" />
          <path d="M 118 180 L 138 208 L 116 212" />
        </g>
      ) : (
        <g stroke={outline} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Kaki berdiri */}
          <path d="M 85 185 L 85 228 L 76 230" />
          <path d="M 115 185 L 115 228 L 125 230" />
        </g>
      )}

      {/* Badan Hoodie */}
      <path
        d={
          pose === "sitting"
            ? "M 65 112 C 62 140, 62 178, 70 185 L 130 185 C 138 178, 138 140, 135 112 C 122 104, 78 104, 65 112 Z"
            : "M 64 110 C 60 140, 60 178, 66 188 L 134 188 C 140 178, 140 140, 136 110 C 122 102, 78 102, 64 110 Z"
        }
        fill={hoodieFill}
        stroke={outline}
        strokeWidth={3.8}
        strokeLinejoin="round"
      />

      {/* Kerah Hoodie & Tali Hoodie */}
      <path
        d="M 76 108 Q 100 122 124 108"
        fill="none"
        stroke={outline}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M 93 116 L 91 138 M 107 116 L 109 138"
        fill="none"
        stroke={penAccent}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Kantong Depan Hoodie */}
      {pose !== "holdingGuitar" && (
        <path
          d="M 80 156 L 120 156 L 124 176 L 76 176 Z"
          fill="none"
          stroke={outline}
          strokeWidth={2.2}
          strokeLinejoin="round"
          opacity={0.6}
        />
      )}

      {/* Kepala Bulat */}
      <circle
        cx="100"
        cy="68"
        r="36"
        fill={skinFill}
        stroke={outline}
        strokeWidth={3.8}
      />

      {/* Rambut Acak-acakan Doodle */}
      <path
        d="M 65 62 C 60 40, 80 22, 102 24 C 122 22, 140 38, 135 60 C 130 46, 122 42, 115 48 C 110 38, 98 38, 92 48 C 85 40, 72 44, 65 62 Z"
        fill={outline}
        stroke={outline}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {/* Helai rambut mencuat lucu */}
      <path
        d="M 98 25 C 95 14, 108 10, 112 22"
        fill="none"
        stroke={outline}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Wajah & Ekspresi */}
      {renderFace()}

      {/* Lengan & Aksesori Berdasarkan Pose */}
      {pose === "standing" && (
        <g stroke={outline} strokeWidth={3.5} strokeLinecap="round" fill="none">
          <path d="M 64 115 C 52 135, 58 158, 72 162" />
          <path d="M 136 115 C 148 135, 142 158, 128 162" />
        </g>
      )}

      {pose === "sitting" && (
        <g stroke={outline} strokeWidth={3.5} strokeLinecap="round" fill="none">
          <path d="M 66 116 C 54 140, 62 165, 82 172" />
          <path d="M 134 116 C 146 140, 138 165, 118 172" />
        </g>
      )}

      {pose === "holdingPhone" && (
        <g>
          {/* Tangan kiri di saku */}
          <path
            d="M 64 115 C 52 135, 58 158, 72 162"
            stroke={outline}
            strokeWidth={3.5}
            strokeLinecap="round"
            fill="none"
          />
          {/* Tangan kanan memegang HP */}
          <path
            d="M 136 115 C 154 130, 160 112, 152 96"
            stroke={outline}
            strokeWidth={3.5}
            strokeLinecap="round"
            fill="none"
          />
          {/* Doodle HP kecil di tangan */}
          <rect
            x="144"
            y="72"
            width="22"
            height="36"
            rx="4"
            transform="rotate(10 155 90)"
            fill={isNight ? "#ffe66d" : "#FFFFFF"}
            stroke={outline}
            strokeWidth={2.5}
          />
          <circle cx="155" cy="88" r="5" fill={mvConfig.palette.highlighterPink} opacity={0.7} />
        </g>
      )}

      {pose === "holdingGuitar" && (
        <g>
          {/* Gitar Akustik Miring di Pangkuan/Dada */}
          <g transform="translate(105, 148) rotate(-25)">
            <path
              d="M -28 -25 C -38 -25, -42 -10, -32 0 C -45 12, -45 36, -24 44 C -10 50, 10 50, 24 44 C 45 36, 45 12, 32 0 C 42 -10, 38 -25, 28 -25 Z"
              fill={isNight ? "#4b3b2b" : "#F3D39C"}
              stroke={outline}
              strokeWidth={3}
            />
            <circle cx="0" cy="14" r="9" fill={isNight ? "#1C2442" : "#33363D"} />
            {/* Neck Gitar */}
            <rect
              x="-5"
              y="-75"
              width="10"
              height="52"
              fill={isNight ? "#634c35" : "#D6A86E"}
              stroke={outline}
              strokeWidth={2.5}
            />
          </g>
          {/* Tangan Memetik Gitar */}
          <path
            d="M 65 116 C 50 135, 65 155, 92 152"
            stroke={outline}
            strokeWidth={3.5}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 135 116 C 145 130, 130 148, 118 145"
            stroke={outline}
            strokeWidth={3.5}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}
    </svg>
  );
};

