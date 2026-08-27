// app/(auth)/verify-email/page.tsx

import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailFOrm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - FormsAwesome",
  description: "Verify your email address to complete registration",
};

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen w-full bg-[#fff]">
      <div className="flex h-screen w-full items-center justify-center px-4">
        <VerifyEmailForm />
      </div>
    </main>
  );
}
