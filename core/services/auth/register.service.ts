// core/services/auth/Register.service.ts

import { NextRequest } from "next/server";
import { AppError } from "@/lib/auth/appError";
import { hashPassword } from "@/utils/catchErrorFunction";
import { connectDB } from "@/core/db/connectDb";
import { User } from "@/models/user.model";
import { generateVerificationToken } from "@/lib/auth/jwt.lib";
import { generateVerificationCode } from "@/lib/auth/verificationCode.lib";
import { SetDataToRedisWithTTL } from "@/lib/redis/redis";
import SendVerificationEmail from "@/features/node-mailer/nodemailer.config";
import { registerSchema } from "@/core/schemas/auth.schema";

export async function RegisterUserService(request: NextRequest) {
  const body = await request.json();
  const parsedBody = registerSchema.safeParse(body);
  if (!parsedBody.success) {
    throw new AppError("Invalid registration details", 400);
  }
  const { name, email, password } = parsedBody.data;

  await connectDB();

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  // Generate verification code and store it in Redis (10 minutes TTL)
  const verificationCode = generateVerificationCode();
  const redisKey = `verification:${user.email}`;
  await SetDataToRedisWithTTL(redisKey, verificationCode, 600); // 600 seconds = 10 minutes

  // Generate verification token (JWT)
  const verificationToken = generateVerificationToken(user.email, user.name);

  // Send verification email
  await SendVerificationEmail({
    code: verificationCode,
    email: user.email,
    name: user.name,
  });

  const encodedEmail = encodeURIComponent(user.email);
  const verifyUrl = `/auth/verify-email?email=${encodedEmail}&token=${verificationToken}`;

  return {
    message: "User registered successfully. Verification email sent.",
    verifyUrl,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      emailVerified: false,
    },
  };
}
