interface Props {
  isDark: boolean;
  onToggle: () => void;
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="4" fill="currentColor" />
      <path
        d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.42 1.42M13.65 13.65l1.42 1.42M4.93 15.07l1.42-1.42M13.65 6.35l1.42-1.42"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M17.3 12.6A8 8 0 1 1 7.4 2.7a6 6 0 0 0 9.9 9.9z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function DarkModeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 100,
        border: "1px solid var(--color-border)",
        background: "var(--color-surface-2)",
        color: "var(--color-ink-2)",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 500,
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-ink-3)";
        e.currentTarget.style.background = "var(--color-surface)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.background = "var(--color-surface-2)";
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
