import React, { useEffect, useState } from "react";
import {
  Audio,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  prefetch,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AVAILABLE_ASSETS } from "./assetsManifest";
import { ensureFontsLoaded, mvConfig } from "./config";
import { Section, timeline } from "./data/timeline";
import { BridgeScene } from "./scenes/BridgeScene";
import { ChorusScene } from "./scenes/ChorusScene";
import { InstrumentalScene } from "./scenes/InstrumentalScene";
import { OutroScene } from "./scenes/OutroScene";
import { PreChorusScene } from "./scenes/PreChorusScene";
import { Verse1Scene } from "./scenes/Verse1Scene";
import { Verse2Scene } from "./scenes/Verse2Scene";

function renderSectionScene(section: Section): React.ReactNode {
  switch (section.kind) {
    case "intro":
    case "interlude":
      return <InstrumentalScene section={section} />;
    case "verse":
      return section.index === 1 ? (
        <Verse1Scene section={section} />
      ) : (
        <Verse2Scene section={section} />
      );
    case "pre":
      return <PreChorusScene section={section} />;
    case "chorus": {
      const variant: 1 | 2 | 3 =
        section.index === 3 ? 3 : section.index === 2 ? 2 : 1;
      return <ChorusScene section={section} variant={variant} />;
    }
    case "bridge":
      return <BridgeScene section={section} />;
    case "outro":
      return <OutroScene section={section} />;
    default:
      return <InstrumentalScene section={section} />;
  }
}

/**
 * Pembungkus Transisi Konsisten ±12 Frame Antar-Seksi
 * Menghindari celah hitam/kosong dengan cross-fade & slide halus buku sketsa.
 */
const SectionTransitionWrapper: React.FC<{
  isFirst: boolean;
  isLast: boolean;
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ isFirst, isLast, durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const tFrames = mvConfig.sectionTransitionFrames; // 12 frame

  const fadeIn = isFirst
    ? 1
    : interpolate(frame, [0, tFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const fadeOut = isLast
    ? 1
    : interpolate(
        frame,
        [Math.max(0, durationInFrames - tFrames), durationInFrames],
        [1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );

  const slideX = isFirst
    ? 0
    : interpolate(frame, [0, tFrames], [18, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: Math.min(fadeIn, fadeOut),
        transform: `translateX(${slideX}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const MV: React.FC = () => {
  const { fps } = useVideoConfig();
  const [fontHandle] = useState(() =>
    delayRender("Memuat Google Fonts Gochi Hand & Reenie Beanie")
  );

  // Pastikan font siap sebelum render & prefetch aset gambar yang tersedia
  useEffect(() => {
    let cancelled = false;

    ensureFontsLoaded()
      .then(() => {
        if (!cancelled) {
          continueRender(fontHandle);
        }
      })
      .catch((err) => {
        console.warn("Peringatan saat memuat font, lanjutkan render:", err);
        if (!cancelled) {
          continueRender(fontHandle);
        }
      });

    // Prefetch seluruh aset gambar yang tersedia di public/assets/
    const prefetchHandles = AVAILABLE_ASSETS.map((assetName) => {
      const clean = assetName.replace(/^\/?(assets\/)?/, "");
      return prefetch(staticFile(`assets/${clean}`));
    });

    return () => {
      cancelled = true;
      prefetchHandles.forEach((p) => p.free());
    };
  }, [fontHandle]);

  const overlapFrames = mvConfig.sectionTransitionFrames; // 12 frame

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: mvConfig.colors.paper,
      }}
    >
      <Audio src={mvConfig.audioSrc} />

      {timeline.map((section, sIdx) => {
        const isFirst = sIdx === 0;
        const isLast = sIdx === timeline.length - 1;

        const baseFrom = Math.round(section.start * fps);
        const baseTo = Math.round(section.end * fps);

        // Overlap ±12 frame antarseksi agar transisi mulus tanpa pernah ada frame kosong/hitam
        const fromFrame = isFirst ? 0 : Math.max(0, baseFrom - overlapFrames);
        const toFrame = isLast ? baseTo : baseTo + overlapFrames;
        const durationInFrames = Math.max(1, toFrame - fromFrame);

        return (
          <Sequence
            key={`${section.name}-${section.kind}-${section.index}-${sIdx}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
            name={`[${section.kind.toUpperCase()} ${section.index}] ${section.name}`}
          >
            <SectionTransitionWrapper
              isFirst={isFirst}
              isLast={isLast}
              durationInFrames={durationInFrames}
            >
              {renderSectionScene(section)}
            </SectionTransitionWrapper>
          </Sequence>
        );
      })}
    </div>
  );
};
