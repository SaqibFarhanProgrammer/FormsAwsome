import axios from "axios";
import { AppError } from "@/lib/auth/appError";

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof AppError || error instanceof Error) {
    return error.message;
  }

  return fallback;
}