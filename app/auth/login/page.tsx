// app/(auth)/login/page.tsx — Server Component

import LeftPanel from "@/features/auth/components/LeftPanel";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full overflow-hidden bg-white">
      {/* Left Panel */}
      <LeftPanel />

      {/* Right Panel — Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <LoginForm />
      </div>
    </main>
  );
}
