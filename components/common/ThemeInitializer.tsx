"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "formsawesome-theme";

const themeScript = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("formsawesome-theme");
      const theme =
        savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
          ? savedTheme
          : "system";

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const shouldUseDarkMode = theme === "dark" || (theme === "system" && mediaQuery.matches);

      document.documentElement.classList.toggle("dark", shouldUseDarkMode);
      document.documentElement.style.colorScheme = shouldUseDarkMode ? "dark" : "light";
    } catch (error) {
      document.documentElement.style.colorScheme = "light";
    }
  })();
`;

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

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
