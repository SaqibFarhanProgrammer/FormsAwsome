import { cookies } from "next/headers";

export type ThemeOption = "system" | "light" | "dark";

export const THEME_COOKIE_NAME = "formsawesome-theme";

export async function getThemePreference(): Promise<ThemeOption> {
  const cookieStore = await cookies();
  const currentTheme = cookieStore.get(THEME_COOKIE_NAME)?.value;

  if (currentTheme === "light" || currentTheme === "dark" || currentTheme === "system") {
    return currentTheme;
  }

  return "system";
}

export async function setThemePreference(theme: ThemeOption) {
  const cookieStore = await cookies();

  cookieStore.set(THEME_COOKIE_NAME, theme, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}
