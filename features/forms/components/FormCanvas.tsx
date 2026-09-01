"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { AppError } from "@/lib/auth/AppError";
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
  const [UiError, setUiError] = useState("");

  async function handleUpdateForm() {
    try {
      const date: string = new Date().toString();

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
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="rounded-2xl border-border mb-6 p-6 bg-card">
        <div className="flex items-start gap-4">
          <div className="space-y-2 flex-1">
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
              defaultValue="Untitled Form"
              className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground"
              placeholder="Form Title"
            />
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
              className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground text-muted-foreground"
              placeholder="Form description (optional)"
            />
          </div>
        </div>
      </Card>

      {/* Canvas Area */}
      <div className="min-h-[400px] rounded-2xl border-2 border-dashed border-border bg-card/50 p-4 space-y-3">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Type className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">Start Building Your Form</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click elements from the left sidebar to add them here
              </p>
              <p>{UiError && <span className="text-sm text-destructive mt-1">{UiError}</span>}</p>
            </div>
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
      </div>
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
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
      }`}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Index Number */}
        <div className="mt-1 w-6 h-6 rounded-md bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
          {index + 1}
        </div>

        {/* Field Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-0.5">*</span>}
            </label>
          </div>
          <FieldPreview field={field} />
        </div>

        {/* Remove Button */}
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
    </div>
  );
}

function FieldPreview({ field }: { field: FormField }) {
  switch (field.type) {
    case "heading":
      return <h3 className="text-lg font-semibold text-foreground">{field.label}</h3>;
    case "divider":
      return <div className="border-t border-border my-2" />;
    case "textarea":
      return (
        <div className="w-full min-h-[80px] rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          {field.placeholder}
        </div>
      );
    case "select":
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
    case "toggle":
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-6 rounded-full bg-muted relative">
            <div className="w-4 h-4 rounded-full bg-background shadow-sm absolute left-1 top-1" />
          </div>
          <span className="text-sm text-muted-foreground">Toggle this option</span>
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
    case "file":
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
    default:
      return (
        <div className="w-full h-10 rounded-lg border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">
          {field.placeholder}
        </div>
      );
  }
}
