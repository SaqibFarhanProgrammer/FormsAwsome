import { NextResponse } from "next/server";
import { getFormAnalyticsService } from "@/core/services/form/forms.service";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ formIdOrSlug: string }> },
) {
  try {
    const { formIdOrSlug } = await params;
    const searchParams = new URL(request.url).searchParams;
    const data = await getFormAnalyticsService(formIdOrSlug, {
      startDate: searchParams.get("startDate") ?? undefined,
      endDate: searchParams.get("endDate") ?? undefined,
    });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to load form analytics"),
      "GET FORM ANALYTICS ERROR",
    );
  }
}
