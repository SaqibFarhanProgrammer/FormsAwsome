"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChevronDown, ChevronUp, Eye, Archive, Trash2 } from "lucide-react";

interface Submission {
  id: string;
  form: string;
  name: string;
  email: string;
  date: string;
  status: "new" | "viewed" | "archived";
  details: { label: string; value: string }[];
}

const submissionsData: Submission[] = [
  {
    id: "1",
    form: "Contact Form",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    date: "Aug 27, 2026",
    status: "new",
    details: [
      { label: "Name", value: "Sarah Johnson" },
      { label: "Email", value: "sarah@example.com" },
      { label: "Phone", value: "+1 (555) 123-4567" },
      { label: "Subject", value: "Product Inquiry" },
      {
        label: "Message",
        value:
          "Hi, I am interested in learning more about your enterprise plan. Can someone reach out to discuss pricing?",
      },
    ],
  },
  {
    id: "2",
    form: "Newsletter Signup",
    name: "Mike Chen",
    email: "mike@example.com",
    date: "Aug 27, 2026",
    status: "new",
    details: [
      { label: "Name", value: "Mike Chen" },
      { label: "Email", value: "mike@example.com" },
      { label: "Company", value: "TechCorp Inc." },
      { label: "Interests", value: "Product Updates, Tutorials" },
    ],
  },
  {
    id: "3",
    form: "Event Registration",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "Aug 26, 2026",
    status: "viewed",
    details: [
      { label: "Name", value: "Emily Davis" },
      { label: "Email", value: "emily@example.com" },
      { label: "Phone", value: "+1 (555) 987-6543" },
      { label: "Event", value: "Summer Workshop 2026" },
      { label: "Tickets", value: "2" },
      { label: "Dietary", value: "Vegetarian" },
    ],
  },
  {
    id: "4",
    form: "Contact Form",
    name: "Alex Turner",
    email: "alex@example.com",
    date: "Aug 26, 2026",
    status: "archived",
    details: [
      { label: "Name", value: "Alex Turner" },
      { label: "Email", value: "alex@example.com" },
      { label: "Subject", value: "Support Request" },
      {
        label: "Message",
        value: "Having trouble exporting my form data. The CSV download seems to be broken.",
      },
    ],
  },
  {
    id: "5",
    form: "Newsletter Signup",
    name: "Lisa Wang",
    email: "lisa@example.com",
    date: "Aug 25, 2026",
    status: "viewed",
    details: [
      { label: "Name", value: "Lisa Wang" },
      { label: "Email", value: "lisa@example.com" },
      { label: "Company", value: "Design Studio" },
    ],
  },
  {
    id: "6",
    form: "Job Application",
    name: "David Kim",
    email: "david@example.com",
    date: "Aug 25, 2026",
    status: "new",
    details: [
      { label: "Name", value: "David Kim" },
      { label: "Email", value: "david@example.com" },
      { label: "Phone", value: "+1 (555) 456-7890" },
      { label: "Position", value: "Senior Frontend Developer" },
      { label: "Experience", value: "5+ years" },
      { label: "Portfolio", value: "davidkim.dev" },
    ],
  },
  {
    id: "7",
    form: "Customer Feedback",
    name: "Rachel Green",
    email: "rachel@example.com",
    date: "Aug 24, 2026",
    status: "viewed",
    details: [
      { label: "Name", value: "Rachel Green" },
      { label: "Email", value: "rachel@example.com" },
      { label: "Rating", value: "4.5/5" },
      { label: "Feedback", value: "Great platform! Would love to see more analytics features." },
    ],
  },
  {
    id: "8",
    form: "Support Ticket",
    name: "Tom Hardy",
    email: "tom@example.com",
    date: "Aug 24, 2026",
    status: "archived",
    details: [
      { label: "Name", value: "Tom Hardy" },
      { label: "Email", value: "tom@example.com" },
      { label: "Issue", value: "Login not working" },
      { label: "Priority", value: "High" },
    ],
  },
  {
    id: "9",
    form: "Contact Form",
    name: "Jessica Alba",
    email: "jessica@example.com",
    date: "Aug 23, 2026",
    status: "new",
    details: [
      { label: "Name", value: "Jessica Alba" },
      { label: "Email", value: "jessica@example.com" },
      { label: "Subject", value: "Partnership" },
      { label: "Message", value: "Interested in a partnership opportunity. Please contact me." },
    ],
  },
  {
    id: "10",
    form: "Event Registration",
    name: "Chris Evans",
    email: "chris@example.com",
    date: "Aug 23, 2026",
    status: "new",
    details: [
      { label: "Name", value: "Chris Evans" },
      { label: "Email", value: "chris@example.com" },
      { label: "Event", value: "Webinar: Future of Forms" },
      { label: "Tickets", value: "1" },
    ],
  },
  {
    id: "11",
    form: "Newsletter Signup",
    name: "Anna Bell",
    email: "anna@example.com",
    date: "Aug 22, 2026",
    status: "viewed",
    details: [
      { label: "Name", value: "Anna Bell" },
      { label: "Email", value: "anna@example.com" },
      { label: "Company", value: "StartupXYZ" },
    ],
  },
  {
    id: "12",
    form: "Job Application",
    name: "Mark Wilson",
    email: "mark@example.com",
    date: "Aug 22, 2026",
    status: "archived",
    details: [
      { label: "Name", value: "Mark Wilson" },
      { label: "Email", value: "mark@example.com" },
      { label: "Position", value: "UI/UX Designer" },
      { label: "Experience", value: "3 years" },
    ],
  },
  {
    id: "13",
    form: "Customer Feedback",
    name: "Sophie Turner",
    email: "sophie@example.com",
    date: "Aug 21, 2026",
    status: "new",
    details: [
      { label: "Name", value: "Sophie Turner" },
      { label: "Email", value: "sophie@example.com" },
      { label: "Rating", value: "5/5" },
      { label: "Feedback", value: "Absolutely love the drag and drop builder!" },
    ],
  },
  {
    id: "14",
    form: "Support Ticket",
    name: "James Bond",
    email: "james@example.com",
    date: "Aug 21, 2026",
    status: "viewed",
    details: [
      { label: "Name", value: "James Bond" },
      { label: "Email", value: "james@example.com" },
      { label: "Issue", value: "Form embed not loading" },
      { label: "Priority", value: "Medium" },
    ],
  },
  {
    id: "15",
    form: "Contact Form",
    name: "Emma Watson",
    email: "emma@example.com",
    date: "Aug 20, 2026",
    status: "archived",
    details: [
      { label: "Name", value: "Emma Watson" },
      { label: "Email", value: "emma@example.com" },
      { label: "Subject", value: "Feature Request" },
      { label: "Message", value: "Would be great to have conditional logic in forms." },
    ],
  },
];

