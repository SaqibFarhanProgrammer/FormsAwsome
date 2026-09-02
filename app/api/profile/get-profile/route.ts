// app/api/auth/profile/route.ts
import { NextResponse } from "next/server";
import { GetProfileService } from "@/core/services/profile/profile.service";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function GET() {
  try {
    const data = await GetProfileService();
    return NextResponse.json(
      {
        success: true,
        message: "Profile retrieved successfully",
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return CatchErrorFunctionForRoute(error, "GET PROFILE ERROR");
  }
}
