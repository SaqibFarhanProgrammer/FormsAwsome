// components/auth/register-form.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { GoogleIcon } from "@/components/icons/Icons";

// ─── Validation Schema ───
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

export const GoogleAuthButton = () => {
  return (
    <Link href="/api/auth/google">
      <Button
        variant="outline"
        className="h-10 gap-2.5 rounded-lg border-white/[0.08] bg-white/[0.06] w-full text-sm font-medium text-white/80 hover:bg-white/[0.10] hover:text-white"
      >
        <GoogleIcon />
        Google
      </Button>
    </Link>
  );
};

export function RegisterForm() {
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
      // 1. Register user
      await axios.post("/api/auth/register", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[420px] border-white/[0.08] bg-transparent shadow-none">
      <CardContent className="p-0">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Let&apos;s Get You Onboard!
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            Join NuvraSpace and start collaborating — create smarter, work faster, and grow
            together.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <div className="mb-5 grid grid-cols-1 gap-3">
          <GoogleAuthButton />
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-xs font-medium text-white/40">Or</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-white/70">First Name</Label>
              <Input
                placeholder="e.g. Michele"
                {...register("firstName")}
                className="h-10 rounded-lg border-white/[0.08] bg-white/[0.06] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
              {errors.firstName && (
                <p className="text-xs text-red-400">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-white/70">Last Name</Label>
              <Input
                placeholder="e.g. Smith"
                {...register("lastName")}
                className="h-10 rounded-lg border-white/[0.08] bg-white/[0.06] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
              {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-white/70">Email</Label>
            <Input
              type="email"
              placeholder="e.g. michelesmith@mail.com"
              {...register("email")}
              className="h-10 rounded-lg border-white/[0.08] bg-white/[0.06] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-white/25 focus-visible:ring-white/10"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-white/70">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="h-10 rounded-lg border-white/[0.08] bg-white/[0.06] px-3 pr-10 text-sm text-white placeholder:text-white/25 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-white/30">Use at least 8 characters.</p>
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-white/70">Confirm Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter your confirm password"
                {...register("confirmPassword")}
                className="h-10 rounded-lg border-white/[0.08] bg-white/[0.06] px-3 pr-10 text-sm text-white placeholder:text-white/25 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-11 w-full rounded-lg text-sm font-semibold text-white active:scale-[0.98]"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-white/40">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-white/80 transition-colors hover:text-white"
          >
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