function getStatusBadge(status: Submission["status"]) {
  switch (status) {
    case "new":
      return (
        <Badge
          variant="secondary"
          className="rounded-lg bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-50 font-medium text-xs"
        >
          New
        </Badge>
      );
    case "viewed":
      return (
        <Badge
          variant="secondary"
          className="rounded-lg bg-blue-50 text-blue-700 border-blue-200/50 hover:bg-blue-50 font-medium text-xs"
        >
          Viewed
        </Badge>
      );
    case "archived":
      return (
        <Badge
          variant="secondary"
          className="rounded-lg bg-slate-100 text-slate-600 border-slate-200/50 hover:bg-slate-100 font-medium text-xs"
        >
          Archived
        </Badge>
      );
  }
}

export function SubmissionsTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card className="rounded-2xl border-border overflow-hidden">
      {/* Scrollable Table Container */}
      <div className="max-h-[600px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Form
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Submitted By
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissionsData.map((submission) => (
              <React.Fragment key={submission.id}>
                <TableRow
                  className="cursor-pointer hover:bg-muted/30 transition-colors border-border"
                  onClick={() => toggleExpand(submission.id)}
                >
                  <TableCell className="py-3">
                    <button
                      className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(submission.id);
                      }}
                    >
                      {expandedId === submission.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="py-3 text-sm font-medium">{submission.form}</TableCell>
                  <TableCell className="py-3 text-sm">{submission.name}</TableCell>
                  <TableCell className="py-3 text-sm text-muted-foreground">
                    {submission.email}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-muted-foreground">
                    {submission.date}
                  </TableCell>
                  <TableCell className="py-3">{getStatusBadge(submission.status)}</TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded Detail Row */}
                {expandedId === submission.id && (
                  <TableRow className="hover:bg-transparent border-0">
                    <TableCell colSpan={7} className="p-0">
                      <div className="px-4 pb-4">
                        <Card className="rounded-xl border-border bg-muted/30 p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold">Submission Details</h4>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl gap-2 text-xs h-8"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Mark as Viewed
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl gap-2 text-xs h-8"
                              >
                                <Archive className="w-3.5 h-3.5" />
                                Archive
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl gap-2 text-xs h-8 text-destructive border-destructive/20 hover:bg-destructive/5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </Button>
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {submission.details.map((detail, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-background border border-border"
                              >
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                  {detail.label}
                                </p>
                                <p className="text-sm font-medium">{detail.value}</p>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom Info Bar */}
      <div className="border-t border-border px-6 py-3 bg-card flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing all {submissionsData.length} submissions
        </p>
      </div>
    </Card>
  );
}
