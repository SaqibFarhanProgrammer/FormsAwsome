"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, StatusCard } from "../utils/ui.utils";
import { Field } from "./form-field";

export function ContactFormUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#111827",
    soft: "#f8fafc",
    page: "min-h-full bg-white",
    card: "",
    title: "text-2xl",
    desc: "text-sm",
  };

  const done = Boolean(props.hasSubmitted || form.successMsg);

  return (
    <Frame {...props} theme={theme} form={form} bare>
      <div className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-10 sm:py-14">
        {done ? (
          <StatusCard form={form} formData={props.formData} hasSubmitted={props.hasSubmitted} />
        ) : (
          <>
            <header className="mb-10 max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {props.formData.title}
              </h1>
              <div className="mt-8 space-y-5 text-[15px] italic leading-relaxed text-slate-600">
                {props.formData.description ? (
                  <p>{props.formData.description}</p>
                ) : (
                  <>
                    <p>
                      This contact form helps you collect messages, questions, and inquiries in a
                      clear and structured way.
                    </p>
                    <p>
                      Add or remove fields, adjust labels, and turn it into a simple or multi-step
                      contact form.
                    </p>
                    <p>
                      This free contact form template helps you respond faster and make it easy for
                      people to get in touch.
                    </p>
                  </>
                )}
              </div>
            </header>

            <div className="grid gap-x-2 gap-y-3 sm:grid-cols-2">
              {props.formData.fields.map((field) => {
                const fullWidth =
                  ["heading", "divider", "long_text", "textarea"].includes(field.type) ||
                  field.type === "file" ||
                  field.type.startsWith("file_upload");

                return (
                  <div key={field.id} className={fullWidth ? "sm:col-span-2" : ""}>
                    <Field field={field} form={form} theme={theme} />
                  </div>
                );
              })}
            </div>

            <div className="mt-5 inline-flex">
              <button
                type="button"
                onClick={form.submit}
                disabled={form.submitting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {form.submitting
                  ? "Submitting..."
                  : props.formData.settings.submitButtonText || "Submit"}
                {!form.submitting && <span aria-hidden="true">→</span>}
              </button>
            </div>
            {form.submitError && (
              <p className="mt-3 text-xs font-medium text-black">{form.submitError}</p>
            )}
          </>
        )}
      </div>
    </Frame>
  );
}
