import { TooltipProvider } from "@/components/ui/Tooltip";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./Topbar";

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="peer-data-[collapsed=true]:ml-[72px] ml-64 flex min-h-screen flex-col transition-[margin] duration-300">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 space-y-8">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
