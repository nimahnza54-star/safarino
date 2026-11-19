/**
 * Generates unique, locally-served SVG artworks for accommodation mock
 * records that have no photograph available. Stylized illustrations —
 * not fake photographs — used because the project has no stock photos
 * of these fictional mock properties.
 *
 * Run: node scripts/generate-accommodation-artworks.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "accommodations");
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
  teal: ["#003049", "#0a5c63", "#669bbc", "#ffcd77"],
};

const stars = (rand, n, maxOpacity = 0.9) =>
  Array.from({ length: n }, () => {
    const x = (rand() * W).toFixed(0);
    const y = (rand() * H * 0.45).toFixed(0);
    const r = (rand() * 1.6 + 0.6).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${(rand() * maxOpacity).toFixed(2)}"/>`;
  }).join("");

/** Modern villa: flat-roof block + taller side block + warm lit windows + pool. */
function villa(colors, rand, pool = true) {
  const parts = [];
  parts.push(`<rect x="0" y="${H - 110}" width="${W}" height="110" fill="${colors[0]}"/>`);
  // main block
  parts.push(`<rect x="150" y="${H - 300}" width="300" height="200" fill="${colors[1]}" opacity="0.97"/>`);
  // side tower
  parts.push(`<rect x="430" y="${H - 360}" width="150" height="260" fill="${colors[1]}" opacity="0.9"/>`);
  // flat roof slab
  parts.push(`<rect x="140" y="${H - 312}" width="320" height="12" fill="${colors[0]}"/>`);
  parts.push(`<rect x="420" y="${H - 372}" width="170" height="12" fill="${colors[0]}"/>`);
  // lit windows
  for (const wx of [190, 270, 350]) {
    for (const wy of [H - 260, H - 190]) {
      if (rand() > 0.25) {
        parts.push(`<rect x="${wx}" y="${wy}" width="34" height="26" fill="${colors[3]}" opacity="0.9"/>`);
      }
    }
  }
  for (const wy of [H - 320, H - 240, H - 160]) {
    if (rand() > 0.2) {
      parts.push(`<rect x="470" y="${wy}" width="60" height="22" fill="${colors[3]}" opacity="0.9"/>`);
    }
  }
  // door
  parts.push(`<rect x="268" y="${H - 158}" width="54" height="58" fill="${colors[0]}" opacity="0.95"/>`);
  if (pool) {
    parts.push(`<rect x="80" y="${H - 62}" width="640" height="34" rx="10" fill="${colors[2]}" opacity="0.9"/>`);
    for (let i = 0; i < 12; i++) {
      parts.push(`<rect x="${(110 + rand() * 580).toFixed(0)}" y="${(H - 54 + rand() * 18).toFixed(0)}" width="${(20 + rand() * 46).toFixed(0)}" height="3" fill="#ffffff" opacity="0.5"/>`);
    }
  }
  return parts.join("");
}

/** Log cottage under pines. */
function cottage(colors, rand) {
  const parts = [];
  for (let layer = 0; layer < 2; layer++) {
    const base = H - 60 - layer * 55;
    const amplitude = 120 - layer * 40;
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const x = (i * W) / 8;
      const y = base - rand() * amplitude - (i % 2 ? amplitude * 0.4 : 0);
      pts.push(`${x.toFixed(0)},${y.toFixed(0)}`);
    }
    parts.push(`<polygon points="0,${base} ${pts.join(" ")} ${W},${base} ${W},${H} 0,${H}" fill="${layer === 0 ? colors[0] : colors[1]}" opacity="0.8"/>`);
  }
  // cottage body
  parts.push(`<rect x="270" y="${H - 210}" width="260" height="150" fill="#3d2c22" opacity="0.98"/>`);
  // log stripes
  for (let y = H - 190; y < H - 70; y += 22) {
    parts.push(`<rect x="270" y="${y}" width="260" height="4" fill="#57422f" opacity="0.9"/>`);
  }
  // gable roof
  parts.push(`<polygon points="250,${H - 210} 400,${H - 330} 550,${H - 210}" fill="#241a12"/>`);
  // glowing door + window
  parts.push(`<rect x="378" y="${H - 138}" width="44" height="78" fill="#ffb703" opacity="0.92"/>`);
  parts.push(`<rect x="300" y="${H - 165}" width="36" height="28" fill="#ffd166" opacity="0.9"/>`);
  parts.push(`<rect x="465" y="${H - 165}" width="36" height="28" fill="#ffd166" opacity="0.9"/>`);
  return parts.join("");
}

