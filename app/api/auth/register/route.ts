// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { RegisterUserService } from "@/core/services/auth/register.service";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function POST(request: NextRequest) {
  try {
    const data = await RegisterUserService(request);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to register user"),
      "REGISTER USER ERROR",
    );
  }
}
