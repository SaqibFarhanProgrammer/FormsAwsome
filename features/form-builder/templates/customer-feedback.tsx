"use client";

import { useTemplateForm } from "../utils/form-template.utils";
import { type UITheme, type TemplateUIProps, Frame, SubmitBar } from "../utils/ui.utils";
import { Field } from "./form-field";

export function CustomerFeedbackUI(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const theme: UITheme = {
    accent: "#111111",
    soft: "#f5f5f5",
    page: "min-h-full bg-white",
    card: "bg-white",
    title: "text-4xl",
    desc: "text-sm",
  };

  return (
    <Frame
      {...props}
      theme={theme}
      form={form}
      maxW="max-w-xl"
      header={
        <div className="mb-8 space-y-6">
          <h1 className="max-w-lg text-4xl font-bold leading-[1.08] tracking-tight text-neutral-800">
            {props.formData.title}
          </h1>
          <div className="space-y-5 text-[15px] italic leading-relaxed text-neutral-700">
            {props.formData.description ? (
              <p>{props.formData.description}</p>
            ) : (
              <>
                <p>
                  This customer feedback form allows you to collect structured feedback from
                  customers about their experience, satisfaction, and suggestions.
                </p>
                <p>
                  The template includes common feedback fields such as rating scales, multiple
                  choice questions, and open text responses, and can be adapted to different moments
                  like after a purchase, support interaction, or onboarding.
                </p>
                <p>
                  This free customer feedback form template helps you understand what is working,
                  identify areas for improvement, and make better decisions based on real customer
                  input.
                </p>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="pb-8">
        <div className="space-y-5">
          {props.formData.fields.map((f) => (
            <Field key={f.id} field={f} form={form} theme={theme} />
          ))}
        </div>
        <div className="mt-6">
          <SubmitBar
            form={form}
            theme={theme}
            text={props.formData.settings.submitButtonText || "Next"}
          />
        </div>
      </div>
    </Frame>
  );
}
