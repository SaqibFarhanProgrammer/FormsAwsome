"use client";

import { useTemplateForm } from "./utils/form-template.utils";
import { type UITheme, type TemplateUIProps, StatusCard } from "./utils/ui.utils";
import { Field } from "./components/form-field";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

const minimalTheme: UITheme = {
  accent: "#000000",
  soft: "#f8fafc",
  page: "min-h-full bg-white",
  card: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8",
  title: "text-2xl",
  desc: "text-sm",
};

export function MinimalFormTemplate(props: TemplateUIProps) {
  const form = useTemplateForm(props.formData, props.submitUrl);
  const done = Boolean(props.hasSubmitted || form.successMsg);

  return (
    <div className="min-h-full bg-white px-4 py-10">
      <Card className="mx-auto w-full max-w-2xl border-slate-200 bg-white text-black shadow-sm">
        {done ? (
          <CardContent className="p-8">
            <StatusCard form={form} formData={props.formData} hasSubmitted={props.hasSubmitted} />
          </CardContent>
        ) : (
          <>
            <CardHeader className="border-b border-slate-200 px-6 py-6 sm:px-8">
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {props.formData.templateType || "Form template"}
              </CardDescription>
              <CardTitle className="mt-2 text-3xl font-bold tracking-tight text-black">
                {props.formData.title}
              </CardTitle>
              {props.formData.description && (
                <CardDescription className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {props.formData.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-5 px-6 py-6 sm:px-8">
              {props.formData.fields.map((field) => (
                <Field key={field.id} field={field} form={form} theme={minimalTheme} />
              ))}
            </CardContent>
            <CardFooter className="block border-t border-slate-200 px-6 py-6 sm:px-8">
              <Button
                type="button"
                onClick={form.submit}
                disabled={form.submitting}
                className="h-10 w-full max-w-xs bg-black px-4 text-sm font-semibold text-white hover:bg-black/80"
              >
                {form.submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  props.formData.settings.submitButtonText || "Submit"
                )}
              </Button>
              {form.submitError && (
                <p className="mt-3 text-xs font-medium text-black">{form.submitError}</p>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
