// Generates the placeholder product artwork in public/images/products.
// Replace these SVGs with real product photography (same file names, or update
// the `image` field in lib/products.ts) when you have it.
//
// Usage: node scripts/generate-images.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "public/images/products";
mkdirSync(OUT, { recursive: true });

const METALS = {
  gold: ["#7a5a1e", "#f6e3a1", "#b8892f", "#fff3c4", "#8a6a2c"],
  rose: ["#7a3f38", "#f5c6b8", "#b8746a", "#ffe1d6", "#8c4f45"],
  white: ["#7c828a", "#f4f6f8", "#aeb5be", "#ffffff", "#8e949c"],
};
const BACKDROPS = {
  gold: ["#1d4a40", "#0a1f1a"],
  rose: ["#4a2233", "#1a0b12"],
  white: ["#1f3150", "#0a1120"],
};
const GEMS = {
  diamond: ["#ffffff", "#dff3ff", "#9ccfe8"],
  emerald: ["#b9ffd9", "#1fae6b", "#0b5a36"],
  ruby: ["#ffd0d8", "#e0204a", "#7a0a22"],
  sapphire: ["#d4e4ff", "#2a5bd7", "#0e2466"],
  "pink-sapphire": ["#ffe3ef", "#f06aa0", "#9c2a5c"],
  pearl: ["#ffffff", "#f7efe6", "#d9c9b6"],
  onyx: ["#6b6b6b", "#1b1b1b", "#000000"],
  none: null,
};

const defs = (metal, gem, id) => {
  const m = METALS[metal];
  const b = BACKDROPS[metal];
  const g = GEMS[gem] ?? GEMS.diamond;
  return `
  <defs>
    <radialGradient id="bg${id}" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="${b[0]}"/>
      <stop offset="100%" stop-color="${b[1]}"/>
    </radialGradient>
    <radialGradient id="spot${id}" cx="50%" cy="30%" r="45%">
      <stop offset="0%" stop-color="#fff" stop-opacity=".22"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="metal${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${m[0]}"/>
      <stop offset="25%" stop-color="${m[1]}"/>
      <stop offset="50%" stop-color="${m[2]}"/>
      <stop offset="72%" stop-color="${m[3]}"/>
      <stop offset="100%" stop-color="${m[4]}"/>
    </linearGradient>
    <linearGradient id="metalV${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${m[3]}"/>
      <stop offset="45%" stop-color="${m[2]}"/>
      <stop offset="100%" stop-color="${m[0]}"/>
    </linearGradient>
    <radialGradient id="gem${id}" cx="38%" cy="32%" r="75%">
      <stop offset="0%" stop-color="${g[0]}"/>
      <stop offset="45%" stop-color="${g[1]}"/>
      <stop offset="100%" stop-color="${g[2]}"/>
    </radialGradient>
    <radialGradient id="shadow${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow${id}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
};

const sparkle = (x, y, s, o = 0.9) =>
  `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z" fill="#fff" opacity="${o}"/>`;

// A faceted brilliant-cut stone seen from the front.
function stone(id, gem, cx, cy, r) {
  if (gem === "pearl") {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gem${id})"/>
      <ellipse cx="${cx - r * 0.3}" cy="${cy - r * 0.35}" rx="${r * 0.3}" ry="${r * 0.2}" fill="#fff" opacity=".85"/>`;
  }
  if (gem === "onyx") {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.1}" ry="${r * 0.85}" fill="url(#gem${id})"/>
      <ellipse cx="${cx - r * 0.35}" cy="${cy - r * 0.35}" rx="${r * 0.4}" ry="${r * 0.15}" fill="#fff" opacity=".35"/>`;
  }
  const crownY = cy - r * 0.35;
  const girdleY = cy;
  const tip = cy + r * 1.05;
  const t = r * 0.55;
  return `<g filter="url(#glow${id})">
    <polygon points="${cx - r},${girdleY} ${cx - t},${crownY - r * 0.3} ${cx + t},${crownY - r * 0.3} ${cx + r},${girdleY} ${cx},${tip}" fill="url(#gem${id})"/>
    <polygon points="${cx - t},${crownY - r * 0.3} ${cx + t},${crownY - r * 0.3} ${cx + t * 0.7},${girdleY} ${cx - t * 0.7},${girdleY}" fill="#fff" opacity=".28"/>
    <polygon points="${cx - r},${girdleY} ${cx - t},${crownY - r * 0.3} ${cx - t * 0.7},${girdleY}" fill="#fff" opacity=".45"/>
    <polygon points="${cx + r},${girdleY} ${cx + t},${crownY - r * 0.3} ${cx + t * 0.7},${girdleY}" fill="#000" opacity=".12"/>
    <polygon points="${cx - r},${girdleY} ${cx - t * 0.7},${girdleY} ${cx},${tip}" fill="#000" opacity=".18"/>
    <polygon points="${cx + t * 0.7},${girdleY} ${cx + r},${girdleY} ${cx},${tip}" fill="#fff" opacity=".22"/>
    <polygon points="${cx - t * 0.7},${girdleY} ${cx + t * 0.7},${girdleY} ${cx},${tip}" fill="#fff" opacity=".1"/>
  </g>`;
}

