import { useState } from "react";
import { api } from "../api";
import type { Meal } from "../api";
import { COUNTRIES, getCountry } from "../countries";

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
  const preselected = preselectedCountry ? getCountry(preselectedCountry) : undefined;

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
      <div
        onClick={onClose}
        className="animate-fade-in pp-backdrop pp-backdrop-front"
      />

      <div className="pp-sheet-slot">
        <div className="animate-slide-up pp-sheet">
          <div className="pp-sheet-handle" />

          <div className="pp-sheet-head">
            <h2>{preselected ? `Log a ${preselected.cuisine} dish` : "Log a dish"}</h2>
            <button type="button" className="pp-icon-btn" onClick={onClose} aria-label="Close">×</button>
          </div>

          <form onSubmit={handleSubmit} className="pp-form">
            <div>
              <label className="pp-label">Country / cuisine</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="pp-input"
              >
                <option value="">Select a country…</option>
                {sortedCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.emoji} {c.name} — {c.cuisine}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="pp-label">Dish name</label>
              <input
                type="text"
                placeholder="e.g. Pad Thai, Tagine, Pierogi…"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                className="pp-input"
                autoFocus
              />
            </div>

            <div>
              <label className="pp-label">
                Notes <span className="pp-label-optional">(optional)</span>
              </label>
              <textarea
                placeholder="Where you had it, how it tasted…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="pp-input pp-textarea"
              />
            </div>

            {error && <p className="pp-form-error">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="pp-btn-primary"
            >
              {submitting ? "Logging…" : "Log this dish"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
