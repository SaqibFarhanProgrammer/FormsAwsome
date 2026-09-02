import { AppError } from "@/lib/auth/appError";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function CatchErrorFunctionForService(
  error: Error,
  ErrorBane: string,
  errorMessage: string,
) {
  console.error(ErrorBane, error);

  if (error instanceof AppError) {
    return error;
  }

  throw new AppError(errorMessage, 500);
}

export async function CatchErrorFunctionForRoute(error: Error, ErrorBane: string) {
  console.error(ErrorBane, error);

  let message = "Server Error";
  let statusCode = 500;

  if (error instanceof AppError) {
    message = error.message;
    statusCode = error.statusCode;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json({ message }, { status: statusCode });
}

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
