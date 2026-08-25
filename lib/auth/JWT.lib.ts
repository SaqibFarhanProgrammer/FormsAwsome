import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const ACCESS_TOKEN_EXPIRY = "1d"; // short lived
export const REFRESH_TOKEN_EXPIRY = "7d"; // long lived

export interface TokenPayload {
  userId: string | any;
  email: string;
}

export const generateAccessToken = (payload: any) => {
  // Purani exp aur iat properties ko destructure karke alag kar dein
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
