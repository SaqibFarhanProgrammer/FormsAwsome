"use client";

import { FileText } from "lucide-react";
import FormCard from "@/features/form-builder/components/FormCard";

interface Form {
  id: string;
  title: string;
  description: string;
  status: "active" | "draft" | "archived";
  submissions: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface FormsGridProps {
  searchQuery: string;
  statusFilter: string;
  sortBy: string;
  forms: any[];
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

export function FormsGrid({ searchQuery, statusFilter, sortBy, forms }: FormsGridProps) {
  let filtered = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "submissions":
        return b.submissions - a.submissions;
      case "views":
        return b.views - a.views;
      case "recent":
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No forms found</h3>
        <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  );
}
