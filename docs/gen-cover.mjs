// Generates docs/cover-image.png (1200x675) from inline SVG.
// Run: node docs/gen-cover.mjs

import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svg = `
<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0D0F14"/>
      <stop offset="100%" stop-color="#0A1626"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="48%" r="58%">
      <stop offset="0%" stop-color="#1A2438" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0D0F14" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.5"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>

  <g stroke="#FFFFFF" stroke-opacity="0.028" stroke-width="0.8">
    <line x1="0" y1="112" x2="1200" y2="112"/>
    <line x1="0" y1="225" x2="1200" y2="225"/>
    <line x1="0" y1="337" x2="1200" y2="337"/>
    <line x1="0" y1="450" x2="1200" y2="450"/>
    <line x1="0" y1="562" x2="1200" y2="562"/>
    <line x1="150" y1="0" x2="150" y2="675"/>
    <line x1="300" y1="0" x2="300" y2="675"/>
    <line x1="450" y1="0" x2="450" y2="675"/>
    <line x1="600" y1="0" x2="600" y2="675"/>
    <line x1="750" y1="0" x2="750" y2="675"/>
    <line x1="900" y1="0" x2="900" y2="675"/>
    <line x1="1050" y1="0" x2="1050" y2="675"/>
  </g>

  <circle cx="600" cy="337" r="280" fill="none" stroke="#DC3220" stroke-width="2" stroke-opacity="0.42"/>
  <circle cx="600" cy="337" r="258" fill="none" stroke="#DC3220" stroke-width="1" stroke-opacity="0.22" stroke-dasharray="9 6"/>

  <circle cx="210" cy="190" r="155" fill="none" stroke="#D4860C" stroke-width="1.8" stroke-opacity="0.38"/>
  <circle cx="210" cy="190" r="138" fill="none" stroke="#D4860C" stroke-width="0.8" stroke-opacity="0.18" stroke-dasharray="7 5"/>

  <circle cx="1010" cy="510" r="175" fill="none" stroke="#067A5F" stroke-width="1.8" stroke-opacity="0.4"/>
  <circle cx="1010" cy="510" r="157" fill="none" stroke="#067A5F" stroke-width="0.8" stroke-opacity="0.18" stroke-dasharray="7 5"/>

  <circle cx="1060" cy="115" r="88" fill="none" stroke="#D4860C" stroke-width="1.4" stroke-opacity="0.28"/>
  <circle cx="140" cy="575" r="95" fill="none" stroke="#DC3220" stroke-width="1.4" stroke-opacity="0.28"/>

  <circle cx="480" cy="290" r="8" fill="#067A5F" fill-opacity="0.7"/>
  <circle cx="680" cy="210" r="9" fill="#067A5F" fill-opacity="0.65"/>
  <circle cx="820" cy="380" r="7" fill="#067A5F" fill-opacity="0.7"/>
  <circle cx="530" cy="430" r="10" fill="#067A5F" fill-opacity="0.62"/>

  <circle cx="560" cy="330" r="7" fill="#DC3220" fill-opacity="0.7"/>
  <circle cx="640" cy="390" r="8" fill="#DC3220" fill-opacity="0.65"/>
  <circle cx="430" cy="360" r="6" fill="#DC3220" fill-opacity="0.68"/>
  <circle cx="760" cy="260" r="7" fill="#DC3220" fill-opacity="0.65"/>

  <g stroke="#067A5F" stroke-opacity="0.16" stroke-width="1" fill="none">
    <path d="M480,290 C530,270 620,230 680,210"/>
    <path d="M680,210 C720,230 760,270 820,380"/>
  </g>

  <rect width="1200" height="675" fill="url(#vignette)"/>

  <!-- Soft scrim so type stays readable -->
  <rect x="180" y="210" width="840" height="255" rx="8" fill="#0D0F14" fill-opacity="0.28"/>

  <!-- Title + one line only -->
  <text x="600" y="330" text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="78" font-weight="700" letter-spacing="-1.5"
        fill="#F7F7F5">PlatePilgrim</text>

  <text x="600" y="390" text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="24" font-weight="400" letter-spacing="0.4"
        fill="#C8C4BA">Turn every meal into a passport stamp.</text>
</svg>
`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: {
    fontFiles: [
      "C:/Windows/Fonts/segoeui.ttf",
      "C:/Windows/Fonts/segoeuib.ttf",
      "C:/Windows/Fonts/arial.ttf",
      "C:/Windows/Fonts/arialbd.ttf",
    ],
    defaultFontFamily: "Segoe UI",
    loadSystemFonts: true,
  },
});

const pngBuffer = resvg.render().asPng();
const outPath = path.join(__dirname, "cover-image.png");
fs.writeFileSync(outPath, pngBuffer);

const sizeKb = Math.round(pngBuffer.length / 1024);
console.log(`Written ${outPath} (${sizeKb} KB)`);
