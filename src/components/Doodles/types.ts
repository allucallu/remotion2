import type { PaperMode } from "../PaperBackground";

export interface DoodleProps {
  /** Frame mulai animasi menggambar (default: 0) */
  start?: number;
  /** Override progres animasi menggambar manual 0..1 */
  progress?: number;
  /** Ukuran render SVG (px) */
  size?: number;
  /** Mode kertas (menyesuaikan tinta biru/grafit vs kapur putih) */
  mode?: PaperMode;
  /** Warna tinta kustom (opsional) */
  color?: string;
  /** Rotasi tambahan dalam derajat */
  rotate?: number;
}
