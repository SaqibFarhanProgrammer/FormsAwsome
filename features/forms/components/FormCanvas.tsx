"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, updateFormMeta } from "@/redux/features/Create-form/Form.Slice";
import dayjs from "dayjs";
import {
  Trash2,
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
  GripVertical,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { AppError } from "@/lib/auth/AppError";
import { cn } from "@/lib/utils";

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

const fieldTypeLabels: Record<string, string> = {
  heading: "Heading",
  text: "Text",
  textarea: "Text Area",
  select: "Dropdown",
  checkbox: "Checkbox",
  radio: "Radio",
  email: "Email",
  phone: "Phone",
  number: "Number",
  date: "Date",
  url: "URL",
  file: "File Upload",
  rating: "Rating",
  toggle: "Toggle",
  divider: "Divider",
};

interface FormCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onRemoveField: (id: string) => void;
}

export function FormCanvas({
  fields,
  selectedFieldId,
  onSelectField,
  onRemoveField,
}: FormCanvasProps) {
  const dispatch = useDispatch();
  const title = useSelector((state: any) => state.form.formTitle);
  const description = useSelector((state: any) => state.form.formDescription);
  const [uiError, setUiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleUpdateForm() {
    setIsSaving(true);
    setUiError("");
    try {
      const DefaultSlug = `untitled-form-${dayjs().format("HH:mm:ss")}`;

      const res = await axios.post("/api/forms/create", {
        title,
        description,
        fields: fields ? fields : [],
        slug: DefaultSlug,
        settings: {
          submitButtonText: "Submit",
          successMessage: "Thank you for your submission!",
          redirectUrl: null,
          notifyEmail: null,
        },
      });

      console.log(res);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.error("AppError:", error.message);
        setUiError(error.message);
      }
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      setUiError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* ─── Form Header Card ─────────────────────────────────────────── */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="space-y-3 flex-1">
              {/* Title Input */}
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    dispatch(
                      updateFormMeta({
                        title: e.target.value,
                      }),
                    );
                  }}
                  className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/60 text-foreground"
                  placeholder="Form Title"
                />
                <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary/30 rounded-full" />
              </div>

              {/* Description Input */}
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  dispatch(
                    updateFormMeta({
                      description: e.target.value,
                    }),
                  );
                }}
                className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-muted-foreground"
                placeholder="Form description (optional)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Error Alert ──────────────────────────────────────────────── */}
      {uiError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{uiError}</p>
        </div>
      )}

      {/* ─── Canvas Area ──────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-2 border-dashed border-border/60 bg-card/30 shadow-none">
        <CardContent className="p-4 space-y-3 min-h-[400px]">
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/80 flex items-center justify-center ring-1 ring-border/50">
                <Type className="w-7 h-7 text-muted-foreground/60" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-foreground">Start Building Your Form</p>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Click elements from the left sidebar to add them here
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 rounded-lg">
                <Plus className="w-3.5 h-3.5" />
                Add Field
              </Button>
            </div>
          ) : (
            fields.map((field, index) => (
              <CanvasFieldItem
                key={field.id}
                field={field}
                index={index}
                isSelected={field.id === selectedFieldId}
                onSelect={() => onSelectField(field.id)}
                onRemove={() => onRemoveField(field.id)}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* ─── Save Button ──────────────────────────────────────────────── */}
      {fields.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleUpdateForm} disabled={isSaving} className="rounded-xl px-6">
            {isSaving ? (
              <>
                <Skeleton className="w-4 h-4 rounded-full mr-2" />
                Saving...
              </>
            ) : (
              "Save Form"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function CanvasFieldItem({
  field,
  index,
  isSelected,
  onSelect,
  onRemove,
}: {
  field: FormField;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const Icon = iconMap[field.type] || Type;

  return (
    <TooltipProvider delayDuration={200}>
      <div
        onClick={onSelect}
        className={cn(
          "group relative rounded-xl border-2 cursor-pointer transition-all duration-200",
          isSelected
            ? "border-primary bg-primary/[0.04] shadow-sm ring-1 ring-primary/10"
            : "border-border/80 bg-card hover:border-primary/25 hover:bg-muted/20 hover:shadow-sm",
        )}
      >
        <div className="p-4 flex items-start gap-3">
          {/* Drag Handle */}
          <Tooltip>
            <TooltipTrigger asChild>
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

          {/* Field Content */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* Label Row */}
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-primary/10" : "bg-muted",
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    isSelected ? "text-primary" : "text-muted-foreground",
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">{field.label}</label>
                {field.required && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 px-1.5 bg-destructive/10 text-destructive border-0 hover:bg-destructive/10"
                  >
                    Required
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground border-border/60"
                >
                  {fieldTypeLabels[field.type] || field.type}
                </Badge>
              </div>
            </div>

            {/* Field Preview */}
            <div className="pl-9.5">
              <FieldPreview field={field} />
            </div>
          </div>

          {/* Remove Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Remove field</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Selected Indicator Bar */}
        {isSelected && (
          <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-primary" />
        )}
      </div>
    </TooltipProvider>
  );
}

function FieldPreview({ field }: { field: FormField }) {
  switch (field.type) {
    case "heading":
      return <h3 className="text-base font-semibold text-foreground">{field.label}</h3>;

    case "divider":
      return <Separator className="my-2" />;

    case "textarea":
      return (
        <div className="w-full min-h-[80px] rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
          {field.placeholder || "Enter your response..."}
        </div>
      );

    case "select":
      return (
        <div className="w-full h-10 rounded-lg border border-border/80 bg-background px-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>Select an option</span>
          <ListFilter className="w-3.5 h-3.5 text-muted-foreground/50" />
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2.5">
          {(field.options || ["Option 1", "Option 2", "Option 3"]).map((opt: string, i: number) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded border border-border/80 flex items-center justify-center">
                {i === 0 && <div className="w-2.5 h-2.5 rounded-sm bg-primary" />}
              </div>
              <span className="text-sm text-muted-foreground">{opt}</span>
            </div>
          ))}
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2.5">
          {(field.options || ["Option 1", "Option 2", "Option 3"]).map((opt: string, i: number) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full border border-border/80 flex items-center justify-center">
                {i === 0 && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="text-sm text-muted-foreground">{opt}</span>
            </div>
          ))}
        </div>
      );

    case "toggle":
      return (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-6 rounded-full relative transition-colors",
              field.defaultValue ? "bg-primary" : "bg-muted",
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full bg-background shadow-sm absolute top-1 transition-all",
                field.defaultValue ? "left-5" : "left-1",
              )}
            />
          </div>
          <span className="text-sm text-muted-foreground">Toggle this option</span>
        </div>
      );

    case "rating":
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={cn(
                "w-5 h-5",
                i <= (field.defaultValue || 0)
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/30",
              )}
            />
          ))}
        </div>
      );

    case "file":
      return (
        <div className="w-full h-24 rounded-lg border-2 border-dashed border-border/60 bg-muted/30 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground/60" />
          </div>
          <span className="text-xs text-muted-foreground">Click or drag file to upload</span>
        </div>
      );

    case "date":
      return (
        <div className="w-full h-10 rounded-lg border border-border/80 bg-background px-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-muted-foreground/50" />
          <span>MM/DD/YYYY</span>
        </div>
      );

    case "email":
      return (
        <div className="w-full h-10 rounded-lg border border-border/80 bg-background px-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4 text-muted-foreground/50" />
          <span>email@example.com</span>
        </div>
      );

    case "phone":
      return (
        <div className="w-full h-10 rounded-lg border border-border/80 bg-background px-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4 text-muted-foreground/50" />
          <span>+1 (555) 000-0000</span>
        </div>
      );

    case "number":
      return (
        <div className="w-full h-10 rounded-lg border border-border/80 bg-background px-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Hash className="w-4 h-4 text-muted-foreground/50" />
          <span>0</span>
        </div>
      );

    case "url":
      return (
        <div className="w-full h-10 rounded-lg border border-border/80 bg-background px-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link className="w-4 h-4 text-muted-foreground/50" />
          <span>https://example.com</span>
        </div>
      );

    default:
      return (
        <div className="w-full h-10 rounded-lg border border-border/80 bg-background px-3 flex items-center text-sm text-muted-foreground">
          {field.placeholder || "Enter your response..."}
        </div>
      );
  }
}
