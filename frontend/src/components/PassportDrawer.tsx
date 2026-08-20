import type { Meal, Stamp } from "../api";

interface Props {
  countryCode: string;
  meals: Meal[];
  stamp: Stamp | null;
  onClose: () => void;
  onDeleteMeal: (mealId: string) => void;
}

export default function PassportDrawer({
  countryCode,
  meals,
  stamp,
  onClose,
  onDeleteMeal,
}: Props) {
  const countryName = meals[0]?.countryName ?? stamp?.countryName ?? countryCode;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full sm:max-w-sm bg-[#F5F0E8] dark:bg-[#1e2f3d] shadow-2xl flex flex-col slide-up overflow-y-auto">
        {/* Header */}
        <div className="bg-[#2C3E50] dark:bg-[#111c24] text-white px-5 py-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60 mb-0.5">
              Passport
            </p>
            <h2 className="font-serif text-2xl font-bold">{countryName}</h2>
            <p className="text-sm text-white/60 mt-0.5">
              {meals.length} dish{meals.length !== 1 ? "es" : ""} logged
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none mt-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Stamp area */}
        <div className="px-5 py-4 border-b border-[#2C3E50]/10 dark:border-white/10">
          {stamp ? (
            <div className="stamp-border rounded-xl p-4 text-center bg-[#F39C12]/10">
              <div className="text-3xl mb-1">🏅</div>
              <p className="font-serif font-bold text-[#F39C12] text-lg">
                Stamp Earned!
              </p>
              <p className="text-xs text-[#2C3E50]/60 dark:text-white/50 mt-1">
                {new Date(stamp.earnedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          ) : (
            <div className="rounded-xl p-4 text-center bg-[#2C3E50]/5 dark:bg-white/5 border border-dashed border-[#2C3E50]/20 dark:border-white/20">
              <div className="text-2xl mb-1 opacity-40">🏅</div>
              <p className="text-sm text-[#2C3E50]/50 dark:text-white/40">
                Log {3 - meals.length} more dish{3 - meals.length !== 1 ? "es" : ""} to earn the stamp
              </p>
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < meals.length
                        ? "bg-[#F39C12]"
                        : "bg-[#2C3E50]/20 dark:bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Meal list */}
        <div className="flex-1 px-5 py-4 space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-[#2C3E50]/50 dark:text-white/40 mb-2">
            Dishes Logged
          </h3>
          {meals.length === 0 && (
            <p className="text-sm text-[#2C3E50]/50 dark:text-white/40 italic">
              No dishes yet — click a country on the map after logging.
            </p>
          )}
          {meals.map((meal) => (
            <div
              key={meal.mealId}
              className="bg-white/60 dark:bg-white/10 rounded-xl p-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2C3E50] dark:text-white text-sm truncate">
                    {meal.dish}
                  </p>
                  {meal.notes && (
                    <p className="text-xs text-[#2C3E50]/60 dark:text-white/50 mt-0.5 line-clamp-2">
                      {meal.notes}
                    </p>
                  )}
                  {meal.funFact && (
                    <p className="text-xs text-[#F39C12] mt-1 italic line-clamp-2">
                      💡 {meal.funFact}
                    </p>
                  )}
                  <p className="text-xs text-[#2C3E50]/40 dark:text-white/30 mt-1">
                    {new Date(meal.loggedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteMeal(meal.mealId)}
                  className="ml-2 opacity-0 group-hover:opacity-100 text-[#C0392B]/60 hover:text-[#C0392B] transition-all text-sm flex-shrink-0"
                  aria-label="Delete meal"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
