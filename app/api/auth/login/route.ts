import { NextRequest, NextResponse } from "next/server";
import { LoginUserService } from "@/core/services/auth/login.service";
import {
  AUTH_RATE_LIMIT,
  AUTH_RATE_LIMIT_WINDOW_SECONDS,
  getClientIp,
  rateLimit,
} from "@/lib/auth/rateLimit";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function POST(request: NextRequest) {
  try {
    const loginRateLimit = await rateLimit({
      name: "login",
      identifier: `ip:${getClientIp(request)}`,
      limit: AUTH_RATE_LIMIT,
      windowSeconds: AUTH_RATE_LIMIT_WINDOW_SECONDS,
    });

    if (!loginRateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(loginRateLimit.retryAfter),
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
  } catch (error: unknown) {
    const normalizedError = error instanceof Error ? error : new Error("Unable to login user");

    return await CatchErrorFunctionForRoute(normalizedError, "LOGIN USER ERROR");
  }
}
