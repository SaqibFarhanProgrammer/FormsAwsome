"use client";

import type { FormFieldItem, FormData } from "../../models/FormData";
import type { TemplateForm, TemplateValue } from "../utils/form-template.utils";
import { cls, type UITheme } from "../utils/ui.utils";
import { Star, Upload, FileText, FileImage } from "lucide-react";

/* ==========================================
   Field Controls
   ========================================== */
function Controls({
  field,
  value,
  onChange,
  theme,
}: {
  field: FormFieldItem;
  value: TemplateValue;
  onChange: (v: TemplateValue) => void;
  theme: UITheme;
}) {
  const c = cls(theme);
  const textValue = typeof value === "boolean" || Array.isArray(value) ? "" : (value ?? "");
  const inputType =
    field.type === "number"
      ? "number"
      : field.type === "email"
        ? "email"
        : ["URL", "url", "image"].includes(field.type)
          ? "url"
          : field.type === "phone"
            ? "tel"
            : field.type === "date"
              ? "date"
              : "text";

  switch (field.type) {
    case "short_text":
    case "text":
    case "email":
    case "phone":
    case "number":
    case "URL":
    case "url":
    case "date":
      return (
        <input
          type={inputType}
          placeholder={field.placeholder}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          className={c.input}
        />
      );

    case "long_text":
    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={c.input + " resize-y"}
        />
      );

    case "dropdown":
    case "select":
      return (
        <select
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          className={c.input + " appearance-none"}
        >
          <option value="">{field.placeholder || "Select an option"}</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );

    case "radio":
      if (theme.radioVariant === "tags") {
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {field.options?.map((o) => (
              <label
                key={o.value}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-3 text-sm transition ${
                  value === o.value
                    ? "border-[var(--acc)] bg-[var(--soft)] text-slate-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[var(--acc)]/40"
                }`}
              >
                <input
                  type="radio"
                  name={field.id}
                  checked={value === o.value}
                  onChange={() => onChange(o.value)}
                  className="sr-only"
                />
                <span aria-hidden="true">
                  {o.label.match(/^\p{Extended_Pictographic}/u)?.[0] || ""}
                </span>
                <span>{o.label.replace(/^\p{Extended_Pictographic}\s*/u, "")}</span>
              </label>
            ))}
          </div>
        );
      }
      return (
        <div className="space-y-2">
          {field.options?.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition ${
                value === o.value
                  ? "border-[var(--acc)] bg-[var(--soft)]"
                  : "border-slate-200 bg-white hover:border-[var(--acc)]/40"
              }`}
            >
              <input
                type="radio"
                name={field.id}
                checked={value === o.value}
                onChange={() => onChange(o.value)}
                className="h-4 w-4 accent-[var(--acc)]"
              />
              <span className="text-slate-700">{o.label}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
    case "multiple_choice":
      const arr: string[] = Array.isArray(value) ? value : [];
      const toggle = (v: string) =>
        onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
      return (
        <div className="space-y-2">
          {field.options?.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition ${
                arr.includes(o.value)
                  ? "border-[var(--acc)] bg-[var(--soft)]"
                  : "border-slate-200 bg-white hover:border-[var(--acc)]/40"
              }`}
            >
              <input
                type="checkbox"
                checked={arr.includes(o.value)}
                onChange={() => toggle(o.value)}
                className="h-4 w-4 rounded accent-[var(--acc)]"
              />
              <span className="text-slate-700">{o.label}</span>
            </label>
          ))}
        </div>
      );

    case "toggle":
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            value ? "bg-[var(--acc)]" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              value ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      );

    case "rating": {
      const v = typeof value === "number" ? value : 0;
      return (
        <div className="flex items-center gap-1 py-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className="p-1 transition-transform hover:scale-125"
            >
              <Star
                className="h-7 w-7"
                fill={s <= v ? "var(--acc)" : "none"}
                stroke={s <= v ? "var(--acc)" : "#cbd5e1"}
                strokeWidth={1.5}
              />
            </button>
          ))}
          {v > 0 && (
            <span className="ml-2 text-sm font-semibold" style={{ color: "var(--acc)" }}>
              {v}/5
            </span>
          )}
        </div>
      );
    }

    case "slider": {
      const min = field.validation.min ?? 0;
      const max = field.validation.max ?? 100;
      const v = typeof value === "number" ? value : min;
      return (
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>{min}</span>
            <span
              className="rounded-full px-2.5 py-0.5 text-sm font-bold text-white"
              style={{ background: "var(--acc)" }}
            >
              {v}
            </span>
            <span>{max}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={v}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: "var(--acc)" }}
          />
        </div>
      );
    }

    case "file_upload_image":
    case "file_upload_pdf":
    case "file": {
      const isImg = field.type === "file_upload_image";
      const fileName = typeof value === "string" ? value : "";
      return (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-[var(--acc)] hover:bg-[var(--soft)]">
          {isImg ? (
            <FileImage className="h-6 w-6 text-slate-400" />
          ) : (
            <FileText className="h-6 w-6 text-slate-400" />
          )}
          <span className="text-sm font-medium text-slate-600">
            {fileName || field.placeholder || `Upload ${isImg ? "image" : "file"}`}
          </span>
          <span className="text-xs text-slate-400">Click to browse</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
          />
        </label>
      );
    }

    case "image":
      return (
        <div className="relative">
          <Upload className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="url"
            placeholder={field.placeholder || "https://example.com/image.jpg"}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className={c.input + " pl-9"}
          />
        </div>
      );

    default:
      return (
        <input
          placeholder={field.placeholder}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          className={c.input}
        />
      );
  }
}

/* ==========================================
   Field Wrapper
   ========================================== */
function Field({
  field,
  form,
  theme,
  hideLabel,
}: {
  field: FormFieldItem;
  form: TemplateForm;
  theme: UITheme;
  hideLabel?: boolean;
}) {
  const c = cls(theme);
  const err = form.errors[field.id];

  if (field.type === "heading")
    return (
      <div className="pt-1">
        <h3 className="text-base font-semibold text-slate-900">{field.label}</h3>
        {field.helperText && <p className="mt-0.5 text-xs text-slate-400">{field.helperText}</p>}
      </div>
    );
  if (field.type === "divider") return <hr className="border-slate-100" />;

  if (field.type === "toggle")
    return (
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-sm font-medium text-slate-700">
              {field.label}
              {field.validation.required && <span className={c.req}>*</span>}
            </span>
            {field.helperText && <p className="text-xs text-slate-400">{field.helperText}</p>}
          </div>
          <Controls
            field={field}
            value={form.values[field.id]}
            onChange={(v) => form.setValue(field.id, v)}
            theme={theme}
          />
        </div>
        {err && <p className={c.err}>{err}</p>}
      </div>
    );

  return (
    <div>
      {!hideLabel && (
        <label className={c.label}>
          {field.label}
          {field.validation.required && <span className={c.req}>*</span>}
        </label>
      )}
      <Controls
        field={field}
        value={form.values[field.id]}
        onChange={(v) => form.setValue(field.id, v)}
        theme={theme}
      />
      {field.helperText && !err && <p className={c.helper}>{field.helperText}</p>}
      {err && <p className={c.err}>{err}</p>}
    </div>
  );
}

/* ==========================================
   Default Helper
   ========================================== */
function DefaultHeader({ formData, theme }: { formData: FormData; theme: UITheme }) {
  return (
    <div className="mb-6">
      <h1 className={`font-semibold tracking-tight text-slate-900 ${theme.title}`}>
        {formData.title}
      </h1>
      {formData.description && (
        <p className={`mt-1.5 leading-relaxed text-slate-500 ${theme.desc}`}>
          {formData.description}
        </p>
      )}
    </div>
  );
}

export { Controls, Field, DefaultHeader };
