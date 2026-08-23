// components/auth/register-form.tsx — Client Component
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff } from "lucide-react";

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

export const GoogleAuthButon = () => {
  return (
    <Button
      variant="outline"
      className="h-10 gap-2.5 rounded-lg border-white/[0.08] bg-white/[0.06] text-sm font-medium text-white/80 hover:bg-white/[0.10] hover:text-white"
    >
      <GoogleIcon />
      Google
    </Button>
  );
};
export const GithubAuthButton = () => {
  return (
    <Button
      variant="outline"
      className="h-10 gap-2.5 rounded-lg border-white/[0.08] bg-white/[0.06] text-sm font-medium text-white/80 hover:bg-white/[0.10] hover:text-white"
    >
      <GithubIcon />
      Github
    </Button>
  );
};

export const GoogleIcon = () => (
  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export const GithubIcon = () => (
  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      console.log("Register data:", data);
    } catch (error) {
      console.error(error);
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

        <div className="mb-5 grid grid-cols-2 gap-3">
          <GoogleAuthButon />
          <GithubAuthButton />
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
            className="mt-2 h-11 w-full rounded-lg  text-sm font-semibold text-white  active:scale-[0.98]"
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
