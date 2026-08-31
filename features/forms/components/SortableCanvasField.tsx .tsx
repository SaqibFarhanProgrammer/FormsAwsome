"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/features/form-builder/types/Form-builder.types";
import {
  GripVertical,
  Trash2,
  Type,
  AlignLeft,
  ListFilter,
  CheckSquare,
  CircleDot,
  Mail,
  Calendar,
  Hash,
  Link,
  Upload,
  Star,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  short_text: Type,
  long_text: AlignLeft,
  email: Mail,
  number: Hash,
  radio: CircleDot,
  checkbox: CheckSquare,
  dropdown: ListFilter,
  rating: Star,
  date: Calendar,
  multiple_choice: ListFilter,
  file_upload_image: Upload,
  file_upload_pdf: Upload,
  slider: Type,
  URL: Link,
  image: Type,
};

interface SortableCanvasFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function SortableCanvasField({
  field,
  isSelected,
  onSelect,
  onRemove,
}: SortableCanvasFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = iconMap[field.type] || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? "opacity-50" : ""}`}
    >
      <Card
        onClick={onSelect}
        className={`rounded-xl border-2 cursor-pointer transition-all ${
          isSelected
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border hover:border-primary/30 hover:bg-muted/30"
        }`}
      >
        <div className="p-4 flex items-start gap-3">
          <button
            {...attributes}
            {...listeners}
            className="mt-1 p-1 rounded-md hover:bg-muted cursor-grab active:cursor-grabbing text-muted-foreground"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium">
                {field.label}
                {field.validation.required && <span className="text-destructive ml-0.5">*</span>}
              </label>
            </div>

            <FieldPreview field={field} />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function FieldPreview({ field }: { field: FormField }) {
  switch (field.type) {
    case "long_text":
      return (
        <div className="w-full min-h-[80px] rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          {field.placeholder}
        </div>
      );
    case "dropdown":
    case "multiple_choice":
      return (
        <div className="w-full h-10 rounded-lg border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">
          Select an option
        </div>
      );
    case "checkbox":
      return (
        <div className="space-y-2">
          {["Option 1", "Option 2", "Option 3"].map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-border" />
              <span className="text-sm text-muted-foreground">{opt}</span>
            </div>
          ))}
        </div>
      );
    case "radio":
      return (
        <div className="space-y-2">
          {["Option 1", "Option 2", "Option 3"].map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-border" />
              <span className="text-sm text-muted-foreground">{opt}</span>
            </div>
          ))}
        </div>
      );
    case "rating":
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-5 h-5 text-muted" />
          ))}
        </div>
      );
    case "file_upload_image":
    case "file_upload_pdf":
      return (
        <div className="w-full h-24 rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2">
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Click or drag file to upload</span>
        </div>
      );
    case "date":
      return (
        <div className="w-full h-10 rounded-lg border border-border bg-background px-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>MM/DD/YYYY</span>
        </div>
      );
    case "short_text":
    case "email":
    case "number":
    case "URL":
    case "image":
    case "slider":
    default:
      return (
        <div className="w-full h-10 rounded-lg border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">
          {field.placeholder}
        </div>
      );
  }
}
