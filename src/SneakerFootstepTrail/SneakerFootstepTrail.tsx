import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SneakerPrint } from "./SneakerPrint";
import { SNEAKER_STEPS } from "./steps";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const AnimatedStep = ({ index }: { index: number }) => {
  const frame = useCurrentFrame();
  const step = SNEAKER_STEPS[index];
  const age = frame - step.start;
  if (age < 0 || age > 84) return null;
  const opacity =
    age <= 3
      ? interpolate(age, [0, 3], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        })
      : interpolate(age, [48, 84], [1, 0], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
  return (
    <div
      style={{
        position: "absolute",
        left: step.x - 38,
        top: step.y - 95,
        width: 76,
        height: 190,
        opacity,
        transformOrigin: "38px 95px",
        transform: `rotate(${step.rotation}deg)`,
      }}
    >
      <SneakerPrint side={step.side} maskId={`step-${index}`} />
    </div>
  );
};

export const SneakerFootstepTrail = () => (
  <AbsoluteFill>
    {SNEAKER_STEPS.map((_, index) => (
      <AnimatedStep key={index} index={index} />
    ))}
  </AbsoluteFill>
);
