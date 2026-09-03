import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const VERIFICATION_TOKEN_SECRET =
  process.env.VERIFICATION_TOKEN_SECRET || process.env.JWT_SECRET || "verification-secret-key";

export const ACCESS_TOKEN_EXPIRY = "1d"; // short lived
export const REFRESH_TOKEN_EXPIRY = "7d"; // long lived
export const VERIFICATION_TOKEN_EXPIRY = "15m"; // 15 minutes for email verification

export interface TokenPayload {
  userId: string | any;
  email: string;
}

export interface VerificationTokenPayload {
  email: string;
  name?: string;
}

export const generateAccessToken = (payload: any) => {
  const { exp, iat, nbf, ...cleanPayload } = payload;

  return jwt.sign(cleanPayload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: any): TokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
};

export const generateTokens = (userId: Types.ObjectId | string, email: string) => {
  const payload: TokenPayload = {
    userId: userId.toString(),
    email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

/**
 * Generate a verification token for email verification (contains email and name)
 */
export const generateVerificationToken = (email: string, name?: string): string => {
  const payload: VerificationTokenPayload = {
    email,
    ...(name && { name }),
  };

  return jwt.sign(payload, VERIFICATION_TOKEN_SECRET, {
    expiresIn: VERIFICATION_TOKEN_EXPIRY,
  });
};

/**
 * Verify a verification token
 */
export const verifyVerificationToken = (token: string): VerificationTokenPayload => {
  return jwt.verify(token, VERIFICATION_TOKEN_SECRET) as VerificationTokenPayload;
};

export async function getUserIdFromToken() {
  const cookiesList = await cookies();
  const accessToken = cookiesList.get("accessToken")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  const payload = verifyAccessToken(accessToken);
  return payload.userId;
}
