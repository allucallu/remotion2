import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Seztk01Background } from "./Background";
import { Seztk01Print } from "./Seztk01Print";
import { SEZTK01_CURVED_STEPS, SEZTK01_STEPS, type Seztk01Step } from "./steps";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Step = ({ step }: { step: Seztk01Step }) => {
  const frame = useCurrentFrame();
  const age = frame - step.start;
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
        left: step.x - 40,
        top: step.y - 90,
        width: 80,
        height: 180,
        opacity,
        transformOrigin: "40px 90px",
        transform: `rotate(${step.rotation}deg)`,
      }}
    >
      <Seztk01Print side={step.side} />
    </div>
  );
};

const Trail = ({ steps }: { steps: readonly Seztk01Step[] }) => (
  <AbsoluteFill>
    <Seztk01Background />
    {steps.map((step, index) => (
      <Step key={index} step={step} />
    ))}
  </AbsoluteFill>
);

export const Seztk01FootstepTrail = () => <Trail steps={SEZTK01_STEPS} />;

export const Seztk01CurvedTrail = () => <Trail steps={SEZTK01_CURVED_STEPS} />;
