import { NextResponse } from "next/server";
import { getFormStateAnalyticsService } from "@/core/services/form/forms.service";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { AppError } from "@/lib/auth/appError";

export async function GET(request: Request) {
  try {
    const slug = new URL(request.url).searchParams.get("slug") ?? "";
    const data = await getFormStateAnalyticsService(slug);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof AppError ? error : new AppError("Unable to load form analytics", 500),
      "GET FORM STATE ANALYTICS ERROR",
    );
  }
}
