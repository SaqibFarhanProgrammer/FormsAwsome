// import { cookies } from "next/headers";

// import { generateAccessToken, verifyRefreshToken } from "./lib/auth/JWT.lib";
// import { NextRequest, NextResponse } from "next/server";

// export async function proxy(request: NextRequest) {
//   const CookieStore = await cookies();

//   const inCommingAccessToken = CookieStore.get("accessToken");

//   if (!inCommingAccessToken) {
//     const inCommingRefreshToken = CookieStore.get("refreshToken");

//     console.log(inCommingRefreshToken);

//     if (!inCommingRefreshToken) {
//       return NextResponse.redirect(new URL("/home", request.url));
//     }

//     const payload = verifyRefreshToken(inCommingRefreshToken);

//     if (payload.userId) {
//       const newAccessToken = generateAccessToken(payload);

//       CookieStore.set("accessToken", newAccessToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "lax",
//         path: "/",
//         maxAge: 60 * 60 * 24, // 1 day
//       });
//     }
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
