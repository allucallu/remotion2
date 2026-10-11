import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const editorialLowerThirdSchema = z.object({
  accentColor: z.string(),
  scale: z.number().min(0.6).max(1.25),
  position: z.object({ x: z.number(), y: z.number() }),
});

export type EditorialLowerThirdProps = z.infer<
  typeof editorialLowerThirdSchema
>;
export type EditorialVariant =
  | "violet"
  | "lime"
  | "copper"
  | "cobalt"
  | "cyan"
  | "coral"
  | "gold"
  | "sage"
  | "sky"
  | "azure";

export const FPS = 30;
export const DURATION_IN_FRAMES = 300;

const COLORS = {
  cream: "#F7F2E7",
  ink: "#202225",
  inkLight: "#34373B",
  violet: "#74549B",
  lime: "#A6D63B",
  copper: "#D18452",
  cobalt: "#315EDB",
  cyan: "#61B6BE",
  coral: "#F27765",
  gold: "#E9B33F",
  sage: "#77986B",
  sky: "#6BA9D1",
  azure: "#59A9DA",
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const incoming = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing: out });
const outgoing = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });

const Marker = ({
  variant,
  accent,
}: {
  variant: EditorialVariant;
  accent: string;
}) => {
  if (variant === "violet")
    return (
      <>
        <path d="M1250 213h42l-27 78h-42z" fill={accent} />
        <path d="M1305 213h42l-27 78h-42z" fill={accent} />
      </>
    );
  if (variant === "lime")
    return (
      <>
        <path d="M1280 45h36l-32 120h-36z" fill={accent} />
        <path d="M1323 45h25l-32 120h-25z" fill={COLORS.inkLight} />
      </>
    );
  if (variant === "copper")
    return (
      <>
        <path d="M1320 213h88" stroke={accent} strokeWidth="6" />
        <path d="M1308 234h72" stroke={accent} strokeWidth="6" />
        <path d="M1296 255h60" stroke={accent} strokeWidth="6" />
      </>
    );
  if (variant === "cobalt")
    return (
      <>
        <path d="M1235 245h42l-12 24h-42z" fill={accent} />
        <path d="M1288 245h42l-12 24h-42z" fill={accent} />
      </>
    );
  if (variant === "cyan")
    return (
      <>
        <path d="M1160 202h62l-78 82h-62z" fill={accent} />
        <path d="M1000 262h34l-22 28h-34z" fill={accent} />
        <path d="M1045 262h34l-22 28h-34z" fill={accent} />
      </>
    );
  if (variant === "coral")
    return (
      <>
        <path d="M1190 64h45l-62 112h-45z" fill={accent} />
        <path d="M1248 64h45l-62 112h-45z" fill={accent} />
      </>
    );
  if (variant === "gold")
    return (
      <>
        <path d="M1178 42h50l-77 143h-50z" fill={accent} />
        <path d="M1240 42h50l-77 143h-50z" fill={accent} />
      </>
    );
  if (variant === "sage")
    return (
      <>
        <path d="M1175 83h34l-27 96h-34z" fill={accent} />
        <path d="M1218 83h34l-27 96h-34z" fill={accent} />
      </>
    );
  if (variant === "sky")
    return (
      <>
        <path d="M1192 80h43l-48 110h-43z" fill={accent} />
        <path d="M1255 45h135" stroke={accent} strokeWidth="7" />
      </>
    );
  return (
    <>
      <path d="M1160 68h105v28h-105z" fill={accent} />
      <path d="M1160 110h95v28h-95z" fill={accent} />
      <path d="M1160 152h85v28h-85z" fill={accent} />
    </>
  );
};

