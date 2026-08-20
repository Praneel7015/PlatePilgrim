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
    <radialGradient id="glow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#1A2A40" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0D0F14" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="20%" cy="25%" r="40%">
      <stop offset="0%" stop-color="#1C1A10" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#0D0F14" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>
  <rect width="1200" height="675" fill="url(#glow2)"/>

  <!-- Subtle map grid (meridians + parallels) -->
  <g stroke="#FFFFFF" stroke-opacity="0.035" stroke-width="0.8">
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

  <!-- ── Large central red stamp ring ── -->
  <circle cx="600" cy="337" r="280" fill="none" stroke="#DC3220" stroke-width="2" stroke-opacity="0.55"/>
  <circle cx="600" cy="337" r="258" fill="none" stroke="#DC3220" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="9 6"/>
  <circle cx="600" cy="337" r="236" fill="none" stroke="#DC3220" stroke-width="0.5" stroke-opacity="0.12"/>

  <!-- ── Amber stamp ring — top-left ── -->
  <circle cx="210" cy="190" r="155" fill="none" stroke="#D4860C" stroke-width="1.8" stroke-opacity="0.5"/>
  <circle cx="210" cy="190" r="138" fill="none" stroke="#D4860C" stroke-width="0.8" stroke-opacity="0.25" stroke-dasharray="7 5"/>
  <circle cx="210" cy="190" r="120" fill="none" stroke="#D4860C" stroke-width="0.4" stroke-opacity="0.12"/>

  <!-- ── Teal stamp ring — bottom-right ── -->
  <circle cx="1010" cy="510" r="175" fill="none" stroke="#067A5F" stroke-width="1.8" stroke-opacity="0.5"/>
  <circle cx="1010" cy="510" r="157" fill="none" stroke="#067A5F" stroke-width="0.8" stroke-opacity="0.25" stroke-dasharray="7 5"/>
  <circle cx="1010" cy="510" r="139" fill="none" stroke="#067A5F" stroke-width="0.4" stroke-opacity="0.12"/>

  <!-- ── Small amber ring — top-right ── -->
  <circle cx="1060" cy="115" r="88" fill="none" stroke="#D4860C" stroke-width="1.4" stroke-opacity="0.38"/>
  <circle cx="1060" cy="115" r="74" fill="none" stroke="#D4860C" stroke-width="0.6" stroke-opacity="0.18" stroke-dasharray="5 4"/>

  <!-- ── Small red ring — bottom-left ── -->
  <circle cx="140" cy="575" r="95" fill="none" stroke="#DC3220" stroke-width="1.4" stroke-opacity="0.35"/>
  <circle cx="140" cy="575" r="80" fill="none" stroke="#DC3220" stroke-width="0.6" stroke-opacity="0.18" stroke-dasharray="5 4"/>

  <!-- ── Teal small ring — mid-left ── -->
  <circle cx="70" cy="340" r="65" fill="none" stroke="#067A5F" stroke-width="1" stroke-opacity="0.3"/>
  <circle cx="70" cy="340" r="52" fill="none" stroke="#067A5F" stroke-width="0.5" stroke-opacity="0.15" stroke-dasharray="4 3"/>

  <!-- ── Dot cluster: stamped countries (teal, solid) ── -->
  <circle cx="480" cy="290" r="8" fill="#067A5F" fill-opacity="0.92"/>
  <circle cx="680" cy="210" r="9" fill="#067A5F" fill-opacity="0.88"/>
  <circle cx="820" cy="380" r="7" fill="#067A5F" fill-opacity="0.90"/>
  <circle cx="530" cy="430" r="10" fill="#067A5F" fill-opacity="0.85"/>
  <circle cx="740" cy="310" r="6" fill="#067A5F" fill-opacity="0.88"/>

  <!-- ── Dot cluster: explored (red) ── -->
  <circle cx="560" cy="330" r="7" fill="#DC3220" fill-opacity="0.92"/>
  <circle cx="640" cy="390" r="8" fill="#DC3220" fill-opacity="0.88"/>
  <circle cx="430" cy="360" r="6" fill="#DC3220" fill-opacity="0.90"/>
  <circle cx="760" cy="260" r="7" fill="#DC3220" fill-opacity="0.88"/>
  <circle cx="880" cy="310" r="5" fill="#DC3220" fill-opacity="0.85"/>
  <circle cx="340" cy="300" r="6" fill="#DC3220" fill-opacity="0.82"/>
  <circle cx="920" cy="430" r="7" fill="#DC3220" fill-opacity="0.88"/>

  <!-- ── Amber accent dots ── -->
  <circle cx="600" cy="57" r="4" fill="#D4860C" fill-opacity="0.55"/>
  <circle cx="600" cy="617" r="4" fill="#D4860C" fill-opacity="0.55"/>
  <circle cx="320" cy="337" r="4" fill="#D4860C" fill-opacity="0.55"/>
  <circle cx="880" cy="337" r="4" fill="#D4860C" fill-opacity="0.55"/>

  <!-- ── Undiscovered dots (very faint) ── -->
  <circle cx="230" cy="310" r="4" fill="#E8E4DC" fill-opacity="0.09"/>
  <circle cx="470" cy="175" r="3" fill="#E8E4DC" fill-opacity="0.08"/>
  <circle cx="700" cy="470" r="4" fill="#E8E4DC" fill-opacity="0.07"/>
  <circle cx="1000" cy="220" r="3" fill="#E8E4DC" fill-opacity="0.09"/>
  <circle cx="840" cy="145" r="4" fill="#E8E4DC" fill-opacity="0.07"/>
  <circle cx="130" cy="420" r="3" fill="#E8E4DC" fill-opacity="0.08"/>
  <circle cx="1100" cy="350" r="4" fill="#E8E4DC" fill-opacity="0.07"/>
  <circle cx="380" cy="510" r="3" fill="#E8E4DC" fill-opacity="0.08"/>
  <circle cx="950" cy="165" r="3" fill="#E8E4DC" fill-opacity="0.07"/>
  <circle cx="260" cy="470" r="4" fill="#E8E4DC" fill-opacity="0.08"/>

  <!-- ── Connection lines between teal dots (like a travel route) ── -->
  <g stroke="#067A5F" stroke-opacity="0.22" stroke-width="1" fill="none">
    <path d="M480,290 C530,270 620,230 680,210"/>
    <path d="M680,210 C720,230 760,270 820,380"/>
    <path d="M530,430 C580,410 620,380 640,390"/>
  </g>

  <!-- ── Subtle vignette overlay ── -->
  <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
    <stop offset="0%" stop-color="transparent"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
  </radialGradient>
  <rect width="1200" height="675" fill="url(#vignette)"/>
</svg>
`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
});

const pngBuffer = resvg.render().asPng();
const outPath = path.join(__dirname, "cover-image.png");
fs.writeFileSync(outPath, pngBuffer);

const sizeKb = Math.round(pngBuffer.length / 1024);
console.log(`✓ Written ${outPath} (${sizeKb} KB)`);
