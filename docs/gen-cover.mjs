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
    <clipPath id="globeClip">
      <circle cx="470" cy="300" r="188"/>
    </clipPath>
  </defs>

  <rect width="1200" height="675" fill="#F6F1E8"/>

  <!-- faint corner stamp rings — graphic, not a grid -->
  <circle cx="80" cy="80" r="120" fill="none" stroke="#DC3220" stroke-width="2" stroke-opacity="0.12"/>
  <circle cx="80" cy="80" r="98" fill="none" stroke="#DC3220" stroke-width="1" stroke-dasharray="6 5" stroke-opacity="0.12"/>
  <circle cx="1140" cy="620" r="140" fill="none" stroke="#067A5F" stroke-width="2" stroke-opacity="0.12"/>
  <circle cx="1140" cy="620" r="116" fill="none" stroke="#067A5F" stroke-width="1" stroke-dasharray="6 5" stroke-opacity="0.12"/>
  <circle cx="1120" cy="70" r="70" fill="none" stroke="#D4860C" stroke-width="1.5" stroke-opacity="0.16"/>

  <!-- ── Globe ─────────────────────────────────────────────────────── -->
  <circle cx="470" cy="300" r="188" fill="#6EA8C4"/>

  <g clip-path="url(#globeClip)">
    <path d="M318 228 C352 188, 412 182, 444 214 C470 240, 456 274, 424 292 C386 314, 338 306, 316 274 C304 254, 300 244, 318 228Z" fill="#067A5F"/>
    <path d="M392 318 C418 312, 438 328, 442 354 C446 388, 428 436, 404 456 C382 472, 366 452, 372 424 C378 396, 372 358, 392 318Z" fill="#067A5F"/>
    <path d="M486 208 C508 198, 536 206, 546 228 C554 248, 538 260, 516 258 C494 256, 476 230, 486 208Z" fill="#067A5F"/>
    <path d="M508 248 C548 236, 578 262, 582 300 C588 344, 566 392, 538 412 C508 432, 488 402, 494 366 C500 330, 486 272, 508 248Z" fill="#067A5F"/>
    <path d="M556 192 C616 172, 684 190, 710 228 C732 260, 720 296, 680 306 C644 316, 606 290, 582 256 C564 232, 544 208, 556 192Z" fill="#067A5F"/>
    <path d="M676 372 C704 364, 728 378, 732 398 C736 418, 714 432, 690 428 C668 424, 656 388, 676 372Z" fill="#067A5F"/>
  </g>

  <g fill="none" stroke="#F6F1E8" stroke-opacity="0.4" stroke-width="1.3">
    <ellipse cx="470" cy="300" rx="66" ry="188"/>
    <ellipse cx="470" cy="300" rx="132" ry="188"/>
    <line x1="282" y1="300" x2="658" y2="300"/>
    <ellipse cx="470" cy="300" rx="188" ry="66"/>
    <ellipse cx="470" cy="300" rx="188" ry="122"/>
  </g>
  <circle cx="470" cy="300" r="188" fill="none" stroke="#1A2744" stroke-width="6"/>

  <!-- ── Passport overlapping the globe ────────────────────────────── -->
  <g transform="translate(690 148) rotate(-8)">
    <rect x="16" y="12" width="198" height="270" rx="9" fill="#FAF7F0" stroke="#D2CBBE" stroke-width="2"/>
    <rect x="0" y="0" width="198" height="270" rx="9" fill="#1A2744"/>
    <rect x="14" y="14" width="170" height="242" rx="5" fill="none" stroke="#D4860C" stroke-width="1.8"/>
    <rect x="22" y="22" width="154" height="226" rx="3" fill="none" stroke="#D4860C" stroke-width="0.9" stroke-dasharray="4 3.5"/>
    <circle cx="99" cy="118" r="42" fill="none" stroke="#D4860C" stroke-width="2.8"/>
    <circle cx="99" cy="118" r="33" fill="none" stroke="#D4860C" stroke-width="1.1" stroke-dasharray="4 3"/>
    <circle cx="99" cy="118" r="16" fill="none" stroke="#D4860C" stroke-width="1.5"/>
    <ellipse cx="99" cy="118" rx="7" ry="16" fill="none" stroke="#D4860C" stroke-width="1.2"/>
    <line x1="83" y1="118" x2="115" y2="118" stroke="#D4860C" stroke-width="1.2"/>
  </g>

  <!-- Title lockup -->
  <text x="600" y="560" text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="36" font-weight="700" letter-spacing="-0.4"
        fill="#111318">Full Stack Challenge : PlatePilgrim</text>
  <text x="600" y="598" text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="18" font-weight="400"
        fill="#5A5F6C">Turn every meal into a passport stamp.</text>
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
console.log(`Written ${outPath} (${Math.round(pngBuffer.length / 1024)} KB)`);
