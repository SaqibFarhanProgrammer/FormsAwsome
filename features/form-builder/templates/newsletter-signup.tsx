"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";
import { Mail } from "lucide-react";

export function NewsletterSignupUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#f8fafc",
    page: "min-h-full bg-white px-4 py-10",
    card: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8",
    title: "text-2xl",
    desc: "text-sm",
    checkVariant: "chips",
    radioVariant: "pills",
  };

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-lg"
      header={
        <div className="mb-7">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            {props.formData.title}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
            {props.formData.description || "Get useful updates and ideas delivered to your inbox."}
          </p>
        </div>
      }
    >
      <div className="space-y-5">
        {props.formData.fields.map((f) => (
          <Field key={f.id} field={f} form={form} theme={theme} />
        ))}
      </div>
      <div className="mt-7 max-w-xs">
        <SubmitBar form={form} theme={theme} text={props.formData.settings.submitButtonText} />
      </div>
    </Frame>
  );
}
