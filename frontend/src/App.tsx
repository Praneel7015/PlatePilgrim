import { useState, useEffect } from "react";
import { isAuthenticated, signIn, signOut, handleCallback } from "./auth";
import { api } from "./api";
import type { Meal, Stamp, DareResponse } from "./api";
import { getContinents, getCountry } from "./countries";
import WorldMap from "./components/WorldMap";
import MealLogger from "./components/MealLogger";
import DareCard from "./components/DareCard";
import DarkModeToggle from "./components/DarkModeToggle";
import PassportDrawer from "./components/PassportDrawer";

function CallbackPage() {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    handleCallback()
      .then(() => { window.location.replace("/"); })
      .catch((e) => setError(String(e)));
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      {error
        ? <p style={{ color: "var(--color-red)", fontSize: 14 }}>Sign-in failed: {error}</p>
        : <div className="spinner" />}
    </div>
  );
}

function App() {
  // Dark mode lifted here so WorldMap gets isDark as a prop (avoids stale DOM read)
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("pp_dark_mode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pp_dark_mode", String(next));
  }

  const [authed] = useState(isAuthenticated());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogger, setShowLogger] = useState(false);
  const [preselectCountry, setPreselectCountry] = useState<string | undefined>();
  const [showDare, setShowDare] = useState(false);
  const [dare, setDare] = useState<DareResponse | null>(null);
  const [dareLoading, setDareLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; stamp?: boolean } | null>(null);

  if (window.location.pathname === "/callback") return <CallbackPage />;


  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([api.getMeals(), api.getStamps()])
      .then(([mr, sr]) => { setMeals(mr.meals); setStamps(sr.stamps); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authed]);

  function showToast(msg: string, isStamp = false) {
    setToast({ msg, stamp: isStamp });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleMealLogged(newMeal: Meal, stampAwarded: boolean) {
    setMeals((prev) => [newMeal, ...prev]);
    if (stampAwarded) {
      const res = await api.getStamps();
      setStamps(res.stamps);
      showToast(`Passport stamp earned — ${newMeal.countryName}!`, true);
    } else {
      showToast(`${newMeal.dish} logged.`);
    }
    setShowLogger(false);
    setPreselectCountry(undefined);
  }

  async function handleMealDelete(mealId: string) {
    await api.deleteMeal(mealId);
    setMeals((prev) => prev.filter((m) => m.mealId !== mealId));
  }

  async function handleDare() {
    setDareLoading(true);
    setShowDare(true);
    try { setDare(await api.getDare()); }
    catch (e) { console.error(e); }
    finally { setDareLoading(false); }
  }

  function handleMapClick(code: string) {
    setSelectedCountry(code);
  }

  const stampedCodes = new Set(stamps.map((s) => s.countryCode));
  const exploredCounts: Record<string, number> = {};
  for (const m of meals) exploredCounts[m.countryCode] = (exploredCounts[m.countryCode] ?? 0) + 1;
  const continentCount = getContinents([...new Set(meals.map((m) => m.countryCode))]).size;

  // ── Landing (signed out) ───────────────────────────────────────────
  if (!authed) {
    return (
      <div className="relative min-h-screen overflow-hidden" style={{ background: "var(--color-bg)" }}>
        {/* Desaturated map fills the screen */}
        <div style={{ position: "absolute", inset: 0, filter: "saturate(0.12) brightness(1.08)", pointerEvents: "none" }}>
          <WorldMap stampedCodes={new Set()} exploredCounts={{}} onCountryClick={() => {}} isDark={isDark} />
        </div>
        {/* Subtle overlay */}
        <div style={{ position: "absolute", inset: 0, background: isDark ? "rgba(0,0,0,0.55)" : "rgba(247,247,245,0.6)" }} />

        {/* Theme toggle */}
        <div style={{ position: "absolute", top: 16, right: 20, zIndex: 20 }}>
          <DarkModeToggle isDark={isDark} onToggle={toggleDark} />
        </div>

        {/* Sign-in card */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
          <div className="animate-fade-in" style={{
            background: "var(--color-surface)",
            borderRadius: 20,
            padding: "48px 40px",
            maxWidth: 380,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 24px 64px rgba(0,0,0,0.14)",
            border: "1px solid var(--color-border)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌍</div>
            <h1 style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: "2.4rem", color: "var(--color-ink)", letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 10 }}>
              PlatePilgrim
            </h1>
            <p style={{ color: "var(--color-ink-2)", fontSize: 16, marginBottom: 32 }}>
              Eat your way around the world.
            </p>
            <button
              onClick={signIn}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 10,
                background: "var(--color-red)", color: "#fff",
                fontFamily: "var(--font-family-display)", fontWeight: 700,
                fontSize: 15, border: "none", cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-red-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-red)")}
            >
              Start your journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── App shell ──────────────────────────────────────────────────────
  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Toast */}
      {toast && (
        <div className="animate-slide-down" style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          zIndex: 100, display: "flex", alignItems: "center", gap: 8,
          background: toast.stamp ? "var(--color-amber)" : "var(--color-ink)",
          color: toast.stamp ? "#fff" : "var(--color-bg)",
          padding: "9px 18px", borderRadius: 100,
          fontSize: 13, fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          whiteSpace: "nowrap",
        }}>
          {toast.stamp && <span>🏅</span>}
          {toast.msg}
        </div>
      )}

      {/* Fixed glass header */}
      <header className="glass" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
        height: 56, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px",
        borderBottom: "1px solid var(--color-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🌍</span>
          <span style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: 18, color: "var(--color-ink)", letterSpacing: "-0.3px" }}>
            PlatePilgrim
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setShowLogger(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--color-red)", color: "#fff",
              border: "none", borderRadius: 8,
              padding: "7px 14px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-red-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-red)")}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Add dish
          </button>
          <DarkModeToggle isDark={isDark} onToggle={toggleDark} />
          <button
            onClick={signOut}
            style={{ fontSize: 12, color: "var(--color-ink-3)", background: "none", border: "none", cursor: "pointer", padding: "4px 6px" }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Full-viewport map hero */}
      <section style={{ position: "relative", height: "100dvh" as string }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "var(--color-map-ocean)" }}>
            <div className="spinner" style={{ width: 44, height: 44 }} />
          </div>
        ) : (
          <WorldMap
            stampedCodes={stampedCodes}
            exploredCounts={exploredCounts}
            onCountryClick={handleMapClick}
            isDark={isDark}
          />
        )}

        {/* Floating stat bar — bottom-left */}
        <div style={{
          position: "absolute", bottom: 24, left: 20,
          display: "flex", gap: 6,
        }}>
          {[
            { value: meals.length, label: "dishes" },
            { value: stamps.length, label: "stamps" },
            { value: new Set(meals.map((m) => m.countryCode)).size, label: "countries" },
            { value: continentCount, label: "continents" },
          ].map((s) => (
            <div key={s.label} className="glass" style={{
              borderRadius: 12, padding: "10px 16px", textAlign: "center",
              border: "1px solid var(--color-border)",
              minWidth: 68,
            }}>
              <div style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: 28, lineHeight: 1, color: "var(--color-ink)" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-ink-3)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Dare button — bottom-right */}
        <button
          onClick={handleDare}
          className="glass"
          style={{
            position: "absolute", bottom: 24, right: 20,
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid var(--color-border)", borderRadius: 12,
            padding: "12px 18px", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: "var(--color-ink)",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-amber)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
        >
          <span>🎲</span> Dare me a dish
        </button>
      </section>

      {/* Below-fold: Your Journey */}
      <section style={{ background: "var(--color-surface)", padding: "48px 24px 64px" }}>
        {/* Recent meals */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Your journey
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
          </div>

          {meals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-ink-3)", fontSize: 14 }}>
              Log your first dish to start the journey.{" "}
              <button onClick={() => setShowLogger(true)} style={{ color: "var(--color-red)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                Add a dish
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {meals.slice(0, 8).map((meal) => {
                const country = getCountry(meal.countryCode);
                return (
                  <button
                    key={meal.mealId}
                    onClick={() => setSelectedCountry(meal.countryCode)}
                    style={{
                      flexShrink: 0, width: 140, textAlign: "left",
                      background: "var(--color-surface-2)", borderRadius: 12,
                      padding: "14px 14px", border: "1px solid var(--color-border)",
                      cursor: "pointer", transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-red)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{country?.emoji ?? "🍽️"}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {meal.dish}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-ink-3)" }}>{meal.countryName}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Stamps earned */}
        {stamps.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Stamps earned
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {stamps.map((stamp) => {
                const country = getCountry(stamp.countryCode);
                return (
                  <button
                    key={stamp.countryCode}
                    onClick={() => setSelectedCountry(stamp.countryCode)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      background: "var(--color-surface-2)", borderRadius: 10,
                      padding: "10px 14px", border: "1px solid var(--color-border)",
                      cursor: "pointer", transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-amber)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                  >
                    <span style={{ fontSize: 18 }}>{country?.emoji ?? "🏅"}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-ink)" }}>{stamp.countryName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Modals */}
      {showLogger && (
        <MealLogger
          onClose={() => { setShowLogger(false); setPreselectCountry(undefined); }}
          onLogged={handleMealLogged}
          preselectedCountry={preselectCountry}
        />
      )}
      {showDare && (
        <DareCard
          dare={dare}
          loading={dareLoading}
          onClose={() => setShowDare(false)}
          onTry={(code) => {
            setShowDare(false);
            setPreselectCountry(code);
            setShowLogger(true);
          }}
        />
      )}
      {selectedCountry && (
        <PassportDrawer
          countryCode={selectedCountry}
          meals={meals.filter((m) => m.countryCode === selectedCountry)}
          stamp={stamps.find((s) => s.countryCode === selectedCountry) ?? null}
          onClose={() => setSelectedCountry(null)}
          onDeleteMeal={handleMealDelete}
          onAddDish={() => { setSelectedCountry(null); setPreselectCountry(selectedCountry); setShowLogger(true); }}
        />
      )}
    </div>
  );
}

export default App;
