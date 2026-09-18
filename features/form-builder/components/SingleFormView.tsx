"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormTopBar } from "./FormTopBar";
import { FormAnalytics } from "./FormAnalytics";
import { FormActions } from "./FormActions";
import { FormPreview } from "./FormPreview";
import { FormFieldsList } from "./FormFieldsList";
import type { FormType } from "../models/form-builder.model";
import { FormSubmissions } from "./FormSubmissions";

export function SingleFormView({ formData }: { formData: FormType }) {
  const [activeTab, setActiveTab] = useState<"preview" | "submissions" | "fields">("preview");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <FormTopBar title={formData.title} state={formData.state} slug={formData.slug} />

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl w-fit">
              {[
                { id: "preview" as const, label: "Preview" },
                {
                  id: "submissions" as const,
                  label: "Submissions",
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
            <div hidden={activeTab !== "submissions"}>
              <FormSubmissions slug={formData.slug} fields={formData.fields} />
            </div>
            {activeTab === "fields" && <FormFieldsList fields={formData.fields} />}
          </div>

          <div className="space-y-4">
            <FormAnalytics slug={formData.slug} />
            <FormActions slug={formData.slug} onDeleted={() => router.push("/all-forms")} />
          </div>
        </div>
      </div>
    </div>
  );
}
