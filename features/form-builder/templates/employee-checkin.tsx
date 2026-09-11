"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function EmployeeCheckinUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#f8fafc",
    page: "min-h-full bg-white",
    card: "rounded-3xl border border-slate-200 bg-white p-8 shadow-sm",
    title: "text-2xl",
    desc: "text-sm",
    radioVariant: "emojis",
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-lg"
      header={
        <div className="mb-6 rounded-2xl bg-black p-5 text-white">
          <p className="text-xs font-medium text-white/70">{today}</p>
          <h1 className="mt-0.5 text-xl font-bold tracking-tight">
            Good morning 👋 {props.formData.title}
          </h1>
          {props.formData.description && (
            <p className="mt-1 text-xs text-white/70">{props.formData.description}</p>
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
