"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { showAlert } from "@/redux/features/global/alertSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { FormTopBar } from "./FormTopBar";
import { FormSubmissions } from "./FormSubmissions";
import { FormStats } from "./FormStats";
import { FormActions } from "./FormActions";
import { FormPreview } from "./FormPreview";
import { FormFieldsList } from "./FormFieldsList";
import type { FormType } from "../models/form-builder.model";

export type AnalyticsViewModel = {
  totalSubmissions: number;
  totalViews: number;
  conversionRate: number;
  avgTime: string;
  lastSubmission: string;
  todaySubmissions: number;
  weekSubmissions: number;
};

const emptyAnalytics: AnalyticsViewModel = {
  totalSubmissions: 0,
  totalViews: 0,
  conversionRate: 0,
  avgTime: "—",
  lastSubmission: "No submissions yet",
  todaySubmissions: 0,
  weekSubmissions: 0,
};

export type SubmissionViewModel = {
  id: string;
  submittedBy: string;
  email: string;
  date: string;
  createdAt: string;
  status: "new";
  values: Record<string, string>;
};

function toSubmissionViewModel(
  submission: {
    id: string;
    data: Record<string, unknown>;
    createdAt: string;
  },
  fields: FormType["fields"],
): SubmissionViewModel {
  const fieldMap = new Map(fields.map((field) => [field.id, field]));
  const safeData = submission.data || {};

  const values = Object.fromEntries(
    Object.entries(safeData).map(([fieldId, value]) => {
      const field = fieldMap.get(fieldId);
      const label = field?.label || fieldId;

      return [label, Array.isArray(value) ? value.join(", ") : String(value ?? "")];
    }),
  );

  const submittedBy =
    values.Name ||
    values["Full Name"] ||
    values["Full name"] ||
    values.full_name ||
    values.name ||
    "Anonymous";

  const email = values.Email || values.email || "No email";

  return {
    id: submission.id,
    submittedBy,
    email,
    date: new Date(submission.createdAt || Date.now()).toLocaleString(),
    createdAt: submission.createdAt || new Date().toISOString(),
    status: "new",
    values,
  };
}

export function SingleFormView({ formData }: { formData: FormType }) {
  const [activeTab, setActiveTab] = useState<"preview" | "submissions" | "fields">("preview");
  const [submissions, setSubmissions] = useState<SubmissionViewModel[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsViewModel>(emptyAnalytics);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const router = useRouter();

  const stats = {
    totalSubmissions: analytics.totalSubmissions || (submissions?.length ?? 0),
    totalViews: analytics.totalViews,
    conversionRate: analytics.conversionRate,
    avgTime: analytics.avgTime,
    lastSubmission: analytics.lastSubmission,
    todaySubmissions: analytics.todaySubmissions,
    weekSubmissions: analytics.weekSubmissions,
  };

  return (
    <div className="min-h-screen bg-background">
      <FormSubmissionsData
        slug={formData.slug}
        fields={formData.fields}
        onLoaded={(data) => setSubmissions(data || [])}
        onLoadingChange={setIsLoadingSubmissions}
      />
      <FormAnalyticsData slug={formData.slug} onLoaded={setAnalytics} />

      <FormTopBar title={formData.title} state={formData.state} slug={formData.slug} />

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl w-fit">
              {[
                { id: "preview" as const, label: "Preview" },
                {
                  id: "submissions" as const,
                  label: `Submissions (${isLoadingSubmissions ? "..." : (submissions?.length ?? 0)})`,
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

            {activeTab === "preview" && <FormPreview fields={formData.fields} />}
            {activeTab === "submissions" && <FormSubmissions submissions={submissions || []} />}
            {activeTab === "fields" && <FormFieldsList fields={formData.fields} />}
          </div>

          <div className="space-y-4">
            <FormStats stats={stats} />
            <FormActions slug={formData.slug} onDeleted={() => router.push("/all-forms")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSubmissionsData({
  slug,
  fields,
  onLoaded,
  onLoadingChange,
}: {
  slug: string;
  fields: FormType["fields"];
  onLoaded: (submissions: SubmissionViewModel[]) => void;
  onLoadingChange: (loading: boolean) => void;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;
    onLoadingChange(true);

    void axios
      .get(`/api/forms/${slug}/submissions`)
      .then((response) => {
        if (!cancelled) {
          const rawData = response.data?.data || response.data || [];
          const items = Array.isArray(rawData) ? rawData : [];
          onLoaded(items.map((item: any) => toSubmissionViewModel(item, fields)));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          onLoaded([]);
          dispatch(
            showAlert({
              message: getErrorMessage(error, "Unable to load submissions"),
              type: "danger",
            }),
          );
        }
      })
      .finally(() => {
        if (!cancelled) onLoadingChange(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, fields, onLoaded, onLoadingChange, slug]);

  return null;
}

function FormAnalyticsData({
  slug,
  onLoaded,
}: {
  slug: string;
  onLoaded: (analytics: AnalyticsViewModel) => void;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    void axios
      .get(`/api/forms/${slug}/analytics`)
      .then((response) => {
        const rawData = response.data?.data || response.data || {};
        onLoaded({ ...emptyAnalytics, ...rawData });
      })
      .catch((error: unknown) => {
        dispatch(
          showAlert({
            message: getErrorMessage(error, "Unable to load form analytics"),
            type: "danger",
          }),
        );
      });
  }, [dispatch, onLoaded, slug]);

  return null;
}
