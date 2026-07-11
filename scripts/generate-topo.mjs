// Generates the topographic contour SVGs used as CSS mask layers for the
// animated backgrounds. Pure Node, no dependencies:
//
//   node scripts/generate-topo.mjs
//
// Writes:
//   assets/topo-a.svg  main contour field
//   assets/topo-b.svg  second field, displayed larger for parallax depth
//   assets/topo-c.svg  "index contours": two levels of field A with
//                      elevation labels, shown in the accent colour and
//                      animated in lockstep with A so the lines coincide
//
// The noise field is periodic, so the SVGs tile seamlessly with
// mask-repeat. Level selection is fully deterministic per seed, which is
// what keeps topo-c aligned with topo-a.

import { writeFileSync } from "node:fs";

const SIZE = 600;      // tile size in px
const CELL = 8;        // marching-squares grid resolution
const PERIOD = 4;      // noise features per tile edge (must divide evenly)

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

// Periodic value noise on a wrapped lattice.
function makeNoise(seed, period) {
  const rand = mulberry32(seed);
  const lattice = [];
  for (let y = 0; y < period; y++) {
    lattice.push(Array.from({ length: period }, () => rand()));
  }
  return (fx, fy) => {
    const x0 = ((Math.floor(fx) % period) + period) % period;
    const y0 = ((Math.floor(fy) % period) + period) % period;
    const x1 = (x0 + 1) % period;
    const y1 = (y0 + 1) % period;
    const tx = smoothstep(fx - Math.floor(fx));
    const ty = smoothstep(fy - Math.floor(fy));
    const a = lattice[y0][x0] + (lattice[y0][x1] - lattice[y0][x0]) * tx;
    const b = lattice[y1][x0] + (lattice[y1][x1] - lattice[y1][x0]) * tx;
    return a + (b - a) * ty;
  };
}

function makeField(seed) {
  const octave1 = makeNoise(seed, PERIOD);
  const octave2 = makeNoise(seed * 7 + 1, PERIOD * 2);
  return (x, y) => {
    const fx = (x / SIZE) * PERIOD;
    const fy = (y / SIZE) * PERIOD;
    return 0.68 * octave1(fx, fy) + 0.32 * octave2(fx * 2, fy * 2);
  };
}

// Marching squares: returns line segments for one iso level.
function marchingSquares(sample, level, n) {
  const step = SIZE / n;
  const grid = [];
  for (let j = 0; j <= n; j++) {
    grid.push(Array.from({ length: n + 1 }, (_, i) => sample(i * step, j * step)));
  }
  const segs = [];
  const lerp = (pa, pb, va, vb) => {
    const t = (level - va) / (vb - va);
    return [pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t];
  };
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = i * step, y = j * step;
      const v = [grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]];
      const p = [[x, y], [x + step, y], [x + step, y + step], [x, y + step]];
      let idx = 0;
      for (let k = 0; k < 4; k++) if (v[k] > level) idx |= 1 << k;
      if (idx === 0 || idx === 15) continue;
      const e = {
        top: () => lerp(p[0], p[1], v[0], v[1]),
        right: () => lerp(p[1], p[2], v[1], v[2]),
        bottom: () => lerp(p[3], p[2], v[3], v[2]),
        left: () => lerp(p[0], p[3], v[0], v[3]),
      };
      const table = {
        1: [["top", "left"]], 2: [["right", "top"]], 3: [["right", "left"]],
        4: [["bottom", "right"]], 6: [["bottom", "top"]], 7: [["bottom", "left"]],
        8: [["left", "bottom"]], 9: [["top", "bottom"]], 11: [["right", "bottom"]],
        12: [["left", "right"]], 13: [["top", "right"]], 14: [["left", "top"]],
      };
      let pairs = table[idx];
      if (!pairs) {
        // Ambiguous saddle: resolve with the cell centre.
        const centre = (v[0] + v[1] + v[2] + v[3]) / 4;
        if (idx === 5) pairs = centre > level ? [["top", "right"], ["bottom", "left"]] : [["top", "left"], ["bottom", "right"]];
        else pairs = centre > level ? [["right", "bottom"], ["left", "top"]] : [["right", "top"], ["left", "bottom"]];
      }
      for (const [ea, eb] of pairs) segs.push([e[ea](), e[eb]()]);
    }
  }
  return segs;
}

// Join segments into polylines by matching endpoints.
function joinSegments(segs) {
  const key = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const byStart = new Map();
  for (const s of segs) {
    const k = key(s[0]);
    if (!byStart.has(k)) byStart.set(k, []);
    byStart.get(k).push(s);
  }
  const used = new Set();
  const lines = [];
  for (const seed of segs) {
    if (used.has(seed)) continue;
    used.add(seed);
    const line = [seed[0], seed[1]];
    for (;;) {
      const next = (byStart.get(key(line[line.length - 1])) || []).find((s) => !used.has(s));
      if (!next) break;
      used.add(next);
      line.push(next[1]);
    }
    lines.push(line);
  }
  return lines;
}

