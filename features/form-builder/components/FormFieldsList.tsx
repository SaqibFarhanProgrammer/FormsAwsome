"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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

interface FormFieldsListProps {
  fields: any[];
}

export function FormFieldsList({ fields }: FormFieldsListProps) {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Form Fields</CardTitle>
        <p className="text-sm text-muted-foreground">{fields.length} fields in this form.</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {fields.map((field, index) => {
          const Icon = iconMap[field.type] || Type;
          const isRequired = field.validation?.required;

          return (
            <div
              key={field.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                {index + 1}
              </div>
              <div className="w-8 h-8 rounded-lg  flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{field.label || field.type}</p>
                  {isRequired && (
                    <Badge
                      variant="secondary"
                      className="rounded-md text-[10px] px-1.5 py-0 h-4 bg-destructive/10 text-destructive border-0"
                    >
                      Required
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground capitalize">{field.type} field</p>
              </div>
              {field.options && (
                <Badge variant="outline" className="rounded-md text-[10px] px-1.5 py-0 h-5">
                  {field.options.length} options
                </Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
