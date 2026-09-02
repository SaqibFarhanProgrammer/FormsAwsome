"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Mail, User, Clock } from "lucide-react";

interface Submission {
  id: string;
  submittedBy: string;
  email: string;
  date: string;
  status: "new" | "viewed" | "archived";
  values: Record<string, string>;
}

interface FormSubmissionsProps {
  submissions: Submission[];
}

const THEME = { primary: "#432DD7" };

function getStatusBadge(status: Submission["status"]) {
  switch (status) {
    case "new":
      return (
        <Badge variant="secondary" className="rounded-lg bg-emerald-50 text-emerald-700 border-emerald-200/50 text-xs font-medium">
          New
        </Badge>
      );
    case "viewed":
      return (
        <Badge variant="secondary" className="rounded-lg bg-blue-50 text-blue-700 border-blue-200/50 text-xs font-medium">
          Viewed
        </Badge>
      );
    case "archived":
      return (
        <Badge variant="secondary" className="rounded-lg bg-slate-100 text-slate-600 border-slate-200/50 text-xs font-medium">
          Archived
        </Badge>
      );
  }
}

export function FormSubmissions({ submissions }: FormSubmissionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Submissions</CardTitle>
        <p className="text-sm text-muted-foreground">All responses to this form.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className={`rounded-xl border transition-all ${
              expandedId === submission.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            {/* Header Row */}
            <button
              onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{submission.submittedBy}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span>{submission.email}</span>
                    <span>·</span>
                    <Clock className="w-3 h-3" />
                    <span>{submission.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {expandedId === submission.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Expanded Values */}
            {expandedId === submission.id && (
              <div className="px-4 pb-4">
                <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Submission Data
                  </p>
                  <div className="grid gap-2">
                    {Object.entries(submission.values).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-3 p-2.5 rounded-lg bg-background border border-border">
                        <span className="text-xs text-muted-foreground font-medium w-32 flex-shrink-0">{key}</span>
                        <span className="text-sm">{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="rounded-xl text-xs h-8">
                      Mark as Viewed
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs h-8">
                      Archive
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}