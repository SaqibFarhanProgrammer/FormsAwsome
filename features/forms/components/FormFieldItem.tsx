"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import {
  Type,
  AlignLeft,
  Mail,
  Hash,
  CircleDot,
  CheckSquare,
  ListFilter,
  Star,
  Calendar,
  ListChecks,
  Image,
  FileText,
  SlidersHorizontal,
  Link,
  Trash2,
  GripVertical,
  Heading1,
  SeparatorHorizontal,
  Upload,
  ToggleLeft,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

export type FieldType =
  | "heading"
  | "short_text"
  | "long_text"
  | "email"
  | "number"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "rating"
  | "date"
  | "multiple_choice"
  | "file_upload_image"
  | "file_upload_pdf"
  | "slider"
  | "URL"
  | "image"
  | "toggle"
  | "divider";

export interface FormFieldType {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

const iconMap: Record<FieldType, LucideIcon> = {
  heading: Heading1,
  short_text: Type,
  long_text: AlignLeft,
  email: Mail,
  number: Hash,
  radio: CircleDot,
  checkbox: CheckSquare,
  dropdown: ListFilter,
  rating: Star,
  date: Calendar,
  multiple_choice: ListChecks,
  file_upload_image: Image,
  file_upload_pdf: FileText,
  slider: SlidersHorizontal,
  URL: Link,
  image: Image,
  toggle: ToggleLeft,
  divider: SeparatorHorizontal,
};

const labelMap: Record<FieldType, string> = {
  heading: "Heading",
  short_text: "Short Text",
  long_text: "Long Text",
  email: "Email",
  number: "Number",
  radio: "Radio",
  checkbox: "Checkbox",
  dropdown: "Dropdown",
  rating: "Rating",
  date: "Date",
  multiple_choice: "Multiple Choice",
  file_upload_image: "Image Upload",
  file_upload_pdf: "File Upload",
  slider: "Slider",
  URL: "URL",
  image: "Image",
  toggle: "Toggle",
  divider: "Divider",
};

interface FormFieldItemProps {
  field: FormFieldType;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export const FormFieldItem = memo(function FormFieldItem({
  field,
  index,
  isSelected,
  onSelect,
  onRemove,
}: FormFieldItemProps) {
  const Icon = iconMap[field.type];
  const typeLabel = labelMap[field.type];

  return (
    <TooltipProvider>
      <div
        onClick={onSelect}
        className={cn(
          "group relative rounded-xl border-2 cursor-pointer transition-all duration-200",
          isSelected
            ? "border-primary bg-primary/[0.04] shadow-sm ring-1 ring-primary/10"
            : "border-border/80 bg-card hover:border-primary/25 hover:bg-muted/20 hover:shadow-sm",
        )}
      >
        <div className="p-4">
          {/* Header Row */}
          <div className="flex items-start gap-3 mb-3">
            {/* Drag Handle */}
            <Tooltip>
              <TooltipTrigger>
                <div className="mt-1 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">Drag to reorder</p>
              </TooltipContent>
            </Tooltip>

            {/* Index Number */}
            <div className="mt-1 w-6 h-6 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0 ring-1 ring-border/50">
              {index + 1}
            </div>

            {/* Field Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {/* <Icon className="w-4 h-4 text-primary" /> */}
                <p className="text-sm font-medium truncate text-foreground">{field.label}</p>
                {field.required && (
                  <span className="text-xs font-semibold text-destructive">*</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{typeLabel}</p>
            </div>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/5 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Field Preview */}
          <div className="pl-[52px]">
            <FieldPreview field={field} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

FormFieldItem.displayName = "FormFieldItem";

/* ============================================
   FIELD PREVIEW COMPONENT
   Shows actual UI preview based on field type
   ============================================ */

function FieldPreview({ field }: { field: FormFieldType }) {
  const placeholder = field.placeholder || `Enter ${field.label.toLowerCase()}...`;

  switch (field.type) {
    case "heading":
      return (
        <div className="py-2">
          <h3 className="text-base font-semibold text-foreground">{field.label}</h3>
        </div>
      );

    case "divider":
      return <div className="border-t-2 border-dashed border-border my-3" />;

    case "short_text":
    case "URL":
      return (
        <div className="space-y-1">
          <div className="w-full h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center text-sm text-muted-foreground">
            {placeholder}
          </div>
        </div>
      );

    case "email":
      return (
        <div className="space-y-1">
          <div className="w-full h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{placeholder}</span>
          </div>
        </div>
      );

    case "number":
      return (
        <div className="space-y-1">
          <div className="w-full h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Hash className="w-4 h-4" />
            <span>{placeholder}</span>
          </div>
        </div>
      );

    case "long_text":
      return (
        <div className="space-y-1">
          <div className="w-full min-h-[80px] rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            {placeholder}
          </div>
        </div>
      );

    case "dropdown":
      return (
        <div className="space-y-1">
          <div className="w-full h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>{placeholder}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          {field.options && field.options.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {field.options.map((opt, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20"
                >
                  {opt}
                </span>
              ))}
            </div>
          )}
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {(field.options || ["Option 1", "Option 2", "Option 3"]).map((opt, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full border-2 border-border bg-muted/40" />
              <span className="text-sm text-muted-foreground">{opt}</span>
            </div>
          ))}
        </div>
      );

    case "checkbox":
    case "multiple_choice":
      return (
        <div className="space-y-2">
          {(field.options || ["Option 1", "Option 2", "Option 3"]).map((opt, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded border border-border bg-muted/40" />
              <span className="text-sm text-muted-foreground">{opt}</span>
            </div>
          ))}
        </div>
      );

    case "rating":
      return (
        <div className="flex gap-1 py-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-5 h-5 text-muted" />
          ))}
        </div>
      );

    case "date":
      return (
        <div className="space-y-1">
          <div className="w-full h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>MM/DD/YYYY</span>
          </div>
        </div>
      );

    case "slider":
      return (
        <div className="space-y-2 py-1">
          <div className="w-full h-2 rounded-full bg-muted relative">
            <div className="absolute left-0 top-0 h-full w-1/2 rounded-full bg-primary/30" />
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-sm" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      );

    case "toggle":
      return (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-6 rounded-full bg-muted relative">
            <div className="w-4 h-4 rounded-full bg-background shadow-sm absolute left-1 top-1" />
          </div>
          <span className="text-sm text-muted-foreground">Toggle this option</span>
        </div>
      );

    case "file_upload_image":
    case "file_upload_pdf":
    case "image":
      return (
        <div className="w-full h-24 rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2">
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {field.type === "file_upload_image"
              ? "Upload image"
              : field.type === "file_upload_pdf"
                ? "Upload PDF"
                : "Upload file"}
          </span>
        </div>
      );

    default:
      return (
        <div className="w-full h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center text-sm text-muted-foreground">
          {placeholder}
        </div>
      );
  }
}
