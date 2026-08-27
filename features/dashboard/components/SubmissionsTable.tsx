import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const submissions = [
  {
    form: "Contact Form",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    date: "Aug 27, 2026",
    status: "New",
  },
  {
    form: "Newsletter Signup",
    name: "Mike Chen",
    email: "mike@example.com",
    date: "Aug 27, 2026",
    status: "New",
  },
  {
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "Viewed",
  },
  {
    form: "Contact Form",
    name: "Alex Turner",
    email: "alex@example.com",
    date: "Aug 26, 2026",
    status: "Archived",
  },
  {
    form: "Newsletter Signup",
    name: "Lisa Wang",
    email: "lisa@example.com",
    date: "Aug 25, 2026",
    status: "Viewed",
  },
];

const statusStyles: Record<string, string> = {
  New: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Viewed: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Archived:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function SubmissionsTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent Submissions
        </h2>
        <button className="h-8 px-3 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors">
          View All
        </button>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="h-11 px-4 text-left font-medium text-muted-foreground">
                  Form
                </th>
                <th className="h-11 px-4 text-left font-medium text-muted-foreground">
                  Submitted By
                </th>
                <th className="h-11 px-4 text-left font-medium text-muted-foreground">
                  Email
                </th>
                <th className="h-11 px-4 text-left font-medium text-muted-foreground">
                  Date
                </th>
                <th className="h-11 px-4 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-11 px-4 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{sub.form}</td>
                  <td className="px-4 py-3">{sub.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {sub.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {sub.date}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium",
                        statusStyles[sub.status]
                      )}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing 1-5 of 1,284 submissions
          </p>
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