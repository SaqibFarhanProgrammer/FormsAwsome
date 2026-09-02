"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Plus, MousePointerClick } from "lucide-react";
import { SortableCanvasField } from "./SortableCanvasFieldDuplicate";
import { FormField } from "@/features/form-builder/types/Form-builder.types";

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
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-droppable",
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Form Header */}
      <Card className="rounded-2xl border-border mb-4 p-6">
        <div className="space-y-2">
          <input
            type="text"
            defaultValue="Untitled Form"
            className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground"
            placeholder="Form Title"
          />
          <input
            type="text"
            defaultValue=""
            className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground text-muted-foreground"
            placeholder="Form description (optional)"
          />
        </div>
      </Card>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`min-h-[400px] rounded-2xl border-2 border-dashed transition-colors ${
          isOver ? "border-primary bg-primary/5" : "border-border bg-card/30"
        } ${fields.length === 0 ? "flex items-center justify-center" : "p-4 space-y-3"}`}
      >
        {fields.length === 0 ? (
          <div className="text-center space-y-3 py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
              <MousePointerClick className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">Start Building Your Form</p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag elements from the left sidebar here
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Or click the + button to add fields</p>
          </div>
        ) : (
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((field) => (
              <SortableCanvasField
                key={field.id}
                field={field}
                isSelected={field.id === selectedFieldId}
                onSelect={() => onSelectField(field.id)}
                onRemove={() => onRemoveField(field.id)}
              />
            ))}
          </SortableContext>
        )}
      </div>
      {fields.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" className="rounded-xl gap-2">
            <Plus className="w-4 h-4" />
            Add Field
          </Button>
        </div>
      )}
    </div>
  );
}
