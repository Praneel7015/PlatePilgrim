import { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { getCountry } from "../countries";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Tooltip {
  x: number;
  y: number;
  name: string;
  emoji: string;
  count: number;
  stamped: boolean;
}

interface Props {
  stampedCodes: Set<string>;
  exploredCounts: Record<string, number>;
  onCountryClick: (code: string) => void;
  isDark: boolean;
}

export default function WorldMap({ stampedCodes, exploredCounts, onCountryClick, isDark }: Props) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const getFill = useCallback((alpha2: string | undefined) => {
    if (!alpha2) return "var(--color-map-land)";
    if (stampedCodes.has(alpha2)) return "var(--color-map-stamped)";
    if ((exploredCounts[alpha2] ?? 0) > 0) return "var(--color-map-explored)";
    return "var(--color-map-land)";
  }, [stampedCodes, exploredCounts]);

  return (
    <div style={{ width: "100%", height: "100%", background: "var(--color-map-ocean)", position: "relative" }}>
      <ComposableMap
        projectionConfig={{ scale: 160, center: [10, 10] }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const alpha2 = geo.properties?.ISO_A2_EH ?? geo.properties?.ISO_A2 ?? geo.properties?.iso_a2;
              const country = alpha2 ? getCountry(alpha2) : null;
              const fill = getFill(alpha2);
              const isExplored = alpha2 ? (exploredCounts[alpha2] ?? 0) > 0 : false;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="var(--color-map-ocean)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none", transition: "fill 0.2s ease" },
                    hover: {
                      outline: "none",
                      fill: stampedCodes.has(alpha2 ?? "")
                        ? "var(--color-teal)"
                        : isExplored
                          ? "var(--color-red-hover)"
                          : isDark ? "#333A4D" : "#B8B0A8",
                      cursor: "pointer",
                    },
                    pressed: { outline: "none" },
                  }}
                  onClick={() => alpha2 && onCountryClick(alpha2)}
                  onMouseMove={(e) => {
                    if (!alpha2 || !country) return;
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      name: country.name,
                      emoji: country.emoji,
                      count: exploredCounts[alpha2] ?? 0,
                      stamped: stampedCodes.has(alpha2),
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.emoji} {tooltip.name}
          {tooltip.stamped && " · stamped ✓"}
          {!tooltip.stamped && tooltip.count > 0 && ` · ${tooltip.count} dish${tooltip.count !== 1 ? "es" : ""}`}
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: "absolute", top: 70, right: 16,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        {[
          { color: "var(--color-map-stamped)", label: "Stamped" },
          { color: "var(--color-map-explored)", label: "Explored" },
          { color: "var(--color-map-land)", label: "Undiscovered" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.85 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: "var(--color-ink-2)",
              fontFamily: "var(--font-family-body)",
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
