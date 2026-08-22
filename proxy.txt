import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, verifyRefreshToken } from "./lib/auth/JWT.lib";

export async function proxy(req: NextRequest) {
  const cookieStore = await cookies();
  const inCommingAccessToken = cookieStore.get("accessToken")?.value;

  const routes = ["/dashboard", "/profile"];

  if (!inCommingAccessToken) {
    const inCommingRefreshToken = cookieStore.get("refreshToken")?.value;

    routes.some((route) => {
      if (!inCommingRefreshToken && req.url.startsWith(route)) {
        return NextResponse.json(new URL("/auth/login"));
      }
    });

    const verifedRefreshToken = verifyRefreshToken(inCommingRefreshToken);

    if (!verifedRefreshToken) {
      return NextResponse.json(new URL("/auth/login"));
    }

    const newAccessTOken = generateAccessToken(verifedRefreshToken);

    cookieStore.set("accessToken", newAccessTOken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
  }
}

export const config = {
  macther: ["/dashboard/path*"],
};
