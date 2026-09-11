"use client";

import { useTemplateForm } from "./utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "./utils/ui.utils";
import { Field } from "./components/form-field";

const minimalTheme: UITheme = {
  accent: "#000000",
  soft: "#f8fafc",
  page: "min-h-full bg-white",
  card: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8",
  title: "text-2xl",
  desc: "text-sm",
};

export function MinimalFormTemplate(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);

  return (
    <Frame
      {...props}
      theme={minimalTheme}
      form={form}
      maxW="max-w-2xl"
      header={
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {props.formData.templateType || "Form template"}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-black">
            {props.formData.title}
          </h1>
          {props.formData.description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              {props.formData.description}
            </p>
          )}
        </header>
      }
    >
      <div className="space-y-5">
        {props.formData.fields.map((field) => (
          <Field key={field.id} field={field} form={form} theme={minimalTheme} />
        ))}
      </div>
      <div className="mt-7 max-w-xs">
        <SubmitBar form={form} theme={minimalTheme} text={props.formData.settings.submitButtonText} />
      </div>
    </Frame>
  );
}
