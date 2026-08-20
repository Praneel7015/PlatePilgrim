import DarkModeToggle from "./DarkModeToggle";

interface Props {
  isDark: boolean;
  onToggle: () => void;
  onSignIn: () => void;
}

const FEATURES = [
  {
    emoji: "🗺️",
    title: "Your culinary world map",
    desc: "Every dish you log lights up a country. Watch your world fill with color — one meal at a time.",
  },
  {
    emoji: "🏅",
    title: "Earn passport stamps",
    desc: "Log three dishes from the same country and earn a stamped passport page. A real badge, not a streak counter.",
  },
  {
    emoji: "🎲",
    title: "Dare me a dish",
    desc: "Spin the globe and get challenged with an unexplored country. Amazon Bedrock writes you a beginner recipe on the spot.",
  },
];

const STEPS = [
  { n: "01", text: "Log a dish from any country" },
  { n: "02", text: "Watch it light up on the map" },
  { n: "03", text: "Earn stamps, explore the world" },
];

export default function LandingPage({ isDark, onToggle, onSignIn }: Props) {
  return (
    <div style={{ background: "var(--color-bg)", color: "var(--color-ink)", minHeight: "100vh" }}>

      {/* ── Nav ───────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 56,
        borderBottom: "1px solid var(--color-border)",
      }} className="glass">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🌍</span>
          <span style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: 17, color: "var(--color-ink)", letterSpacing: "-0.3px" }}>
            PlatePilgrim
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DarkModeToggle isDark={isDark} onToggle={onToggle} />
          <button
            onClick={onSignIn}
            style={{
              padding: "7px 16px", borderRadius: 8,
              background: "var(--color-red)", color: "#fff",
              fontFamily: "var(--font-family-display)", fontWeight: 700,
              fontSize: 13, border: "none", cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-red-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-red)")}
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100dvh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative stamp rings behind content */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: isDark ? 0.12 : 0.07 }}
          viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="600" cy="350" r="320" fill="none" stroke="var(--color-red)" strokeWidth="2" />
          <circle cx="600" cy="350" r="290" fill="none" stroke="var(--color-red)" strokeWidth="1" strokeDasharray="8 5" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="var(--color-amber)" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="var(--color-amber)" strokeWidth="0.8" strokeDasharray="6 4" />
          <circle cx="1050" cy="530" r="180" fill="none" stroke="var(--color-teal)" strokeWidth="1.5" />
          <circle cx="1050" cy="530" r="158" fill="none" stroke="var(--color-teal)" strokeWidth="0.8" strokeDasharray="6 4" />
          <circle cx="980" cy="110" r="90" fill="none" stroke="var(--color-amber)" strokeWidth="1" />
          <circle cx="140" cy="580" r="100" fill="none" stroke="var(--color-red)" strokeWidth="1" />
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            borderRadius: 100, padding: "5px 14px",
            fontSize: 12, fontWeight: 600, color: "var(--color-ink-2)",
            marginBottom: 28, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-teal)", display: "inline-block" }} />
            Built for The Full Stack Challenge
          </div>

          <h1 style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 800,
            fontSize: "clamp(2.8rem, 7vw, 5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--color-ink)",
            marginBottom: 20,
          }}>
            Eat your way<br />around the world.
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "var(--color-ink-2)",
            lineHeight: 1.65,
            maxWidth: 520,
            margin: "0 auto 40px",
          }}>
            Log a dish, light up a country. Earn passport stamps. Get dared to cook something new.
            PlatePilgrim turns your meals into a culinary world tour.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={onSignIn}
              style={{
                padding: "14px 32px", borderRadius: 12,
                background: "var(--color-red)", color: "#fff",
                fontFamily: "var(--font-family-display)", fontWeight: 700,
                fontSize: 16, border: "none", cursor: "pointer",
                transition: "background 0.15s, transform 0.1s",
                boxShadow: "0 4px 20px color-mix(in srgb, var(--color-red) 35%, transparent)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-red-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-red)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Start your journey →
            </button>
            <a
              href="https://github.com/Praneel7015/PlatePilgrim"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "14px 24px", borderRadius: 12,
                background: "none", color: "var(--color-ink-2)",
                fontFamily: "var(--font-family-display)", fontWeight: 600,
                fontSize: 16,
                border: "1.5px solid var(--color-border)",
                cursor: "pointer", transition: "border-color 0.15s",
                textDecoration: "none", display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-ink-3)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            >
              View on GitHub
            </a>
          </div>

          {/* Scroll hint */}
          <div style={{ marginTop: 64, color: "var(--color-ink-3)", fontSize: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 1, height: 36, background: "var(--color-border)" }} />
            <span style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Scroll</span>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section style={{
        background: "var(--color-surface)",
        padding: "80px 24px",
        borderTop: "1px solid var(--color-border)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{
            textAlign: "center",
            fontSize: 11, fontWeight: 600,
            color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.12em",
            marginBottom: 48,
          }}>
            What you get
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16, padding: "28px 24px",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-red)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.emoji}</div>
                <h3 style={{
                  fontFamily: "var(--font-family-display)", fontWeight: 700,
                  fontSize: 17, color: "var(--color-ink)", marginBottom: 10,
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--color-ink-2)", lineHeight: 1.65, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "var(--color-ink-3)",
            textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 48,
          }}>
            How it works
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 24, textAlign: "left", paddingBottom: i < STEPS.length - 1 ? 32 : 0, position: "relative" }}>
                {/* connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", left: 20, top: 40, width: 1, height: "calc(100% - 8px)", background: "var(--color-border)" }} />
                )}
                <div style={{
                  flexShrink: 0, width: 40, height: 40,
                  borderRadius: 10,
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-family-display)", fontWeight: 800,
                  fontSize: 12, color: "var(--color-red)",
                  letterSpacing: "0.05em",
                  position: "relative", zIndex: 1,
                }}>
                  {s.n}
                </div>
                <p style={{
                  fontFamily: "var(--font-family-display)", fontWeight: 600,
                  fontSize: 18, color: "var(--color-ink)",
                  paddingTop: 9, margin: 0,
                }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA footer ────────────────────────────────────────────── */}
      <section style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>🌍</div>
          <h2 style={{
            fontFamily: "var(--font-family-display)", fontWeight: 800,
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            color: "var(--color-ink)", marginBottom: 14, letterSpacing: "-0.02em",
          }}>
            Ready to start exploring?
          </h2>
          <p style={{ color: "var(--color-ink-2)", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
            Your map is blank. Every meal is a new country waiting to light up.
          </p>
          <button
            onClick={onSignIn}
            style={{
              padding: "14px 36px", borderRadius: 12,
              background: "var(--color-red)", color: "#fff",
              fontFamily: "var(--font-family-display)", fontWeight: 700,
              fontSize: 16, border: "none", cursor: "pointer",
              transition: "background 0.15s",
              boxShadow: "0 4px 20px color-mix(in srgb, var(--color-red) 35%, transparent)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-red-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-red)")}
          >
            Sign in free →
          </button>

          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "center", gap: 24 }}>
            <a href="https://github.com/Praneel7015/PlatePilgrim" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: "var(--color-ink-3)", textDecoration: "none", fontWeight: 500 }}>
              GitHub
            </a>
            <span style={{ color: "var(--color-border)" }}>·</span>
            <span style={{ fontSize: 12, color: "var(--color-ink-3)", fontWeight: 500 }}>
              Built on AWS · The Full Stack Challenge 2026
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
