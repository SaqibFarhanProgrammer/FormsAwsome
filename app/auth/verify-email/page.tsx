// app/(auth)/verify-email/page.tsx

import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailFOrm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - FormsAwesome",
  description: "Verify your email address to complete registration",
};

function VerifyEmailLoadingFallback() {
  return (
    <div className="w-full max-w-[420px] space-y-4">
      {/* Logo skeleton */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
      </div>

      {/* Heading skeleton */}
      <div className="mb-8 space-y-3 text-center">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse mx-auto" />
        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse mx-auto" />
      </div>

      {/* Input skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="h-11 w-full rounded-xl bg-gray-200 animate-pulse" />
      </div>

      {/* Button skeleton */}
      <div className="h-12 w-full rounded-full bg-gray-200 animate-pulse" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen w-full bg-[#fff]">
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Suspense fallback={<VerifyEmailLoadingFallback />}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </main>
  );
}
