"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function ExpenseReimbursementUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#f8fafc",
    page: "min-h-full bg-white",
    card: "rounded-2xl border border-slate-200 bg-white p-8 shadow-sm",
    title: "text-2xl",
    desc: "text-sm",
  };

  const amountField = props.formData.fields.find((f) => f.type === "number");
  const amount = amountField ? form.values[amountField.id] : null;

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-2xl"
      header={
        <div className="mb-6 border-b-2 border-slate-900 pb-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-black">
                Finance · Claims
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {props.formData.title}
              </h1>
              {props.formData.description && (
                <p className="mt-1 text-sm text-slate-500">{props.formData.description}</p>
              )}
            </div>
            {amount !== null && amount !== undefined && amount !== "" && (
              <div className="shrink-0 rounded-xl border-2 border-slate-900 px-4 py-2 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Claim total
                </p>
                <p className="text-xl font-black text-slate-900">
                  ${Number(amount).toLocaleString()}
                </p>
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
