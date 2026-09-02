import { DashboardShell } from "@/features/dashboard/components/DashboardShell";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
