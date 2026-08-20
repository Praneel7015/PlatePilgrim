import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";

// react-simple-maps injects rsmKey at runtime
type RSMFeature = Feature<Geometry, GeoJsonProperties> & { rsmKey: string };

// World topojson from public CDN — no local file needed
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO numeric → alpha-2 mapping for the most-relevant countries in our list
// (react-simple-maps world-atlas uses numeric codes)
const NUMERIC_TO_ALPHA2: Record<string, string> = {
  "380": "IT", "392": "JP", "356": "IN", "484": "MX", "250": "FR",
  "156": "CN", "764": "TH", "300": "GR", "724": "ES", "504": "MA",
  "231": "ET", "566": "NG", "818": "EG", "710": "ZA", "686": "SN",
  "288": "GH", "788": "TN", "404": "KE", "120": "CM", "076": "BR",
  "604": "PE", "032": "AR", "170": "CO", "192": "CU", "388": "JM",
  "152": "CL", "840": "US", "124": "CA", "792": "TR", "422": "LB",
  "364": "IR", "368": "IQ", "682": "SA", "704": "VN", "410": "KR",
  "608": "PH", "360": "ID", "458": "MY", "702": "SG", "586": "PK",
  "050": "BD", "144": "LK", "524": "NP", "104": "MM", "116": "KH",
  "826": "GB", "276": "DE", "620": "PT", "616": "PL", "643": "RU",
  "804": "UA", "348": "HU", "642": "RO", "752": "SE", "036": "AU",
  "554": "NZ", "242": "FJ", "376": "IL", "268": "GE", "860": "UZ",
  "398": "KZ", "496": "MN",
};

interface Props {
  stampedCodes: Set<string>;
  exploredCounts: Record<string, number>;
  onCountryClick: (code: string) => void;
}

function getFill(code: string, stamped: Set<string>, explored: Record<string, number>) {
  if (stamped.has(code)) return "#F39C12"; // saffron — stamped
  if ((explored[code] ?? 0) > 0) return "#C0392B"; // chili red — explored
  return "#D6CAB8"; // parchment-grey — untouched
}

function getFillDark(code: string, stamped: Set<string>, explored: Record<string, number>) {
  if (stamped.has(code)) return "#F39C12";
  if ((explored[code] ?? 0) > 0) return "#C0392B";
  return "#2e3f4f";
}

export default function WorldMap({ stampedCodes, exploredCounts, onCountryClick }: Props) {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-[#2C3E50]/10 dark:border-white/10">
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: RSMFeature[] }) =>
            geographies.map((geo: RSMFeature) => {
              const numericId = String(geo.id).padStart(3, "0");
              const alpha2 = NUMERIC_TO_ALPHA2[numericId];
              const fill = alpha2
                ? (isDark ? getFillDark : getFill)(alpha2, stampedCodes, exploredCounts)
                : isDark ? "#2e3f4f" : "#D6CAB8";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={isDark ? "#1a252f" : "#F5F0E8"}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none", transition: "fill 0.2s" },
                    hover: { fill: alpha2 ? "#e67e22" : fill, outline: "none", cursor: alpha2 ? "pointer" : "default" },
                    pressed: { fill: "#d35400", outline: "none" },
                  }}
                  onClick={() => {
                    if (alpha2) onCountryClick(alpha2);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 bg-white/40 dark:bg-white/5 text-xs text-[#2C3E50]/70 dark:text-white/60">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-[#F39C12]"/> Stamped (3+ dishes)</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-[#C0392B]"/> Explored (1-2)</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-[#D6CAB8] dark:bg-[#2e3f4f]"/> Undiscovered</span>
      </div>
    </div>
  );
}
