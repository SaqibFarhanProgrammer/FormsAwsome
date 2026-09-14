import { NextRequest, NextResponse } from "next/server";
import { LoginUserService } from "@/core/services/auth/login.service";
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
      `auth:login:${getClientIp(request)}`,
      AUTH_RATE_LIMIT,
      AUTH_RATE_LIMIT_WINDOW_SECONDS,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        },
      );
    }

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
