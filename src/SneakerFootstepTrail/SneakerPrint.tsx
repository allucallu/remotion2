export type SneakerSide = "left" | "right";

const COLOR = "#F2EFE9";
const SOLE =
  "M 63 8 C 87 4 105 17 108 43 C 113 75 103 107 92 133 C 82 157 77 176 82 198 C 87 220 94 238 90 259 C 87 281 72 292 52 290 C 31 289 20 274 20 253 C 20 230 23 211 22 187 C 20 162 12 136 9 109 C 5 80 7 54 19 33 C 29 16 45 10 63 8 Z";

export const SneakerPrint = ({
  side,
  maskId,
}: {
  side: SneakerSide;
  maskId: string;
}) => {
  const transform =
    side === "right" ? "translate(120 0) scale(-1 1)" : undefined;
  const treadMaskId = `sneaker-tread-${maskId}`;

  return (
    <svg
      viewBox="0 0 120 300"
      width="100%"
      height="100%"
      aria-hidden="true"
      shapeRendering="geometricPrecision"
    >
      <g transform={transform}>
        <defs>
          <mask
            id={treadMaskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="120"
            height="300"
          >
            <path d={SOLE} fill="white" />
            <g
              fill="none"
              stroke="black"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M32 21 C21 48 20 77 24 105 C28 132 36 153 37 181 C39 210 32 237 36 261 C39 275 49 280 61 277" />
              <path d="M11 46 L48 57 L108 38 M8 70 L48 81 L109 62 M9 95 L48 105 L102 88 M14 120 L49 129 L95 114 M22 145 L49 153 L84 138" />
              <path d="M48 34 C46 77 47 116 50 149" />
              <path d="M38 174 L77 167 M38 192 L78 185" />
              <path d="M28 226 L55 237 L87 220 M25 248 L54 260 L92 242 M31 272 L55 281 L85 265" />
            </g>
          </mask>
        </defs>
        <path d={SOLE} fill={COLOR} mask={`url(#${treadMaskId})`} />
      </g>
    </svg>
  );
};