/** Treehouse tower shape among forest canopy. */
function treehouse(colors, rand) {
  const parts = [];
  for (let i = 0; i < 22; i++) {
    const x = rand() * W;
    const h = 90 + rand() * 140;
    const w = 16 + rand() * 22;
    parts.push(`<polygon points="${x.toFixed(0)},${(H - 40 - h).toFixed(0)} ${(x - w / 2).toFixed(0)},${H - 40} ${(x + w / 2).toFixed(0)},${H - 40}" fill="${i % 3 === 0 ? colors[2] : colors[1]}" opacity="0.95"/>`);
  }
  // trunk + cabin
  parts.push(`<rect x="372" y="${H - 285}" width="56" height="245" fill="#3d2c22" opacity="0.97"/>`);
  parts.push(`<rect x="315" y="${H - 400}" width="170" height="120" fill="#57422f" opacity="0.98"/>`);
  parts.push(`<polygon points="300,${H - 400} 400,${H - 478} 500,${H - 400}" fill="#241a12"/>`);
  parts.push(`<rect x="350" y="${H - 352}" width="30" height="26" fill="#ffd166" opacity="0.92"/>`);
  parts.push(`<rect x="420" y="${H - 352}" width="30" height="26" fill="#ffd166" opacity="0.92"/>`);
  // string lights
  parts.push(`<path d="M 315 ${H - 300} Q 400 ${H - 265} 485 ${H - 300}" stroke="${colors[3]}" stroke-width="2" fill="none" opacity="0.8"/>`);
  return parts.join("");
}

/** Badgir (windcatcher) towers for desert/badgir cities. */
function badgir(colors) {
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
    ${tower(140, 185, 64)}
    ${tower(365, 135, 52)}
    ${tower(555, 225, 84)}
    <circle cx="115" cy="105" r="40" fill="${colors[3]}" opacity="0.85"/>
  `;
}

/** Dome city (Isfahan): grand dome + pishtaq + minarets. */
function domeCity(colors, rand) {
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

/** Seafront scene with palm or sailboat. */
function seaScene(colors, rand, withPalm = true) {
  const parts = [];
  parts.push(`<rect x="0" y="${H - 150}" width="${W}" height="150" fill="${colors[1]}" opacity="0.9"/>`);
  parts.push(`<rect x="0" y="${H - 150}" width="${W}" height="8" fill="${colors[3]}" opacity="0.8"/>`);
  parts.push(`<path d="M 470 ${H - 152} L 470 ${H - 225} L 525 ${H - 152} Z" fill="#ffffff" opacity="0.9"/>`);
  parts.push(`<path d="M 460 ${H - 152} L 508 ${H - 152} L 498 ${H - 128} L 470 ${H - 128} Z" fill="${colors[0]}"/>`);
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
  for (let i = 0; i < 20; i++) {
    parts.push(`<rect x="${(rand() * W).toFixed(0)}" y="${(H - 120 + rand() * 90).toFixed(0)}" width="${(14 + rand() * 30).toFixed(0)}" height="3" fill="#ffffff" opacity="${(rand() * 0.5 + 0.2).toFixed(2)}"/>`);
  }
  return parts.join("");
}

/** Shiraz-style pointed arches + cypress trees. */
function shirazScene(colors) {
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

/** Mountain valley with terraced orchards (rice fields). */
function valley(colors, rand) {
  const parts = [];
  for (let layer = 0; layer < 3; layer++) {
    const base = H - 60 - layer * 55;
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const x = (i * W) / 8;
      const y = base - rand() * (130 - layer * 40) - (i % 2 ? 40 : 0);
      pts.push(`${x.toFixed(0)},${y.toFixed(0)}`);
    }
    parts.push(`<polygon points="0,${base} ${pts.join(" ")} ${W},${base} ${W},${H} 0,${H}" fill="${[colors[0], colors[1], colors[2]][layer]}" opacity="0.78"/>`);
  }
  // rice terraces
  for (let i = 0; i < 5; i++) {
    const y = H - 45 - i * 14;
    parts.push(`<rect x="0" y="${y}" width="${W}" height="5" fill="${colors[3]}" opacity="${0.35 + i * 0.1}"/>`);
  }
  return parts.join("");
}

/** Tehran high-rise skyline with warm windows. */
function skyline(colors, rand) {
  let x = 0;
  const parts = [];
  while (x < W) {
    const bw = 40 + rand() * 70;
    const bh = 120 + rand() * 180;
    const y = H - 70 - bh;
    parts.push(`<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${bw.toFixed(0)}" height="${(bh + 70).toFixed(0)}" fill="${colors[1]}" opacity="0.95"/>`);
    for (let wy = y + 16; wy < H - 80; wy += 18) {
      for (let wx = x + 8; wx < x + bw - 10; wx += 14) {
        if (rand() > 0.55) {
          parts.push(`<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="6" height="8" fill="${colors[3]}" opacity="0.85"/>`);
        }
      }
    }
    x += bw + 6 + rand() * 18;
  }
  return parts.join("");
}

