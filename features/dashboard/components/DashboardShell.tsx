"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <div
          className="flex min-h-screen flex-col transition-[margin] duration-300"
          style={{ marginLeft: collapsed ? 72 : 256 }}
        >
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 space-y-8">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
