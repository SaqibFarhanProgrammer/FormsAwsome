"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  MoreHorizontal,
  Eye,
  BarChart3,
  Pencil,
  Copy,
  Archive,
  Trash2,
  Send,
} from "lucide-react";
import Form_Card from "@/features/form-builder/components/Form_Card";

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

// const formsData: Form[] = [
//   {
//     id: "1",
//     title: "Contact Form",
//     description: "General contact inquiries",
//     status: "active",
//     submissions: 342,
//     views: 2100,
//     createdAt: "2026-08-20",
//     updatedAt: "2026-08-27",
//   },
//   {
//     id: "2",
//     title: "Newsletter Signup",
//     description: "Email subscription form",
//     status: "active",
//     submissions: 891,
//     views: 5400,
//     createdAt: "2026-08-18",
//     updatedAt: "2026-08-26",
//   },
//   {
//     id: "3",
//     title: "Job Application",
//     description: "Career opportunities",
//     status: "draft",
//     submissions: 0,
//     views: 0,
//     createdAt: "2026-08-25",
//     updatedAt: "2026-08-25",
//   },
//   {
//     id: "4",
//     title: "Event Registration",
//     description: "Summer workshop 2026",
//     status: "active",
//     submissions: 51,
//     views: 1200,
//     createdAt: "2026-08-15",
//     updatedAt: "2026-08-24",
//   },
//   {
//     id: "5",
//     title: "Customer Feedback",
//     description: "Product feedback survey",
//     status: "active",
//     submissions: 128,
//     views: 3400,
//     createdAt: "2026-08-10",
//     updatedAt: "2026-08-23",
//   },
//   {
//     id: "6",
//     title: "Support Ticket",
//     description: "Technical support requests",
//     status: "active",
//     submissions: 67,
//     views: 890,
//     createdAt: "2026-08-08",
//     updatedAt: "2026-08-22",
//   },
//   {
//     id: "7",
//     title: "Product Survey",
//     description: "New feature feedback",
//     status: "draft",
//     submissions: 0,
//     views: 12,
//     createdAt: "2026-08-28",
//     updatedAt: "2026-08-28",
//   },
//   {
//     id: "7",
//     title: "Product Survey",
//     description: "New feature feedback",
//     status: "draft",
//     submissions: 0,
//     views: 12,
//     createdAt: "2026-08-28",
//     updatedAt: "2026-08-28",
//   },
//   {
//     id: "7",
//     title: "Product Survey",
//     description: "New feature feedback",
//     status: "draft",
//     submissions: 0,
//     views: 12,
//     createdAt: "2026-08-28",
//     updatedAt: "2026-08-28",
//   },
//   {
//     id: "7",
//     title: "Product Survey",
//     description: "New feature feedback",
//     status: "draft",
//     submissions: 0,
//     views: 12,
//     createdAt: "2026-08-28",
//     updatedAt: "2026-08-28",
//   },
//   {
//     id: "7",
//     title: "Product Survey",
//     description: "New feature feedback",
//     status: "draft",
//     submissions: 0,
//     views: 12,
//     createdAt: "2026-08-28",
//     updatedAt: "2026-08-28",
//   },
//   {
//     id: "7",
//     title: "Product Survey",
//     description: "New feature feedback",
//     status: "draft",
//     submissions: 0,
//     views: 12,
//     createdAt: "2026-08-28",
//     updatedAt: "2026-08-28",
//   },
//   {
//     id: "7",
//     title: "Product Survey",
//     description: "New feature feedback",
//     status: "draft",
//     submissions: 0,
//     views: 12,
//     createdAt: "2026-08-28",
//     updatedAt: "2026-08-28",
//   },
//   {
//     id: "7",
//     title: "Product Survey",
//     description: "New feature feedback",
//     status: "draft",
//     submissions: 0,
//     views: 12,
//     createdAt: "2026-08-28",
//     updatedAt: "2026-08-28",
//   },
//   {
//     id: "7",
//     title: "Product Survey",
//     description: "New feature feedback",
//     status: "draft",
//     submissions: 0,
//     views: 12,
//     createdAt: "2026-08-28",
//     updatedAt: "2026-08-28",
//   },
//   {
//     id: "8",
//     title: "Booking Form",
//     description: "Appointment scheduling",
//     status: "archived",
//     submissions: 234,
//     views: 1500,
//     createdAt: "2026-07-15",
//     updatedAt: "2026-08-01",
//   },
// ];

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
        <Form_Card key={form.id} form={form} />
      ))}
    </div>
  );
}
