import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";
import { BOIL_FILTER_ID } from "./BoilFilter";

export type LetterTilesMode =
  | "hidden"
  | "shaking"
  | "struggle"
  | "glow"
  | "final";

export interface LetterTilesProps {
  /** Jumlah kotak yang terisi huruf (0 - 8) */
  filled: number;
  /** Mode perilaku visual sesuai alur cerita PRD Bagian 4.2 */
  mode: LetterTilesMode;
  /** Tema latar untuk penyesuaian kontras ('day' | 'night') */
  theme?: "day" | "night";
  style?: React.CSSProperties;
}

const TARGET_LETTERS = ["I", "L", "O", "V", "E", "Y", "O", "U"] as const;

export const LetterTiles: React.FC<LetterTilesProps> = ({
  filled,
  mode,
  theme = "day",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (mode === "hidden") {
    return null;
  }

  const clampedFilled = Math.max(0, Math.min(8, Math.round(filled)));
  const isNight = theme === "night" || mode === "glow";

  // Spring kemunculan barisan kotak
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });

  const containerOpacity = interpolate(entrance, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const containerY = interpolate(entrance, [0, 1], [-24, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: containerOpacity,
        transform: `translateY(${containerY}px)`,
        filter: `url(#${BOIL_FILTER_ID})`,
        pointerEvents: "none",
        ...style,
      }}
    >
      {TARGET_LETTERS.map((letter, idx) => {
        // Beri sedikit ruang pemisah visual antar kata: I (0) | L O V E (1..4) | Y O U (5..7)
        const isWordBreak = idx === 1 || idx === 5;

        // Apakah kotak ini terisi huruf
        const isTileFilled = mode === "final" ? true : idx < clampedFilled;

        // 1. Efek getar ('shaking' & 'struggle')
        const shakeAmp =
          mode === "shaking" ? 2.8 : mode === "struggle" ? 2.0 : 0.4;
        const shakeX =
          shakeAmp * Math.sin((frame * 0.65) + idx * 1.9);
        const shakeY =
          shakeAmp * Math.cos((frame * 0.55) + idx * 2.3);
        const shakeRot =
          (shakeAmp * 0.7) * Math.sin((frame * 0.45) + idx * 1.4);

        // 2. Efek tarik-ulur tulis-hapus ('struggle')
        // Siklus 75 frame (~2.5 detik): ditulis tipis -> ragu-ragu -> dicoret/terhapus
        const struggleCycle = (frame + idx * 11) % 75;
        const struggleWriteProgress = interpolate(
          struggleCycle,
          [0, 22, 48, 65, 74],
          [0, 1, 1, 0.15, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const struggleEraseStrike = interpolate(
          struggleCycle,
          [40, 55, 70],
          [0, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // 3. Efek glow malam ('glow')
        const glowPulse =
          mode === "glow"
            ? 0.65 + 0.35 * Math.sin((frame * 2 * Math.PI) / 70 + idx * 0.5)
            : 0;

        // 4. Efek final: pop spring per huruf + tetesan tinta kecil
        const finalDelay = idx * 4;
        const finalSpring = spring({
          frame: Math.max(0, frame - finalDelay),
          fps,
          config: { damping: 12, stiffness: 140 },
        });
        const finalScale =
          mode === "final"
            ? interpolate(finalSpring, [0, 0.6, 1], [0.85, 1.08, 1])
            : 1;
        const dripLength =
          mode === "final"
            ? interpolate(finalSpring, [0.3, 1], [0, 8 + (idx % 3) * 4], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;

        // Warna bingkai & latar kotak
        const borderColor =
          mode === "glow"
            ? mvConfig.colors.glowNight
            : mode === "final"
            ? mvConfig.colors.inkDark
            : isNight
            ? mvConfig.colors.chalkNight
            : mvConfig.colors.inkDark;

        const tileBg =
          mode === "glow"
            ? "rgba(31, 35, 64, 0.75)"
            : mode === "final"
            ? mvConfig.colors.paper
            : isNight
            ? "rgba(31, 35, 64, 0.55)"
            : "rgba(255, 247, 227, 0.9)";

        const boxShadow =
          mode === "glow"
            ? `0 0 ${14 + glowPulse * 12}px rgba(255, 182, 92, ${
                0.35 + glowPulse * 0.35
              }), inset 0 0 8px rgba(255, 182, 92, 0.2)`
            : mode === "final"
            ? `3px 4px 0px ${mvConfig.colors.pencilOrange}`
            : `2px 3px 0px rgba(27, 26, 46, 0.18)`;

        // Warna & opasitas huruf di dalam kotak
        const letterColor =
          mode === "struggle"
            ? mvConfig.colors.pencilOrange
            : mode === "glow"
            ? mvConfig.colors.glowNight
            : isNight
            ? mvConfig.colors.chalkNight
            : mvConfig.colors.inkDark;

        const letterOpacity = !isTileFilled
          ? 0
          : mode === "struggle"
          ? struggleWriteProgress * 0.75
          : mode === "glow"
          ? 0.55 + glowPulse * 0.4
          : 1;

        return (
          <div
            key={idx}
            style={{
              position: "relative",
              marginLeft: isWordBreak ? 16 : 0,
              width: 64,
              height: 74,
              borderRadius: 10,
              backgroundColor: tileBg,
              border: `2.5px solid ${borderColor}`,
              boxShadow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate(${shakeX}px, ${shakeY}px) rotate(${shakeRot}deg) scale(${finalScale})`,
              boxSizing: "border-box",
            }}
          >
            {/* Aksen stabilo kuning hangat pada mode final */}
            {mode === "final" && (
              <div
                style={{
                  position: "absolute",
                  inset: 6,
                  backgroundColor: mvConfig.colors.blushYellow,
                  opacity: 0.28,
                  borderRadius: 6,
                }}
              />
            )}

            {/* Huruf Tulisan Tangan */}
            {isTileFilled && (
              <span
                style={{
                  fontFamily: mvConfig.fonts.primary,
                  fontSize: 46,
                  fontWeight: 700,
                  color: letterColor,
                  opacity: letterOpacity,
                  lineHeight: 1,
                  userSelect: "none",
                  transform:
                    mode === "struggle"
                      ? `scale(${0.9 + 0.1 * struggleWriteProgress})`
                      : "none",
                }}
              >
                {letter}
              </span>
            )}

            {/* Coretan hapus pensil pada mode 'struggle' */}
            {mode === "struggle" && isTileFilled && struggleEraseStrike > 0.05 && (
              <svg
                width="54"
                height="54"
                viewBox="0 0 54 54"
                style={{
                  position: "absolute",
                  top: 10,
                  left: 5,
                  pointerEvents: "none",
                }}
              >
                <path
                  d="M 6 44 L 48 10 M 10 14 L 44 42"
                  fill="none"
                  stroke={mvConfig.colors.pencilOrange}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  opacity={struggleEraseStrike * 0.85}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - struggleEraseStrike}
                />
              </svg>
            )}

            {/* Efek tinta menetes kecil pada mode 'final' */}
            {mode === "final" && dripLength > 0.5 && (
              <svg
                width="20"
                height="24"
                viewBox="0 0 20 24"
                style={{
                  position: "absolute",
                  bottom: -18,
                  right: 10 + (idx % 3) * 6,
                  overflow: "visible",
                  pointerEvents: "none",
                }}
              >
                {/* Aliran tetesan dari bingkai bawah */}
                <path
                  d={`M 10 0 L 10 ${dripLength}`}
                  stroke={mvConfig.colors.inkDark}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                />
                {/* Bulir tetes tinta di ujung */}
                <circle
                  cx={10}
                  cy={dripLength + 4}
                  r={2.6}
                  fill={mvConfig.colors.inkDark}
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};
