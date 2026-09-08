"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus, AlertCircle, Type } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { showAlert } from "@/redux/features/global/alertSlice";
import { useRouter, useSearchParams } from "next/navigation";
import {
  selectFormFields,
  selectFormTitle,
  selectFormDescription,
  selectFormSettings,
} from "@/redux/features/form-builder/form.selectors";
import { FormMeta } from "./FormMeta";
import { FormFieldItem } from "./FormFieldItem";
import { reorderFields } from "@/redux/features/form-builder/form.slice";

interface FormCanvasProps {
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onRemoveField: (id: string) => void;
}

/**
 * FormCanvas Component
 *
 * Renders the form builder canvas with field list.
 *
 * Redux Subscriptions:
 * - fields (via selectFormFields) - used to render field list
 * - formTitle (via selectFormTitle) - needed for save API call
 * - formDescription (via selectFormDescription) - needed for save API call
 * - formSettings (via selectFormSettings) - needed for save API call
 *
 * Note: FormMeta is rendered as a separate component that manages
 * its own narrow subscriptions to formTitle and formDescription.
 * This prevents FormCanvas from re-rendering when meta fields change.
 *
 * Individual FormFieldItem components are memoized, so they only
 * re-render when their specific field data changes, not when other
 * fields or form metadata changes.
 */
export function FormCanvas({ selectedFieldId, onSelectField, onRemoveField }: FormCanvasProps) {
  const dispatch = useDispatch();

  // Subscribe only to data needed for save functionality
  const title = useSelector(selectFormTitle);
  const description = useSelector(selectFormDescription);
  const settings = useSelector(selectFormSettings);

  // Subscribe only to fields for rendering the list
  const fields = useSelector(selectFormFields);

  const [uiError, setUiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const router = useRouter();

  const handleMoveField = useCallback(
    (fieldId: string, direction: "up" | "down") => {
      const currentIndex = fields.findIndex((field) => field.id === fieldId);
      if (currentIndex === -1) return;

      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex < 0 || nextIndex >= fields.length) return;

      const reordered = [...fields];
      const [movedField] = reordered.splice(currentIndex, 1);
      reordered.splice(nextIndex, 0, movedField);

      dispatch(reorderFields(reordered));
    },
    [dispatch, fields],
  );

  const handleUpdateForm = useCallback(async () => {
    if (!slug) {
      setUiError("Create the form first before saving changes.");
      dispatch(
        showAlert({
          message: "Create the form first before saving changes.",
          type: "danger",
        }),
      );
      return;
    }

    setIsSaving(true);
    setUiError("");

    try {
      const res = await axios.put(`/api/forms/${slug}`, {
        title,
        description,
        fields: fields ? fields : [],
        settings,
      });

      dispatch(
        showAlert({
          message: "Changes Saved",
          type: "success",
        }),
      );

      router.replace(`/create?slug=${res.data.form.slug}`);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "An error occurred");
      setUiError(errorMessage);
      dispatch(
        showAlert({
          message: errorMessage,
          type: "danger",
        }),
      );
    } finally {
      setIsSaving(false);
    }
  }, [slug, title, description, fields, settings, dispatch, router]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Form metadata section - renders as separate component with own subscriptions */}
      <FormMeta />

      {uiError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{uiError}</p>
        </div>
      )}

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
              <FormFieldItem
                key={field.id}
                field={field}
                index={index}
                isSelected={field.id === selectedFieldId}
                isFirst={index === 0}
                isLast={index === fields.length - 1}
                onSelect={() => onSelectField(field.id)}
                onRemove={() => onRemoveField(field.id)}
                onMoveUp={() => handleMoveField(field.id, "up")}
                onMoveDown={() => handleMoveField(field.id, "down")}
              />
            ))
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}
