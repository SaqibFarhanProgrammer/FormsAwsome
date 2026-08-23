// features/auth/components/LoginForm.tsx — Client Component
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
import { GithubAuthButton, GoogleAuthButon } from "./RegisterForm";

// ─── Validation Schema ───
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      console.log("Login data:", data);
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
          <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome Back!</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            Sign in to continue your journey — manage forms, track responses, and collaborate.
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
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-white/70">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
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
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-white/[0.08] bg-white/[0.06] accent-white"
            />
            <Label htmlFor="remember" className="text-xs text-white/50 cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-11 w-full rounded-lg  text-sm font-semibold active:scale-[0.98]"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-white/40">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-white">
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
