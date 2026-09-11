"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import {
  type UITheme,
  type TemplateUIProps,
  Frame,
  SubmitBar,
  StatusCard,
} from "../utils/ui.utils";
import { Field } from "./form-field";

export function EventRegistrationUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#111827",
    soft: "#f8fafc",
    page: "min-h-full bg-white",
    card: "",
    title: "text-4xl",
    desc: "text-base",
  };

  const done = Boolean(props.hasSubmitted || form.successMsg);

  return (
    <Frame {...props} theme={theme} form={form} bare>
      <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-10 lg:px-0 lg:py-16">
        {done ? (
          <StatusCard form={form} formData={props.formData} hasSubmitted={props.hasSubmitted} />
        ) : (
          <>
            <header className="mb-10 max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {props.formData.title}
              </h1>
              <div className="mt-8 space-y-5 text-[15px] italic leading-7 text-slate-600">
                <p>
                  This registration form helps you collect signups in a clear and structured way for
                  events, programs, or online access.
                </p>
                {props.formData.description && <p>{props.formData.description}</p>}
                <p>
                  Complete the details below and submit your registration. You can customize these
                  fields for your own registration flow.
                </p>
              </div>
            </header>

            <div className="space-y-7">
              {props.formData.fields.map((field) => {
                if (field.type === "heading") {
                  return (
                    <div key={field.id} className="pt-2">
                      <h2 className="text-xl font-bold text-slate-800">{field.label}</h2>
                      {field.helperText && (
                        <p className="mt-1 text-sm text-slate-500">{field.helperText}</p>
                      )}
                    </div>
                  );
                }
                if (field.type === "divider") {
                  return <hr key={field.id} className="border-slate-200" />;
                }
                return <Field key={field.id} field={field} form={form} theme={theme} />;
              })}
            </div>

            <div className="mt-8 max-w-32">
              <SubmitBar
                form={form}
                theme={theme}
                text={props.formData.settings.submitButtonText || "Register"}
              />
            </div>
          </>
        )}
      </div>
    </Frame>
  );
}
