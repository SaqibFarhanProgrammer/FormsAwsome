import { NextResponse } from "next/server";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { getUserSubmissionsService } from "@/core/services/form/forms.service";

export async function GET() {
  try {
    const data = await getUserSubmissionsService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unknown submissions error"),
      "GET SUBMISSIONS ERROR",
    );
  }
}
