"use client";

import { useEffect } from "react";

export type ThemeOption = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "formsawesome-theme";

function getStoredTheme(): ThemeOption {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  return storedTheme === "system" || storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : "system";
}

function applyTheme(theme: ThemeOption, prefersDark: boolean) {
  const isDark = theme === "dark" || (theme === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

export function ThemeInitializer() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncTheme = () => applyTheme(getStoredTheme(), mediaQuery.matches);
    const handleSystemThemeChange = () => syncTheme();

    syncTheme();
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  return null;
}