const StaticArtwork = ({
  variant,
  accent,
}: {
  variant: EditorialVariant;
  accent: string;
}) => {
  if (variant === "violet")
    return (
      <>
        <path
          d="M40 48H1225L1162 198H40z"
          fill={COLORS.ink}
          transform="translate(14 15)"
        />
        <path d="M40 32H1180l68 68v104H40z" fill={COLORS.cream} />
        <path d="M62 52H1171l55 56v76H62z" fill={accent} />
        <path
          d="M67 205h680l48 70H67z"
          fill={COLORS.ink}
          transform="translate(0 12)"
        />
        <path d="M67 205h650l48 58H67z" fill={COLORS.cream} />
        <path d="M765 205h430l-45 82H820z" fill={COLORS.inkLight} />
      </>
    );
  if (variant === "lime")
    return (
      <>
        <path
          d="M90 42h1110l-50 160H35z"
          fill={COLORS.inkLight}
          transform="translate(12 14)"
        />
        <path d="M90 32h410l22 27H72z" fill={accent} />
        <path
          d="M70 58h930l20 20h180l-46 126H25z"
          fill={COLORS.ink}
          stroke={COLORS.cream}
          strokeWidth="7"
        />
        <path
          d="M430 204h735l-30 76H470z"
          fill={COLORS.ink}
          transform="translate(8 10)"
        />
        <path d="M430 204h710l-25 64H470z" fill={COLORS.cream} />
      </>
    );
  if (variant === "copper")
    return (
      <>
        <path
          d="M80 65h1120l45 44v115H120l-60-56z"
          fill={COLORS.ink}
          transform="translate(-8 12)"
        />
        <path d="M25 94h155v66H62z" fill={accent} />
        <path d="M150 55h1040l50 48v122H210l-60-55z" fill={COLORS.cream} />
        <path
          d="M135 40v160M135 40h120M135 200h62M1190 40h55v150"
          fill="none"
          stroke={accent}
          strokeWidth="5"
        />
        <path
          d="M650 204h590l-48 76H602z"
          fill={COLORS.inkLight}
          stroke={accent}
          strokeWidth="5"
        />
      </>
    );
  if (variant === "cobalt")
    return (
      <>
        <path d="M92 39h330l-17 31H76z" fill={accent} />
        <path d="M50 64h1120v144H25z" fill={COLORS.cream} />
        <path d="M42 64h54L58 208H18z" fill={accent} />
        <path d="M1170 93h75l-35 115h-40z" fill={accent} />
        <path d="M180 216h970l-18 70H158z" fill={COLORS.inkLight} />
        <path
          d="M10 142H0v150h1010"
          fill="none"
          stroke={accent}
          strokeWidth="7"
        />
      </>
    );
  if (variant === "cyan")
    return (
      <>
        <path
          d="M76 44h1125v145l-88 82H50V96z"
          fill={COLORS.inkLight}
          transform="translate(12 12)"
        />
        <path
          d="M76 38h850l20 20h190l45 45v92l-88 70H52V96z"
          fill={COLORS.ink}
          stroke={COLORS.cream}
          strokeWidth="7"
        />
        <path d="M140 38h760l16 14H152z" fill={accent} />
        <path d="M60 266h950l-48 58H105z" fill={COLORS.cream} />
      </>
    );
  if (variant === "coral")
    return (
      <>
        <path d="M860 18h320l50 52-100 160H760z" fill={COLORS.inkLight} />
        <path d="M50 45h1080l38 42-82 142H50z" fill={accent} />
        <path d="M84 232h650l-40 70H84z" fill={COLORS.cream} />
        <path
          d="M22 92v145h58v43h780"
          fill="none"
          stroke={COLORS.cream}
          strokeWidth="7"
        />
      </>
    );
  if (variant === "gold")
    return (
      <>
        <path
          d="M60 34h1130l-82 160H20V88z"
          fill={COLORS.ink}
          stroke={COLORS.cream}
          strokeWidth="7"
        />
        <path
          d="M18 174h650l18 18h430"
          fill="none"
          stroke={accent}
          strokeWidth="14"
        />
        <path d="M20 192h520l-44 82H20z" fill={COLORS.cream} />
      </>
    );
  if (variant === "sage")
    return (
      <>
        <path d="M180 20h880l42 18h105l38 48-30 94H170z" fill={accent} />
        <path
          d="M45 28h105l30 32h1015l-48 144H45z"
          fill={COLORS.ink}
          stroke={COLORS.cream}
          strokeWidth="7"
        />
        <path d="M390 206h760l-38 76H420z" fill={COLORS.cream} />
      </>
    );
  if (variant === "sky")
    return (
      <>
        <path
          d="M105 26h245l22 20h820v152l-56 75H130L95 238z"
          fill={COLORS.inkLight}
        />
        <path d="M45 45h1080l55 54v90l-58 58H45z" fill={COLORS.cream} />
        <path d="M45 45h105l-72 202H45z" fill={accent} />
        <path
          d="M655 250h520l-42 78H655z"
          fill={COLORS.inkLight}
          stroke={accent}
          strokeWidth="7"
        />
      </>
    );
  return (
    <>
      <path d="M95 30h930l55 52v132l-55 50H35z" fill={COLORS.cream} />
      <path d="M35 30h55L28 218H0z" fill={accent} />
      <path d="M60 220h500l-42 82H18z" fill={COLORS.inkLight} />
      <path
        d="M545 264h575l55-58"
        fill="none"
        stroke={accent}
        strokeWidth="14"
      />
    </>
  );
};

export const EditorialLowerThird = ({
  variant,
  accentColor,
  scale,
  position,
}: EditorialLowerThirdProps & { variant: EditorialVariant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mainIn = incoming(frame, 0.4 * fps, 1 * fps);
  const mainOut = outgoing(frame, 8.55 * fps, 9.2 * fps);
  const secondaryIn = incoming(frame, 0.85 * fps, 1.3 * fps);
  const secondaryOut = outgoing(frame, 8.2 * fps, 8.7 * fps);
  const mainReveal = Math.min(mainIn, mainOut);
  const secondaryReveal = Math.min(secondaryIn, secondaryOut);
  const accent = accentColor;

  return (
    <AbsoluteFill>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
      >
        <defs>
          <clipPath id={`${variant}-main`}>
            <rect x="0" y="0" width={1420 * mainReveal} height="330" />
          </clipPath>
          <clipPath id={`${variant}-secondary`}>
            <rect x="0" y="196" width={1420 * secondaryReveal} height="130" />
          </clipPath>
        </defs>
        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g clipPath={`url(#${variant}-main)`}>
            <StaticArtwork variant={variant} accent={accent} />
            <Marker variant={variant} accent={accent} />
          </g>
          <g clipPath={`url(#${variant}-secondary)`}>
            <StaticArtwork variant={variant} accent={accent} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const defaultAccent: Record<EditorialVariant, string> = {
  violet: COLORS.violet,
  lime: COLORS.lime,
  copper: COLORS.copper,
  cobalt: COLORS.cobalt,
  cyan: COLORS.cyan,
  coral: COLORS.coral,
  gold: COLORS.gold,
  sage: COLORS.sage,
  sky: COLORS.sky,
  azure: COLORS.azure,
};
