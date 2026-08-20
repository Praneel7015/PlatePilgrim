import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svg = `
<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <circle cx="80" cy="80" r="78" fill="#1A2744"/>
  <circle cx="80" cy="80" r="58" fill="#6EA8C4"/>
  <circle cx="80" cy="80" r="58" fill="none" stroke="#F6F1E8" stroke-width="2"/>
  <ellipse cx="80" cy="80" rx="22" ry="58" fill="none" stroke="#F6F1E8" stroke-width="1.6"/>
  <ellipse cx="80" cy="80" rx="58" ry="22" fill="none" stroke="#F6F1E8" stroke-width="1.6"/>
  <line x1="22" y1="80" x2="138" y2="80" stroke="#F6F1E8" stroke-width="1.6"/>
  <path d="M48 62 C62 48, 78 50, 86 62 C92 72, 78 80, 64 78 C54 76, 44 70, 48 62Z" fill="#067A5F"/>
  <path d="M88 58 C102 50, 120 58, 124 74 C128 90, 114 98, 100 94 C90 90, 82 70, 88 58Z" fill="#067A5F"/>
  <path d="M70 88 C82 84, 90 96, 88 110 C86 124, 74 130, 66 122 C58 114, 60 94, 70 88Z" fill="#067A5F"/>
  <circle cx="80" cy="80" r="70" fill="none" stroke="#D4860C" stroke-width="3"/>
  <circle cx="80" cy="80" r="64" fill="none" stroke="#D4860C" stroke-width="1" stroke-dasharray="4 3"/>
</svg>
`;

const png = new Resvg(svg, { fitTo: { mode: "width", value: 160 } }).render().asPng();
const out = path.join(__dirname, "../infra/assets/cognito-logo.png");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, png);
console.log(`Wrote ${out} (${Math.round(png.length / 1024)} KB)`);
