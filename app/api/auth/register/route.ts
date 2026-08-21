// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { RegisterUserService } from "@/core/services/auth/Register.service";
import { CatchErrorFunctionForRoute } from "@/utils/CatchErrorFunction";

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
  } catch (error: any) {
    CatchErrorFunctionForRoute(error, "REGISTER USER ERROR");
  }
}
