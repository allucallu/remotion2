import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

const CELL = 24;
const CX = 1920;
const CY = 1080;
const C = {
  edge: '#C08BDD', light: '#AB75C5', membrane: '#815394',
  shade: '#68447B', rib: '#382545', body: '#302039',
  fur: '#432B52', furLight: '#58376B', eye: '#FFF0CD',
};
type Point = readonly [number, number];
type Cell = {x: number; y: number; color: string};
const inside = (x: number, y: number, poly: readonly Point[]) => {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[i]; const [bx, by] = poly[j];
    if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) hit = !hit;
  }
  return hit;
};
const distance = (x: number, y: number, a: Point, b: Point) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
};

// Independently proportioned poses: span, tip height, outer finger and inner finger.
// The shoulder stays fixed while each distal joint changes its own position.
const POSES = [
  {span: 55, tip: -26, outer: [-40, 5], inner: [-25, 14]},
  {span: 50, tip: -33, outer: [-37, -4], inner: [-24, 8]},
  {span: 39, tip: -39, outer: [-30, -15], inner: [-20, 1]},
  {span: 54, tip: -17, outer: [-41, 13], inner: [-26, 20]},
  {span: 56, tip: -4, outer: [-42, 25], inner: [-26, 29]},
  {span: 55, tip: -20, outer: [-41, 10], inner: [-25, 17]},
] as const;
const makeWing = (pose: number): Cell[] => {
  const p = POSES[pose];
  const tip: Point = [-p.span, p.tip];
  const knuckle: Point = [-p.span + 12, p.tip - 5];
  const outer: Point = p.outer;
  const inner: Point = p.inner;
  const shoulder: Point = [-8, -6];
  const poly: Point[] = [
    shoulder, [(shoulder[0] + knuckle[0]) / 2, p.tip + 10],
    knuckle,
    [-p.span + 4, p.tip - 1], tip,
    [-p.span + 5, p.tip + 1], [-p.span + 9, p.tip + 4],
    [outer[0] - 2, outer[1] - 6], outer,
    [outer[0] + 3, outer[1] - 3], [outer[0] + 7, outer[1] - 4],
    [inner[0] - 5, inner[1] - 7], [inner[0] - 2, inner[1] - 4], inner,
    [inner[0] + 4, inner[1] - 4], [inner[0] + 8, inner[1] - 4],
    [-13, 14], [-9, 19], [-7, 14], [-7, -3],
  ];
  const ribs: [Point, Point][] = [
    [shoulder, knuckle], [knuckle, outer],
    [shoulder, [knuckle[0] + 8, p.tip + 4]], [[knuckle[0] + 8, p.tip + 4], inner],
    [shoulder, [-19, p.tip + 13]], [[-19, p.tip + 13], [-9, 19]],
  ];
  const cells: Cell[] = [];
  for (let y = -46; y <= 32; y++) for (let x = -60; x <= -6; x++) {
    const px = x + 0.5, py = y + 0.5;
    if (!inside(px, py, poly)) continue;
    const edge = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => !inside(px + dx, py + dy, poly));
    const rib = ribs.some(([a,b]) => distance(px,py,a,b) < 1.05);
    let color: string = x < -35 ? C.membrane : x < -22 ? C.shade : C.membrane;
    if (py < p.tip + 7 && !rib) color = C.light;
    if (rib) color = C.rib;
    if (edge) color = C.edge;
    cells.push({x,y,color});
  }
  return cells;
};
const body = (): Cell[] => {
  const cells = new Map<string,Cell>();
  const paint = (poly: readonly Point[], color: string) => {
    for (let y = -34; y <= 30; y++) for (let x = -13; x <= 12; x++)
      if (inside(x + .5,y + .5,poly)) cells.set(`${x},${y}`,{x,y,color});
  };
  // Head and pointed belly, with angular tufts instead of a plain oval.
  paint([[-8,-13],[-11,-8],[-10,0],[-11,4],[-9,8],[-10,10],[-7,15],[-6,19],[-2,23],[0,24],[4,21],[7,17],[8,12],[10,8],[9,3],[10,-5],[7,-12]],C.fur);
  paint([[-7,-10],[-9,-5],[-8,1],[-5,5],[0,8],[6,4],[8,-1],[7,-8],[3,-12]],C.body);
  paint([[-8,6],[-5,8],[-2,11],[1,12],[6,8],[8,6],[6,13],[1,17],[-4,14]],C.furLight);
  paint([[-7,12],[-3,16],[1,18],[6,14],[4,20],[0,23],[-3,21]],C.body);
  // Long tapered ears with inset lavender, joined to the head.
  paint([[-11,-10],[-11,-24],[-9,-30],[-7,-27],[-4,-22],[-3,-12],[-6,-9]],C.fur);
  paint([[3,-12],[4,-23],[8,-30],[10,-27],[11,-11],[7,-9]],C.fur);
  paint([[-9,-13],[-9,-23],[-8,-26],[-6,-22],[-5,-14],[-7,-12]],C.light);
  paint([[5,-13],[6,-23],[8,-26],[9,-23],[9,-14],[7,-12]],C.light);
  paint([[-9,-15],[-8,-21],[-7,-17],[-7,-13]],C.membrane);
  paint([[5,-14],[7,-21],[7,-13]],C.membrane);
  // Three-toed feet, kept readable below the belly.
  paint([[-6,20],[-5,20],[-5,24],[-3,25],[-3,27],[-5,26],[-6,28],[-7,26],[-9,26],[-9,24],[-7,24]],C.furLight);
  paint([[4,21],[6,21],[6,25],[8,25],[9,27],[7,27],[6,29],[5,27],[3,27],[3,25],[4,25]],C.furLight);
  const pixel = (x:number,y:number,color:string) => cells.set(`${x},${y}`,{x,y,color});
  for (const x of [-5,3]) for(let y=-4;y<=-2;y++) pixel(x,y,C.eye);
  pixel(-1,-1,C.light);pixel(0,-1,C.light);pixel(1,-1,C.light);pixel(0,0,C.membrane);pixel(0,1,C.membrane);
  return Array.from(cells.values());
};
const WINGS = POSES.map((_,i)=>makeWing(i));
const BODY = body();
const POSE_SEQUENCE = [0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,4,5,5,0,0];
const BOB = [0,0,0,0,0,1,1,1,1,1,1,1,0,0,-1,-1,-2,-2,-1,0];
const draw = (cell:Cell,key:string,right=false) => <rect key={key}
  x={(right ? -cell.x - 1 : cell.x) * CELL} y={cell.y * CELL}
  width={CELL} height={CELL} fill={cell.color} />;

