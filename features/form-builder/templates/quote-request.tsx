"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function QuoteRequestUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#f8fafc",
    page: "min-h-full bg-white",
    card: "rounded-2xl border border-slate-200 bg-white p-8 shadow-sm",
    title: "text-2xl",
    desc: "text-sm",
    checkVariant: "chips",
  };

  const budgetField = props.formData.fields.find((f) => f.type === "slider");
  const budget = budgetField ? form.values[budgetField.id] : null;

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-2xl"
      header={
        <div className="mb-6 border-b border-slate-100 pb-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {props.formData.title}
              </h1>
              {props.formData.description && (
                <p className="mt-1 text-sm text-slate-500">{props.formData.description}</p>
              )}
            </div>
            {budget !== null && budget !== undefined && (
              <div className="shrink-0 rounded-xl bg-black px-4 py-2 text-center text-white">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                  Budget
                </p>
                <p className="text-lg font-bold leading-none">${budget}k</p>
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {props.formData.fields.map((f) => (
          <Field key={f.id} field={f} form={form} theme={theme} />
        ))}
      </div>
      <div className="mt-6">
        <SubmitBar form={form} theme={theme} text={props.formData.settings.submitButtonText} />
      </div>
    </Frame>
  );
}