// One round of Chaikin corner cutting, then decimation.
function smooth(line) {
  const closed = line.length > 3 &&
    Math.hypot(line[0][0] - line[line.length - 1][0], line[0][1] - line[line.length - 1][1]) < 0.01;
  const out = [];
  for (let i = 0; i < line.length - 1; i++) {
    const [a, b] = [line[i], line[i + 1]];
    out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
    out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
  }
  if (!closed) {
    out.unshift(line[0]);
    out.push(line[line.length - 1]);
  }
  return { points: out.filter((_, i) => i % 2 === 0 || i === out.length - 1), closed };
}

function pathFor(points, closed) {
  if (points.length < 2) return "";
  let d = `M${points.map((p) => `${Math.round(p[0])} ${Math.round(p[1])}`).join("L")}`;
  if (closed) d += "Z";
  return d;
}

// Deterministic quantile levels for a seed, so different layers built from
// the same seed pick numerically identical iso levels.
function levelsFor(seed, count) {
  const field = makeField(seed);
  const rand = mulberry32(seed ^ 0x5eed);
  const samples = [];
  for (let i = 0; i < 4000; i++) samples.push(field(rand() * SIZE, rand() * SIZE));
  samples.sort((a, b) => a - b);
  return Array.from({ length: count }, (_, l) =>
    samples[Math.floor((0.2 + (0.65 * l) / (count - 1)) * samples.length)]);
}

// Build smoothed contour lines for the given iso levels of a seed's field.
function contours(seed, levels) {
  const field = makeField(seed);
  const n = SIZE / CELL;
  const lines = [];
  levels.forEach((level, levelIndex) => {
    for (const raw of joinSegments(marchingSquares(field, level, n))) {
      const s = smooth(raw);
      if (s.points.length >= (s.closed ? 8 : 4)) lines.push({ ...s, levelIndex });
    }
  });
  return lines;
}

function svg(body, strokeWidth) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">` +
    `<g fill="none" stroke="#000" stroke-width="${strokeWidth}">${body}</g></svg>\n`;
}

function plainLayer(seed, levelCount, strokeWidth) {
  const body = contours(seed, levelsFor(seed, levelCount))
    .map((l) => `<path d="${pathFor(l.points, l.closed)}"/>`).join("");
  return svg(body, strokeWidth);
}

// Index-contour layer: a subset of field A's levels, bolder, with the line
// broken where an elevation label sits (proper cartographic style).
function indexLayer(seed, totalLevels, pickedIndices, elevations) {
  const all = levelsFor(seed, totalLevels);
  const picked = pickedIndices.map((i) => all[i]);
  const lines = contours(seed, picked);

  let paths = "";
  let labels = "";
  const labelled = new Set();
  // Label the two longest lines of each level.
  lines.sort((a, b) => b.points.length - a.points.length);
  const perLevel = new Map();

  for (const line of lines) {
    const count = perLevel.get(line.levelIndex) || 0;
    if (count < 2 && line.points.length > 24) {
      perLevel.set(line.levelIndex, count + 1);
      const pts = line.points;
      // Cut a gap around 40% of the way along; keep labels off tile edges
      // so they never straddle the seam.
      let cut = Math.floor(pts.length * 0.4);
      const margin = 40;
      for (let tries = 0; tries < pts.length; tries++) {
        const c = pts[(cut + tries) % (pts.length - 4)];
        if (c[0] > margin && c[0] < SIZE - margin && c[1] > margin && c[1] < SIZE - margin) {
          cut = (cut + tries) % (pts.length - 4);
          break;
        }
      }
      const gap = 4;
      const a = pts.slice(0, cut);
      const b = pts.slice(cut + gap);
      const p1 = pts[cut];
      const p2 = pts[Math.min(cut + gap, pts.length - 1)];
      const cx = (p1[0] + p2[0]) / 2;
      const cy = (p1[1] + p2[1]) / 2;
      let deg = (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;
      if (deg > 90) deg -= 180;
      if (deg < -90) deg += 180;
      paths += `<path d="${pathFor(a, false)}"/><path d="${pathFor(b, false)}"/>`;
      labels += `<text transform="translate(${Math.round(cx)} ${Math.round(cy)}) rotate(${Math.round(deg)})" dy="3.5">${elevations[line.levelIndex]}</text>`;
      labelled.add(line);
    }
  }
  for (const line of lines) {
    if (!labelled.has(line)) paths += `<path d="${pathFor(line.points, line.closed)}"/>`;
  }

  const text = `<g font-family="ui-monospace, Consolas, Menlo, monospace" font-size="10" fill="#000" stroke="none" text-anchor="middle">${labels}</g>`;
  return svg(paths + text, 1.4);
}

writeFileSync("assets/topo-a.svg", plainLayer(1337, 6, 1.1));
writeFileSync("assets/topo-b.svg", plainLayer(9021, 4, 1.1));
writeFileSync("assets/topo-c.svg", indexLayer(1337, 6, [1, 4], { 0: "160", 1: "340" }));
console.log("wrote assets/topo-a.svg, topo-b.svg and topo-c.svg");
