import { NextRequest, NextResponse } from "next/server";
import { LoginUserService } from "@/core/services/auth/Login.service";
import { CatchErrorFunctionForRoute } from "@/utils/CatchErrorFunction";

export async function POST(request: NextRequest) {
  try {
    const data = await LoginUserService(request);
    return NextResponse.json(
      {
        success: true,
        message: "User logged in successfully",
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return await CatchErrorFunctionForRoute(error, "LOGIN USER ERROR");
  }
}
