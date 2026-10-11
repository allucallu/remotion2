import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CatSvgBackground } from "./Background";
import { CatSvgPrint } from "./CatSvgPrint";
import { CAT_SVG_LOOP_STEPS, CAT_SVG_STEPS, type CatSvgStep } from "./steps";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Step = ({
  step,
  loopDuration,
}: {
  step: CatSvgStep;
  loopDuration?: number;
}) => {
  const frame = useCurrentFrame();
  const age = loopDuration
    ? (frame - step.start + loopDuration) % loopDuration
    : frame - step.start;
  if (age < 0 || age > 78) return null;
  const opacity =
    age <= 3
      ? interpolate(age, [0, 3], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        })
      : interpolate(age, [45, 78], [1, 0], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
  return (
    <div
      style={{
        position: "absolute",
        left: step.x - 75,
        top: step.y - 90,
        width: 150,
        height: 180,
        opacity,
        transformOrigin: "75px 90px",
        transform: `rotate(${step.rotation}deg)`,
      }}
    >
      <CatSvgPrint side={step.side} />
    </div>
  );
};

const Trail = ({
  steps,
  loopDuration,
}: {
  steps: readonly CatSvgStep[];
  loopDuration?: number;
}) => (
  <AbsoluteFill>
    <CatSvgBackground />
    {steps.map((step, index) => (
      <Step key={index} step={step} loopDuration={loopDuration} />
    ))}
  </AbsoluteFill>
);

export const CatSvgFootstepTrail = () => <Trail steps={CAT_SVG_STEPS} />;

export const CatSvgLoopArcTrail = () => (
  <Trail steps={CAT_SVG_LOOP_STEPS} loopDuration={300} />
);
