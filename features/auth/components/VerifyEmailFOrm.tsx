"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    // setSuccess(null);

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

      // setSuccess("Email verified successfully! Redirecting to dashboard...");

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

  // async function handleResend() {
  //   if (resendTimer > 0 || !email) return;

  //   setIsResending(true);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const response = await fetch("/api/auth/resend-verification", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email }),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       setError(result.message || "Failed to resend code. Please try again.");
  //       return;
  //     }

  //     setSuccess("Verification code sent! Check your email.");

  //     if (result.verifyUrl) {
  //       const urlParams = new URLSearchParams(
  //         new URL(result.verifyUrl, window.location.origin).search,
  //       );
  //       const newToken = urlParams.get("token");
  //       if (newToken) {
  //         setToken(newToken);
  //       }
  //     }

  //     setResendTimer(60);
  //     const interval = setInterval(() => {
  //       setResendTimer((prev) => {
  //         if (prev <= 1) {
  //           clearInterval(interval);
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);
  //   } catch (error: any) {
  //     console.error("Resend error:", error);
  //     setError("An error occurred. Please try again.");
  //   } finally {
  //     setIsResending(false);
  //   }
  // }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("code", value);
  }

  if (!email || !token) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
          <p className="text-xs text-red-600">
            Invalid verification link. Please try registering again.
          </p>
        </div>
        <Link href="/auth/register">
          <Button className="w-full h-12 rounded-full text-sm font-semibold text-white active:scale-[0.98]">
            Back to Registration
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <span className="text-lg font-semibold text-[#432DD7]">FormsAwesome</span>
      </div>

      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">Verify your email</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#666]">
          We sent a verification code to <span className="font-medium text-[#1a1a1a]">{email}</span>
          . Enter the 6-digit code below to confirm your account. If you don't see the email, check
          the spam folder. Sometimes emails will send to the spam folder.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#333]">Verification Code</Label>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            {...register("code")}
            onChange={handleCodeChange}
            disabled={isLoading}
            className="h-11 rounded-xl border-[#E5E5E5] bg-white px-4 text-center text-lg tracking-[0.5em] font-semibold text-[#1a1a1a] placeholder:text-[#999] placeholder:tracking-normal placeholder:font-normal placeholder:text-sm focus-visible:border-[#432DD7] focus-visible:ring-[#432DD7]/20 disabled:opacity-50"
          />
          {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-12 w-full rounded-full text-sm font-semibold text-white active:scale-[0.98]"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[#666]">
        <Link
          href="/auth/register"
          className="font-medium text-[#432DD7] transition-colors hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign up
        </Link>
      </p>
    </div>
  );
}
