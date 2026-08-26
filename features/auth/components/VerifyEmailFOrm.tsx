"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";

const verifySchema = z.object({
  code: z
    .string()
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must contain only numbers"),
});
type VerifyFormValues = z.infer<typeof verifySchema>;

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    setEmail(emailParam);
    setToken(tokenParam);

    if (!emailParam || !tokenParam) {
      setError("Missing email or token. Please try registering again.");
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  async function onSubmit(data: VerifyFormValues) {
    if (!email || !token) {
      setError("Missing email or token. Please try registering again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: data.code,
          token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Verification failed. Please try again.");
        return;
      }

      setSuccess("Email verified successfully! Redirecting to dashboard...");

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Verification error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (resendTimer > 0 || !email) return;

    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to resend code. Please try again.");
        return;
      }

      setSuccess("Verification code sent! Check your email.");

      if (result.verifyUrl) {
        const urlParams = new URLSearchParams(
          new URL(result.verifyUrl, window.location.origin).search,
        );
        const newToken = urlParams.get("token");
        if (newToken) {
          setToken(newToken);
        }
      }

      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error("Resend error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("code", value);
  }

  if (!email || !token) {
    return (
      <Card className="w-full max-w-[420px] border-white/[0.08] bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="space-y-4">
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-400">
                Invalid verification link. Please try registering again.
              </p>
            </div>
            <Link href="/auth/register">
              <Button className="w-full">Back to Registration</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[420px] border-white/[0.08] bg-transparent shadow-none">
      <CardContent className="p-0">
        <Link
          href="/auth/register"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign up
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Verify your email</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/90">
            We sent a verification code to <span className="font-medium">{email}</span>. Enter the
            6-digit code below to confirm your account.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
            <p className="text-xs text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/70">Verification Code</label>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              {...register("code")}
              onChange={handleCodeChange}
              disabled={isLoading}
              className="h-12 rounded-lg border-white/[0.08] bg-white/[0.06] px-4 text-center text-lg tracking-[0.5em] font-semibold text-white placeholder:text-white/25 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm focus-visible:border-white/25 focus-visible:ring-white/10 disabled:opacity-50"
            />
            {errors.code && <p className="text-xs text-red-400">{errors.code.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-lg text-sm font-semibold text-white active:scale-[0.98]"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="mt-6 space-y-4 border-t border-white/[0.08] pt-6">
          <p className="text-xs text-white/60 text-center">Didn&apos;t receive the code?</p>
          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            disabled={isResending || resendTimer > 0}
            className="h-10 w-full rounded-lg border-white/[0.08] bg-white/[0.02] text-sm font-medium text-white hover:bg-white/[0.06] disabled:opacity-50"
          >
            {isResending
              ? "Sending..."
              : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend Code"}
          </Button>
        </div>

        <div className="mt-5 rounded-lg bg-white/[0.03] p-4">
          <p className="text-xs leading-relaxed text-white/60">
            If you don&apos;t see the email, check the spam folder. Sometimes emails will send to
            the spam folder.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
