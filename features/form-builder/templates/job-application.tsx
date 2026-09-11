"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function JobApplicationUI(props: TemplateUIProps) {
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
      maxW="max-w-2xl"
      grid
      header={
        <div className="mb-6 sm:col-span-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-black">
            <span className="rounded-full bg-black px-2.5 py-1 text-white">We&apos;re hiring</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Applications reviewed weekly</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {props.formData.title}
          </h1>
          {props.formData.description && (
            <p className="mt-2 text-sm text-slate-500">{props.formData.description}</p>
          )}
        </div>
      }
    >
      <div className="space-y-4 sm:col-span-2">
        {props.formData.fields.map((f) => (
          <Field key={f.id} field={f} form={form} theme={theme} />
        ))}
      </div>
      <div className="mt-6 sm:col-span-2">
        <SubmitBar form={form} theme={theme} text={props.formData.settings.submitButtonText} />
      </div>
    </Frame>
  );
}
