/**
 * Generates unique, locally-served SVG artworks for hotels that have no
 * photograph available. These are stylized illustrations (not fake
 * photographs) used because the project has no image budget for AI
 * generation or stock photography.
 *
 * Run: node scripts/generate-hotel-artworks.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "hotels");
mkdirSync(outDir, { recursive: true });

const W = 800;
const H = 520;

/** Deterministic pseudo-random from a seed string. */
function seeded(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const palettes = {
  dusk: ["#1e3a5f", "#3d5a80", "#e07a5f", "#f2cc8f"],
  night: ["#141e30", "#243b55", "#f0f0f0", "#ffd166"],
  dawn: ["#355c7d", "#6c5b7b", "#f8b195", "#f67280"],
  sea: ["#023e8a", "#0077b6", "#48cae4", "#caf0f8"],
  sand: ["#6f4e37", "#a98467", "#ddb892", "#ede0d4"],
  forest: ["#081c15", "#1b4332", "#2d6a4f", "#95d5b2"],
  rose: ["#370617", "#6a040f", "#dc2f02", "#ffb4a2"],
};

const stars = (rand, n, maxOpacity = 0.9) =>
  Array.from({ length: n }, () => {
    const x = (rand() * W).toFixed(0);
    const y = (rand() * H * 0.45).toFixed(0);
    const r = (rand() * 1.6 + 0.6).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${(rand() * maxOpacity).toFixed(2)}"/>`;
  }).join("");

function skyline(colors, rand) {
  // Tehran: dense high-rise skyline silhouette
  let x = 0;
  const buildings = [];
  while (x < W) {
    const bw = 40 + rand() * 70;
    const bh = 120 + rand() * 180;
    const y = H - 70 - bh;
    buildings.push(
      `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${bw.toFixed(0)}" height="${(bh + 70).toFixed(0)}" fill="${colors[1]}" opacity="0.95"/>`
    );
    // lit windows
    for (let wy = y + 16; wy < H - 80; wy += 18) {
      for (let wx = x + 8; wx < x + bw - 10; wx += 14) {
        if (rand() > 0.55) {
          buildings.push(
            `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="6" height="8" fill="${colors[3]}" opacity="0.85"/>`
          );
        }
      }
    }
    x += bw + 6 + rand() * 18;
  }
  return buildings.join("");
}

function mountains(colors, rand, snow = true) {
  const ridges = [];
  for (let layer = 0; layer < 3; layer++) {
    const base = H - 60 - layer * 60;
    const amplitude = 150 - layer * 45;
    const pts = [];
    const steps = 9;
    for (let i = 0; i <= steps; i++) {
      const x = (i * W) / steps;
      const y = base - rand() * amplitude - (i % 2 ? amplitude * 0.35 : 0);
      pts.push(`${x.toFixed(0)},${y.toFixed(0)}`);
    }
    const fill = [colors[0], colors[1], colors[2]][layer];
    ridges.push(`<polygon points="0,${base} ${pts.join(" ")} ${W},${base} ${W},${H} 0,${H}" fill="${fill}" opacity="${0.75 + layer * 0.12}"/>`);
  }
  if (snow) {
    ridges.push(`<circle cx="620" cy="120" r="34" fill="${colors[3]}" opacity="0.9"/>`);
  }
  return ridges.join("");
}

function forest(colors, rand) {
  const trees = [];
  for (let i = 0; i < 26; i++) {
    const x = rand() * W;
    const h = 60 + rand() * 130;
    const base = H - 40;
    const w = 18 + rand() * 26;
    const fill = i % 3 === 0 ? colors[2] : colors[1];
    trees.push(
      `<polygon points="${x.toFixed(0)},${(base - h).toFixed(0)} ${(x - w / 2).toFixed(0)},${base} ${(x + w / 2).toFixed(0)},${base}" fill="${fill}" opacity="0.95"/>`
    );
  }
  return mountains(colors, seeded("kolardasht-far"), false) + trees.join("");
}

function domeCity(colors, rand) {
  // Mashhad: grand dome + two minarets silhouette
  const parts = [];
  parts.push(`<rect x="0" y="${H - 120}" width="${W}" height="120" fill="${colors[0]}"/>`);
  parts.push(`<path d="M 310 ${H - 120} A 95 95 0 0 1 500 ${H - 120} Z" fill="${colors[2]}" opacity="0.95"/>`);
  parts.push(`<rect x="392" y="${H - 235}" width="26" height="34" fill="${colors[2]}"/>`);
  for (const mx of [205, 575]) {
    parts.push(`<rect x="${mx}" y="${H - 240}" width="34" height="240" fill="${colors[1]}"/>`);
    parts.push(`<polygon points="${mx - 8},${H - 240} ${mx + 17},${H - 292} ${mx + 42},${H - 240}" fill="${colors[3]}" opacity="0.95"/>`);
  }
  for (let i = 0; i < 14; i++) {
    const x = rand() * W;
    parts.push(`<rect x="${x.toFixed(0)}" y="${H - 70 - rand() * 30}" width="8" height="10" fill="${colors[3]}" opacity="0.8"/>`);
  }
  return parts.join("");
}

function badgir(colors) {
  // Yazd: windcatcher towers in desert light
  const tower = (x, h, w) => `
    <rect x="${x}" y="${H - 60 - h}" width="${w}" height="${h + 60}" fill="${colors[1]}"/>
    ${Array.from({ length: 4 }, (_, i) => {
      const sx = x + 8 + i * ((w - 16) / 3);
      return `<rect x="${sx.toFixed(0)}" y="${H - 60 - h + 10}" width="6" height="${h - 20}" fill="${colors[0]}" opacity="0.9"/>`;
    }).join("")}
    <rect x="${x - 6}" y="${H - 72 - h}" width="${w + 12}" height="14" fill="${colors[0]}"/>
  `;
  return `
    <rect x="0" y="${H - 62}" width="${W}" height="62" fill="${colors[2]}" opacity="0.5"/>
    ${tower(150, 190, 70)}
    ${tower(370, 140, 56)}
    ${tower(560, 225, 84)}
    <circle cx="120" cy="105" r="40" fill="${colors[3]}" opacity="0.85"/>
  `;
}

function seaScene(colors, rand, withPalm = true) {
  const parts = [];
  parts.push(`<rect x="0" y="${H - 150}" width="${W}" height="150" fill="${colors[1]}" opacity="0.9"/>`);
  parts.push(`<rect x="0" y="${H - 150}" width="${W}" height="8" fill="${colors[3]}" opacity="0.8"/>`);
  // sailboat
  parts.push(`<path d="M 470 ${H - 152} L 470 ${H - 225} L 525 ${H - 152} Z" fill="#ffffff" opacity="0.9"/>`);
  parts.push(`<path d="M 460 ${H - 152} L 508 ${H - 152} L 498 ${H - 128} L 470 ${H - 128} Z" fill="${colors[0]}"/>`);
  // sun on horizon
  parts.push(`<circle cx="215" cy="${H - 152}" r="46" fill="${colors[3]}" opacity="0.95"/>`);
  if (withPalm) {
    const px = 640;
    parts.push(`<rect x="${px}" y="${H - 170}" width="12" height="130" fill="${colors[0]}" transform="rotate(6 ${px} ${H - 40})"/>`);
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 5 + 0.2;
      const dx = Math.cos(angle) * 62;
      parts.push(`<ellipse cx="${(px + dx).toFixed(0)}" cy="${(H - 185 - Math.sin(angle) * 34).toFixed(0)}" rx="34" ry="8" fill="${colors[0]}" transform="rotate(${(-angle * 57 + 20).toFixed(0)} ${(px + dx).toFixed(0)} ${(H - 185 - Math.sin(angle) * 34).toFixed(0)})"/>`);
    }
  }
  // sparkles on water
  for (let i = 0; i < 20; i++) {
    parts.push(`<rect x="${(rand() * W).toFixed(0)}" y="${(H - 120 + rand() * 90).toFixed(0)}" width="${(14 + rand() * 30).toFixed(0)}" height="3" fill="#ffffff" opacity="${(rand() * 0.5 + 0.2).toFixed(2)}"/>`);
  }
  return parts.join("");
}

