// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { RegisterUserService } from "@/core/services/auth/Register.service";
import { AppError } from "@/lib/auth/AppError";

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
    console.error("REGISTER USER ERROR:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
