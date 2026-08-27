"use client";

import { useState, useRef, useEffect } from "react";
import { RefreshCw, ArrowUpDown, Clock, CheckSquare, Globe, Bell, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center mx-6 gap-3 shrink-0 py-2">
      <div className="flex-1 min-w-0 rounded-2xl border border-border bg-card px-5 py-3.5 shadow-sm">
        <p className="text-sm font-semibold text-foreground truncate">Good Morning, John</p>
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
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="John"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">John Smith</p>
            <p className="text-xs text-muted-foreground">@admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