function stele(colors, rand) {
  // Hamedan: rocky ridge + ancient stele silhouette
  const parts = [];
  for (let layer = 0; layer < 2; layer++) {
    const base = H - 55 - layer * 55;
    const pts = [];
    const steps = 8;
    for (let i = 0; i <= steps; i++) {
      const x = (i * W) / steps;
      const y = base - rand() * 120 - 30;
      pts.push(`${x.toFixed(0)},${y.toFixed(0)}`);
    }
    parts.push(`<polygon points="0,${base} ${pts.join(" ")} ${W},${base} ${W},${H} 0,${H}" fill="${colors[layer === 0 ? 0 : 1]}" opacity="${0.8 + layer * 0.15}"/>`);
  }
  // stele / lion-shaped rock hint
  parts.push(`<rect x="330" y="${H - 235}" width="46" height="180" rx="8" fill="${colors[3]}" opacity="0.55"/>`);
  parts.push(`<circle cx="353" cy="${H - 245}" r="26" fill="${colors[3]}" opacity="0.55"/>`);
  return parts.join("");
}

function shirazScene(colors) {
  // Shiraz: pointed arches + cypress trees
  const parts = [];
  parts.push(`<rect x="0" y="${H - 115}" width="${W}" height="115" fill="${colors[0]}"/>`);
  for (const ax of [140, 380, 620]) {
    parts.push(`<path d="M ${ax - 48} ${H - 115} L ${ax - 48} ${H - 235} Q ${ax} ${H - 300} ${ax + 48} ${H - 235} L ${ax + 48} ${H - 115} Z" fill="${colors[2]}" opacity="0.8"/>`);
  }
  for (const cx of [60, 300, 520, 760]) {
    parts.push(`<ellipse cx="${cx}" cy="${H - 185}" rx="16" ry="95" fill="${colors[1]}"/>`);
    parts.push(`<rect x="${cx - 4}" y="${H - 110}" width="8" height="60" fill="${colors[0]}"/>`);
  }
  return parts.join("");
}

