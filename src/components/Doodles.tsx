import React from "react";
import { mvConfig } from "../config";

export interface DoodleProps {
  /** Nilai progres menggambar 0 -> 1 (default: 1) */
  progress?: number;
  /** Ukuran lebar & tinggi kotak SVG (default: 48) */
  size?: number;
  /** Warna tinta sketsa (default: tinta navy-hitam) */
  color?: string;
  /** Ketebalan garis pensil (default: 2.5) */
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/**
 * 1. Doodle Bintang Sketsa (Star)
 */
export const Star: React.FC<DoodleProps> = ({
  progress = 1,
  size = 48,
  color = mvConfig.colors.pencilOrange,
  strokeWidth = 2.5,
  style,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", display: "inline-block", ...style }}
    >
      <path
        d="M 50 10 L 62 38 L 92 40 L 68 58 L 76 88 L 50 72 L 24 88 L 32 58 L 8 40 L 38 38 Z"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

/**
 * 2. Doodle Hati Sketsa (Heart)
 */
export const Heart: React.FC<DoodleProps> = ({
  progress = 1,
  size = 48,
  color = mvConfig.colors.pencilOrange,
  strokeWidth = 2.5,
  style,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", display: "inline-block", ...style }}
    >
      <path
        d="M 50 32 C 45 15, 20 15, 15 35 C 10 52, 28 68, 50 88 C 72 68, 90 52, 85 35 C 80 15, 55 15, 50 32 Z"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

/**
 * 3. Doodle Tanda Tanya (QuestionMark)
 */
export const QuestionMark: React.FC<DoodleProps> = ({
  progress = 1,
  size = 48,
  color = mvConfig.colors.inkDark,
  strokeWidth = 2.5,
  style,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const mainProgress = Math.min(1, p / 0.85);
  const dotProgress = Math.max(0, (p - 0.85) / 0.15);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", display: "inline-block", ...style }}
    >
      {/* Lengkungan tanda tanya */}
      <path
        d="M 32 36 C 30 18, 70 18, 68 38 C 66 52, 50 56, 50 70"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - mainProgress}
      />
      {/* Titik bawah */}
      {dotProgress > 0 && (
        <circle
          cx={50}
          cy={84}
          r={strokeWidth * 1.4}
          fill={color}
          opacity={dotProgress}
        />
      )}
    </svg>
  );
};

/**
 * 4. Doodle Not Musik (MusicNote)
 */
export const MusicNote: React.FC<DoodleProps> = ({
  progress = 1,
  size = 48,
  color = mvConfig.colors.inkDark,
  strokeWidth = 2.5,
  style,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", display: "inline-block", ...style }}
    >
      {/* Tangkai dan bendera not ganda */}
      <path
        d="M 35 70 L 35 25 L 75 15 L 75 60"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
      {/* Kepala not kiri */}
      <ellipse
        cx={26}
        cy={70}
        rx={12}
        ry={8}
        transform="rotate(-20 26 70)"
        fill={color}
        opacity={Math.min(1, p * 2)}
      />
      {/* Kepala not kanan */}
      <ellipse
        cx={66}
        cy={60}
        rx={12}
        ry={8}
        transform="rotate(-20 66 60)"
        fill={color}
        opacity={Math.min(1, Math.max(0, (p - 0.5) * 2))}
      />
    </svg>
  );
};

/**
 * 5. Doodle Garis Retakan (CrackLines) - untuk motif retakan hati / keraguan
 */
export const CrackLines: React.FC<DoodleProps> = ({
  progress = 1,
  size = 48,
  color = mvConfig.colors.inkDark,
  strokeWidth = 2.5,
  style,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", display: "inline-block", ...style }}
    >
      {/* Retakan utama */}
      <path
        d="M 50 10 L 44 32 L 56 45 L 42 62 L 54 75 L 48 95"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
      {/* Cabang retakan kiri */}
      <path
        d="M 44 32 L 28 40"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 1.2}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, (p - 0.3) / 0.7)}
      />
      {/* Cabang retakan kanan */}
      <path
        d="M 42 62 L 60 68"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 1.2}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, (p - 0.5) / 0.5)}
      />
    </svg>
  );
};

/**
 * 6. Doodle Kilau Berpendar (Sparkle)
 */
export const Sparkle: React.FC<DoodleProps> = ({
  progress = 1,
  size = 48,
  color = mvConfig.colors.blushYellow,
  strokeWidth = 2.5,
  style,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", display: "inline-block", ...style }}
    >
      {/* Garis vertikal & horizontal bintang 4 ujung */}
      <path
        d="M 50 15 Q 50 50, 15 50 Q 50 50, 50 85 Q 50 50, 85 50 Q 50 50, 50 15 Z"
        fill={color}
        stroke={mvConfig.colors.pencilOrange}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={p}
        transform={`scale(${p})`}
        style={{ transformOrigin: "50px 50px" }}
      />
    </svg>
  );
};

export type DoodleType =
  | "star"
  | "heart"
  | "question"
  | "note"
  | "crack"
  | "sparkle";

export interface GenericDoodleProps extends DoodleProps {
  type: DoodleType;
}

/**
 * Wrapper serbaguna Doodle yang dapat memilih jenis doodle via prop `type`
 */
export const Doodle: React.FC<GenericDoodleProps> = ({ type, ...props }) => {
  switch (type) {
    case "star":
      return <Star {...props} />;
    case "heart":
      return <Heart {...props} />;
    case "question":
      return <QuestionMark {...props} />;
    case "note":
      return <MusicNote {...props} />;
    case "crack":
      return <CrackLines {...props} />;
    case "sparkle":
      return <Sparkle {...props} />;
    default:
      return <Star {...props} />;
  }
};
