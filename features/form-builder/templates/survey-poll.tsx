"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function SurveyPollUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#f8fafc",
    page: "min-h-full bg-white",
    card: "rounded-2xl border border-slate-200 bg-white p-8 shadow-sm",
    title: "text-2xl",
    desc: "text-sm",
  };

  const required = props.formData.fields.filter(
    (f) => f.validation.required && !["heading", "divider"].includes(f.type),
  );
  const filled = required.filter((f) => {
    const v = form.values[f.id];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && v !== "" && v !== false;
  }).length;
  const pct = required.length ? Math.round((filled / required.length) * 100) : 0;

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-lg"
      header={
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-400">
            <span>
              {filled} of {required.length} required
            </span>
            <span className="font-bold text-black">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-black transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            {props.formData.title}
          </h1>
          {props.formData.description && (
            <p className="mt-1 text-sm text-slate-500">{props.formData.description}</p>
          )}
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
