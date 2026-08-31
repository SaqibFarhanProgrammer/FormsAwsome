"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import LeftPanel from "./LeftPanel";
import { CatchErrorFunctionForService } from "@/utils/CatchErrorFunction";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name is too long"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/register", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      });

      const verifyUrl = response.data?.data?.verifyUrl;
      if (verifyUrl) {
        router.push(verifyUrl);
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong. Please try again.";
      CatchErrorFunctionForService(err, "REGISTER USER ERROR", "Failed to Register user");
      setError(message);
    }
  }

  return (
    <main className="relative flex min-h-screen w-full overflow-hidden bg-white">
      <LeftPanel />

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#432DD7]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-[#432DD7]">FormsAwesome</span>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">
              Hi! Welcome to FormsAwesome
            </h1>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#333]">First Name</Label>
                <Input
                  placeholder="John"
                  {...register("firstName")}
                  className="h-11 rounded-xl border-[#E5E5E5] bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#999] focus-visible:border-[#432DD7] focus-visible:ring-[#432DD7]/20"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#333]">Last Name</Label>
                <Input
                  placeholder="Doe"
                  {...register("lastName")}
                  className="h-11 rounded-xl border-[#E5E5E5] bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#999] focus-visible:border-[#432DD7] focus-visible:ring-[#432DD7]/20"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#333]">Email</Label>
              <Input
                type="email"
                placeholder="johndoe@gmail.com"
                {...register("email")}
                className="h-11 rounded-xl border-[#E5E5E5] bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#999] focus-visible:border-[#432DD7] focus-visible:ring-[#432DD7]/20"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#333]">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  {...register("password")}
                  className="h-11 rounded-xl border-[#E5E5E5] bg-white px-4 pr-10 text-sm text-[#1a1a1a] placeholder:text-[#999] focus-visible:border-[#432DD7] focus-visible:ring-[#432DD7]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] transition-colors hover:text-[#666]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#333]">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  {...register("confirmPassword")}
                  className="h-11 rounded-xl border-[#E5E5E5] bg-white px-4 pr-10 text-sm text-[#1a1a1a] placeholder:text-[#999] focus-visible:border-[#432DD7] focus-visible:ring-[#432DD7]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] transition-colors hover:text-[#666]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-12 w-full rounded-full  text-sm font-semibold text-white  active:scale-[0.98]"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>

            <div className=" gap-3">
              <Button
                variant="outline"
                className="h-11 gap-2 w-full rounded-full border-[#E5E5E5] bg-[#f7ebff] text-sm font-medium text-[#333] hover:bg-gray-50"
              >
                <GoogleIcon />
                Sign up with Google
              </Button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-[#666]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#432DD7] transition-colors hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
