"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmissionDetail {
  label: string;
  value: string;
}

interface Submission {
  id: string;
  form: string;
  name: string;
  email: string;
  date: string;
  status: "New" | "Viewed" | "Archived";
  details: SubmissionDetail[];
}

const submissions: Submission[] = [
  {
    id: "1",
    form: "Contact Form",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    date: "Aug 27, 2026",
    status: "New",
    details: [
      { label: "Name", value: "Sarah Johnson" },
      { label: "Email", value: "sarah@example.com" },
      { label: "Phone", value: "+1 (555) 987-6543" },
      { label: "Subject", value: "Product Inquiry" },
      {
        label: "Message",
        value:
          "Hi, I'm interested in learning more about your enterprise plan. Could someone reach out to discuss pricing and features?",
      },
    ],
  },
  {
    id: "2",
    form: "Newsletter Signup",
    name: "Mike Chen",
    email: "mike@example.com",
    date: "Aug 27, 2026",
    status: "New",
    details: [
      { label: "Name", value: "Mike Chen" },
      { label: "Email", value: "mike@example.com" },
      { label: "Preferences", value: "Weekly Digest" },
    ],
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
    details: [
      { label: "Name", value: "Emily Davis" },
      { label: "Email", value: "emily@example.com" },
      { label: "Event", value: "Summer Workshop 2026" },
      { label: "Attendees", value: "2" },
      { label: "Dietary", value: "Vegetarian" },
    ],
  },
  {
    id: "4",
    form: "Contact Form",
    name: "Alex Turner",
    email: "alex@example.com",
    date: "Aug 26, 2026",
    status: "Archived",
    details: [
      { label: "Name", value: "Alex Turner" },
      { label: "Email", value: "alex@example.com" },
      { label: "Subject", value: "Support Request" },
    ],
  },
  {
    id: "5",
    form: "Newsletter Signup",
    name: "Lisa Wang",
    email: "lisa@example.com",
    date: "Aug 25, 2026",
    status: "Viewed",
    details: [
      { label: "Name", value: "Lisa Wang" },
      { label: "Email", value: "lisa@example.com" },
      { label: "Preferences", value: "Monthly Digest" },
    ],
  },
];

const statusStyles: Record<string, string> = {
  New: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Viewed: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Archived: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function SubmissionsTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Recent Submissions</h2>
        <button className="h-8 px-3 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors">
          View All
        </button>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-10"></TableHead>
              <TableHead>Form</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => {
              const isExpanded = expandedId === sub.id;
              return (
                <>
                  {/* Main Row */}
                  <TableRow
                    key={sub.id}
                    onClick={() => toggleExpand(sub.id)}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "text-muted-foreground transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{sub.form}</TableCell>
                    <TableCell>{sub.name}</TableCell>
                    <TableCell className="text-muted-foreground">{sub.email}</TableCell>
                    <TableCell className="text-muted-foreground">{sub.date}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium",
                          statusStyles[sub.status],
                        )}
                      >
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Detail Row */}
                  {isExpanded && (
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableCell colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {sub.details.map((detail) => (
                            <div
                              key={detail.label}
                              className={cn(
                                "rounded-xl border border-border bg-card p-4",
                                detail.label === "Message" && "sm:col-span-2 lg:col-span-2",
                              )}
                            >
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                {detail.label}
                              </p>
                              <p className="text-sm font-medium text-foreground">{detail.value}</p>
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
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing 1-5 of 1,284 submissions</p>
          <div className="flex items-center gap-1">
            <button
              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
              disabled
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
    </div>
  );
}
