import { useEffect, useRef } from "react";
import type { Meal, Stamp } from "../api";
import { getCountry } from "../countries";

interface Props {
  countryCode: string;
  meals: Meal[];
  stamp: Stamp | null;
  onClose: () => void;
  onDeleteMeal: (id: string) => void;
  onAddDish: () => void;
}

function PassportStamp({ country, stamp, meals }: { country: ReturnType<typeof getCountry>; stamp: Stamp | null; meals: Meal[] }) {
  const earned = !!stamp;
  const strokeColor = earned ? "var(--color-amber)" : "var(--color-border)";
  const stampDate = stamp ? new Date(stamp.earnedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className={earned ? "animate-stamp-press" : ""}
        style={{ opacity: earned ? 1 : 0.4 }}
      >
        {/* Outer ring */}
        <circle cx="80" cy="80" r="72" fill="none" stroke={strokeColor} strokeWidth={earned ? 2.5 : 1.5} />
        {/* Inner dashed ring */}
        <circle cx="80" cy="80" r="62" fill="none" stroke={strokeColor} strokeWidth={1} strokeDasharray="4 3" />

        {/* Top arc path (country name) */}
        <defs>
          <path id="topArc" d="M 14,80 A 66,66 0 0,1 146,80" />
          <path id="botArc" d="M 22,80 A 58,58 0 0,0 138,80" />
        </defs>
        <text fill={strokeColor} fontSize="11" fontFamily="var(--font-family-display)" fontWeight="700" letterSpacing="2">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            {(country?.name ?? "").toUpperCase()}
          </textPath>
        </text>

        {/* Center content */}
        <text x="80" y="72" textAnchor="middle" fontSize="28" dominantBaseline="middle">
          {country?.emoji ?? "🌍"}
        </text>
        {earned && (
          <>
            <text x="80" y="97" textAnchor="middle" fill={strokeColor} fontSize="9" fontFamily="var(--font-family-display)" fontWeight="700" letterSpacing="3">
              VISITED
            </text>
            <text fill={strokeColor} fontSize="9" fontFamily="var(--font-family-body)" letterSpacing="1">
              <textPath href="#botArc" startOffset="50%" textAnchor="middle">
                {stampDate.toUpperCase()}
              </textPath>
            </text>
          </>
        )}
      </svg>

      {/* Progress bar if not earned yet */}
      {!earned && (
        <div style={{ width: 160 }}>
          <div style={{ height: 4, borderRadius: 4, background: "var(--color-border)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%", borderRadius: 4,
                background: "var(--color-amber)",
                width: `${(Math.min(meals.length, 3) / 3) * 100}%`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <p style={{ fontSize: 11, color: "var(--color-ink-3)", textAlign: "center", marginTop: 6 }}>
            {meals.length}/3 dishes · {3 - Math.min(meals.length, 3)} more to earn stamp
          </p>
        </div>
      )}
    </div>
  );
}

export default function PassportDrawer({ countryCode, meals, stamp, onClose, onDeleteMeal, onAddDish }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const country = getCountry(countryCode);

  useEffect(() => {
    // Slide in on mount
    const el = drawerRef.current;
    if (!el) return;
    requestAnimationFrame(() => { el.style.transform = "translateX(0)"; });

    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleClose() {
    const el = drawerRef.current;
    if (!el) { onClose(); return; }
    el.style.transform = "translateX(100%)";
    setTimeout(onClose, 280);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)",
        }}
        className="animate-fade-in"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
          width: "min(420px, 100vw)",
          background: "var(--color-surface)",
          borderLeft: "1px solid var(--color-border)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
          transform: "translateX(100%)",
          transition: "transform 0.28s cubic-bezier(0.32, 0, 0.18, 1)",
          willChange: "transform",
        }}
      >
        {/* Header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: 18, color: "var(--color-ink)", margin: 0 }}>
              {country?.emoji} {country?.name ?? countryCode}
            </h2>
            <p style={{ fontSize: 12, color: "var(--color-ink-3)", margin: "2px 0 0" }}>
              {country?.cuisine} · {country?.continent}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--color-ink-3)", padding: "4px 8px", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Stamp */}
        <div style={{ padding: "32px 20px 24px", display: "flex", justifyContent: "center", borderBottom: "1px solid var(--color-border)" }}>
          <PassportStamp country={country} stamp={stamp} meals={meals} />
        </div>

        {/* Meal log */}
        <div style={{ padding: "20px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Dishes logged
            </span>
            <button
              onClick={onAddDish}
              style={{
                fontSize: 12, fontWeight: 600, color: "var(--color-red)",
                background: "none", border: "none", cursor: "pointer", padding: "2px 6px",
              }}
            >
              + Add dish
            </button>
          </div>

          {meals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: "var(--color-ink-3)", fontSize: 14 }}>
              No dishes logged yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {meals.map((meal) => (
                <MealCard key={meal.mealId} meal={meal} onDelete={onDeleteMeal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MealCard({ meal, onDelete }: { meal: Meal; onDelete: (id: string) => void }) {
  const date = new Date(meal.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        borderRadius: 12, padding: "14px 14px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-ink)", marginBottom: 3 }}>
            {meal.dish}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-ink-3)" }}>{date}</div>
          {meal.notes && (
            <div style={{ fontSize: 13, color: "var(--color-ink-2)", marginTop: 6 }}>{meal.notes}</div>
          )}
          {meal.funFact && (
            <div style={{
              marginTop: 8, fontSize: 12,
              color: "var(--color-amber)",
              fontStyle: "italic",
              borderLeft: "2px solid var(--color-amber)",
              paddingLeft: 8,
            }}>
              {meal.funFact}
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(meal.mealId)}
          title="Delete"
          style={{
            flexShrink: 0, marginLeft: 10, background: "none", border: "none",
            cursor: "pointer", color: "var(--color-ink-3)",
            fontSize: 15, padding: "2px 4px", lineHeight: 1,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-red)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-ink-3)")}
        >
          ×
        </button>
      </div>
    </div>
  );
}
