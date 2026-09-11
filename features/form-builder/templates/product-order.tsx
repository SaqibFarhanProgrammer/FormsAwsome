"use client";

import type { CSSProperties } from "react";
import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, SubmitBar, StatusCard } from "../utils/ui.utils";
import { Field } from "./form-field";

export function ProductOrderUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#ffffff",
    page: "min-h-full bg-white",
    card: "",
    title: "text-2xl",
    desc: "text-sm",
    radioVariant: "pills",
  };

  const vars = { "--acc": theme.accent, "--soft": theme.soft } as CSSProperties;
  const done = Boolean(props.hasSubmitted || form.successMsg);
  const productField = props.formData.fields.find((f) => f.type === "dropdown");
  const qtyField = props.formData.fields.find((f) => f.type === "number");
  const productLabel = productField?.options?.find(
    (o) => o.value === form.values[productField?.id ?? ""],
  )?.label;
  const qty = form.values[qtyField?.id ?? ""];

  return (
    <div style={vars} className={`${theme.page} px-4 py-10 ${props.className ?? ""}`}>
      <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          {done ? (
            <StatusCard form={form} formData={props.formData} hasSubmitted={props.hasSubmitted} />
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {props.formData.title}
                </h1>
                {props.formData.description && (
                  <p className="mt-1 text-sm text-slate-500">{props.formData.description}</p>
                )}
              </div>
              <div className="space-y-4">
                {props.formData.fields.map((f) => (
                  <Field key={f.id} field={f} form={form} theme={theme} />
                ))}
              </div>
              <div className="mt-6">
                <SubmitBar
                  form={form}
                  theme={theme}
                  text={props.formData.settings.submitButtonText}
                />
              </div>
            </>
          )}
        </div>
        <div className="h-fit rounded-2xl bg-slate-900 p-6 text-white lg:sticky lg:top-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Order summary
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Product</span>
              <span className="font-medium">{productLabel || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Quantity</span>
              <span className="font-medium">{qty || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Shipping</span>
              <span className="font-medium text-white">Free</span>
            </div>
          </div>
          <div className="mt-4 border-t border-white/10 pt-4 text-xs text-slate-400">
            Final pricing confirmed by our team after review.
          </div>
        </div>
      </div>
    </div>
  );
}
