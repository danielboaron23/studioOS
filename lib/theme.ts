"use client";

type Theme = "light" | "dark" | "system";

let theme: Theme = "system";
const listeners = new Set<() => void>();

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getResolvedTheme(): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme() {
  if (typeof document === "undefined") return;
  const resolved = getResolvedTheme();
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function getTheme(): Theme {
  return theme;
}

export function setTheme(newTheme: Theme) {
  theme = newTheme;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", newTheme);
  }
  applyTheme();
  notifyListeners();
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getThemeSnapshot(): Theme {
  return theme;
}

// Initialize theme from localStorage on client
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark" || stored === "system") {
    theme = stored;
  }
  applyTheme();
  
  // Listen to system theme changes when in system mode
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (theme === "system") {
      applyTheme();
      notifyListeners();
    }
  });
}
