"use client";

import { Search, Download, ChevronDown } from "lucide-react";

export function SubmissionsFilters() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[240px] max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search submissions..."
          className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all"
        />
      </div>

      {/* Form Filter */}
      <div className="relative">
        <select className="h-10 pl-4 pr-10 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background appearance-none cursor-pointer">
          <option value="">All Forms</option>
          <option value="contact">Contact Form</option>
          <option value="newsletter">Newsletter Signup</option>
          <option value="event">Event Registration</option>
          <option value="job">Job Application</option>
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select className="h-10 pl-4 pr-10 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background appearance-none cursor-pointer">
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="viewed">Viewed</option>
          <option value="archived">Archived</option>
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>

      {/* Date Filter */}
      <div className="relative">
        <select className="h-10 pl-4 pr-10 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background appearance-none cursor-pointer">
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>

      {/* Export */}
      <button className="h-10 px-4 rounded-xl border border-border bg-background text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2 ml-auto">
        <Download size={16} />
        Export
      </button>
    </div>
  );
}
