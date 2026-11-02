import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Five blank painted caption backgrounds, sequential in ONE composition.
 * Register: 3840 x 2160, 30 fps, 1110 frames (37 s). No registry included.
 * Cut at seconds 7, 14, 22, 29. Each design paints in, holds, then wipes out.
 * All five entrances are enabled. First frame is empty by default.
 * firstBrushVisibleAtStart=true is available ONLY for a filled first thumbnail.
 * Bristle-shaped moving fronts reveal authored paint contours, not rectangles.
 * Texture stays at the edges; the middle remains solid for editor-added text.
 * No text, hands, brush objects, logos, glow, fonts, or external assets.
 * Entirely deterministic SVG driven by the Remotion frame.
 */
export type BrushCaptionFivePackProps = {
  background?: 'black' | 'green' | 'transparent';
  primaryColor?: string;
  secondaryColor?: string;
  firstBrushVisibleAtStart?: boolean;
  /** Position in the 1920 x 1080 design coordinate system. */
  x?: number;
  y?: number;
  scale?: number;
};
export const BrushCaptionFivePackConfig = {
  id: 'BrushCaptionFivePack', width: 3840, height: 2160, fps: 30, durationInFrames: 1110,
} as const;
export const BrushCaptionFivePackSegments = [
  {name: 'Dry Bristle', startSeconds: 0, endSeconds: 7, color: '#F1DFC0', edge: '#CAB28E'},
  {name: 'Thick Paint', startSeconds: 7, endSeconds: 14, color: '#D89577', edge: '#A96953'},
  {name: 'Double Swipe', startSeconds: 14, endSeconds: 22, color: '#92B7C1', edge: '#466E80'},
  {name: 'Ink Ribbon', startSeconds: 22, endSeconds: 29, color: '#E8C65C', edge: '#B89739'},
  {name: 'Arc Sweep', startSeconds: 29, endSeconds: 37, color: '#A4B69B', edge: '#6F8E73'},
] as const;

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const phase = (t: number, a: number, b: number) => {
  const x = clamp((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

// A broad tuft with unequal bristle tips; only the moving paint edge is jagged.
const gate = (progress: number) => {
  const x = -660 + 1320 * clamp(progress);
  return `M -720 -220 H ${x - 8} V -140 L ${x + 5} -114 L ${x - 3} -93 L ${x + 17} -73 L ${x + 8} -48 L ${x + 27} -24 L ${x + 13} 1 L ${x + 23} 23 L ${x + 5} 47 L ${x + 15} 70 L ${x - 2} 93 L ${x + 8} 120 L ${x - 8} 146 V 220 H -720 Z`;
};
type PaintLayerProps = {
  id: string; draw: number; erase: number; reverse?: boolean;
  eraseFromRight?: boolean; children: React.ReactNode;
};
const PaintLayer: React.FC<PaintLayerProps> = ({id, draw, erase, reverse = false,
  eraseFromRight = false, children}) => <g opacity={draw <= 0 || erase >= 1 ? 0 : 1}>
  <defs>
    <clipPath id={`${id}-in`} clipPathUnits="userSpaceOnUse">
      <path d={gate(draw)} transform={reverse ? 'scale(-1 1)' : undefined} />
    </clipPath>
    <clipPath id={`${id}-out`} clipPathUnits="userSpaceOnUse">
      <path d={gate(1 - erase)} transform={eraseFromRight ? undefined : 'scale(-1 1)'} />
    </clipPath>
  </defs>
  <g clipPath={`url(#${id}-in)`}><g clipPath={`url(#${id}-out)`}>{children}</g></g>
</g>;

type BrushProps = {t: number; duration: number; first: boolean; color: string; edge: string; id: string};

const DryBristle: React.FC<BrushProps> = ({t, duration, first, color, edge, id}) => {
  const draw = first ? 1 : phase(t, 0.03, 1.02);
  const erase = phase(t, duration - 1.12, duration - 0.28);
  return <PaintLayer id={id} draw={draw} erase={erase} eraseFromRight>
    <path d="M -576 -38 L -560 -56 L -572 -60 L -539 -73 L -505 -70 L -471 -78 C -277 -69 -102 -84 75 -75 C 246 -82 405 -73 516 -71 L 560 -59 L 545 -48 L 582 -43 L 557 -27 L 575 -13 L 563 7 L 587 19 L 561 30 L 575 44 L 542 49 L 552 63 L 511 72 C 334 80 171 72 7 80 C -159 73 -338 84 -488 73 L -537 69 L -562 58 L -546 46 L -579 38 L -559 21 L -580 5 L -565 -10 L -585 -19 Z" fill={color} />
    <g fill="none" stroke={edge} strokeLinecap="round" opacity={0.52}>
      <path d="M -514 -62 C -319 -57 -170 -68 -41 -63 M 82 -64 C 268 -69 382 -60 502 -60" strokeWidth={2} />
      <path d="M -478 62 C -286 68 -125 59 54 67 M 185 65 C 306 69 418 62 505 63" strokeWidth={2.4} />
      <path d="M -565 -33 L -485 -40 M -568 33 L -483 40 M 488 -43 L 554 -38 M 497 43 L 559 37" strokeWidth={2} />
    </g>
    <g fill="none" stroke={color} strokeLinecap="round">
      <path d="M -552 -82 L -457 -85 M -539 83 L -433 87 M 425 -82 L 548 -78 M 474 82 L 566 74" strokeWidth={3} />
      <path d="M -592 -28 L -574 -32 M -588 48 L -566 51 M 569 -58 L 588 -54" strokeWidth={1.8} />
    </g>
  </PaintLayer>;
};

const ThickPaint: React.FC<BrushProps> = ({t, duration, first, color, edge, id}) => {
  const draw = first ? 1 : phase(t, 0.02, 0.91);
  const erase = phase(t, duration - 1.15, duration - 0.3);
  return <PaintLayer id={id} draw={draw} erase={erase}>
    <path d="M -553 -44 C -575 -73 -539 -99 -494 -94 C -302 -104 -98 -95 110 -100 C 296 -98 436 -107 517 -89 C 552 -95 581 -70 563 -45 C 585 -24 566 -8 576 12 C 568 26 584 52 559 63 C 553 88 528 92 495 90 C 273 100 57 87 -131 96 C -302 94 -471 105 -531 83 C -564 81 -577 55 -561 31 C -579 4 -562 -18 -553 -44 Z" fill={color} />
    <path d="M -532 -72 C -328 -87 -145 -77 58 -84 C 244 -81 414 -91 511 -75" fill="none" stroke={edge} strokeWidth={7} strokeLinecap="round" opacity={0.35} />
    <path d="M -512 78 C -289 90 -73 72 132 82 C 302 78 431 89 526 73" fill="none" stroke={edge} strokeWidth={6} strokeLinecap="round" opacity={0.48} />
    <path d="M -510 -87 C -267 -96 -78 -87 78 -94 M 287 -93 Q 434 -98 509 -86" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M -547 -52 Q -554 -10 -545 24 M 550 -33 Q 555 6 547 37" stroke={edge} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.48} />
  </PaintLayer>;
};

const DoubleSwipe: React.FC<BrushProps> = ({t, duration, first, color, edge, id}) => {
  const back = first ? 1 : phase(t, 0.02, 0.76);
  const front = first ? 1 : phase(t, 0.35, 1.28);
  const backOut = phase(t, duration - 0.85, duration - 0.25);
  const frontOut = phase(t, duration - 1.3, duration - 0.5);
  return <g>
    <PaintLayer id={`${id}-back`} draw={back} erase={backOut}>
      <path d="M -589 -70 L -560 -93 C -374 -112 -134 -94 60 -111 C 242 -116 434 -111 546 -126 L 574 -113 L 561 -95 L 591 -86 L 569 -66 L 584 -46 L 565 -22 L 574 21 L 556 52 C 327 63 105 70 -102 82 C -276 85 -463 94 -558 99 L -582 82 L -569 62 L -589 45 L -570 21 L -583 -5 L -570 -29 Z" fill={edge} />
      <path d="M -530 -102 C -274 -116 -46 -108 160 -121 M 275 -120 L 546 -136" stroke={edge} strokeWidth={3} fill="none" strokeLinecap="round" />
    </PaintLayer>
    <PaintLayer id={`${id}-front`} draw={front} erase={frontOut} reverse eraseFromRight>
      <path d="M -555 -44 L -531 -69 C -335 -79 -116 -65 79 -74 C 275 -68 422 -80 513 -63 L 552 -56 L 539 -37 L 568 -25 L 550 -8 L 560 12 L 545 31 L 557 52 L 532 62 L 517 80 C 298 87 79 77 -135 88 C -309 80 -467 94 -525 77 L -552 61 L -542 42 L -565 26 L -547 6 L -562 -16 Z" fill={color} />
      <path d="M -510 70 C -275 74 -81 66 88 76 M 272 73 L 513 69" stroke={edge} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.42} />
      <path d="M -542 -39 L -476 -46 M 484 -46 L 545 -40 M 491 48 L 547 45" stroke={edge} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.45} />
    </PaintLayer>
  </g>;
};

const InkRibbon: React.FC<BrushProps> = ({t, duration, first, color, edge, id}) => {
  const draw = first ? 1 : phase(t, 0.02, 0.87);
  const erase = phase(t, duration - 1.02, duration - 0.25);
  return <PaintLayer id={id} draw={draw} erase={erase} reverse>
    <path d="M -589 -17 L -558 -47 C -438 -70 -263 -78 -105 -85 C 96 -89 299 -99 503 -97 L 555 -89 L 541 -74 L 578 -70 L 556 -51 L 575 -32 L 559 -12 L 580 4 L 556 25 L 565 43 L 537 51 L 520 68 C 319 61 99 76 -105 79 C -290 87 -453 82 -551 63 L -577 47 L -562 31 L -588 18 L -569 3 Z" fill={color} />
    <path d="M -527 -39 C -341 -63 -164 -66 43 -75 C 240 -85 400 -88 515 -82" stroke={edge} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.55} />
    <path d="M -518 50 C -342 72 -169 64 13 62 C 189 60 350 51 511 53" stroke={edge} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.48} />
    <path d="M -595 -33 L -566 -42 M -592 53 L -556 61 M 528 -105 L 571 -99 M 549 61 L 584 48" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
    <ellipse cx={-604} cy={-7} rx={7} ry={3.5} fill={color} />
  </PaintLayer>;
};

