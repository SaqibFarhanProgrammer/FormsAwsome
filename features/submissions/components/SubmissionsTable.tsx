"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Submission {
  id: string;
  form: string;
  name: string;
  email: string;
  date: string;
  status: "New" | "Viewed" | "Archived";
  details: Record<string, string>;
}

const submissions: Submission[] = [
  {
    id: "1",
    form: "Contact Form",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    date: "Aug 27, 2026",
    status: "New",
    details: {
      Name: "Sarah Johnson",
      Email: "sarah@example.com",
      Phone: "+1 (555) 987-6543",
      Subject: "Product Inquiry",
      Message:
        "Hi, I'm interested in learning more about your enterprise plan. Could someone reach out to discuss pricing and features?",
    },
  },
  {
    id: "2",
    form: "Newsletter Signup",
    name: "Mike Chen",
    email: "mike@example.com",
    date: "Aug 27, 2026",
    status: "New",
    details: {
      Name: "Mike Chen",
      Email: "mike@example.com",
      Preferences: "Weekly Digest",
    },
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
    details: {
      Name: "Emily Davis",
      Email: "emily@example.com",
      Event: "Summer Workshop 2026",
      Attendees: "2",
      Dietary: "Vegetarian",
    },
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
    details: {
      Name: "Emily Davis",
      Email: "emily@example.com",
      Event: "Summer Workshop 2026",
      Attendees: "2",
      Dietary: "Vegetarian",
    },
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
    details: {
      Name: "Emily Davis",
      Email: "emily@example.com",
      Event: "Summer Workshop 2026",
      Attendees: "2",
      Dietary: "Vegetarian",
    },
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
    details: {
      Name: "Emily Davis",
      Email: "emily@example.com",
      Event: "Summer Workshop 2026",
      Attendees: "2",
      Dietary: "Vegetarian",
    },
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
    details: {
      Name: "Emily Davis",
      Email: "emily@example.com",
      Event: "Summer Workshop 2026",
      Attendees: "2",
      Dietary: "Vegetarian",
    },
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
    details: {
      Name: "Emily Davis",
      Email: "emily@example.com",
      Event: "Summer Workshop 2026",
      Attendees: "2",
      Dietary: "Vegetarian",
    },
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
    details: {
      Name: "Emily Davis",
      Email: "emily@example.com",
      Event: "Summer Workshop 2026",
      Attendees: "2",
      Dietary: "Vegetarian",
    },
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
    details: {
      Name: "Emily Davis",
      Email: "emily@example.com",
      Event: "Summer Workshop 2026",
      Attendees: "2",
      Dietary: "Vegetarian",
    },
  },
  {
    id: "4",
    form: "Contact Form",
    name: "Alex Turner",
    email: "alex@example.com",
    date: "Aug 26, 2026",
    status: "Archived",
    details: {
      Name: "Alex Turner",
      Email: "alex@example.com",
      Subject: "Support Request",
    },
  },
  {
    id: "5",
    form: "Newsletter Signup",
    name: "Lisa Wang",
    email: "lisa@example.com",
    date: "Aug 25, 2026",
    status: "Viewed",
    details: {
      Name: "Lisa Wang",
      Email: "lisa@example.com",
      Preferences: "Monthly Digest",
    },
  },
];

const statusStyles = {
  New: "bg-emerald-50 text-emerald-700",
  Viewed: "bg-blue-50 text-blue-700",
  Archived: "bg-slate-100 text-slate-700",
};

export function SubmissionsTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="h-12 px-4 text-left font-medium text-muted-foreground w-10"></th>
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">Form</th>
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                Submitted By
              </th>
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">Email</th>
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => {
              const isExpanded = expandedId === sub.id;
              const detailEntries = Object.entries(sub.details);

              return (
                <>
                  {/* Main Row */}
                  <tr
                    key={sub.id}
                    onClick={() => toggleExpand(sub.id)}
                    className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <ChevronDown
                        size={16}
                        className={cn(
                          "text-muted-foreground transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{sub.form}</td>
                    <td className="px-4 py-3">{sub.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{sub.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{sub.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium",
                          statusStyles[sub.status],
                        )}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  <tr className={cn("border-b border-border bg-muted/20", !isExpanded && "hidden")}>
                    <td colSpan={7} className="px-4 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {detailEntries.map(([key, value]) => (
                          <div
                            key={key}
                            className={cn(
                              "rounded-xl border border-border bg-card p-4",
                              key === "Message" && "sm:col-span-2 lg:col-span-2",
                            )}
                          >
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              {key}
                            </p>
                            <p className="text-sm font-medium text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        {sub.status === "New" && (
                          <button className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                            Mark as Viewed
                          </button>
                        )}
                        {sub.status !== "Archived" && (
                          <button className="h-8 px-3 rounded-lg border border-border bg-background text-xs font-medium hover:bg-accent transition-colors">
                            Archive
                          </button>
                        )}
                        <button className="h-8 px-3 rounded-lg border border-border bg-background text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">Showing 1-5 of 1,284 submissions</p>
        <div className="flex items-center gap-1">
          <button
            disabled
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={14} />
          </button>
          <button className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
            1
          </button>
          <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            2
          </button>
          <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            3
          </button>
          <span className="text-muted-foreground px-1">...</span>
          <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
