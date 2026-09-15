import { NextRequest, NextResponse } from "next/server";
import {
  getThemePreference,
  setThemePreference,
  type ThemeOption,
} from "@/core/services/theme/theme.service";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function GET() {
  try {
    const theme = await getThemePreference();
    return NextResponse.json({ success: true, data: { theme } }, { status: 200 });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(error, "GET THEME ERROR");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const theme = body.theme;

    if (theme !== "system" && theme !== "light" && theme !== "dark") {
      return NextResponse.json({ success: false, message: "Invalid theme value" }, { status: 400 });
    }

    await setThemePreference(theme as ThemeOption);

    return NextResponse.json(
      { success: true, message: "Theme updated", data: { theme } },
      { status: 200 },
    );
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(error, "UPDATE THEME ERROR");
  }
}
