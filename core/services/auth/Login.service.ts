import { NextRequest } from "next/server";
import { AppError } from "@/lib/auth/AppError";
import { comparePassword } from "@/utils/CatchErrorFunction";
import { connectDB } from "@/core/DB/ConnectDB";
import { User } from "@/models/User.models";
import { generateAccessToken, generateTokens, verifyRefreshToken } from "@/lib/auth/JWT.lib";
import { cookies } from "next/headers";

export async function LoginUserService(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const { accessToken, refreshToken } = generateTokens(user._id, user.email);

  user.refreshToken = refreshToken;
  await user.save();

  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 day
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    redirectUrl: "/dashboard",
  };
}
