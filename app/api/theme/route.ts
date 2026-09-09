import { NextRequest, NextResponse } from "next/server";
import { getThemePreference, setThemePreference, type ThemeOption } from "@/core/services/theme/theme.service";

export async function GET() {
  const theme = await getThemePreference();

  return NextResponse.json({ success: true, data: { theme } }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const theme = body.theme;

    if (theme !== "system" && theme !== "light" && theme !== "dark") {
      return NextResponse.json(
        { success: false, message: "Invalid theme value" },
        { status: 400 },
      );
    }

    await setThemePreference(theme as ThemeOption);

    return NextResponse.json(
      { success: true, message: "Theme updated", data: { theme } },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to update theme" },
      { status: 500 },
    );
  }
}
