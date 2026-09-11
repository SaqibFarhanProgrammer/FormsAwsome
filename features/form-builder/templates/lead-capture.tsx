"use client";

import type { CSSProperties } from "react";
import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, SubmitBar, StatusCard } from "../utils/ui.utils";
import { Field } from "./form-field";
import { Check } from "lucide-react";

export function LeadCaptureUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#ffffff",
    page: "min-h-full bg-slate-50 px-4 py-10",
    card: "",
    title: "text-2xl",
    desc: "text-sm",
    radioVariant: "pills",
    checkVariant: "chips",
  };
  const vars = { "--acc": theme.accent, "--soft": theme.soft } as CSSProperties;
  const done = Boolean(props.hasSubmitted || form.successMsg);

  return (
    <div style={vars} className={`${theme.page} ${props.className ?? ""}`}>
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-8 sm:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">
            Free quote · No commitment
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {props.formData.title}
          </h1>
          {props.formData.description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              {props.formData.description}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
            {["Response within 1 business day", "Tailored pricing", "Free consultation"].map(
              (text) => (
                <span key={text} className="inline-flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-black" />
                  {text}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10">
          {done ? (
            <StatusCard form={form} formData={props.formData} hasSubmitted={props.hasSubmitted} />
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Tell us about your project</h2>
                <p className="mt-1 text-sm text-slate-500">Takes less than 60 seconds.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {props.formData.fields.map((f) => (
                  <div key={f.id} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                    <Field field={f} form={form} theme={theme} />
                  </div>
                ))}
              </div>
              <div className="mt-7 max-w-xs">
                <SubmitBar
                  form={form}
                  theme={theme}
                  text={props.formData.settings.submitButtonText}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
