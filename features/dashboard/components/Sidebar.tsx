"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  FileText,
  Users,
  BarChart3,
  Settings,
  PanelLeft,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const navItems = [
  { href: "/profile", label: "Profile", icon: User2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "Create New Form", icon: Plus },
  { href: "/all-forms", label: "My Forms", icon: FileText },
  { href: "/submissions", label: "All Submissions", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const data = useSelector((state: RootState) => state.profile);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 border-r border-border bg-sidebar flex h-screen flex-col transition-[width] duration-300",
        collapsed ? "w-18" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <span className="text-lg  text-[#432DD7] font-semibold tracking-tight">FormBuilder</span>
        )}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={collapsed ? "Open sidebar" : "Collapse sidebar"}
              />
            }
            onClick={onToggle}
          >
            <PanelLeft size={18} />
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? "Open sidebar" : "Collapse sidebar"}
          </TooltipContent>
        </Tooltip>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-sidebar-primary/10 font-medium text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  />
                }
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
            <img src={data.image!} alt="" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{data.name}</p>
              <p className="text-xs text-muted-foreground truncate">{data.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
