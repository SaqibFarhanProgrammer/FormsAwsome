import { TooltipProvider } from "@/components/ui/Tooltip";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./Topbar";

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="peer-data-[collapsed=true]:ml-[72px] ml-64 flex min-h-screen min-w-0 flex-col transition-[margin] duration-300">
          <TopBar />
          <main className="min-w-0 flex-1 space-y-8 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
