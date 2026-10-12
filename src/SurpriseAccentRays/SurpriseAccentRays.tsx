import { Easing, interpolate, useCurrentFrame } from "remotion";

export const RAYS_WIDTH = 3840;
export const RAYS_HEIGHT = 2160;
export const RAYS_FPS = 30;
export const RAYS_DURATION = 150;

const COLORS = { background: "#000000", stroke: "#FFFFFF" } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.25, 0.1, 0.25, 1);
const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing: ease });

const rays = [
  { d: "M 740 430 C 720 392 694 347 670 310", width: 19, delay: 0 },
  { d: "M 690 490 C 642 474 592 451 550 435", width: 17, delay: 2 },
  { d: "M 685 555 C 647 557 614 562 580 560", width: 15, delay: 4 },
  { d: "M 1180 420 C 1200 378 1221 330 1240 290", width: 18, delay: 1 },
  { d: "M 1230 485 C 1281 466 1330 444 1375 425", width: 16, delay: 3 },
  { d: "M 1240 550 C 1281 549 1320 553 1355 558", width: 14, delay: 5 },
] as const;

const details = [
  { d: "M 654 380 C 643 361 634 344 626 327", delay: 3 },
  { d: "M 1260 366 C 1271 343 1280 321 1288 302", delay: 4 },
  { d: "M 598 585 C 574 588 553 592 535 598", delay: 6 },
  { d: "M 1344 582 C 1364 587 1382 594 1398 603", delay: 7 },
] as const;

const Ray = ({
  d,
  width,
  draw,
}: {
  d: string;
  width: number;
  draw: number;
}) => (
  <path
    d={d}
    fill="none"
    stroke={COLORS.stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={100}
    strokeDasharray="100 100"
    strokeDashoffset={100 * (1 - draw)}
  />
);

export const SurpriseAccentRays = () => {
  const frame = useCurrentFrame();
  const overshoot =
    progress(frame, 12, 15) * (1 - progress(frame, 15, 17)) * 0.08;
  const attentionPulse =
    progress(frame, 72, 77) * (1 - progress(frame, 78, 83)) * 0.05;

  const drawFor = (delay: number) => {
    const entrance = progress(frame, delay, delay + 8);
    const retract = progress(frame, 132 + delay, 142 + delay);
    return Math.max(
      0,
      Math.min(1, entrance + overshoot + attentionPulse - retract),
    );
  };

  return (
    <svg
      width={RAYS_WIDTH}
      height={RAYS_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: COLORS.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={COLORS.background} />
      {rays.map((ray) => (
        <Ray key={ray.d} {...ray} draw={drawFor(ray.delay)} />
      ))}
      {details.map((detail) => (
        <Ray
          key={detail.d}
          d={detail.d}
          width={8}
          draw={drawFor(detail.delay)}
        />
      ))}
    </svg>
  );
};
