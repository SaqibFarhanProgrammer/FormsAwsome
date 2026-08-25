import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, verifyRefreshToken } from "./lib/auth/JWT.lib";

export async function proxy(req: NextRequest) {
  const cookieStore = await cookies();
  const inCommingAccessToken = cookieStore.get("accessToken")?.value;

  const routes = ["/dashboard", "/profile"];
  const isProtectedRoute = routes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (!inCommingAccessToken) {
    const inCommingRefreshToken = cookieStore.get("refreshToken")?.value;
    console.log("AccessTOken was not found now fethcin the refresh token ");

    if (!inCommingRefreshToken && isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (!inCommingRefreshToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const verifedRefreshToken = verifyRefreshToken(inCommingRefreshToken);
    console.log("Verifuing refresh token......  ");

    if (!verifedRefreshToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    console.log("Generating new access token......  ");
    const newAccessToken = generateAccessToken(verifedRefreshToken);

    console.log("Settings into the cookies new access token......  ");

    const response = NextResponse.next();
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    console.log("Done? ");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Fixed typo 'macther'
};
