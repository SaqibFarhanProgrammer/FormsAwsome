"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "formsawesome-theme";

export function ThemeInitializer() {
  useEffect(() => {
    const updateTheme = () => {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      const theme =
        savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
          ? savedTheme
          : "system";

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const shouldUseDarkMode = theme === "dark" || (theme === "system" && mediaQuery.matches);

      document.documentElement.classList.toggle("dark", shouldUseDarkMode);
      document.documentElement.style.colorScheme = shouldUseDarkMode ? "dark" : "light";
    };

    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => updateTheme();

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return null;
}