const ArcSweep: React.FC<BrushProps> = ({t, duration, first, color, edge, id}) => {
  const draw = first ? 1 : phase(t, 0.02, 1.05);
  const underline = first ? 1 : phase(t, 0.77, 1.42);
  const erase = phase(t, duration - 1.22, duration - 0.29);
  const underOut = phase(t, duration - 1.4, duration - 0.8);
  return <g>
    <PaintLayer id={`${id}-body`} draw={draw} erase={erase} eraseFromRight>
      <path d="M -571 -10 L -552 -35 C -408 -76 -240 -104 -58 -108 C 161 -113 367 -86 523 -51 L 559 -35 L 543 -23 L 575 -10 L 555 8 L 570 24 L 551 41 L 561 57 L 535 62 L 520 81 C 348 48 155 37 -38 47 C -237 49 -416 77 -541 97 L -563 84 L -548 67 L -576 58 L -556 37 L -577 22 L -558 6 Z" fill={color} />
      <path d="M -515 -27 C -336 -77 -166 -91 15 -91 C 216 -89 371 -68 512 -36" stroke={edge} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.5} />
      <path d="M -508 79 C -320 43 -162 34 11 33 C 214 28 370 43 510 66" stroke={edge} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.45} />
      <path d="M -549 -45 L -485 -65 M 460 -74 L 552 -48 M -558 106 L -489 93" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
    </PaintLayer>
    <PaintLayer id={`${id}-underline`} draw={underline} erase={underOut}>
      <path d="M -349 126 C -202 96 -61 92 109 96 L 205 102 L 167 110 C -35 98 -189 113 -327 136 Z" fill={edge} />
      <path d="M -291 141 Q -182 119 -74 116" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </PaintLayer>
  </g>;
};

