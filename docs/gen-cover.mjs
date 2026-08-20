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
      <circle cx="400" cy="286" r="178"/>
    </clipPath>
    <clipPath id="passClip">
      <rect x="0" y="0" width="372" height="128" rx="8"/>
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
  <circle cx="400" cy="286" r="178" fill="#6EA8C4"/>

  <g clip-path="url(#globeClip)">
    <path d="M258 218 C290 180, 348 174, 378 204 C402 228, 390 260, 360 276 C324 296, 278 288, 258 258 C246 240, 242 230, 258 218Z" fill="#067A5F"/>
    <path d="M328 304 C352 298, 370 314, 374 338 C378 370, 362 414, 340 432 C320 446, 306 428, 312 402 C318 376, 312 340, 328 304Z" fill="#067A5F"/>
    <path d="M416 198 C436 188, 462 196, 472 216 C480 234, 466 246, 446 244 C426 242, 408 218, 416 198Z" fill="#067A5F"/>
    <path d="M438 236 C476 226, 504 250, 508 286 C514 326, 494 372, 468 390 C440 408, 422 380, 428 346 C434 312, 420 258, 438 236Z" fill="#067A5F"/>
    <path d="M486 182 C542 164, 606 180, 630 216 C650 246, 640 280, 602 290 C568 300, 532 276, 510 244 C494 222, 476 198, 486 182Z" fill="#067A5F"/>
    <path d="M600 354 C626 346, 648 360, 652 378 C656 396, 636 408, 614 404 C594 400, 582 368, 600 354Z" fill="#067A5F"/>
  </g>

  <g fill="none" stroke="#F6F1E8" stroke-opacity="0.4" stroke-width="1.3">
    <ellipse cx="400" cy="286" rx="62" ry="178"/>
    <ellipse cx="400" cy="286" rx="124" ry="178"/>
    <line x1="222" y1="286" x2="578" y2="286"/>
    <ellipse cx="400" cy="286" rx="178" ry="62"/>
    <ellipse cx="400" cy="286" rx="178" ry="116"/>
  </g>
  <circle cx="400" cy="286" r="178" fill="none" stroke="#1A2744" stroke-width="6"/>

  <!-- ── Passport overlapping the globe ────────────────────────────── -->
  <g transform="translate(590 118) rotate(-8)">
    <rect x="16" y="12" width="186" height="252" rx="9" fill="#FAF7F0" stroke="#D2CBBE" stroke-width="2"/>
    <rect x="0" y="0" width="186" height="252" rx="9" fill="#1A2744"/>
    <rect x="14" y="14" width="158" height="224" rx="5" fill="none" stroke="#D4860C" stroke-width="1.8"/>
    <rect x="22" y="22" width="142" height="208" rx="3" fill="none" stroke="#D4860C" stroke-width="0.9" stroke-dasharray="4 3.5"/>
    <circle cx="93" cy="110" r="40" fill="none" stroke="#D4860C" stroke-width="2.8"/>
    <circle cx="93" cy="110" r="31" fill="none" stroke="#D4860C" stroke-width="1.1" stroke-dasharray="4 3"/>
    <circle cx="93" cy="110" r="15" fill="none" stroke="#D4860C" stroke-width="1.5"/>
    <ellipse cx="93" cy="110" rx="6.5" ry="15" fill="none" stroke="#D4860C" stroke-width="1.2"/>
    <line x1="78" y1="110" x2="108" y2="110" stroke="#D4860C" stroke-width="1.2"/>
  </g>

  <!-- ── Boarding pass ─────────────────────────────────────────────── -->
  <g transform="translate(318 348) rotate(6)">
    <g clip-path="url(#passClip)">
      <rect x="0" y="0" width="372" height="128" rx="8" fill="#FFFBFC"/>
      <rect x="0" y="0" width="372" height="30" fill="#DC3220"/>
      <!-- field blocks instead of tiny text -->
      <rect x="18" y="48" width="72" height="8" rx="2" fill="#D6D0C6"/>
      <rect x="18" y="64" width="118" height="14" rx="2" fill="#1A2744"/>
      <rect x="18" y="92" width="52" height="8" rx="2" fill="#D6D0C6"/>
      <rect x="18" y="106" width="78" height="10" rx="2" fill="#5A5F6C"/>
      <rect x="150" y="48" width="52" height="8" rx="2" fill="#D6D0C6"/>
      <rect x="150" y="64" width="64" height="14" rx="2" fill="#1A2744"/>
      <rect x="150" y="92" width="40" height="8" rx="2" fill="#D6D0C6"/>
      <rect x="150" y="106" width="48" height="10" rx="2" fill="#5A5F6C"/>
      <!-- plane mark -->
      <path d="M236 58 L268 72 L236 86 L242 72 Z" fill="#DC3220"/>
      <rect x="220" y="70" width="64" height="4" rx="2" fill="#DC3220"/>
    </g>
    <rect x="0" y="0" width="372" height="128" rx="8" fill="none" stroke="#1A2744" stroke-width="4"/>
    <!-- perforation + stub -->
    <line x1="278" y1="8" x2="278" y2="120" stroke="#1A2744" stroke-width="1.6" stroke-dasharray="3.5 4"/>
    <circle cx="278" cy="0" r="9" fill="#F6F1E8"/>
    <circle cx="278" cy="128" r="9" fill="#F6F1E8"/>
    <!-- barcode on stub -->
    <g fill="#1A2744">
      <rect x="292" y="42" width="3" height="62"/>
      <rect x="298" y="42" width="2" height="62"/>
      <rect x="303" y="42" width="5" height="62"/>
      <rect x="311" y="42" width="2" height="62"/>
      <rect x="316" y="42" width="3" height="62"/>
      <rect x="322" y="42" width="2" height="62"/>
      <rect x="327" y="42" width="6" height="62"/>
      <rect x="336" y="42" width="2" height="62"/>
      <rect x="341" y="42" width="4" height="62"/>
      <rect x="348" y="42" width="2" height="62"/>
      <rect x="353" y="42" width="3" height="62"/>
    </g>
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
