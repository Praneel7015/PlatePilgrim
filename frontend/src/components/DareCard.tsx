import type { DareResponse } from "../api";
import { getCountry } from "../countries";

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
  const diff = DIFFICULTY_META[country?.difficulty ?? dare?.country?.difficulty ?? 1];

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
            🎲 Today's dare
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--color-ink-3)", padding: "4px 8px", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
            <div className="spinner" />
          </div>
        ) : dare ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Country banner */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "var(--color-surface-2)",
              borderRadius: 14, padding: "16px 18px",
              border: "1px solid var(--color-border)",
            }}>
              <span style={{ fontSize: 36 }}>{country?.emoji ?? dare.country?.emoji ?? "🌍"}</span>
              <div>
                <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: 18, color: "var(--color-ink)", margin: "0 0 4px" }}>
                  {country?.name ?? dare.country?.name ?? dareCode}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--color-ink-2)" }}>
                    {country?.name ?? dare.country?.name} · {country?.cuisine ?? dare.country?.cuisine}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    fontFamily: "var(--font-family-display)",
                    color: diff.color,
                    background: `color-mix(in srgb, ${diff.color} 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${diff.color} 30%, transparent)`,
                    borderRadius: 6, padding: "2px 8px",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>
                    {diff.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipe */}
            {dare.recipe && (
              <div style={{
                background: "var(--color-surface-2)",
                borderLeft: "3px solid var(--color-amber)",
                borderRadius: "0 10px 10px 0",
                padding: "14px 16px",
                border: "1px solid var(--color-border)",
                borderLeftColor: "var(--color-amber)",
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-amber)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                  Beginner recipe
                </p>
                <p style={{ fontSize: 14, color: "var(--color-ink-2)", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>
                  {dare.recipe}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button
                onClick={() => onTry(dareCode)}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 10,
                  background: "var(--color-red)", color: "#fff",
                  fontFamily: "var(--font-family-display)", fontWeight: 700,
                  fontSize: 14, border: "none", cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-red-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-red)")}
              >
                Try it
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 10,
                  background: "none", color: "var(--color-ink-2)",
                  fontFamily: "var(--font-family-display)", fontWeight: 700,
                  fontSize: 14,
                  border: "1.5px solid var(--color-border)",
                  cursor: "pointer", transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-ink-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              >
                Skip
              </button>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--color-ink-3)", padding: "32px 0", fontSize: 14 }}>
            No dare available. Try again later.
          </p>
        )}
      </div>
    </>
  );
}
