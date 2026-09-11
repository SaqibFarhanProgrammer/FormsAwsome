"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function CourseEvaluationUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#f8fafc",
    page: "min-h-full bg-white",
    card: "rounded-2xl border border-slate-200 bg-white p-8 shadow-sm",
    title: "text-2xl",
    desc: "text-sm",
  };

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-lg"
      header={
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white">
            🎓
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
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
