import type { DareResponse } from "../api";

interface Props {
  dare: DareResponse | null;
  loading: boolean;
  onClose: () => void;
  onLogDish: () => void;
}

const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Beginner friendly",
  2: "Intermediate",
  3: "Adventurous",
};

const DIFFICULTY_COLOR: Record<number, string> = {
  1: "text-green-600 dark:text-green-400",
  2: "text-[#F39C12]",
  3: "text-[#C0392B]",
};

export default function DareCard({ dare, loading, onClose, onLogDish }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#F5F0E8] dark:bg-[#1e2f3d] w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-bold text-[#2C3E50] dark:text-[#F5F0E8] flex items-center gap-2">
            <span>🎲</span> Dare Me a Dish
          </h2>
          <button
            onClick={onClose}
            className="text-[#2C3E50]/50 dark:text-white/50 hover:text-[#C0392B] transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl animate-spin inline-block mb-4">🌍</div>
            <p className="text-[#2C3E50]/60 dark:text-white/60 text-sm">
              Spinning the globe…
            </p>
          </div>
        )}

        {/* All explored */}
        {!loading && dare?.allExplored && (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">🏆</div>
            <p className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#F5F0E8] mb-2">
              World Tour Complete!
            </p>
            <p className="text-sm text-[#2C3E50]/60 dark:text-white/60">
              {dare.message}
            </p>
          </div>
        )}

        {/* Dare content */}
        {!loading && dare && !dare.allExplored && dare.country && (
          <>
            {/* Country banner */}
            <div className="stamp-border rounded-xl p-4 mb-5 bg-white/50 dark:bg-white/5 text-center">
              <span className="text-4xl">{dare.country.emoji}</span>
              <h3 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#F5F0E8] mt-1">
                {dare.country.name}
              </h3>
              <p className="text-sm text-[#2C3E50]/60 dark:text-white/50 mb-1">
                {dare.country.cuisine} cuisine · {dare.country.continent}
              </p>
              <span
                className={`text-xs font-medium ${DIFFICULTY_COLOR[dare.country.difficulty] ?? "text-[#2C3E50]"}`}
              >
                {DIFFICULTY_LABEL[dare.country.difficulty] ?? ""}
              </span>
            </div>

            {/* Recipe from Bedrock */}
            {dare.recipe && (
              <div className="bg-white/60 dark:bg-white/10 rounded-xl p-4 mb-5 text-sm text-[#2C3E50] dark:text-[#F5F0E8] leading-relaxed whitespace-pre-wrap">
                {dare.recipe}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onLogDish}
                className="flex-1 bg-[#C0392B] hover:bg-[#a93226] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow"
              >
                Accept the Dare 🍽️
              </button>
              <button
                onClick={onClose}
                className="flex-1 border border-[#2C3E50]/20 dark:border-white/20 text-[#2C3E50] dark:text-white font-semibold py-2.5 rounded-lg text-sm transition-colors hover:bg-[#2C3E50]/5"
              >
                Maybe Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
