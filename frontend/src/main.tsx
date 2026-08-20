// Apply dark mode before React mounts to prevent flash of wrong theme
const stored = localStorage.getItem("pp_dark_mode");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (stored === "true" || (stored === null && prefersDark)) {
  document.documentElement.classList.add("dark");
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