const shapes = {
  ring: (id, gem) => `
    <ellipse cx="400" cy="640" rx="230" ry="36" fill="url(#shadow${id})"/>
    <ellipse cx="400" cy="480" rx="200" ry="92" fill="none" stroke="url(#metalV${id})" stroke-width="40"/>
    <ellipse cx="400" cy="474" rx="200" ry="92" fill="none" stroke="url(#metal${id})" stroke-width="26"/>
    <ellipse cx="400" cy="466" rx="186" ry="82" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
    <path d="M360 400 L372 340 M440 400 L428 340 M386 404 L392 330 M414 404 L408 330" stroke="url(#metal${id})" stroke-width="10" stroke-linecap="round"/>
    ${gem === "none" ? "" : stone(id, gem, 400, 320, 70)}`,
  necklace: (id, gem, metal) => {
    const beads = [];
    for (let i = 0; i <= 26; i++) {
      const a = Math.PI * (0.08 + (0.84 * i) / 26);
      beads.push([400 - Math.cos(a) * 280, 150 + Math.sin(a) * 380]);
    }
    const chain = beads.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="url(#metal${id})"/>`).join("");
    const drops =
      gem === "none"
        ? ""
        : beads
            .filter((_, i) => i % 4 === 2)
            .map(([x, y]) => stone(id, gem, x, y + 22, 18))
            .join("");
    return `
      <ellipse cx="400" cy="700" rx="200" ry="30" fill="url(#shadow${id})"/>
      <polyline points="${beads.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="none" stroke="${METALS[metal][2]}" stroke-width="4" opacity=".8"/>
      ${chain}${drops}
      ${gem === "none" ? `<circle cx="400" cy="535" r="26" fill="url(#metal${id})"/>` : stone(id, gem, 400, 560, 48)}`;
  },
  earrings: (id, gem, metal) =>
    [270, 530]
      .map(
        (x) => `
      <ellipse cx="${x}" cy="690" rx="90" ry="18" fill="url(#shadow${id})"/>
      <path d="M${x} 150 q-40 0 -40 40 q0 30 40 40" fill="none" stroke="url(#metal${id})" stroke-width="10" stroke-linecap="round"/>
      <path d="M${x - 70} 300 Q${x} 220 ${x + 70} 300 L${x + 50} 360 Q${x} 330 ${x - 50} 360Z" fill="url(#metal${id})"/>
      ${[-40, -13, 13, 40].map((d) => `<circle cx="${x + d}" cy="${372 + Math.abs(d) * -0.3}" r="7" fill="url(#metal${id})"/>`).join("")}
      <line x1="${x}" y1="226" x2="${x}" y2="268" stroke="${METALS[metal][2]}" stroke-width="7" stroke-linecap="round"/>
      <line x1="${x}" y1="350" x2="${x}" y2="392" stroke="${METALS[metal][2]}" stroke-width="5" stroke-linecap="round"/>
      ${stone(id, gem === "none" ? "diamond" : gem, x, gem === "pearl" ? 440 : 450, 50)}`
      )
      .join(""),
  bracelet: (id, gem) => {
    const pts = [];
    for (let i = 0; i < 34; i++) {
      const a = (Math.PI * 2 * i) / 34;
      pts.push([400 + Math.cos(a) * 250, 430 + Math.sin(a) * 120, Math.sin(a)]);
    }
    pts.sort((a, b) => a[2] - b[2]);
    return `
      <ellipse cx="400" cy="620" rx="280" ry="40" fill="url(#shadow${id})"/>
      <ellipse cx="400" cy="430" rx="250" ry="120" fill="none" stroke="url(#metalV${id})" stroke-width="18"/>
      ${pts
        .map(([x, y, d]) => {
          const s = 16 + d * 5;
          return gem === "none"
            ? `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${s + 6}" ry="${s * 0.7}" fill="url(#metal${id})" stroke="#fff" stroke-opacity=".3"/>`
            : `<rect x="${(x - s).toFixed(1)}" y="${(y - s).toFixed(1)}" width="${s * 2}" height="${s * 2}" rx="5" fill="url(#metal${id})"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(s * 0.72).toFixed(1)}" fill="url(#gem${id})"/><circle cx="${(x - s * 0.25).toFixed(1)}" cy="${(y - s * 0.25).toFixed(1)}" r="${(s * 0.2).toFixed(1)}" fill="#fff" opacity=".8"/>`;
        })
        .join("")}`;
  },
  pendant: (id, gem) => `
    <ellipse cx="400" cy="700" rx="150" ry="24" fill="url(#shadow${id})"/>
    <path d="M140 80 Q400 520 400 330 Q400 520 660 80" fill="none" stroke="url(#metal${id})" stroke-width="5" stroke-dasharray="3 9" stroke-linecap="round"/>
    <path d="M140 80 Q270 300 390 330 M660 80 Q530 300 410 330" fill="none" stroke="url(#metal${id})" stroke-width="5" stroke-dasharray="3 9" stroke-linecap="round"/>
    <circle cx="400" cy="345" r="16" fill="none" stroke="url(#metal${id})" stroke-width="7"/>
    <path d="M400 370 C320 450 310 540 400 600 C490 540 480 450 400 370Z" fill="url(#metal${id})"/>
    <path d="M400 392 C336 460 330 532 400 580 C470 532 464 460 400 392Z" fill="url(#gem${id})"/>
    <path d="M400 392 C360 440 350 490 372 520 C368 470 380 430 400 392Z" fill="#fff" opacity=".45"/>
    ${Array.from({ length: 12 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 12;
      return `<circle cx="${(400 + Math.cos(a) * 88).toFixed(1)}" cy="${(492 + Math.sin(a) * 112).toFixed(1)}" r="6" fill="#fff" opacity=".85"/>`;
    }).join("")}`,
  bangle: (id, gem) => `
    <ellipse cx="400" cy="660" rx="280" ry="40" fill="url(#shadow${id})"/>
    ${[0, 70]
      .map(
        (o) => `
      <ellipse cx="400" cy="${380 + o}" rx="240" ry="110" fill="none" stroke="url(#metalV${id})" stroke-width="46"/>
      <ellipse cx="400" cy="${374 + o}" rx="240" ry="110" fill="none" stroke="url(#metal${id})" stroke-width="30"/>
      <ellipse cx="400" cy="${374 + o}" rx="240" ry="110" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 14"/>
      ${
        gem === "none"
          ? ""
          : Array.from({ length: 9 }, (_, i) => {
              const a = Math.PI * (0.15 + (0.7 * i) / 8);
              return `<circle cx="${(400 - Math.cos(a) * 240).toFixed(1)}" cy="${(374 + o + Math.sin(a) * 110).toFixed(1)}" r="9" fill="url(#gem${id})"/>`;
            }).join("")
      }`
      )
      .join("")}`,
};

const ART = [
  ["eternal-solitaire-diamond-ring", "ring", "white", "diamond"],
  ["rose-petal-halo-ring", "ring", "rose", "pink-sapphire"],
  ["royal-emerald-kundan-necklace", "necklace", "gold", "emerald"],
  ["celestial-diamond-tennis-bracelet", "bracelet", "white", "diamond"],
  ["pearl-drop-jhumka-earrings", "earrings", "gold", "pearl"],
  ["sapphire-teardrop-pendant", "pendant", "white", "sapphire"],
  ["temple-heritage-gold-bangles", "bangle", "gold", "ruby"],
  ["classic-22k-gold-rope-chain", "necklace", "gold", "none"],
  ["ruby-heart-stud-earrings", "earrings", "rose", "ruby"],
  ["mens-onyx-signet-ring", "ring", "gold", "onyx"],
  ["bridal-polki-diamond-choker", "necklace", "gold", "diamond"],
  ["infinity-rose-gold-bracelet", "bracelet", "rose", "none"],
];

let n = 0;
for (const [slug, type, metal, gem] of ART) {
  const id = String(n++);
  const sparkles = [
    sparkle(160, 150, 18),
    sparkle(640, 200, 12, 0.7),
    sparkle(600, 560, 10, 0.6),
    sparkle(200, 520, 8, 0.5),
    sparkle(470, 120, 7, 0.6),
  ].join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  ${defs(metal, gem, id)}
  <rect width="800" height="800" fill="url(#bg${id})"/>
  <rect width="800" height="800" fill="url(#spot${id})"/>
  ${shapes[type](id, gem, metal)}
  ${sparkles}
</svg>`;
  writeFileSync(`${OUT}/${slug}.svg`, svg);
}
console.log(`Wrote ${ART.length} product images to ${OUT}`);
