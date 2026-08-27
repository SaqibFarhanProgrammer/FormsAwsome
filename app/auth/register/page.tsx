// app/(auth)/register/page.tsx — Server Component

import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative  flex min-h-screen w-full overflow-hidden bg-[#0A0A0A]">
      <RegisterForm />
    </main>
  );
}
