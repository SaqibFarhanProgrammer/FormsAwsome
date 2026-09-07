"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { jsPDF } from "jspdf";
import { Search, Download, ChevronDown } from "lucide-react";
import { showAlert } from "@/redux/features/global/alertSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";

type ExportSubmission = {
  form: string;
  name: string;
  email: string;
  date: string;
  status: string;
};

const filterKeys = ["search", "form", "status", "date"] as const;

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function SubmissionsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filters = Object.fromEntries(
    filterKeys.map((key) => [key, searchParams.get(key) ?? ""]),
  ) as Record<(typeof filterKeys)[number], string>;

  const updateFilter = (key: (typeof filterKeys)[number], value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const loadFilteredSubmissions = async () => {
    const response = await fetch("/api/submissions");
    if (!response.ok) throw new Error("Unable to export submissions");
    const result = await response.json();
    const query = filters.search.toLowerCase();

    return (result.data ?? []).filter((submission: ExportSubmission) => {
      const searchableText =
        `${submission.form} ${submission.name} ${submission.email}`.toLowerCase();
      const matchesSearch = !query || searchableText.includes(query);
      const matchesForm = !filters.form || submission.form === filters.form;
      const matchesStatus = !filters.status || submission.status === filters.status;
      const submissionDate = new Date(submission.date);
      const now = new Date();
      const matchesDate =
        !filters.date ||
        (filters.date === "today" && submissionDate.toDateString() === now.toDateString()) ||
        (filters.date === "week" && now.getTime() - submissionDate.getTime() <= 7 * 86400000) ||
        (filters.date === "month" &&
          submissionDate.getMonth() === now.getMonth() &&
          submissionDate.getFullYear() === now.getFullYear()) ||
        (filters.date === "year" && submissionDate.getFullYear() === now.getFullYear());

      return matchesSearch && matchesForm && matchesStatus && matchesDate;
    });
  };

  const exportSubmissions = async (format: "csv" | "pdf") => {
    try {
      const submissions = await loadFilteredSubmissions();
      if (submissions.length === 0) throw new Error("No submissions match the selected filters");

      if (format === "csv") {
        const headers = ["Form", "Submitted By", "Email", "Date", "Status"];
        const rows = submissions.map((submission: ExportSubmission) =>
          [submission.form, submission.name, submission.email, submission.date, submission.status]
            .map(escapeCsvValue)
            .join(","),
        );
        const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "submissions.csv";
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const pdf = new jsPDF();
        pdf.setFontSize(16);
        pdf.text("Submissions", 14, 18);
        pdf.setFontSize(10);
        submissions.forEach((submission: ExportSubmission, index: number) => {
          const rowIndex = index % 13;
          if (index > 0 && rowIndex === 0) {
            pdf.addPage();
          }
          const pageY = 30 + rowIndex * 18;
          pdf.text(`${submission.form} | ${submission.name} | ${submission.email}`, 14, pageY);
          pdf.text(`${submission.date} | ${submission.status}`, 14, pageY + 6);
        });
        pdf.save("submissions.pdf");
      }

      setIsExportOpen(false);
      dispatch(
        showAlert({ message: `Submissions exported as ${format.toUpperCase()}`, type: "success" }),
      );
    } catch (error: unknown) {
      dispatch(
        showAlert({
          message: getErrorMessage(error, "Unable to export submissions"),
          type: "danger",
        }),
      );
    }
  };

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
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
          className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all"
        />
      </div>

      {/* Form Filter */}
      <div className="relative">
        <select
          value={filters.form}
          onChange={(event) => updateFilter("form", event.target.value)}
          className="h-10 pl-4 pr-10 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background appearance-none cursor-pointer"
        >
          <option value="">All Forms</option>
          <option value="Contact Form">Contact Form</option>
          <option value="Newsletter Signup">Newsletter Signup</option>
          <option value="Event Registration">Event Registration</option>
          <option value="Job Application">Job Application</option>
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={filters.status}
          onChange={(event) => updateFilter("status", event.target.value)}
          className="h-10 pl-4 pr-10 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background appearance-none cursor-pointer"
        >
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
        <select
          value={filters.date}
          onChange={(event) => updateFilter("date", event.target.value)}
          className="h-10 pl-4 pr-10 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background appearance-none cursor-pointer"
        >
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
      <div className="relative ml-auto">
        <button
          onClick={() => setIsExportOpen((open) => !open)}
          className="h-10 px-4 rounded-xl border border-border bg-background text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          Export
        </button>
        {isExportOpen && (
          <div className="absolute right-0 top-12 z-20 w-36 rounded-xl border border-border bg-card p-1 shadow-lg">
            <button
              onClick={() => void exportSubmissions("csv")}
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
            >
              Export CSV
            </button>
            <button
              onClick={() => void exportSubmissions("pdf")}
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
            >
              Export PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
