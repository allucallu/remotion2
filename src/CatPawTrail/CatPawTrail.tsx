import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CatPawPrint } from "./CatPawPrint";
import { PAW_STEPS } from "./trail-data";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const PawAtStep = ({ index }: { index: number }) => {
  const frame = useCurrentFrame();
  const step = PAW_STEPS[index];
  const age = frame - (15 + index * 15);
  if (age < 0 || age > 75) return null;
  const opacity =
    age <= 4
      ? interpolate(age, [0, 4], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        })
      : interpolate(age, [45, 75], [1, 0], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
  const scale = interpolate(age, [0, 4], [0.94, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: step.x - 44,
        top: step.y - 48.5,
        width: 88,
        height: 97,
        opacity,
        transformOrigin: "44px 48.5px",
        transform: `rotate(${step.rotation}deg) scale(${scale})`,
      }}
    >
      <CatPawPrint />
    </div>
  );
};

export const CatPawTrail = () => (
  <AbsoluteFill>
    {PAW_STEPS.map((_, index) => (
      <PawAtStep key={index} index={index} />
    ))}
  </AbsoluteFill>
);
