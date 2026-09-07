"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/features/global/alertSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { FormTopBar } from "./FormTopBar";
import { FormSubmissions } from "./FormSubmissions";
import { FormStats } from "./FormStats";
import { FormActions } from "./FormActions";
import { FormPreview } from "./FormPreview";
import { FormFieldsList } from "./FormFieldsList";
import type { FormType } from "../models/form-builder.model";

export function SingleFormView({ formData }: { formData: FormType }) {
  const [activeTab, setActiveTab] = useState<"preview" | "submissions" | "fields">("preview");
  const [submissions, setSubmissions] = useState<SubmissionViewModel[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    const loadSubmissions = async () => {
      try {
        const response = await fetch(`/api/forms/${formData.slug}/submissions`);
        if (!response.ok) throw new Error("Unable to load submissions");
        const result = await response.json();
        if (!cancelled) {
          setSubmissions((result.data ?? []).map(toSubmissionViewModel));
        }
      } catch (error: unknown) {
        if (!cancelled) setSubmissions([]);
        if (!cancelled) {
          dispatch(
            showAlert({
              message: getErrorMessage(error, "Unable to load submissions"),
              type: "danger",
            }),
          );
        }
      } finally {
        if (!cancelled) setIsLoadingSubmissions(false);
      }
    };

    void loadSubmissions();

    return () => {
      cancelled = true;
    };
  }, [dispatch, formData.slug]);

  const stats = {
    totalSubmissions: submissions.length,
    totalViews: 0,
    conversionRate: 0,
    avgTime: "—",
    lastSubmission: submissions[0]?.date || "No submissions yet",
    todaySubmissions: submissions.filter((submission) => isToday(submission.createdAt)).length,
    weekSubmissions: submissions.filter((submission) => isThisWeek(submission.createdAt)).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <FormTopBar title={formData.title} state={formData.state} slug={formData.slug} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl w-fit">
              {[
                { id: "preview" as const, label: "Preview" },
                {
                  id: "submissions" as const,
                  label: `Submissions (${isLoadingSubmissions ? "..." : submissions.length})`,
                },
                { id: "fields" as const, label: "Fields" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "preview" && <FormPreview fields={formData.fields} />}
            {activeTab === "submissions" && <FormSubmissions submissions={submissions} />}
            {activeTab === "fields" && <FormFieldsList fields={formData.fields} />}
          </div>

          {/* Right Column - 1/3 Stats & Actions */}
          <div className="space-y-4">
            <FormStats stats={stats} />
            <FormActions slug={formData.slug} onDeleted={() => router.push("/all-forms")} />
          </div>
        </div>
      </div>
    </div>
  );
}

type SubmissionViewModel = {
  id: string;
  submittedBy: string;
  email: string;
  date: string;
  createdAt: string;
  status: "new";
  values: Record<string, string>;
};

function toSubmissionViewModel(submission: {
  id: string;
  data: Record<string, unknown>;
  createdAt: string;
}): SubmissionViewModel {
  const values = Object.fromEntries(
    Object.entries(submission.data).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(", ") : String(value ?? ""),
    ]),
  );

  return {
    id: submission.id,
    submittedBy: values.name || values.full_name || "Anonymous",
    email: values.email || "No email",
    date: new Date(submission.createdAt).toLocaleString(),
    createdAt: submission.createdAt,
    status: "new",
    values,
  };
}

function isToday(date: string) {
  const value = new Date(date);
  const today = new Date();
  return value.toDateString() === today.toDateString();
}

function isThisWeek(date: string) {
  const value = new Date(date).getTime();
  return Date.now() - value <= 7 * 24 * 60 * 60 * 1000;
}
