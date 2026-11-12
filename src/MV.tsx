import React from "react";
import { Audio, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "./config";
import { timeline } from "./data/timeline";

export const MV: React.FC = () => {
  const { fps, width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: mvConfig.palette.paperCream,
        fontFamily: "'Segoe UI', 'Caveat', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 1. Pemutar Trek Audio Lagu */}
      <Audio src={mvConfig.audioSrc} />

      {/* 2. Sequence Per Section dari Timeline */}
      {timeline.map((sec, idx) => {
        const from = Math.round(sec.start * fps);
        const durationInFrames = Math.max(
          1,
          Math.round((sec.end - sec.start) * fps)
        );

        return (
          <Sequence
            key={`sec-${idx}-${sec.kind}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`${idx + 1}. ${sec.name}`}
          >
            <SectionPlaceholder
              section={sec}
              durationInFrames={durationInFrames}
            />
          </Sequence>
        );
      })}
    </div>
  );
};

interface SectionPlaceholderProps {
  section: (typeof timeline)[number];
  durationInFrames: number;
}

const SectionPlaceholder: React.FC<SectionPlaceholderProps> = ({
  section,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSecTime = section.start + frame / fps;

  const isNight = section.kind === "bridge";
  const bgColor = isNight
    ? mvConfig.palette.nightPaperNavy
    : mvConfig.palette.paperCream;
  const textColor = isNight
    ? mvConfig.palette.nightChalk
    : mvConfig.palette.penBlue;
  const lineColor = isNight
    ? "rgba(255, 255, 255, 0.12)"
    : mvConfig.palette.bookLine;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: bgColor,
        color: textColor,
        display: "flex",
        flexDirection: "column",
        padding: "50px 80px",
        boxSizing: "border-box",
        border: `3px dashed ${isNight ? "rgba(255, 255, 255, 0.2)" : mvConfig.palette.marginRed}`,
      }}
    >
      {/* Header Seksi & Info Waktu */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${lineColor}`,
          paddingBottom: 16,
          marginBottom: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              backgroundColor: isNight
                ? "#2b3b6b"
                : mvConfig.palette.highlighterYellow,
              color: isNight ? "#fff" : mvConfig.palette.graphite,
              padding: "4px 16px",
              borderRadius: 6,
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {section.kind}
          </span>
          <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            {section.name}
          </h2>
        </div>

        <div
          style={{
            fontSize: 20,
            color: isNight ? "#a8b5db" : "#62739a",
            fontFamily: "monospace",
          }}
        >
          {section.start.toFixed(2)}s — {section.end.toFixed(2)}s | Frame {frame}
        </div>
      </div>

      {/* Konten Lirik & Karaoke Word Highlight */}
      {section.lines.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.65,
          }}
        >
          <div style={{ fontSize: 60, marginBottom: 12 }}>🎸 ♫</div>
          <div style={{ fontSize: 32, fontStyle: "italic" }}>
            Instrumental Acoustic Solo ({section.name})
          </div>
          <div style={{ fontSize: 20, marginTop: 10 }}>
            Durasi: {(section.end - section.start).toFixed(2)} detik
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {section.lines.map((line, lIdx) => {
            const isLineActive =
              currentSecTime >= line.start && currentSecTime <= line.end;
            const isLinePassed = currentSecTime > line.end;

            return (
              <div
                key={`line-${lIdx}`}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 12,
                  fontSize: isLineActive ? 38 : 30,
                  opacity: isLineActive ? 1 : isLinePassed ? 0.35 : 0.6,
                  fontWeight: isLineActive ? 700 : 500,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    color: isNight ? "#7887b0" : "#94a3b8",
                    fontFamily: "monospace",
                    marginRight: 6,
                  }}
                >
                  #{lIdx + 1}
                </span>

                {line.words.map((w, wIdx) => {
                  const isWordActive =
                    currentSecTime >= w.start && currentSecTime <= w.end;
                  const isNona = w.text.toLowerCase().includes("nona");

                  return (
                    <span
                      key={`w-${lIdx}-${wIdx}`}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        padding: "2px 6px",
                        borderRadius: 4,
                        backgroundColor: isWordActive
                          ? isNona
                            ? mvConfig.palette.highlighterPink
                            : mvConfig.palette.highlighterYellow
                          : "transparent",
                        color: isWordActive
                          ? mvConfig.palette.graphite
                          : isNona
                          ? mvConfig.palette.highlighterPink
                          : textColor,
                        borderBottom: isWordActive
                          ? `3px solid ${mvConfig.palette.penBlue}`
                          : "none",
                      }}
                    >
                      {w.text}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
