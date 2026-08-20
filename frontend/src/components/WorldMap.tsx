import { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { resolveMapCountry } from "../countries";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Tooltip {
  x: number;
  y: number;
  name: string;
  emoji?: string;
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

  const getFill = useCallback((code: string | undefined) => {
    if (!code) return "var(--color-map-land)";
    if (stampedCodes.has(code)) return "var(--color-map-stamped)";
    if ((exploredCounts[code] ?? 0) > 0) return "var(--color-map-explored)";
    return "var(--color-map-land)";
  }, [stampedCodes, exploredCounts]);

  return (
    <div className="pp-map-canvas">
      <ComposableMap
        projectionConfig={{ scale: 147, center: [10, 12] }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const props = geo.properties as Record<string, unknown>;
              const resolved = resolveMapCountry(props);
              const code = resolved?.code;
              const label = resolved?.name
                || String(props.NAME || props.NAME_EN || props.name || "").trim();
              const fill = getFill(code);
              const isExplored = code ? (exploredCounts[code] ?? 0) > 0 : false;
              const isStamped = code ? stampedCodes.has(code) : false;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="var(--color-map-ocean)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none", fill, cursor: resolved ? "pointer" : "default", transition: "fill 0.2s ease" },
                    hover: {
                      outline: "none",
                      fill: isStamped
                        ? "var(--color-teal)"
                        : isExplored
                          ? "var(--color-red-hover)"
                          : isDark ? "#3A4258" : "#C4B8A8",
                      cursor: resolved ? "pointer" : "default",
                    },
                    pressed: { outline: "none" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (resolved) onCountryClick(resolved.code);
                  }}
                  onMouseMove={(e) => {
                    if (!label) return;
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      name: label,
                      count: code ? (exploredCounts[code] ?? 0) : 0,
                      stamped: isStamped,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.name}
          {tooltip.stamped && " · stamped"}
          {!tooltip.stamped && tooltip.count > 0 && ` · ${tooltip.count} dish${tooltip.count !== 1 ? "es" : ""}`}
        </div>
      )}

      <div className="pp-map-legend">
        {[
          { color: "var(--color-map-stamped)", label: "Stamped" },
          { color: "var(--color-map-explored)", label: "Explored" },
          { color: "var(--color-map-land)", label: "Undiscovered" },
        ].map((item) => (
          <div key={item.label} className="pp-map-legend-item">
            <div className="pp-map-swatch" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
