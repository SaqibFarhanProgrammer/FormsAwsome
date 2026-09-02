import { NextRequest } from "next/server";
import { AppError } from "@/lib/auth/AppError";
import { comparePassword } from "@/utils/CatchErrorFunction";
import { connectDB } from "@/core/DB/ConnectDB";
import { User } from "@/models/User.models";
import { generateTokens } from "@/lib/auth/JWT.lib";
import { generateVerificationToken } from "@/lib/auth/JWT.lib";
import { generateVerificationCode } from "@/lib/auth/VerificationCode.lib";
import { SetDataToRedisWithTTL } from "@/lib/redis/redis";
import SendVerificationEmail from "@/features/NodeMailer/Nodemailer.config";
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
