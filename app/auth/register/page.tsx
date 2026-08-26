// app/(auth)/register/page.tsx — Server Component

import LeftPanel from "@/features/auth/components/LeftPanel";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative  flex min-h-screen w-full overflow-hidden bg-[#0A0A0A]">
      {/* Left Panel — Branding */}
      <LeftPanel />
      {/* Right Panel — Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <RegisterForm />
      </div>
    </main>
  );
}