const artworks = [
  { file: "tehran-diplomatic.svg", palette: "night", seed: "tehran-2", scene: "skyline" },
  { file: "kolardasht-forest.svg", palette: "forest", seed: "maz-2", scene: "forest" },
  { file: "shiraz-baghiran.svg", palette: "rose", seed: "shiraz-2", scene: "shiraz" },
  { file: "yazd-badgir.svg", palette: "sand", seed: "yazd-2", scene: "badgir" },
  { file: "kish-aftab.svg", palette: "sea", seed: "kish-2", scene: "sea" },
  { file: "qeshm-sitare.svg", palette: "dusk", seed: "qeshm-1", scene: "sea" },
  { file: "qeshm-khalij.svg", palette: "night", seed: "qeshm-2", scene: "sea" },
  { file: "hamedan-alavian.svg", palette: "dawn", seed: "hamedan-2", scene: "stele" },
];

for (const art of artworks) {
  const rand = seeded(art.seed);
  const colors = palettes[art.palette];
  const [top, mid, glow] = colors;
  let scene = "";
  switch (art.scene) {
    case "skyline": scene = skyline(colors, rand); break;
    case "forest": scene = forest(colors, rand); break;
    case "dome": scene = domeCity(colors, rand); break;
    case "badgir": scene = badgir(colors); break;
    case "sea": scene = seaScene(colors, rand); break;
    case "stele": scene = stele(colors, rand); break;
    case "shiraz": scene = shirazScene(colors); break;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="0.62" stop-color="${mid}"/>
      <stop offset="1" stop-color="${glow}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${stars(rand, art.palette === "sea" || art.palette === "dawn" ? 14 : 60)}
  ${scene}
  <rect x="0" y="${H - 24}" width="${W}" height="24" fill="#000" opacity="0.35"/>
</svg>
`;
  writeFileSync(join(outDir, art.file), svg, "utf8");
  console.log("wrote", art.file);
}

// Travel club membership artwork (third card in the travel-card section)
{
  const rand = seeded("travel-club");
  const colors = palettes.dusk;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="0.55" stop-color="${colors[1]}"/>
      <stop offset="1" stop-color="${colors[2]}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${stars(rand, 50)}
  <circle cx="400" cy="205" r="64" fill="${colors[3]}" opacity="0.95"/>
  <circle cx="400" cy="205" r="80" fill="none" stroke="${colors[3]}" stroke-width="3" opacity="0.5"/>
  <path d="M 400 168 l 11 22.5 24.8 3.6 -17.9 17.4 4.2 24.6 -22.1 -11.6 -22.1 11.6 4.2 -24.6 -17.9 -17.4 24.8 -3.6 Z" fill="${colors[0]}" opacity="0.9"/>
  <rect x="0" y="${H - 70}" width="${W}" height="70" fill="#000" opacity="0.3"/>
</svg>
`;
  writeFileSync(join(__dirname, "..", "public", "travel-card-club.svg"), svg, "utf8");
  console.log("wrote travel-card-club.svg");
}
