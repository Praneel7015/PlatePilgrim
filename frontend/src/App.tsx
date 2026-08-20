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
import LandingPage from "./components/LandingPage";

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

  const isCallback = window.location.pathname === "/callback";

  useEffect(() => {
    if (!authed || isCallback) return;
    setLoading(true);
    Promise.all([api.getMeals(), api.getStamps()])
      .then(([mr, sr]) => { setMeals(mr.meals); setStamps(sr.stamps); })
      .catch((err) => {
        console.error(err);
        showToast("Could not load your journey. Try signing in again.");
      })
      .finally(() => setLoading(false));
  }, [authed, isCallback]);

  if (isCallback) return <CallbackPage />;

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
    try {
      setDare(await api.getDare());
    } catch (e) {
      console.error(e);
      setShowDare(false);
      showToast("Dare failed — sign out and back in, then try again.");
    } finally {
      setDareLoading(false);
    }
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
    return <LandingPage isDark={isDark} onToggle={toggleDark} onSignIn={signIn} />;
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
      <header className="glass pp-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🌍</span>
          <span className="pp-brand">
            PlatePilgrim
          </span>
        </div>
        <div className="pp-topbar-actions">
        <button
          type="button"
          onClick={() => { setPreselectCountry(undefined); setShowLogger(true); }}
            className="pp-btn-primary pp-btn-header"
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> <span className="pp-add-label">Add dish</span>
          </button>
          <DarkModeToggle isDark={isDark} onToggle={toggleDark} />
          <button
            onClick={signOut}
            className="pp-text-btn"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Full-viewport map hero */}
      <section className="pp-map-stage">
        <WorldMap
          stampedCodes={stampedCodes}
          exploredCounts={exploredCounts}
          onCountryClick={handleMapClick}
          isDark={isDark}
        />
        {loading && (
          <div className="pp-map-loading">
            <div className="spinner" style={{ width: 44, height: 44 }} />
          </div>
        )}

        {/* Floating stat bar — bottom-left */}
        <div className="pp-stats">
          {[
            { value: meals.length, label: "dishes" },
            { value: stamps.length, label: "stamps" },
            { value: new Set(meals.map((m) => m.countryCode)).size, label: "countries" },
            { value: continentCount, label: "continents" },
          ].map((s) => (
            <div key={s.label} className="glass pp-stat">
              <div className="pp-stat-value">
                {s.value}
              </div>
              <div className="pp-stat-label">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Dare button — bottom-right */}
        <button
          type="button"
          onClick={handleDare}
          className="glass pp-dare"
        >
          <span>🎲</span> Dare me a dish
        </button>
      </section>

      {/* Below-fold: Your Journey */}
      <section className="pp-journey">
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
          onAddDish={() => { setPreselectCountry(selectedCountry); setShowLogger(true); }}
        />
      )}
    </div>
  );
}

export default App;