// Two short pressure pulses detach below each membrane during the downstroke.
// Fixed birth positions keep the gust independent from subsequent wing poses.
const GUSTS = [
  {x: 19, y: 25, born: 12, life: 7, drift: 0.8},
  {x: 28, y: 30, born: 13, life: 7, drift: 1.1},
  {x: 38, y: 27, born: 12, life: 7, drift: 1.3},
  {x: 48, y: 20, born: 13, life: 7, drift: 1.2},
  {x: 24, y: 26, born: 14, life: 6, drift: 0.7},
  {x: 43, y: 24, born: 14, life: 6, drift: 1.0},
] as const;
const gustPixels = (local: number): Cell[] => {
  const cells: Cell[] = [];
  for (const side of [-1, 1]) GUSTS.forEach((gust, i) => {
    const age = (local - gust.born + 20) % 20;
    if (age >= gust.life) return;
    const x = gust.x + Math.round(age * gust.drift);
    const y = gust.y + Math.round(age * 1.35);
    const color = age < 2 ? C.light : age < 4 ? C.membrane : C.shade;
    // A small stepped pressure streak breaks into isolated pixels as it falls.
    const pattern: Point[] = age < 2 ? [[0,0],[1,0],[2,1],[3,1]] :
      age < 4 ? [[0,0],[1,0],[3,1]] : [[1,0]];
    pattern.forEach(([dx,dy]) => cells.push({
      x: side === 1 ? x + dx : -x - dx - 1,
      y: y + dy + (i > 3 ? 1 : 0), color,
    }));
  });
  return cells;
};

/** 4K / 30fps / 240 frames. Twelve 20-frame flap cycles. */
export const PixelBatLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const local = ((frame % 20) + 20) % 20;
  const pose = POSE_SEQUENCE[local];
  const age = local - 13;
  const particles = age >= 0 && age < 5 ? [0,1,2,3].filter(i=>i<2 || age>0) : [];
  return <AbsoluteFill style={{backgroundColor:'#000000'}}>
    <svg width="100%" height="100%" viewBox="0 0 3840 2160" shapeRendering="crispEdges" aria-label="Purple pixel bat loop">
      <rect width={3840} height={2160} fill="#000000" />
      <g transform={`translate(${CX} ${CY})`}>
        {gustPixels(local).map((cell,i)=>draw(cell,`gust${i}`))}
      </g>
      <g transform={`translate(${CX} ${CY + BOB[local]*CELL})`}>
        {WINGS[pose].map((cell,i)=>draw(cell,`l${i}`))}
        {WINGS[pose].map((cell,i)=>draw(cell,`r${i}`,true))}
        {BODY.map((cell,i)=>draw(cell,`b${i}`))}
      </g>
      {/* Particles detach in world space; they do not jump to a new wing pose. */}
      {particles.map(i=>{
        const side=i%2===0?-1:1;
        const delay=i<2?0:1;
        const a=age-delay;
        const x=CX+side*(58+a+(i>1?0:2))*CELL;
        const y=CY+(22+a*2+(i>1?3:0))*CELL;
        return <rect key={i} x={x} y={y} width={CELL} height={CELL} fill={a<3?C.light:C.membrane} />;
      })}
    </svg>
  </AbsoluteFill>;
};