const brushes = [DryBristle, ThickPaint, DoubleSwipe, InkRibbon, ArcSweep] as const;
export const BrushCaptionFivePack: React.FC<BrushCaptionFivePackProps> = ({
  background = 'black', primaryColor, secondaryColor, firstBrushVisibleAtStart = false,
  x = 960, y = 780, scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const index = BrushCaptionFivePackSegments.findIndex(s => frame >= Math.round(s.startSeconds * fps)
    && frame < Math.round(s.endSeconds * fps));
  const segment = index >= 0 ? BrushCaptionFivePackSegments[index] : null;
  const ActiveBrush = index >= 0 ? brushes[index] : null;
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const backgrounds = {black: '#000000', green: '#00FF00', transparent: 'transparent'};
  return <AbsoluteFill style={{backgroundColor: backgrounds[background], overflow: 'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet" style={{display: 'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.max(0.3, Math.min(1.3, scale))})`}>
        {segment && ActiveBrush ? <g data-brush-index={index}>
          <ActiveBrush t={(frame - Math.round(segment.startSeconds * fps)) / fps}
            duration={segment.endSeconds - segment.startSeconds} first={index === 0 && firstBrushVisibleAtStart}
            color={primaryColor ?? segment.color} edge={secondaryColor ?? segment.edge} id={`brush-caption-${uid}`} />
        </g> : null}
      </g>
    </svg>
  </AbsoluteFill>;
};
export default BrushCaptionFivePack;
