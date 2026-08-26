import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, verifyRefreshToken } from "./lib/auth/JWT.lib";

export async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const pathname = req.nextUrl.pathname;

  const authRoutes = ["/auth/login", "/auth/register"];
  const protectedRoutes = ["/dashboard", "/profile"];

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Logged-in user should not access login/register
  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Auth pages are public
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Access token exists
  if (accessToken) {
    return NextResponse.next();
  }

  // No access token and no refresh token
  if (!refreshToken) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  }

  // Verify refresh token
  console.log("Access token missing → checking refresh token");

  const verifiedRefreshToken = verifyRefreshToken(refreshToken);

  if (!verifiedRefreshToken) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  }

  // Generate new access token
  console.log("Refresh token valid → generating access token");

  const newAccessToken = generateAccessToken(verifiedRefreshToken);

  const response = NextResponse.next();

  response.cookies.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*", "/profile/:path*"],
};
