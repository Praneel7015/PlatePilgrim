import { useEffect, useState } from "react";
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
    <div className="pp-stamp-wrap">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className={earned ? "animate-stamp-press" : ""}
        style={{ opacity: earned ? 1 : 0.4 }}
      >
        <circle cx="80" cy="80" r="72" fill="none" stroke={strokeColor} strokeWidth={earned ? 2.5 : 1.5} />
        <circle cx="80" cy="80" r="62" fill="none" stroke={strokeColor} strokeWidth={1} strokeDasharray="4 3" />

        <defs>
          <path id="topArc" d="M 14,80 A 66,66 0 0,1 146,80" />
          <path id="botArc" d="M 22,80 A 58,58 0 0,0 138,80" />
        </defs>
        <text fill={strokeColor} fontSize="11" fontFamily="var(--font-family-display)" fontWeight="700" letterSpacing="2">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            {(country?.name ?? "").toUpperCase()}
          </textPath>
        </text>

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

      {!earned && (
        <div className="pp-stamp-progress">
          <div className="pp-stamp-bar">
            <div className="pp-stamp-bar-fill" style={{ width: `${(Math.min(meals.length, 3) / 3) * 100}%` }} />
          </div>
          <p>
            {meals.length}/3 dishes · {3 - Math.min(meals.length, 3)} more to earn stamp
          </p>
        </div>
      )}
    </div>
  );
}

export default function PassportDrawer({ countryCode, meals, stamp, onClose, onDeleteMeal, onAddDish }: Props) {
  const [open, setOpen] = useState(false);
  const country = getCountry(countryCode);
  const difficulty = country?.difficulty === 3 ? "Adventurous" : country?.difficulty === 2 ? "Intermediate" : "Easy";

  function handleClose() {
    setOpen(false);
    setTimeout(onClose, 280);
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") handleClose(); }
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <div
        onClick={handleClose}
        className="animate-fade-in pp-backdrop"
      />

      <aside className={`pp-drawer${open ? " pp-drawer-open" : ""}`} aria-label={`${country?.name ?? countryCode} details`}>
        <div className="pp-drawer-handle" />

        <div className="pp-drawer-head">
          <div>
            <h2>
              {country?.emoji} {country?.name ?? countryCode}
            </h2>
            <p>
              {country?.cuisine} · {country?.continent} · {difficulty}
            </p>
          </div>
          <button type="button" className="pp-icon-btn" onClick={handleClose} aria-label="Close">×</button>
        </div>

        <div className="pp-drawer-stamp">
          <PassportStamp country={country} stamp={stamp} meals={meals} />
        </div>

        <div className="pp-drawer-body">
          <button type="button" className="pp-btn-primary" onClick={onAddDish}>
            + Add a dish from {country?.name ?? "this country"}
          </button>

          <div className="pp-drawer-log-head">
            <span>Dishes logged</span>
            <span>{meals.length}</span>
          </div>

          {meals.length === 0 ? (
            <div className="pp-muted-center">No dishes logged yet. Add one to light this country up on the map.</div>
          ) : (
            <div className="pp-meal-list">
              {meals.map((meal) => (
                <MealCard key={meal.mealId} meal={meal} onDelete={onDeleteMeal} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function MealCard({ meal, onDelete }: { meal: Meal; onDelete: (id: string) => void }) {
  const date = new Date(meal.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="pp-meal-card">
      <div className="pp-meal-card-row">
        <div className="pp-meal-card-body">
          <div className="pp-meal-card-title">{meal.dish}</div>
          <div className="pp-meal-card-date">{date}</div>
          {meal.notes && <div className="pp-meal-card-notes">{meal.notes}</div>}
          {meal.funFact && <div className="pp-meal-card-fact">{meal.funFact}</div>}
        </div>
        <button
          type="button"
          onClick={() => onDelete(meal.mealId)}
          title="Delete"
          className="pp-icon-btn pp-icon-btn-danger"
          aria-label="Delete dish"
        >
          ×
        </button>
      </div>
    </div>
  );
}
