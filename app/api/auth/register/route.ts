// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { RegisterUserService } from "@/core/services/auth/register.service";
import {
  AUTH_RATE_LIMIT,
  AUTH_RATE_LIMIT_WINDOW_SECONDS,
  consumeRateLimit,
  getClientIp,
} from "@/lib/auth/rateLimit";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function POST(request: NextRequest) {
  try {
    const rateLimit = await consumeRateLimit(
      `auth:register:${getClientIp(request)}`,
      AUTH_RATE_LIMIT,
      AUTH_RATE_LIMIT_WINDOW_SECONDS,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many signup attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        },
      );
    }

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
