import type { DareResponse } from "../api";
import { getCountry } from "../countries";
import RecipeMarkdown, { extractDishName } from "./RecipeMarkdown";

interface Props {
  dare: DareResponse | null;
  loading: boolean;
  onClose: () => void;
  onTry: (countryCode: string) => void;
}

const DIFFICULTY_META: Record<number, { label: string; color: string }> = {
  1: { label: "Easy",         color: "var(--color-teal)"  },
  2: { label: "Intermediate", color: "var(--color-amber)" },
  3: { label: "Adventurous",  color: "var(--color-red)"   },
};

export default function DareCard({ dare, loading, onClose, onTry }: Props) {
  const dareCode = dare?.country?.code ?? "";
  const country = dareCode ? getCountry(dareCode) : null;
  const diff = DIFFICULTY_META[country?.difficulty ?? dare?.country?.difficulty ?? 1] ?? DIFFICULTY_META[1];
  const dishName = extractDishName(dare?.recipe) ?? dare?.country?.name ?? "Today's dare";

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
          <h2>🎲 Today's dare</h2>
          <button type="button" className="pp-icon-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        {loading ? (
          <div className="pp-sheet-loading"><div className="spinner" /></div>
        ) : dare?.allExplored ? (
          <p className="pp-muted-center">{dare.message ?? "You've explored every cuisine."}</p>
        ) : dare ? (
          <div className="pp-stack">
            <div className="pp-banner-card">
              <span className="pp-banner-emoji">{country?.emoji ?? dare.country?.emoji ?? "🌍"}</span>
              <div>
                <h3>{dishName}</h3>
                <div className="pp-banner-meta">
                  <span>{country?.name ?? dare.country?.name} · {country?.cuisine ?? dare.country?.cuisine}</span>
                  <span className="pp-pill" style={{ color: diff.color, borderColor: diff.color }}>
                    {diff.label}
                  </span>
                </div>
              </div>
            </div>

            {dare.recipe && (
              <div className="pp-recipe-block">
                <p className="pp-recipe-label">Beginner recipe</p>
                <RecipeMarkdown text={dare.recipe} />
              </div>
            )}

            <div className="pp-sheet-actions">
              <button type="button" className="pp-btn-primary" onClick={() => dareCode && onTry(dareCode)}>
                Try it
              </button>
              <button type="button" className="pp-btn-ghost" onClick={onClose}>
                Skip
              </button>
            </div>
          </div>
        ) : (
          <p className="pp-muted-center">No dare available. Try again later.</p>
        )}
      </div>
      </div>
    </>
  );
}
