import { NextResponse } from "next/server";
import { GetProfileService } from "@/core/services/profile/profile.service";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function GET() {
  try {
    const data = await GetProfileService();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to load profile"),
      "GET PROFILE ERROR",
    );
  }
}
