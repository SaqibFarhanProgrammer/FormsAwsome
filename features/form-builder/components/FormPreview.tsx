"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import {
  Type,
  AlignLeft,
  ListFilter,
  CheckSquare,
  CircleDot,
  Mail,
  Phone,
  Calendar,
  Hash,
  Link,
  Upload,
  Star,
  ToggleLeft,
  Heading1,
  SeparatorHorizontal,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  heading: Heading1,
  text: Type,
  textarea: AlignLeft,
  select: ListFilter,
  checkbox: CheckSquare,
  radio: CircleDot,
  email: Mail,
  phone: Phone,
  number: Hash,
  date: Calendar,
  url: Link,
  file: Upload,
  rating: Star,
  toggle: ToggleLeft,
  divider: SeparatorHorizontal,
};

const THEME = { primary: "#432DD7" };

interface FormPreviewProps {
  fields: any[];
}

export function FormPreview({ fields }: FormPreviewProps) {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-semibold">Form Preview</CardTitle>
        <p className="text-sm text-muted-foreground">This is how your form will appear to users.</p>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-5">
        {fields.map((field) => (
          <PreviewField key={field.id} field={field} />
        ))}

        {/* Submit Button Preview */}
        <div className="pt-2">
          <div
            className="w-full h-11 rounded-xl flex items-center justify-center text-sm font-medium text-white"
            style={{ backgroundColor: THEME.primary }}
          >
            Submit Feedback
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewField({ field }: { field: any }) {
  const isRequired = field.validation?.required;
  const Icon = iconMap[field.type] || Type;

  switch (field.type) {
    case "heading":
      return (
        <div className="pt-2">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            {field.label}
          </h3>
        </div>
      );

    case "divider":
      return <Separator className="my-1" />;

    case "text":
    case "email":
    case "phone":
    case "url":
    case "number":
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {field.label}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <div className="w-full h-10 rounded-xl border border-border bg-muted/40 px-3 flex items-center text-sm text-muted-foreground">
            {field.placeholder || `Enter ${field.label.toLowerCase()}`}
          </div>
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {field.label}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <div className="w-full min-h-[80px] rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            {field.placeholder || "Enter text..."}
          </div>
        </div>
      );

    case "select":
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {field.label}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <div className="w-full h-10 rounded-xl border border-border bg-muted/40 px-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>{field.placeholder || "Select an option"}</span>
            <ListFilter className="w-4 h-4" />
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {field.label}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <div className="space-y-2">
            {field.options?.map((opt: any) => (
              <div key={opt.value} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded border border-border bg-muted/40" />
                <span className="text-sm text-muted-foreground">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {field.label}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <div className="space-y-2">
            {field.options?.map((opt: any) => (
              <div key={opt.value} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full border border-border bg-muted/40" />
                <span className="text-sm text-muted-foreground">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "rating":
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {field.label}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-muted" />
            ))}
          </div>
        </div>
      );

    case "toggle":
      return (
        <div className="flex items-center justify-between py-1">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {field.label}
          </Label>
          <div className="w-10 h-6 rounded-full bg-muted relative">
            <div className="w-4 h-4 rounded-full bg-background shadow-sm absolute left-1 top-1" />
          </div>
        </div>
      );

    case "date":
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {field.label}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <div className="w-full h-10 rounded-xl border border-border bg-muted/40 px-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>MM/DD/YYYY</span>
          </div>
        </div>
      );

    case "file":
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {field.label}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <div className="w-full h-24 rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2">
            <Upload className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Click or drag file to upload</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