const artworks = [
  { file: "tehran-01.svg", palette: "night", seed: "tehran-villa", scene: "villa" },
  { file: "tehran-02.svg", palette: "dusk", seed: "tehran-ap", scene: "skyline" },
  { file: "mazandaran-01.svg", palette: "forest", seed: "chelik", scene: "cottage" },
  { file: "mazandaran-02.svg", palette: "sea", seed: "ramser", scene: "sea" },
  { file: "mazandaran-03.svg", palette: "forest", seed: "kolanardasht", scene: "treehouse" },
  { file: "mazandaran-04.svg", palette: "teal", seed: "chalus", scene: "villa" },
  { file: "mazandaran-05.svg", palette: "forest", seed: "metalqho", scene: "treehouse" },
  { file: "gilan-01.svg", palette: "forest", seed: "masal", scene: "cottage" },
  { file: "gilan-02.svg", palette: "sea", seed: "anzali", scene: "sea" },
  { file: "gilan-03.svg", palette: "forest", seed: "shalyzar", scene: "valley" },
  { file: "alborz-01.svg", palette: "dawn", seed: "kordan", scene: "villa" },
  { file: "alborz-02.svg", palette: "sand", seed: "saheyliyeh", scene: "villa" },
  { file: "yazd-01.svg", palette: "sand", seed: "negin-kavir", scene: "badgir" },
  { file: "isfahan-01.svg", palette: "rose", seed: "jolf-esfahan", scene: "dome" },
  { file: "shiraz-01.svg", palette: "rose", seed: "golat", scene: "shiraz" },
  { file: "mashhad-01.svg", palette: "dawn", seed: "torabeg", scene: "valley" },
  { file: "kish-01.svg", palette: "sea", seed: "kish-sadaf", scene: "sea" },
  { file: "kish-02.svg", palette: "teal", seed: "kish-pardis", scene: "villa" },
];

for (const art of artworks) {
  const rand = seeded(art.seed);
  const colors = palettes[art.palette];
  const [top, mid, glow] = colors;
  let scene = "";
  switch (art.scene) {
    case "villa": scene = villa(colors, rand, art.palette !== "teal"); break;
    case "cottage": scene = cottage(colors, rand); break;
    case "treehouse": scene = treehouse(colors, rand); break;
    case "badgir": scene = badgir(colors); break;
    case "dome": scene = domeCity(colors, rand); break;
    case "sea": scene = seaScene(colors, rand); break;
    case "shiraz": scene = shirazScene(colors); break;
    case "valley": scene = valley(colors, rand); break;
    case "skyline": scene = skyline(colors, rand); break;
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
