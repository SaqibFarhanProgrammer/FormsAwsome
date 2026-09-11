"use client";

import type { CSSProperties, ReactNode } from "react";
import { Check, Loader2, X } from "lucide-react";
import type { FormData } from "../../models/FormData";
import type { TemplateForm } from "./form-template.utils";

/* ==========================================
   Theme System
   ========================================== */
export interface UITheme {
  accent: string; // hex
  soft: string; // hex soft bg
  page: string;
  card: string;
  title: string;
  desc: string;
  inputMode?: "boxed" | "underline";
  radioVariant?: "list" | "pills" | "letters" | "emojis" | "tags";
  checkVariant?: "list" | "chips";
  selectVariant?: "default" | "slots";
}

export interface TemplateUIProps {
  formData: FormData;
  submitUrl: string;
  className?: string;
  hasSubmitted?: boolean;
}

/* ==========================================
   Style Generators
   ========================================== */
export const cls = (t: UITheme) => ({
  label: "mb-1.5 block text-sm font-medium text-slate-700",
  req: "ml-1 text-black",
  helper: "mt-1 text-xs text-slate-400",
  err: "mt-1 text-xs font-medium text-black",
  input:
    t.inputMode === "underline"
      ? "w-full border-b-2 border-slate-200 bg-transparent px-1 py-2 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--acc)]"
      : "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--acc)] focus:ring-4 focus:ring-[var(--acc)]/10",
  btn: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--acc)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60",
});

/* ==========================================
   UI Components (Shared)
   ========================================== */
export function SubmitBar({
  form,
  theme,
  text,
}: {
  form: TemplateForm;
  theme: UITheme;
  text?: string;
}) {
  const c = cls(theme);
  return (
    <div className="pt-2">
      <button type="button" onClick={form.submit} disabled={form.submitting} className={c.btn}>
        {form.submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          text || "Submit"
        )}
      </button>
      {form.submitError && (
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-black/20 bg-white px-3 py-2 text-xs font-medium text-black">
          <X className="h-3.5 w-3.5" /> {form.submitError}
        </div>
      )}
    </div>
  );
}

export function StatusCard({
  form,
  formData,
  hasSubmitted,
}: {
  form: TemplateForm;
  formData: FormData;
  hasSubmitted?: boolean;
}) {
  const done = hasSubmitted;
  return (
    <div className="flex min-h-64 flex-col items-center justify-center text-center">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: "var(--soft)" }}
      >
        <Check className="h-6 w-6" style={{ color: "var(--acc)" }} />
      </div>
      <h2 className="text-xl font-semibold text-slate-900">
        {done ? "Already submitted" : "Submission complete"}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {done ? "You have already submitted the form." : form.successMsg}
      </p>
      {!done && formData.settings.redirectUrl && (
        <button
          onClick={() => window.location.assign(formData.settings.redirectUrl!)}
          className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ background: "var(--acc)" }}
        >
          Continue <span className="h-4 w-4">→</span>
        </button>
      )}
    </div>
  );
}

export function Frame({
  theme,
  formData,
  form,
  hasSubmitted,
  className,
  header,
  grid,
  bare,
  children,
  maxW,
}: {
  theme: UITheme;
  formData: FormData;
  form: TemplateForm;
  hasSubmitted?: boolean;
  className?: string;
  header?: ReactNode;
  grid?: boolean;
  bare?: boolean;
  children?: ReactNode;
  maxW?: string;
}) {
  void grid;
  const vars = { "--acc": theme.accent, "--soft": theme.soft } as CSSProperties;
  const done = Boolean(hasSubmitted || form.successMsg);

  const body = done ? (
    <StatusCard form={form} formData={formData} hasSubmitted={hasSubmitted} />
  ) : (
    <>
      {header}
      {children}
    </>
  );

  if (bare)
    return (
      <div style={vars} className={`${theme.page} ${className ?? ""}`}>
        {body}
      </div>
    );

  return (
    <div style={vars} className={`${theme.page} px-4 py-10 ${className ?? ""}`}>
      <div className={`mx-auto w-full ${maxW ?? "max-w-xl"}`}>
        <div className={theme.card}>{body}</div>
      </div>
    </div>
  );
}

export const TAG_COLORS = ["#10b981", "#f59e0b", "#f97316", "#ef4444", "#8b5cf6"];

export function emojiFor(label: string, i: number) {
  const l = label.toLowerCase();
  if (
    l.includes("great") ||
    l.includes("excellent") ||
    l.includes("definitely") ||
    l.includes("yes")
  )
    return "😄";
  if (l.includes("good") || l.includes("maybe") || l.includes("likely")) return "🙂";
  if (l.includes("okay") || l.includes("fine") || l.includes("average")) return "😐";
  if (l.includes("struggl") || l.includes("bad") || l.includes("unlikely")) return "😕";
  if (l.includes("no")) return "😞";
  return ["😄", "🙂", "😐", "😕", "😞"][i % 5];
}
