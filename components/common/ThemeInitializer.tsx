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
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} suppressHydrationWarning />;
}
