// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GetProfileService } from "@/core/services/Profile/Profile.service";
import { CatchErrorFunctionForRoute } from "@/utils/CatchErrorFunction";

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
