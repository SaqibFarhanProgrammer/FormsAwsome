import { NextRequest } from "next/server";
import { AppError } from "@/lib/auth/appError";
import { comparePassword } from "@/utils/catchErrorFunction";
import { connectDB } from "@/core/db/connectDb";
import { User } from "@/models/user.model";
import { generateTokens } from "@/lib/auth/jwt.lib";
import { generateVerificationToken } from "@/lib/auth/jwt.lib";
import { generateVerificationCode } from "@/lib/auth/verificationCode.lib";
import { SetDataToRedisWithTTL } from "@/lib/redis/redis";
import SendVerificationEmail from "@/features/node-mailer/nodemailer.config";
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

  if (!user.emailVerified) {
    const verificationCode = generateVerificationCode();
    const redisKey = `verification:${user.email}`;
    await SetDataToRedisWithTTL(redisKey, verificationCode, 600);

    const verificationToken = generateVerificationToken(user.email, user.name);
    await SendVerificationEmail({
      code: verificationCode,
      email: user.email,
      name: user.name,
    });

    const encodedEmail = encodeURIComponent(user.email);
    return {
      requiresVerification: true,
      verifyUrl: `/auth/verify-email?email=${encodedEmail}&token=${verificationToken}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: false,
      },
    };
  }

  const { accessToken, refreshToken } = generateTokens(user._id, user.email);

  user.refreshToken = refreshToken;
  await user.save();

  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
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
