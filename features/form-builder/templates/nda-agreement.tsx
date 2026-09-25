"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import {
  type UITheme,
  type TemplateUIProps,
  FormDescription,
  Frame,
  SubmitBar,
} from "../utils/ui.utils";
import { Field } from "./form-field";

export function NdaAgreementUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#f8fafc",
    page: "min-h-full bg-white px-4 py-12",
    card: "rounded-sm border border-slate-300 bg-white p-10 font-serif shadow-sm",
    title: "text-3xl",
    desc: "text-sm",
  };

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-2xl"
      header={
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Confidential · Legal Document
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tighter text-slate-900">
            {props.formData.title}
          </h1>
          <FormDescription
            description={props.formData.description}
            className="mx-auto mt-5 max-w-md space-y-3 border-y border-slate-200 py-4 text-left text-xs leading-relaxed text-slate-500"
          />
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
