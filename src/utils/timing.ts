export const secondsToFrames = (seconds: number, fps: number) =>
  Math.round(seconds * fps);

export const loopProgress = (frame: number, durationInFrames: number) => {
  if (durationInFrames <= 0) {
    throw new Error("durationInFrames must be greater than zero.");
  }

  return (frame % durationInFrames) / durationInFrames;
};

export const phase = (frame: number, durationInFrames: number) =>
  loopProgress(frame, durationInFrames) * Math.PI * 2;
