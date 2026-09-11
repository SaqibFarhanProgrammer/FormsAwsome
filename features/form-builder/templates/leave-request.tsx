"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function LeaveRequestUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#f8fafc",
    page: "min-h-full bg-white",
    card: "rounded-2xl border border-slate-200 bg-white p-8 shadow-sm",
    title: "text-2xl",
    desc: "text-sm",
    radioVariant: "pills",
  };

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      grid
      header={
        <div className="mb-6 sm:col-span-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {props.formData.title}
          </h1>
          {props.formData.description && (
            <p className="mt-1 text-sm text-slate-500">{props.formData.description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["Annual", "12 days left"],
              ["Sick", "7 days left"],
              ["Casual", "5 days left"],
            ].map(([k, v]) => (
              <span
                key={k}
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs"
              >
                <b className="text-black">{k}</b> <span className="text-slate-500">· {v}</span>
              </span>
            ))}
          </div>
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
