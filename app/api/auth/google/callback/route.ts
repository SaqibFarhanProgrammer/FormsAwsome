// app/api/auth/google/callback/route.ts
import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { connectDB } from "@/core/DB/ConnectDB";
import { User } from "@/models/User.models";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/JWT.lib";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=NoCode", req.url));
  }

  try {
    // 1. Code ko Google Tokens ke saath exchange karein
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_KEY,
      client_secret: process.env.GOOGLE_SECRET_KEY,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
    });

    const { id_token, access_token } = tokenResponse.data;

    // 2. Google Tokens se User Details fetch karein
    const googleUserResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    );

    const { email, name, picture } = googleUserResponse.data;

    // 3. Database Syncing
    await connectDB();
    let existingUser = await User.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      existingUser = await User.create({
        email: email.toLowerCase(),
        name: name || "",
        image: picture || "https://i.pinimg.com/736x/1a/81/7a/1a817a95a42d8c43031378d122a05ffe.jpg",
        emailVerified: true,
        passwordHash: "google-oauth-user-no-password",
      });
    }

    // 4. Custom JWT Tokens generate karein
    const appAccessToken = generateAccessToken({ id: existingUser._id, email: existingUser.email });
    const appRefreshToken = generateRefreshToken({
      userId: existingUser._id,
      email: existingUser.email,
    });

    const response = NextResponse.redirect(new URL("/dashboard", req.url));

    response.cookies.set("accessToken", appAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    response.cookies.set("refreshToken", appRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login?error=OAuthFailed", req.url));
  }
}
