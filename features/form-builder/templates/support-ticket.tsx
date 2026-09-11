"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function SupportTicketUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#111111",
    soft: "#f5f5f5",
    page: "min-h-full bg-white",
    card: "bg-white",
    title: "text-4xl",
    desc: "text-sm",
    radioVariant: "tags",
  };

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-3xl"
      header={
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-800">
            {props.formData.title || "Contact support"}
          </h1>
          {props.formData.description && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-500">
              {props.formData.description}
            </p>
          )}
        </div>
      }
    >
      <div className="space-y-8">
        {props.formData.fields.map((f) => (
          <Field key={f.id} field={f} form={form} theme={theme} />
        ))}
      </div>
      <div className="mt-14 max-w-fit">
        <SubmitBar
          form={form}
          theme={theme}
          text={props.formData.settings.submitButtonText || "Next"}
        />
      </div>
    </Frame>
  );
}
