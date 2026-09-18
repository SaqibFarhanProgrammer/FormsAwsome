"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronUp, Mail, User, Clock } from "lucide-react";
import { showAlert } from "@/redux/features/global/alertSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { FormType } from "../models/form-builder.model";

export interface Submission {
  id: string;
  submittedBy: string;
  email: string;
  date: string;
  status: "new" | "viewed" | "archived";
  values: Record<string, string>;
}

interface FormSubmissionsProps {
  slug: string;
  fields: FormType["fields"];
}

function toSubmissionViewModel(
  submission: { id: string; data: Record<string, unknown>; createdAt: string },
  fields: FormType["fields"],
): Submission {
  const fieldMap = new Map(fields.map((field) => [field.id, field]));
  const values = Object.fromEntries(
    Object.entries(submission.data || {}).map(([fieldId, value]) => {
      const field = fieldMap.get(fieldId);
      const label = field?.label || fieldId;
      return [label, Array.isArray(value) ? value.join(", ") : String(value ?? "")];
    }),
  );

  return {
    id: submission.id,
    submittedBy:
      values.Name ||
      values["Full Name"] ||
      values["Full name"] ||
      values.full_name ||
      values.name ||
      "Anonymous",
    email: values.Email || values.email || "No email",
    date: new Date(submission.createdAt || Date.now()).toLocaleString(),
    status: "new",
    values,
  };
}

export function FormSubmissions({ slug, fields }: FormSubmissionsProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void axios
      .get(`/api/forms/${slug}/submissions`)
      .then((response) => {
        if (cancelled) return;

        const rawData = response.data?.data || response.data || [];
        const items = Array.isArray(rawData) ? rawData : [];
        setSubmissions(
          items.map((item) =>
            toSubmissionViewModel(
              item as { id: string; data: Record<string, unknown>; createdAt: string },
              fields,
            ),
          ),
        );
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSubmissions([]);
          dispatch(
            showAlert({
              message: getErrorMessage(error, "Unable to load submissions"),
              type: "danger",
            }),
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, fields, slug]);

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Submissions</CardTitle>
        <p className="text-sm text-muted-foreground">All responses to this form.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading submissions...</p>}
        {!isLoading && submissions.length === 0 && (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        )}
        {!isLoading &&
          submissions.map((submission) => (
            <div
              key={submission.id}
              className={`rounded-xl border transition-all ${
                expandedId === submission.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
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

              {expandedId === submission.id && (
                <div className="px-4 pb-4">
                  <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Submission Data
                    </p>
                    <div className="grid gap-2">
                      {Object.entries(submission.values).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start gap-3 p-2.5 rounded-lg bg-background border border-border"
                        >
                          <span className="text-xs text-muted-foreground font-medium w-32 flex-shrink-0">
                            {key}
                          </span>
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
