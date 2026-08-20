import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("pp_dark_mode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("pp_dark_mode", String(dark));
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="w-8 h-8 rounded-full flex items-center justify-center text-base bg-white/10 hover:bg-white/20 transition-colors"
    >
      {dark ? "🌞" : "🌚"}
    </button>
  );
}
