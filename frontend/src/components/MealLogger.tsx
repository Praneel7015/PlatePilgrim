import { useState } from "react";
import { api } from "../api";
import type { Meal } from "../api";
import { COUNTRIES } from "../countries";

interface Props {
  onClose: () => void;
  onLogged: (meal: Meal, stampAwarded: boolean) => void;
  preselectedCountry?: string;
}

export default function MealLogger({ onClose, onLogged, preselectedCountry }: Props) {
  const [country, setCountry] = useState(preselectedCountry ?? "");
  const [dish, setDish] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedCountries = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!country) { setError("Please select a country."); return; }
    if (!dish.trim()) { setError("Please enter a dish name."); return; }

    setSubmitting(true);
    try {
      const selectedCountryMeta = COUNTRIES.find((c) => c.code === country);
      const result = await api.logMeal({
        countryCode: country,
        countryName: selectedCountryMeta?.name ?? country,
        dish: dish.trim(),
        notes: notes.trim(),
      });
      onLogged(result.meal, result.stampAwarded);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      if (message.includes("401") || message.includes("403")) {
        setError("Session expired. Sign out and sign in again, then retry.");
      } else {
        setError("Could not log this dish. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="animate-fade-in"
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)",
        }}
      />

      {/* Modal */}
      <div
        className="animate-slide-up"
        style={{
          position: "fixed", zIndex: 50,
          /* Bottom-sheet on mobile, centered on desktop */
          bottom: 0, left: 0, right: 0,
          borderRadius: "20px 20px 0 0",
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          padding: "28px 24px 40px",
          maxHeight: "90dvh", overflowY: "auto",
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--color-border)", margin: "0 auto 24px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: 20, color: "var(--color-ink)", margin: 0 }}>
            Log a dish
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--color-ink-3)", padding: "4px 8px", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Country */}
          <div>
            <label style={labelStyle}>Country / cuisine</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select a country…</option>
              {sortedCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.emoji} {c.name} — {c.cuisine}
                </option>
              ))}
            </select>
          </div>

          {/* Dish name */}
          <div>
            <label style={labelStyle}>Dish name</label>
            <input
              type="text"
              placeholder="e.g. Pad Thai, Tagine, Pierogi…"
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              style={inputStyle}
              autoFocus
            />
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes <span style={{ color: "var(--color-ink-3)", fontWeight: 400 }}>(optional)</span></label>
            <textarea
              placeholder="Where you had it, how it tasted…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: "var(--color-red)", margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 10,
              background: submitting ? "var(--color-border)" : "var(--color-red)",
              color: submitting ? "var(--color-ink-3)" : "#fff",
              fontFamily: "var(--font-family-display)", fontWeight: 700,
              fontSize: 15, border: "none", cursor: submitting ? "default" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {submitting ? "Logging…" : "Log this dish"}
          </button>
        </form>
      </div>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--color-ink-2)",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--color-surface-2)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  padding: "11px 12px",
  fontSize: 14,
  color: "var(--color-ink)",
  outline: "none",
  fontFamily: "var(--font-family-body)",
  transition: "border-color 0.15s",
};
