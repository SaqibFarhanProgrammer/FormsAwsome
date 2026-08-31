"use client";

import { RefreshCw, ArrowUpDown, Clock, CheckSquare, Bell, ChevronDown } from "lucide-react";
import { GetProfileDataFromRedux } from "@/utils/GetProfileDataFromRedux";

export function TopBar() {
  const { data: user } = GetProfileDataFromRedux();

  return (
    <header className="flex items-center mx-6 gap-3 shrink-0 py-2">
      <div className="flex-1 min-w-0 rounded-2xl border border-border bg-card px-5 py-3.5 shadow-sm">
        <p className="text-sm font-semibold text-foreground truncate">
          Good Morning, {user?.name || "User"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          Your latest system updates here
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <RefreshCw size={18} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Cron run</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Just now
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card px-4 py-3.5     shadow-sm flex items-center gap-3 shrink-0 cursor-pointer hover:bg-accent/50 transition-colors">
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowUpDown size={18} className="text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm font-medium text-foreground">Sort By</p>
            <p className="text-xs text-muted-foreground">All-Time</p>
          </div>
          <ChevronDown size={14} className="text-muted-foreground" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm flex items-center gap-2 shrink-0">
        <button className="relative p-1.5 rounded-lg hover:bg-accent transition-colors">
          <Clock size={20} className="text-muted-foreground" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 border-2 border-card" />
        </button>
        <button className="relative p-1.5 rounded-lg hover:bg-accent transition-colors">
          <CheckSquare size={20} className="text-muted-foreground" />
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm flex items-center gap-3 shrink-0">
        <button className="relative p-1.5 rounded-lg hover:bg-accent transition-colors">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 border-2 border-card" />
        </button>
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-muted overflow-hidden">
            <img
              src={
                user?.image ||
                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              }
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">
              @{user?.name?.split(" ").join("").toLowerCase() || "user"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
