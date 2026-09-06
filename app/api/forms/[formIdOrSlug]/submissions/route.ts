import { NextResponse } from "next/server";
import { getFormSubmissionsService } from "@/core/services/form/forms.service";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ formIdOrSlug: string }> },
) {
  try {
    const { formIdOrSlug } = await params;
    const data = await getFormSubmissionsService(formIdOrSlug);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to load submissions"),
      "GET FORM SUBMISSIONS ERROR",
    );
  }
}
