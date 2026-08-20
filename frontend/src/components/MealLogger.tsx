import { useState } from "react";
import { api, LogMealRequest, Meal } from "../api";

// Simple country list for the picker — matching our backend COUNTRIES list
const COUNTRIES = [
  { code: "IT", name: "Italy", emoji: "🍝" },
  { code: "JP", name: "Japan", emoji: "🍣" },
  { code: "IN", name: "India", emoji: "🍛" },
  { code: "MX", name: "Mexico", emoji: "🌮" },
  { code: "FR", name: "France", emoji: "🥐" },
  { code: "CN", name: "China", emoji: "🥟" },
  { code: "TH", name: "Thailand", emoji: "🍜" },
  { code: "GR", name: "Greece", emoji: "🫒" },
  { code: "ES", name: "Spain", emoji: "🥘" },
  { code: "MA", name: "Morocco", emoji: "🫙" },
  { code: "ET", name: "Ethiopia", emoji: "🫓" },
  { code: "NG", name: "Nigeria", emoji: "🍲" },
  { code: "EG", name: "Egypt", emoji: "🧆" },
  { code: "ZA", name: "South Africa", emoji: "🥩" },
  { code: "SN", name: "Senegal", emoji: "🍚" },
  { code: "GH", name: "Ghana", emoji: "🍛" },
  { code: "TN", name: "Tunisia", emoji: "🌶️" },
  { code: "KE", name: "Kenya", emoji: "🍖" },
  { code: "BR", name: "Brazil", emoji: "🥩" },
  { code: "PE", name: "Peru", emoji: "🍋" },
  { code: "AR", name: "Argentina", emoji: "🥩" },
  { code: "CO", name: "Colombia", emoji: "🫘" },
  { code: "CU", name: "Cuba", emoji: "🍖" },
  { code: "JM", name: "Jamaica", emoji: "🌶️" },
  { code: "CL", name: "Chile", emoji: "🫘" },
  { code: "US", name: "United States", emoji: "🍔" },
  { code: "CA", name: "Canada", emoji: "🍁" },
  { code: "TR", name: "Turkey", emoji: "🥙" },
  { code: "LB", name: "Lebanon", emoji: "🧆" },
  { code: "IR", name: "Iran", emoji: "🍚" },
  { code: "SA", name: "Saudi Arabia", emoji: "🍖" },
  { code: "VN", name: "Vietnam", emoji: "🍜" },
  { code: "KR", name: "South Korea", emoji: "🥢" },
  { code: "PH", name: "Philippines", emoji: "🍖" },
  { code: "ID", name: "Indonesia", emoji: "🍚" },
  { code: "MY", name: "Malaysia", emoji: "🍜" },
  { code: "SG", name: "Singapore", emoji: "🦞" },
  { code: "PK", name: "Pakistan", emoji: "🍛" },
  { code: "BD", name: "Bangladesh", emoji: "🐟" },
  { code: "LK", name: "Sri Lanka", emoji: "🌴" },
  { code: "GB", name: "United Kingdom", emoji: "🫖" },
  { code: "DE", name: "Germany", emoji: "🌭" },
  { code: "PT", name: "Portugal", emoji: "🐟" },
  { code: "PL", name: "Poland", emoji: "🥣" },
  { code: "RU", name: "Russia", emoji: "🥣" },
  { code: "UA", name: "Ukraine", emoji: "🥣" },
  { code: "HU", name: "Hungary", emoji: "🫕" },
  { code: "SE", name: "Sweden", emoji: "🐟" },
  { code: "AU", name: "Australia", emoji: "🦘" },
  { code: "NZ", name: "New Zealand", emoji: "🥝" },
  { code: "IL", name: "Israel", emoji: "🧆" },
  { code: "GE", name: "Georgia", emoji: "🥟" },
  { code: "MN", name: "Mongolia", emoji: "🥩" },
];

interface Props {
  onClose: () => void;
  onLogged: (meal: Meal, stampAwarded: boolean) => void;
}

export default function MealLogger({ onClose, onLogged }: Props) {
  const [dish, setDish] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === countryCode);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dish.trim() || !countryCode) {
      setError("Please fill in the dish name and select a country.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: LogMealRequest = {
        dish: dish.trim(),
        countryCode,
        countryName: selectedCountry?.name ?? countryCode,
        notes: notes.trim(),
      };
      const res = await api.logMeal(payload);
      onLogged(res.meal, res.stampAwarded);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#F5F0E8] dark:bg-[#1e2f3d] w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-bold text-[#2C3E50] dark:text-[#F5F0E8]">
            Log a Dish
          </h2>
          <button
            onClick={onClose}
            className="text-[#2C3E50]/50 dark:text-white/50 hover:text-[#C0392B] transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] dark:text-[#F5F0E8] mb-1">
              Dish name *
            </label>
            <input
              type="text"
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              placeholder="e.g. Pad Thai, Tagine, Ceviche…"
              className="w-full border border-[#2C3E50]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 rounded-lg px-3 py-2 text-sm text-[#2C3E50] dark:text-white placeholder-[#2C3E50]/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] dark:text-[#F5F0E8] mb-1">
              Country *
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full border border-[#2C3E50]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 rounded-lg px-3 py-2 text-sm text-[#2C3E50] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
              required
            >
              <option value="">Select a country…</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] dark:text-[#F5F0E8] mb-1">
              Notes <span className="font-normal opacity-60">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Where did you have it? How was it?"
              rows={2}
              className="w-full border border-[#2C3E50]/20 dark:border-white/20 bg-white/70 dark:bg-white/10 rounded-lg px-3 py-2 text-sm text-[#2C3E50] dark:text-white placeholder-[#2C3E50]/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#C0392B] resize-none"
            />
          </div>

          {error && (
            <p className="text-[#C0392B] text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#C0392B] hover:bg-[#a93226] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm shadow"
          >
            {submitting ? "Logging…" : "Log Dish ✓"}
          </button>
        </form>
      </div>
    </div>
  );
}
