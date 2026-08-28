import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const forms = [
  {
    title: "Contact Form",
    desc: "General contact inquiries",
    status: "Active",
    submissions: 342,
    views: "2.1k",
  },
  {
    title: "Contact Form",
    desc: "General contact inquiries",
    status: "Active",
    submissions: 342,
    views: "2.1k",
  },
  {
    title: "Contact Form",
    desc: "General contact inquiries",
    status: "Active",
    submissions: 342,
    views: "2.1k",
  },
  {
    title: "Contact Form",
    desc: "General contact inquiries",
    status: "Active",
    submissions: 342,
    views: "2.1k",
  },
  {
    title: "Contact Form",
    desc: "General contact inquiries",
    status: "Active",
    submissions: 342,
    views: "2.1k",
  },
  {
    title: "Contact Form",
    desc: "General contact inquiries",
    status: "Active",
    submissions: 342,
    views: "2.1k",
  },
  {
    title: "Contact Form",
    desc: "General contact inquiries",
    status: "Active",
    submissions: 342,
    views: "2.1k",
  },
  {
    title: "Contact Form",
    desc: "General contact inquiries",
    status: "Active",
    submissions: 342,
    views: "2.1k",
  },
  {
    title: "Contact Form",
    desc: "General contact inquiries",
    status: "Active",
    submissions: 342,
    views: "2.1k",
  },
  {
    title: "Newsletter Signup",
    desc: "Email subscription form",
    status: "Active",
    submissions: 891,
    views: "5.4k",
  },
  {
    title: "Job Application",
    desc: "Career opportunities",
    status: "Draft",
    submissions: 0,
    views: "0",
  },
  {
    title: "Event Registration",
    desc: "Summer workshop 2026",
    status: "Active",
    submissions: 51,
    views: "1.2k",
  },
];

export function FormsGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">My Forms</h2>
        <button className="h-8 px-3 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forms.map((form) => (
          <div
            key={form.title}
            className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg  flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileText size={18} />
              </div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium",
                  form.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                )}
              >
                {form.status}
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-1 truncate">{form.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{form.desc}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{form.submissions} submissions</span>
              <span>{form.views} views</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
