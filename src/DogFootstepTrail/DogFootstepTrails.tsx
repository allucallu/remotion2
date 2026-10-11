import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DogTrailBackground } from "./Background";
import { DogPrint } from "./DogPrint";
import {
  CURVE_CYCLE,
  CURVE_STEPS,
  type DogStep,
  VERTICAL_CYCLE,
  VERTICAL_STEPS,
} from "./steps";

const PAW_WIDTH = 140;
const PAW_HEIGHT = 170;
const VISIBLE_AGE = 75;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const opacityAtAge = (age: number) => {
  if (age < 0 || age > VISIBLE_AGE) return 0;
  if (age <= 3) {
    return interpolate(age, [0, 3], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });
  }
  if (age <= 42) return 1;
  return interpolate(age, [42, VISIBLE_AGE], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
};

const DogStepLayer = ({ step, age }: { step: DogStep; age: number }) => {
  const opacity = opacityAtAge(age);
  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: step.x - PAW_WIDTH / 2,
        top: step.y - PAW_HEIGHT / 2,
        width: PAW_WIDTH,
        height: PAW_HEIGHT,
        opacity,
        transform: `rotate(${step.rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      <DogPrint side={step.side} />
    </div>
  );
};

const PeriodicTrail = ({
  steps,
  cycle,
}: {
  steps: readonly DogStep[];
  cycle: number;
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <DogTrailBackground />
      {steps.flatMap((step, stepIndex) =>
        [-1, 0, 1, 2].map((cycleIndex) => {
          const age = frame - (step.birth + cycleIndex * cycle);
          return (
            <DogStepLayer
              key={`${stepIndex}-${cycleIndex}`}
              step={step}
              age={age}
            />
          );
        }),
      )}
    </AbsoluteFill>
  );
};

export const FootstepsVertical = () => (
  <PeriodicTrail steps={VERTICAL_STEPS} cycle={VERTICAL_CYCLE} />
);

export const FootstepsCurve = () => (
  <PeriodicTrail steps={CURVE_STEPS} cycle={CURVE_CYCLE} />
);
