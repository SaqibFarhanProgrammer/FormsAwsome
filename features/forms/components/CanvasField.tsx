"use client";

import { Card } from "@/components/ui/card";
import { FormField } from "@/features/form-builder/types/Form-builder.types";
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

interface CanvasFieldProps {
  field: FormField;
  isOverlay?: boolean;
    required?: boolean;
}

export function CanvasField({ field, isOverlay, required }: CanvasFieldProps) {
  const Icon = iconMap[field.type] || Type;

  return (
    <Card
      className={`rounded-xl border-2 ${
        isOverlay ? "border-primary shadow-xl" : "border-border"
      } bg-background`}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="mt-1 p-1 rounded-md text-muted-foreground">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            {field.label}
            {required && <span className="text-destructive">*</span>}
          </label>
          <div className="w-full h-10 rounded-lg border border-border bg-muted/50 px-3 flex items-center text-sm text-muted-foreground">
            {field.placeholder}
          </div>
        </div>
      </div>
    </Card>
  );
}