// Generates the topographic contour SVGs used as CSS mask layers for the
// animated backgrounds. Pure Node, no dependencies:
//
//   node scripts/generate-topo.mjs
//
// Writes assets/topo-a.svg and assets/topo-b.svg. The noise field is
// periodic, so the SVGs tile seamlessly with mask-repeat.

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

function toPath(lines) {
  let d = "";
  for (const line of lines) {
    if (line.points.length < (line.closed ? 8 : 4)) continue; // drop specks
    d += `M${line.points.map((p) => `${Math.round(p[0])} ${Math.round(p[1])}`).join("L")}`;
    if (line.closed) d += "Z";
  }
  return d;
}

function generate(seed, levels) {
  const field = makeField(seed);
  const n = SIZE / CELL;
  // Pick levels from the field's actual distribution so density is even.
  const samples = [];
  for (let i = 0; i < 4000; i++) samples.push(field(Math.random() * SIZE, Math.random() * SIZE));
  samples.sort((a, b) => a - b);
  const quantile = (q) => samples[Math.floor(q * samples.length)];

  const lines = [];
  for (let l = 0; l < levels; l++) {
    const level = quantile(0.2 + (0.65 * l) / (levels - 1));
    for (const line of joinSegments(marchingSquares(field, level, n))) {
      lines.push(smooth(line));
    }
  }
  const d = toPath(lines);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}"><path d="${d}" fill="none" stroke="#000" stroke-width="1.1"/></svg>\n`;
}

writeFileSync("assets/topo-a.svg", generate(1337, 6));
writeFileSync("assets/topo-b.svg", generate(9021, 4));
console.log("wrote assets/topo-a.svg and assets/topo-b.svg");
