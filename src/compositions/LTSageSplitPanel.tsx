import {useId} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const DESIGN = {
  colors: {
    background: '#000000',
    ivory: '#F1EDE4',
    sage: '#98A990',
    graphite: '#34383A',
  },
  main: {x: 440, y: 1310, width: 2560, height: 390, radius: 32},
  secondary: {x: 760, y: 1720, width: 2240, height: 200, radius: 28},
  connector: {x: 340, y: 1380, width: 180, height: 255},
  topTab: [
    [255, 1300], [390, 1300], [350, 1494], [215, 1494],
  ],
  bottomTab: [
    [210, 1514], [345, 1514], [305, 1708], [170, 1708],
  ],
} as const;

const EASING = Easing.bezier(0.22, 1, 0.36, 1);
const EXIT_EASING = Easing.bezier(0.64, 0, 0.78, 0);

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

type Point = readonly [number, number];

const roundedPolygonPath = (
  points: readonly Point[],
  cornerDistance: number,
) => {
  const corners = points.map((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const toward = (target: Point) => {
      const dx = target[0] - point[0];
      const dy = target[1] - point[1];
      const length = Math.hypot(dx, dy);
      const distance = Math.min(cornerDistance, length / 2);
      return [
        point[0] + (dx / length) * distance,
        point[1] + (dy / length) * distance,
      ] as const;
    };

    return {
      before: toward(previous),
      corner: point,
      after: toward(next),
    };
  });

  const first = corners[0];
  const commands = [`M ${first.before[0]} ${first.before[1]}`];
  corners.forEach(({before, corner, after}, index) => {
    if (index > 0) commands.push(`L ${before[0]} ${before[1]}`);
    commands.push(
      `Q ${corner[0]} ${corner[1]} ${after[0]} ${after[1]}`,
    );
  });
  commands.push(`L ${first.before[0]} ${first.before[1]} Z`);
  return commands.join(' ');
};

const TOP_TAB_PATH = roundedPolygonPath(DESIGN.topTab, 18);
const BOTTOM_TAB_PATH = roundedPolygonPath(DESIGN.bottomTab, 18);

// Register at 3840x2160, 30 fps, durationInFrames: 360.
// Empty flat-color panels on solid black. No text or logo placeholders.
export const LTSageSplitPanel = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const time = frame / fps;
  const exitShift = Math.max(4, durationInFrames / fps) - 12;

  const progress = (start: number, end: number, closing = false) =>
    interpolate(time, [start + (closing ? exitShift : 0), end + (closing ? exitShift : 0)], [0, 1], {
      ...clamp,
      easing: closing ? EXIT_EASING : EASING,
    });
  const visibility = (
    enterStart: number,
    enterEnd: number,
    exitStart: number,
    exitEnd: number,
  ) =>
    progress(enterStart, enterEnd) *
    (1 - progress(exitStart, exitEnd, true));

  const topTabEnter = progress(0.1, 0.45);
  const topTabExit = progress(11.3, 11.65, true);
  const topTabVisibility = topTabEnter * (1 - topTabExit);
  const topTabX = -35 * (1 - topTabEnter) - 35 * topTabExit;
  const topTabHeight = 194 * topTabVisibility;

  const bottomTabEnter = progress(0.25, 0.6);
  const bottomTabExit = progress(11.15, 11.5, true);
  const bottomTabVisibility = bottomTabEnter * (1 - bottomTabExit);
  const bottomTabX = -35 * (1 - bottomTabEnter) - 35 * bottomTabExit;
  const bottomTabHeight = 194 * bottomTabVisibility;

  const connectorWidth =
    (DESIGN.main.x - DESIGN.connector.x) *
    visibility(0.35, 0.75, 10.95, 11.35);

  const mainWidth =
    DESIGN.main.width * visibility(0.5, 1.35, 10.35, 11.15);

  const secondaryEnter = progress(0.95, 1.8);
  const secondaryExit = progress(10, 10.65, true);
  const secondaryWidth =
    DESIGN.secondary.width * secondaryEnter * (1 - secondaryExit);
  const secondaryMaskX =
    DESIGN.secondary.x + DESIGN.secondary.width - secondaryWidth;
  const secondaryTranslateX = 70 * (1 - secondaryEnter) + 70 * secondaryExit;
  const secondaryPanelX = DESIGN.secondary.x + secondaryTranslateX;
  // Translate a rigid panel inside its fixed mask; never squeeze its width.
  const secondaryPanelWidth = DESIGN.secondary.width;

  return (
    <AbsoluteFill
      style={{backgroundColor: DESIGN.colors.background, overflow: 'hidden'}}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        preserveAspectRatio="xMidYMid meet"
        style={{display: 'block'}}
        shapeRendering="geometricPrecision"
      >
        <defs>
          <clipPath id={`${id}-connector`} clipPathUnits="userSpaceOnUse">
            <rect
              x={DESIGN.connector.x}
              y={DESIGN.connector.y}
              width={connectorWidth}
              height={DESIGN.connector.height}
            />
          </clipPath>
          <clipPath id={`${id}-top-tab`} clipPathUnits="userSpaceOnUse">
            <rect
              x={130}
              y={1494 - topTabHeight}
              width={300}
              height={topTabHeight}
            />
          </clipPath>
          <clipPath id={`${id}-bottom-tab`} clipPathUnits="userSpaceOnUse">
            <rect
              x={100}
              y={1708 - bottomTabHeight}
              width={300}
              height={bottomTabHeight}
            />
          </clipPath>
          <clipPath id={`${id}-main`} clipPathUnits="userSpaceOnUse">
            <rect
              x={DESIGN.main.x}
              y={DESIGN.main.y}
              width={mainWidth}
              height={DESIGN.main.height}
            />
          </clipPath>
          <clipPath id={`${id}-secondary`} clipPathUnits="userSpaceOnUse">
            <rect
              x={secondaryMaskX}
              y={DESIGN.secondary.y}
              width={secondaryWidth}
              height={DESIGN.secondary.height}
            />
          </clipPath>
        </defs>

        <g clipPath={`url(#${id}-connector)`}>
          <rect {...DESIGN.connector} fill={DESIGN.colors.graphite} />
        </g>

        <g transform={`translate(${topTabX} 0)`}>
          <g clipPath={`url(#${id}-top-tab)`}>
            <path d={TOP_TAB_PATH} fill={DESIGN.colors.sage} />
          </g>
        </g>
        <g transform={`translate(${bottomTabX} 0)`}>
          <g clipPath={`url(#${id}-bottom-tab)`}>
            <path d={BOTTOM_TAB_PATH} fill={DESIGN.colors.sage} />
          </g>
        </g>

        <g clipPath={`url(#${id}-main)`}>
          <rect
            x={DESIGN.main.x}
            y={DESIGN.main.y}
            width={DESIGN.main.width}
            height={DESIGN.main.height}
            rx={DESIGN.main.radius}
            ry={DESIGN.main.radius}
            fill={DESIGN.colors.ivory}
          />
        </g>

        <g clipPath={`url(#${id}-secondary)`}>
          <rect
            x={secondaryPanelX}
            y={DESIGN.secondary.y}
            width={secondaryPanelWidth}
            height={DESIGN.secondary.height}
            rx={DESIGN.secondary.radius}
            ry={DESIGN.secondary.radius}
            fill={DESIGN.colors.sage}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
