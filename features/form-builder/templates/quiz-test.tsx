"use client";

import type { CSSProperties } from "react";
import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, SubmitBar, StatusCard } from "../utils/ui.utils";
import { Field } from "./form-field";

export function QuizTestUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#000000",
    soft: "#f8fafc",
    page: "min-h-full bg-white",
    card: "",
    title: "text-2xl",
    desc: "text-sm",
    radioVariant: "letters",
    checkVariant: "chips",
  };

  const vars = { "--acc": theme.accent, "--soft": theme.soft } as CSSProperties;
  const done = Boolean(props.hasSubmitted || form.successMsg);
  const flat = props.formData.fields.filter((f) => !["heading", "divider"].includes(f.type));

  return (
    <div style={vars} className={`${theme.page} px-4 py-10 ${props.className ?? ""}`}>
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 text-center">
          <span className="mb-3 inline-block rounded-full bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            Quiz mode
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {props.formData.title}
          </h1>
          {props.formData.description && (
            <p className="mt-2 text-sm text-slate-500">{props.formData.description}</p>
          )}
        </div>
        {done ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <StatusCard form={form} formData={props.formData} hasSubmitted={props.hasSubmitted} />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {props.formData.fields.map((f) => {
                if (f.type === "heading")
                  return (
                    <h3
                      key={f.id}
                      className="pt-3 text-sm font-bold uppercase tracking-wider text-black"
                    >
                      {f.label}
                    </h3>
                  );
                if (f.type === "divider") return <hr key={f.id} className="border-slate-200" />;
                const qNum = flat.indexOf(f) + 1;
                return (
                  <div
                    key={f.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <span className="mb-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                      {qNum}
                    </span>
                    <Field field={f} form={form} theme={theme} />
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SubmitBar
                form={form}
                theme={theme}
                text={props.formData.settings.submitButtonText || "Finish quiz"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
