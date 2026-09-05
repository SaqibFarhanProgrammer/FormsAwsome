"use client";

import { useState } from "react";
import { FormTopBar } from "./FormTopBar";
import { singleFormData } from "./FormData";
import { FormSubmissions } from "./FormSubmissions";
import { FormStats } from "./FormStats";
import { FormActions } from "./FormActions";
import { FormPreview } from "./FormPreview";
import { FormFieldsList } from "./FormFieldsList";
import type { FormType } from "../models/form-builder.model";

export function SingleFormView({ formData }: { formData: FormType }) {
  const [activeTab, setActiveTab] = useState<"preview" | "submissions" | "fields">("preview");

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
                  label: `Submissions (${singleFormData.stats.totalSubmissions})`,
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
            {activeTab === "submissions" && (
              <FormSubmissions submissions={singleFormData.submissions} />
            )}
            {activeTab === "fields" && <FormFieldsList fields={formData.fields} />}
          </div>

          {/* Right Column - 1/3 Stats & Actions */}
          <div className="space-y-4">
            <FormStats stats={singleFormData.stats} />
            <FormActions slug={formData.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
