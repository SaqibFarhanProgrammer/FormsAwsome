import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/auth/appError";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/lib/auth/jwt.lib";

export type ApiAuthContext = {
  userId: string;
  accessToken?: string;
};

export async function getApiAuthContext(request: NextRequest): Promise<ApiAuthContext> {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (accessToken) {
    try {
      const payload = verifyAccessToken(accessToken);
      return { userId: payload.userId };
    } catch {
      // fall through to refresh token handling
    }
  }

  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const refreshedAccessToken = generateAccessToken(payload);

    return {
      userId: payload.userId,
      accessToken: refreshedAccessToken,
    };
  } catch {
    throw new AppError("Unauthorized", 401);
  }
}

export function applyRefreshedAccessToken(
  response: NextResponse,
  accessToken: string,
): NextResponse {
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
