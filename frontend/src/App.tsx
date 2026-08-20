import { useState, useEffect } from "react";
import {
  isAuthenticated,
  signIn,
  signOut,
  handleCallback,
  getCurrentUser,
} from "./auth";
import { api, Meal, Stamp, DareResponse } from "./api";
import WorldMap from "./components/WorldMap";
import MealLogger from "./components/MealLogger";
import DareCard from "./components/DareCard";
import DarkModeToggle from "./components/DarkModeToggle";
import PassportDrawer from "./components/PassportDrawer";

function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogger, setShowLogger] = useState(false);
  const [showDare, setShowDare] = useState(false);
  const [dare, setDare] = useState<DareResponse | null>(null);
  const [dareLoading, setDareLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const user = getCurrentUser();

  // Handle Cognito callback
  useEffect(() => {
    if (window.location.pathname === "/callback") {
      handleCallback()
        .then(() => {
          setAuthed(isAuthenticated());
        })
        .catch(console.error);
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([api.getMeals(), api.getStamps()])
      .then(([mealsRes, stampsRes]) => {
        setMeals(mealsRes.meals);
        setStamps(stampsRes.stamps);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authed]);

  function showToast(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  }

  async function handleMealLogged(newMeal: Meal, stampAwarded: boolean) {
    setMeals((prev) => [newMeal, ...prev]);
    if (stampAwarded) {
      // Refresh stamps
      const res = await api.getStamps();
      setStamps(res.stamps);
      showToast(`🏅 Passport stamp earned for ${newMeal.countryName}!`);
    } else {
      showToast(`✅ Logged ${newMeal.dish}!`);
    }
    setShowLogger(false);
  }

  async function handleMealDelete(mealId: string) {
    await api.deleteMeal(mealId);
    setMeals((prev) => prev.filter((m) => m.mealId !== mealId));
  }

  async function handleDare() {
    setDareLoading(true);
    setShowDare(true);
    try {
      const res = await api.getDare();
      setDare(res);
    } catch (e) {
      console.error(e);
    } finally {
      setDareLoading(false);
    }
  }

  // Derive stamp set and per-country meal counts for the map
  const stampedCodes = new Set(stamps.map((s) => s.countryCode));
  const exploredCounts: Record<string, number> = {};
  for (const m of meals) {
    exploredCounts[m.countryCode] = (exploredCounts[m.countryCode] ?? 0) + 1;
  }

  const selectedCountryMeals = selectedCountry
    ? meals.filter((m) => m.countryCode === selectedCountry)
    : [];
  const selectedStamp = selectedCountry
    ? stamps.find((s) => s.countryCode === selectedCountry)
    : null;

  // --- Unauthenticated landing ---
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1a252f] flex flex-col items-center justify-center p-6 text-center">
        <DarkModeToggle />
        <div className="max-w-md">
          <div className="text-7xl mb-4">🌍</div>
          <h1 className="font-serif text-5xl font-bold text-[#2C3E50] dark:text-[#F5F0E8] mb-2">
            PlatePilgrim
          </h1>
          <p className="text-[#2C3E50]/70 dark:text-[#F5F0E8]/70 text-lg mb-1 italic">
            "Turn every meal into a passport stamp."
          </p>
          <p className="text-[#2C3E50]/60 dark:text-[#F5F0E8]/60 text-sm mb-8">
            Log dishes from around the world, unlock country stamps, and dare
            yourself to cook something new every day.
          </p>
          <button
            onClick={signIn}
            className="bg-[#C0392B] hover:bg-[#a93226] text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors shadow-md"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1a252f] transition-colors">
      {/* Toast notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2C3E50] dark:bg-[#F5F0E8] text-white dark:text-[#2C3E50] px-6 py-3 rounded-full shadow-lg text-sm font-medium slide-up">
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="bg-[#2C3E50] dark:bg-[#111c24] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌍</span>
          <h1 className="font-serif text-2xl font-bold tracking-wide">
            PlatePilgrim
          </h1>
          <span className="hidden sm:inline text-[#F39C12] text-sm">
            {stamps.length} stamps · {meals.length} dishes
          </span>
        </div>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <span className="text-sm text-white/70 hidden sm:inline">
            {user?.email}
          </span>
          <button
            onClick={signOut}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Action bar */}
      <div className="flex gap-3 px-6 py-4 border-b border-[#2C3E50]/10 dark:border-white/10">
        <button
          onClick={() => setShowLogger(true)}
          className="bg-[#C0392B] hover:bg-[#a93226] text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shadow"
        >
          + Log a Dish
        </button>
        <button
          onClick={handleDare}
          className="bg-[#F39C12] hover:bg-[#d68910] text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shadow"
        >
          🎲 Dare Me a Dish
        </button>
      </div>

      {/* Map */}
      <main className="px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-[#2C3E50]/50 dark:text-white/50">
            Loading your world...
          </div>
        ) : (
          <WorldMap
            stampedCodes={stampedCodes}
            exploredCounts={exploredCounts}
            onCountryClick={setSelectedCountry}
          />
        )}

        {/* Stats strip */}
        <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
          <div className="bg-white/60 dark:bg-white/10 rounded-xl p-3 shadow-sm">
            <p className="text-2xl font-bold text-[#C0392B]">{meals.length}</p>
            <p className="text-xs text-[#2C3E50]/60 dark:text-white/60 mt-0.5">Dishes</p>
          </div>
          <div className="bg-white/60 dark:bg-white/10 rounded-xl p-3 shadow-sm">
            <p className="text-2xl font-bold text-[#F39C12]">{stamps.length}</p>
            <p className="text-xs text-[#2C3E50]/60 dark:text-white/60 mt-0.5">Stamps</p>
          </div>
          <div className="bg-white/60 dark:bg-white/10 rounded-xl p-3 shadow-sm">
            <p className="text-2xl font-bold text-[#2C3E50] dark:text-white">
              {new Set(meals.map((m) => m.countryCode)).size}
            </p>
            <p className="text-xs text-[#2C3E50]/60 dark:text-white/60 mt-0.5">Countries</p>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showLogger && (
        <MealLogger
          onClose={() => setShowLogger(false)}
          onLogged={handleMealLogged}
        />
      )}
      {showDare && (
        <DareCard
          dare={dare}
          loading={dareLoading}
          onClose={() => setShowDare(false)}
          onLogDish={() => {
            setShowDare(false);
            setShowLogger(true);
          }}
        />
      )}
      {selectedCountry && (
        <PassportDrawer
          countryCode={selectedCountry}
          meals={selectedCountryMeals}
          stamp={selectedStamp ?? null}
          onClose={() => setSelectedCountry(null)}
          onDeleteMeal={handleMealDelete}
        />
      )}
    </div>
  );
}

export default App;
