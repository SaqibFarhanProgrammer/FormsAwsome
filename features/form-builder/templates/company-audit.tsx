"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function CompanyAuditUI(props: TemplateUIProps) {
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

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-2xl"
      header={
        <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-2xl text-white">
            🛡️
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {props.formData.title}
            </h1>
            {props.formData.description && (
              <p className="mt-0.5 text-sm text-slate-500">{props.formData.description}</p>
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
